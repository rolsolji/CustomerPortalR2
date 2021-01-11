import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierPerformanceComponent } from './CarrierPerformance.component';
import { CarrierPerformanceRoutingModule } from './CarrierPerformance-routing.module';
import { MasterReportModule } from '../MasterReport/MasterReport.module';

@NgModule({
  declarations: [CarrierPerformanceComponent],
  imports: [
    FormsModule,    
    CommonModule,
    MasterReportModule,
    CarrierPerformanceRoutingModule
  ]
})

export class CarrierPerformanceModule { }