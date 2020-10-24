import {Injectable} from '@angular/core';
import {User} from '../Entities/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Client} from '../Entities/client.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseEndpoint: string;
  constructor (
    private http: HttpClient,
    public router: Router,
    private snackbar: MatSnackBar
  ) {
    this.baseEndpoint = environment.baseEndpoint;
    this.init();
  }

  public authState$ = new BehaviorSubject(false);
  public authenticatedUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public ticket$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);
  public defaultClient$: BehaviorSubject<Client> = new BehaviorSubject<Client>(null);
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public init(): boolean {
    this.loading$.next(false);
    const ticket = this.getTicketFromStorage();
    const user = this.getUserFromStorage();
    const clients = this.getClientsForUserFromStorage();
    const defaultClient = this.getDefaultClientFromStorage();

    if (ticket && user) {
      this.ticket$.next(ticket);
      this.authenticatedUser$.next(new User(user));
      this.authState$.next(true);
      this.clientsForUser$.next(clients);
      this.defaultClient$.next(defaultClient);

      return true;
    }
    this.authState$.next(false);
    return false;
  }

  public isAuthenticated(): boolean {
    return this.authState$.value;
  }

  public async doLogin(username: string, password: string) {
    return new Promise((resolve, reject) => {

      this.http
        .get(
          `${environment.baseEndpoint}Services/LoginService.svc/Json/DoLogin?Username=${username}&Password=${password}&userType=C`,
          {observe: 'response'}
        )
        .subscribe(async resp => {
            const {body, headers} = resp;
            const ticket = headers.get('ticket');
            const user = resp && body ? new User(body) : {};

            this.ticket$.next(ticket);
            localStorage.setItem('ticket', ticket);
            this.authState$.next(true);

            if (user instanceof User) {
              this.authenticatedUser$.next(user);
              localStorage.setItem('authenticatedUser', JSON.stringify(user));

              await this.getClientsForUser(user.UserID);

              const defaultClient = this.clientsForUser$.value.find(
                (client: Client) => client.ClientID === user.ClientID);
              localStorage.setItem('defaultClient', JSON.stringify(defaultClient));
              this.defaultClient$.next(defaultClient);

            }

            resolve({ticket, status: true, user});

          },
          error => {
            this.authState$.next(false);
            resolve({status: false, message: error.error.ErrorMessage})

          });

    })
  }

  public logout() {
    this.clearSession();
    this.router.navigate(['login']);
  }

  private clearSession() {
    this.authenticatedUser$.next(null);
    this.ticket$.next(null);
    this.authState$.next(false);
    localStorage.removeItem('authenticatedUser');
    localStorage.removeItem('ticket');
    localStorage.removeItem('defaultClient');
    localStorage.removeItem('clientsForUser');
  }

  public async getClientsForUser(userID: number) {
    const ticket = this.ticket$.value;

    console.log(ticket);

    const httpHeaders = new HttpHeaders({
      Ticket : ticket
    });

    const clients = await this.http.get<Client[]>(`${this.baseEndpoint}Services/MASClientService.svc/json/GetClientForUser?userID=${userID}&ClientName=`
      ,{
        headers: httpHeaders
      }
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
}
