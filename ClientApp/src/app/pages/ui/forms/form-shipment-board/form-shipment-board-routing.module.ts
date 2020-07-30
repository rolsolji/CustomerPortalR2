import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormShipmentBoardComponent } from './form-shipment-board.component';
import { VexRoutes } from '../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: FormShipmentBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormShipmentBoardRoutingModule {
}