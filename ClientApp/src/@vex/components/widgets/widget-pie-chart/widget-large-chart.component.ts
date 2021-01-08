import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import { createDateArray } from '../../../utils/create-date-array';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ChartType,
} from "ng-apexcharts";
import { asapScheduler } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'vex-widget-large-chart',
  templateUrl: './widget-large-chart.component.html',
  styleUrls: ['./widget-large-chart.component.scss']
})
export class WidgetLargeChartComponent implements OnInit, OnChanges {

  @Input() series: ApexNonAxisChartSeries = [];
  @Input() labels: any;
  @Input() titleName: string;
  @Input() chartType: ChartType = 'pie';
  @Input() autoUpdateSeries = true;
  @Input() chartHeight: number = 450;
  @Input() chartWidth: number = 550;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;

  constructor() {
  }

  ngOnInit() {
    this.chartInitialize();
  }

  ngOnChanges() {
    this.chartInitialize();
    // if (this.series && this.series.length > 0) {
    //   this.chartOptions.series = this.series;
    // }
    // if (this.labels && this.labels.length > 0) {
    //   this.chartOptions.labels = this.labels;
    // }
    // if(this.chartOptions && this.chartType){
    //   this.chartOptions.chart.type = this.chartType;
    // }
    // if(this.chartOptions && this.chartHeight){
    //   this.chartOptions.chart.height = this.chartHeight;
    // }
    // if(this.chartOptions && this.chartWidth){
    //   this.chartOptions.chart.width = this.chartWidth;
    // }
  }

  chartInitialize(){
    this.chartOptions = {
      series: this.series,
      chart: {
        type: this.chartType,
        height: this.chartHeight,
        width: this.chartWidth,
        sparkline: {
          enabled: false
        },
        zoom: {
          enabled: false
        },
      },
      labels: this.labels,
    };
  }
}
