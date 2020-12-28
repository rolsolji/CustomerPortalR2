import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrierPerformanceComponent } from './CarrierPerformance.component';


const routes: Routes = [
  {
    path: '',
    component: CarrierPerformanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrierPerformanceRoutingModule {
}
