import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormAddShipComponent } from './form-add-ship.component';


const routes: Routes = [
  {
    path: '',
    component: FormAddShipComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormAddShipRoutingModule {
}
