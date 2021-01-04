import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeyPerformanceIndicatorComponent } from "./KPI.component";
import { KeyPerformanceIndicatorRoutingModule } from './KPI-routing.module';
import { MasterReportModule } from '../MasterReport/MasterReport.module';

@NgModule({
  declarations: [KeyPerformanceIndicatorComponent],
  imports: [
    FormsModule,    
    CommonModule,
    MasterReportModule,
    KeyPerformanceIndicatorRoutingModule
  ]
})

export class KeyPerformanceIndicatorModule { }