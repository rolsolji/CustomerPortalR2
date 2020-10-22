import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          console.log(error);
          if (error.error instanceof ErrorEvent) {
            // This is client side error'
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            // This is server side error
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;

            if (error && error.error
              && error.error.ErrorMessage
              && error.error.ErrorMessage === 'Your Access is Expired.') {
              console.log(error.error.ErrorMessage);
              this.authenticationService.logout();
              this.snackbar.open('Your Access is Expired. Log in again.', '', {
                duration: 5000
              });
            }

            if (error && error.error
              && error.error.ErrorMessage
              && error.error.ErrorMessage === 'Invalid username or password') {
              this.authenticationService.loading$.next(false);
              this.snackbar.open('Invalid username or password.', '', {
                duration: 5000
              });
            }
          }
          console.error(errorMsg);
          return EMPTY;
        })
      )
  }
}
