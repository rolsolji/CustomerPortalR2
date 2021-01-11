import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShipmentHistoryComponent } from './ShipmentHistory.component';
import { ShipmentHistoryRoutingModule } from './ShipmentHistory-routing.module';
import { MasterReportModule } from '../MasterReport/MasterReport.module';

@NgModule({
  declarations: [ShipmentHistoryComponent],
  imports: [
    FormsModule,    
    CommonModule,
    MasterReportModule,
    ShipmentHistoryRoutingModule
  ]
})

export class ShipmentHistoryModule { }