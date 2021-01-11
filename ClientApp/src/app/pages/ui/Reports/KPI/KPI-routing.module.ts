import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeyPerformanceIndicatorComponent } from './KPI.component';


const routes: Routes = [
  {
    path: '',
    component: KeyPerformanceIndicatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyPerformanceIndicatorRoutingModule {
}
