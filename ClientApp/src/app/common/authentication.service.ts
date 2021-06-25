import { Injectable } from '@angular/core';
import { User } from '../Entities/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Client } from '../Entities/client.model';
import { MasUser } from '../Entities/mas-user.model';
import { HtmlMsgByClient } from '../Entities/HtmlMsgByClient';
import { Brand } from '../Entities/Brand';
import { TicketDataModel } from '../Entities/TicketDataModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseEndpoint: string;
  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    this.baseEndpoint = environment.baseEndpoint;
    this.loading$.next(false);
    this.requestFailed$.next(false);
    this.requestFailedMessage$.next('');
    this.init();
    this.isTokenRefreshing$.next(false);
  }

  public authState$ = new BehaviorSubject(false);
  public authenticatedUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public ticket$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);
  public defaultClient$: BehaviorSubject<Client> = new BehaviorSubject<Client>(null);
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public requestFailed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public requestFailedMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public clientHtmlMessages$: BehaviorSubject<HtmlMsgByClient[]> = new BehaviorSubject<HtmlMsgByClient[]>(null);
  public MasBrandForClient$: BehaviorSubject<Brand[]> = new BehaviorSubject<Brand[]>(null);
  public tokenIssueDate$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public tokenExpiryDate$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public isTokenRefreshing$ = new BehaviorSubject(false);

  public init(): boolean {
    const ticket = this.getTicketFromStorage();
    const user = this.getUserFromStorage();
    const clients = this.getClientsForUserFromStorage();
    const defaultClient = this.getDefaultClientFromStorage();
    const clientHtmlMessages = this.getClientHtmlMessagesFromStorage();
    const masBrands = this.getMasBrandFromStorage();
    const tokenIssueDate = this.getTokenIssueDateFromStorage();
    const tokenExpiryDate = this.getTokenExpiryDateFromStorage();

    if (ticket && user) {
      this.ticket$.next(ticket);
      this.authenticatedUser$.next(new User(user));
      this.authState$.next(true);
      this.clientsForUser$.next(clients);
      this.defaultClient$.next(defaultClient);
      this.clientHtmlMessages$.next(clientHtmlMessages);
      this.MasBrandForClient$.next(masBrands);
      this.tokenIssueDate$.next(tokenIssueDate);
      this.tokenExpiryDate$.next(tokenExpiryDate);

      return true;
    }
    this.authState$.next(false);
    return false;
  }

  public isAuthenticated(): boolean {
    return this.authState$.value;
  }

  public async doLogin(username: string, password: string) {
    this.loading$.next(true);
    return new Promise((resolve, reject) => {

      this.http
        .get(
          `${environment.baseEndpoint}Services/LoginService.svc/Json/DoLogin?Username=${username}&Password=${password}&userType=C`,
          { observe: 'response' }
        )
        .subscribe(async resp => {
          const { body, headers } = resp;
          const ticket = headers.get('ticket');
          const user = resp && body ? new User(body) : {};

          if (user instanceof User) {
            this.tokenIssueDate$.next(user.TokenIssueDate);
            localStorage.setItem('tokenIssueDate', user.TokenIssueDate);
            this.tokenExpiryDate$.next(user.TokenExpiryDate);
            localStorage.setItem('tokenExpiryDate', user.TokenExpiryDate);
          }

          this.ticket$.next(ticket);
          localStorage.setItem('ticket', ticket);
          this.authState$.next(true);

          if (user instanceof User) {
            this.authenticatedUser$.next(user);
            localStorage.setItem('authenticatedUser', JSON.stringify(user));

            await this.getClientsForUser(user.UserID);
            const masUser = await this.getMasUser(user.UserID);
            localStorage.setItem('masUser', JSON.stringify(masUser));

            const defaultClient = this.clientsForUser$.value.find(
              (client: Client) => client.ClientID === user.ClientID);
            localStorage.setItem('defaultClient', JSON.stringify(defaultClient));
            this.defaultClient$.next(defaultClient);

            const clientHtmlMessagesSetup = await this.getClientHtmlMsgByClientID(defaultClient.ClientID);
            localStorage.setItem('clientHtmlMessages', JSON.stringify(clientHtmlMessagesSetup));
            this.clientHtmlMessages$.next(clientHtmlMessagesSetup);
           
            let masBrandsSetup = await this.getMasBrandsByClientID(defaultClient.ClientID);
            if(masBrandsSetup && masBrandsSetup.length > 0){
              let ClientBannerText = masBrandsSetup[0].BannerText;
              if (ClientBannerText == null || ClientBannerText === ''){
                masBrandsSetup = await this.getMasBrandsByClientID(8473); // Get Client info with R2 Client as default
              }
            }
            localStorage.setItem('masBrands', JSON.stringify(masBrandsSetup));
            this.MasBrandForClient$.next(masBrandsSetup);
          }

          resolve({ ticket, status: true, user });

        },
          error => {
            this.authState$.next(false);
            resolve({ status: false, message: error.error.ErrorMessage })

          });

    })
  }

  public logout() {
    this.clearSession();
    this.router.navigate(['login']);
    window.location.reload();
  }

  private clearSession() {
    this.authenticatedUser$.next(null);
    this.ticket$.next(null);
    this.clientsForUser$.next(null);
    this.authState$.next(false);
    this.defaultClient$.next(null);
    this.loading$.next(false);
    this.tokenIssueDate$.next(null);
    this.tokenExpiryDate$.next(null);
    localStorage.removeItem('authenticatedUser');
    localStorage.removeItem('ticket');
    localStorage.removeItem('defaultClient');
    localStorage.removeItem('clientsForUser');
    localStorage.removeItem('tokenIssueDate');
    localStorage.removeItem('tokenExpiryDate');
    localStorage.clear();
    this.isTokenRefreshing$.next(false);
  }

  public async getClientsForUser(userID: number) {
    const clients = await this.http.get<Client[]>(`${this.baseEndpoint}Services/MASClientService.svc/json/GetClientForUser?userID=${userID}&ClientName=`
    ).toPromise();

    localStorage.setItem('clientsForUser', JSON.stringify(clients));
    this.clientsForUser$.next(clients);

    return clients;
  }

  public getTicketFromStorage(): string {
    return localStorage.getItem('ticket');
  }

  public getUserFromStorage(): User {
    return JSON.parse(localStorage.getItem('authenticatedUser'));
  }

  public getDefaultClientFromStorage(): Client {
    return JSON.parse(localStorage.getItem('defaultClient'));
  }

  public getDefaultClient(): Client {
    return this.defaultClient$.value;
  }

  public setDefaultClient(client: Client) {
    localStorage.setItem('defaultClient', JSON.stringify(client));
    this.defaultClient$.next(client);
  }

  public getClientsForUserFromStorage(): Client[] {
    return JSON.parse(localStorage.getItem('clientsForUser'));
  }

  public getMasUserFromStorage(): MasUser {
    return JSON.parse(localStorage.getItem('masUser'));
  }

  public getClientHtmlMessages(): HtmlMsgByClient[] {
    return this.clientHtmlMessages$.value;
  }

  public getClientHtmlMessagesFromStorage(): HtmlMsgByClient[] {
    return JSON.parse(localStorage.getItem('clientHtmlMessages'));
  }

  public getMasBrands(): Brand[] {
    return this.MasBrandForClient$.value;
  }

  public getMasBrandFromStorage(): Brand[] {
    return JSON.parse(localStorage.getItem('masBrands'));
  }

  public async getMasUser(userId): Promise<MasUser> {
    return await this.http.get<MasUser>(`${this.baseEndpoint}Services/MASUserService.svc/json//GetMasUserByID?UserID=${userId}`
    ).toPromise();
  }

  public async getClientHtmlMsgByClientID(clientID: number) {
    return this.http.get<HtmlMsgByClient[]>(`${this.baseEndpoint}Services/MasClientHtmlMessageService.svc/json/GetClientHtmlMsgByClientID?ClientID=${clientID}`
    ).toPromise();
  }

  public async getMasBrandsByClientID(clientID: number) {
    return this.http.get<Brand[]>(`${this.baseEndpoint}Services/MasBrandsService.svc/json/GetMasBrandsDataByClientID?ClientID=${clientID}`    
    ).toPromise();
  }

  public async getLoginDetailsUsingTicket(ticket: string) {
    this.loading$.next(true);
    this.ticket$.next(ticket);
    localStorage.setItem('ticket', ticket);
    const httpHeaders = new HttpHeaders({
      Ticket: ticket
    });
    return new Promise((resolve, reject) => {

      this.http
        .get(
          `${environment.baseEndpoint}Services/LoginService.svc/Json/GetDetailsUsingTicket?ticket=${ticket}`,
          { headers: httpHeaders, observe: 'response' }
        )
        .subscribe(async resp => {
          const { body, headers } = resp;
          const ticket = headers.get('ticket');
          const user = resp && body ? new User(body) : {};

          if (user instanceof User) {
            this.tokenIssueDate$.next(user.TokenIssueDate);
            localStorage.setItem('tokenIssueDate', user.TokenIssueDate);
            this.tokenExpiryDate$.next(user.TokenExpiryDate);
            localStorage.setItem('tokenExpiryDate', user.TokenExpiryDate);
          }

          this.ticket$.next(ticket);
          localStorage.setItem('ticket', ticket);
          this.authState$.next(true);

          if (user instanceof User) {
            this.authenticatedUser$.next(user);
            localStorage.setItem('authenticatedUser', JSON.stringify(user));

            await this.getClientsForUser(user.UserID);
            const masUser = await this.getMasUser(user.UserID);
            localStorage.setItem('masUser', JSON.stringify(masUser));

            const defaultClient = this.clientsForUser$.value.find(
              (client: Client) => client.ClientID === user.ClientID);
            localStorage.setItem('defaultClient', JSON.stringify(defaultClient));
            this.defaultClient$.next(defaultClient);

            const clientHtmlMessagesSetup = await this.getClientHtmlMsgByClientID(defaultClient.ClientID);
            localStorage.setItem('clientHtmlMessages', JSON.stringify(clientHtmlMessagesSetup));
            this.clientHtmlMessages$.next(clientHtmlMessagesSetup);

            const masBrandsSetup = await this.getMasBrandsByClientID(defaultClient.ClientID);
            localStorage.setItem('masBrands', JSON.stringify(masBrandsSetup));
            this.MasBrandForClient$.next(masBrandsSetup);
          }

          resolve({ ticket, status: true, user });
        },
          error => {
            this.authState$.next(false);
            resolve({ status: false, message: error.error.ErrorMessage })
          });
    })
  }

  public getTokenIssueDateFromStorage(): string {
    return localStorage.getItem('tokenIssueDate');
  }

  public getTokenExpiryDateFromStorage(): string {
    return localStorage.getItem('tokenExpiryDate');
  }

  public async refreshToken() {
    return new Promise((resolve, reject) => {

      this.http.post(this.baseEndpoint + 'Services/LoginService.svc/json/RefreshToken', "",
        { observe: 'response' }
      )
        .subscribe(async resp => {
          const { body } = resp;
          const ticketModel = resp && body ? new TicketDataModel(body) : {};

          var ticket = '';
          if (ticketModel instanceof TicketDataModel) {
            this.tokenIssueDate$.next(ticketModel.TokenIssueDate);
            localStorage.setItem('tokenIssueDate', ticketModel.TokenIssueDate);
            this.tokenExpiryDate$.next(ticketModel.TokenExpiryDate);
            localStorage.setItem('tokenExpiryDate', ticketModel.TokenExpiryDate);
            this.ticket$.next(ticketModel.TokenString);
            localStorage.setItem('ticket', ticketModel.TokenString);
            ticket = ticketModel.TokenString;
          }

          this.isTokenRefreshing$.next(false);

          resolve({ ticket, status: true, ticketModel });
        },
          error => {
            this.authState$.next(false);
            resolve({ status: false, message: error.error.ErrorMessage })
          });
    })
  }
}
