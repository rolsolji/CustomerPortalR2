import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

export class RefreshTokenInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (req.url.indexOf("DoLogin") === -1 && req.url.indexOf("RefreshToken") === -1
            && req.url.indexOf("GetDetailsUsingTicket") === -1) {

            var issueDate = new Date(this.authenticationService.tokenIssueDate$.value);
            var expiryDate = new Date(this.authenticationService.tokenExpiryDate$.value);

            // var currentDate = new Date();
            var currentDateinlocaltime = new Date();
            var minutes = currentDateinlocaltime.getTimezoneOffset();
            var currentDate = new Date(currentDateinlocaltime.getTime() + minutes * (60000));

            var issueAndExpirySeconds = Math.floor((expiryDate.getTime() - (issueDate.getTime())) / 1000);
            var issueAndExpiryMinutes = Math.floor(issueAndExpirySeconds / 60);
            var issueandexpirydiff = issueAndExpiryMinutes;

            var currentAndExpirySeconds = Math.floor((expiryDate.getTime() - (currentDate.getTime())) / 1000);
            var currentAndExpiryMinutes = Math.floor(currentAndExpirySeconds / 60);
            var currentandexpirydiff = currentAndExpiryMinutes

            var hrsDiffInPer = (currentandexpirydiff * 100) / issueandexpirydiff;

            if (issueandexpirydiff < 0 || currentandexpirydiff < 0 || hrsDiffInPer <= 0) {
                this.authenticationService.isTokenRefreshing$.next(false);
            }
            else {
                if (hrsDiffInPer < 30 && this.authenticationService.isTokenRefreshing$.value === false) {
                    this.authenticationService.isTokenRefreshing$.next(true);
                    this.authenticationService.refreshToken();
                }
            }
        }

        /* Supply ticket into header. */
        var authToken = this.authenticationService.ticket$.value;
        if (authToken == null || authToken == undefined) {
            authToken = "";
        }

        const authReq = req.clone({
            headers: req.headers.set('Ticket', authToken)
        });
        /* END */

        return next.handle(authReq);
    }
}