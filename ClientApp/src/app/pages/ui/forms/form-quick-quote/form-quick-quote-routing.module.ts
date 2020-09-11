import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from '../../../../../@vex/interfaces/vex-route.interface';
import { FormQuickQuoteComponent } from './form-quick-quote.component';

const routes: VexRoutes = [
  { path: '', component: FormQuickQuoteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormQuickQuoteRoutingModule {
}
