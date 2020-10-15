import {Injectable} from '@angular/core';
import {User} from '../Entities/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Client} from '../Entities/client.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseEndpoint: string;

  constructor (
    private http: HttpClient,
    public router: Router
  ) {
    this.baseEndpoint = environment.baseEndpoint;
    this.init();
  }

  public authState$ = new BehaviorSubject(false);
  public authenticatedUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public ticket$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);

  private init(): boolean {
    const ticket = this.getTicketFromStorage();
    const user = this.getUserFromStorage();
    const clients = this.getClientsForUserFromStorage();

    if (ticket && user) {
      this.ticket$.next(ticket);
      this.authenticatedUser$.next(new User(user));
      this.authState$.next(true);
      this.clientsForUser$.next(clients);
      return true;
    }
    this.authState$.next(false);
    return false;
  }

  public isAuthenticated(): boolean {
    return this.authState$.value;
  }

  public doLogin(username: string, password: string) {
    return new Promise((resolve, reject) => {

      this.http
        .get(
          `${environment.baseEndpoint}Services/LoginService.svc/Json/DoLogin?Username=${username}&Password=${password}&userType=C`,
          {observe: 'response'}
        )
        .subscribe(resp => {

            const {body, headers} = resp;
            const ticket = headers.get('ticket');
            const user = resp && body ? new User(body) : {};

            this.ticket$.next(ticket);
            localStorage.setItem('ticket', ticket);
            this.authState$.next(true);

            if (user instanceof User) {
              this.authenticatedUser$.next(user);
              localStorage.setItem('authenticatedUser', JSON.stringify(user));
              this.getClientForUser(user.UserID);
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
    this.ticket$.next('');
    this.authState$.next(false);
    localStorage.removeItem('authenticatedUser');
    localStorage.removeItem('ticket');
  }

  public getClientForUser(userID: number) {
    const ticket = this.ticket$.value;
    const httpHeaders = new HttpHeaders({
      Ticket : ticket
    });

    return this.http.get(`${this.baseEndpoint}Services/MASClientService.svc/json/GetClientForUser?userID=${userID}&ClientName=`
      ,{
        headers: httpHeaders
      }
    ).subscribe((clients: Client[]) => {
      localStorage.setItem('clientsForUser', JSON.stringify(clients));
      this.clientsForUser$.next(clients);
    });
  }

  public getTicketFromStorage(): string {
    return localStorage.getItem('ticket');
  }

  public getUserFromStorage(): User {
    return JSON.parse(localStorage.getItem('authenticatedUser'));
  }

  public getClientsForUserFromStorage(): Client[] {
    return JSON.parse(localStorage.getItem('clientsForUser'));
  }

}
