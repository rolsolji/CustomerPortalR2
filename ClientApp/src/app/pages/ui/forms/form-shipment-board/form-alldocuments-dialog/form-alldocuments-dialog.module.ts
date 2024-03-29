import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormAllDocumentsDialogComponent } from './form-alldocuments-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { MatDividerModule } from '@angular/material/divider';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AppModule} from "../../../../../app.module";

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FlexLayoutModule,
      MatDialogModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatRadioModule,
      MatSelectModule,
      MatMenuModule,
      IconModule,
      MatDividerModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      AppModule
    ],
    declarations: [FormAllDocumentsDialogComponent],
    entryComponents: [FormAllDocumentsDialogComponent],
    exports: [FormAllDocumentsDialogComponent]
  })
  
  export class FormAllDocumentsDialogModule {      
  }