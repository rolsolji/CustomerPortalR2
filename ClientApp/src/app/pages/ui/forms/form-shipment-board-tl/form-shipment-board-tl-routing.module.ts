import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormShipmentBoardTlComponent } from './form-shipment-board-tl.component';
import { VexRoutes } from '../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: FormShipmentBoardTlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormShipmentBoardTlRoutingModule {
}