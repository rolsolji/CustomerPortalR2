import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAddShipmentRoutingModule } from './form-add-shipment-routing.module';
import { FormAddShipmentComponent } from './form-add-shipment.component'; 
import { PageLayoutModule } from '../../../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [FormAddShipmentComponent],
  imports: [
    CommonModule,
    FormAddShipmentRoutingModule,
    PageLayoutModule,
    FlexLayoutModule
  ]
})
export class FormAddShipmentModule { }
