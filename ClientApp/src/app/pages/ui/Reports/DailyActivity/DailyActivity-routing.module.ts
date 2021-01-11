import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyActivityComponent } from './DailyActivity.component';


const routes: Routes = [
  {
    path: '',
    component: DailyActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyActivityRoutingModule {
}
