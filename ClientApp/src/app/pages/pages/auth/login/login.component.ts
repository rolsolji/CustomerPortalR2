import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import {AuthenticationService} from '../../../../common/authentication.service';
import {BehaviorSubject} from 'rxjs';
import {Client} from '../../../../Entities/client.model';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  isLoginEnabled: boolean = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    public authService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    var ticket = this.activatedRoute.snapshot.queryParamMap.get("ticket");
    if(ticket != null && ticket != undefined && ticket != ''){
      this.snackbar.open('Logging in...', '', {
        duration: 5000,
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition
      });
      this.isLoginEnabled = false;
      this.form.controls['username'].disable();
      this.form.controls['password'].disable();
      this.getLoginDetailsUsingTicket(ticket);
    }
  }

  async send() {
    if (this.form.value && this.form.value.username && this.form.value.password) {
      const username = this.form.value.username;
      const password = this.form.value.password;
      const response: any = await this.authService.doLogin(username.toString(), password.toString());
      if (response.status) {
        this.router.navigate(['/']);
        this.authService.loading$.next(false);
        return true;
      }
    }
    this.authService.loading$.next(false);
    this.snackbar.open('No valid credentials needed.', '', {
      duration: 5000
    });
    return false;
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  async getLoginDetailsUsingTicket(ticket: string) {
    if (ticket != null && ticket != undefined && ticket != '') {      
      const response: any = await this.authService.getLoginDetailsUsingTicket(ticket.toString());
      if (response.status) {
        this.router.navigate(['/']);
        this.authService.loading$.next(false);
        return true;
      }
    }
    this.authService.loading$.next(false);
    this.snackbar.open('No valid credentials needed.', '', {
      duration: 5000
    });
    return false;
  }
}
