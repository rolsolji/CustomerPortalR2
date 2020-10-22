import { Injectable } from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) { }

  canActivate(): boolean{
    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
