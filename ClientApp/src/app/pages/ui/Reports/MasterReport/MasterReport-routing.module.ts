import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterReportComponent } from "./MasterReport.component";


const routes: Routes = [
  {
    path: '',
    component: MasterReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterReportRoutingModule {
}
