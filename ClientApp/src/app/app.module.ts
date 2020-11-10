import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {HttpErrorInterceptor} from './common/http-error-interceptor';
import {AuthenticationService} from './common/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,

    // Vex
    VexModule,
    CustomLayoutModule
  ],
  providers: [
    DatePipe,
    MatSnackBar,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
      deps: [AuthenticationService, MatSnackBar]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
