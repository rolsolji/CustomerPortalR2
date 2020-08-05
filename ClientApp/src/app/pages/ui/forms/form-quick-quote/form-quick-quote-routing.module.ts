import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormQuickQuoteComponent } from './form-quick-quote.component';
import { VexRoutes } from '../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: FormQuickQuoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormQuickQuoteRoutingModule {
}
