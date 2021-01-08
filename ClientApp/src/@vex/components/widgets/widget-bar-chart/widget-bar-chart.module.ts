import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBarChartComponent } from './widget-bar-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [WidgetBarChartComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    IconModule,
    FlexLayoutModule,
    NgApexchartsModule
  ],
  exports: [WidgetBarChartComponent]
})
export class WidgetBarChartModule {
}
