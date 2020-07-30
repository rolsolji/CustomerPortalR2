import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormShipmentBoardTlRoutingModule } from './form-shipment-board-tl-routing.module';
import { FormShipmentBoardTlComponent } from './form-shipment-board-tl.component';
import { PageLayoutModule } from '../../../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [FormShipmentBoardTlComponent],
  imports: [
    CommonModule,
    FormShipmentBoardTlRoutingModule,
    PageLayoutModule,
    FlexLayoutModule
  ]
})
export class FormShipmentBoardTlModule { }
