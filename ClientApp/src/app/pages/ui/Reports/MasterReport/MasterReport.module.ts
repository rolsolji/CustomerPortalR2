import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SecondaryToolbarModule } from '../../../../../@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MasterReportComponent } from "./MasterReport.component";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [MasterReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,    
    MatAutocompleteModule,    
    MatCheckboxModule,
    SecondaryToolbarModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule    
  ],
  exports: [MasterReportComponent]
})

export class MasterReportModule { }