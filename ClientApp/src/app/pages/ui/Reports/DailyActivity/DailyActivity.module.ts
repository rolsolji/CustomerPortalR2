import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyActivityComponent } from './DailyActivity.component';
import { DailyActivityRoutingModule } from './DailyActivity-routing.module';
import { MasterReportModule } from '../MasterReport/MasterReport.module';

@NgModule({
  declarations: [DailyActivityComponent],
  imports: [
    FormsModule,    
    CommonModule,
    MasterReportModule,
    DailyActivityRoutingModule
  ]
})

export class DailyActivityModule { }