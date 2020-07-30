import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormAddShipmentComponent } from './form-add-shipment.component';
import { VexRoutes } from '../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: FormAddShipmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormAddShipmentRoutingModule { }
