import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentHistoryComponent } from './ShipmentHistory.component';


const routes: Routes = [
  {
    path: '',
    component: ShipmentHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentHistoryRoutingModule {
}
