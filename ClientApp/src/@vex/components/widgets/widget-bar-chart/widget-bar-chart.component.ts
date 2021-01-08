import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};

@Component({
  selector: 'vex-widget-bar-chart',
  templateUrl: './widget-bar-chart.component.html',
  styleUrls: ['./widget-bar-chart.component.scss']
})
export class WidgetBarChartComponent implements OnInit, OnChanges {

  @Input() titleName: string = "";
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() series: ApexAxisChartSeries = [];
  @Input() labels: any;
  @Input() barHeight: string = "50";

  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;

  constructor() { }

  ngOnInit() {
    this.labels = [];
    this.chartInitialize();    
  }

  ngOnChanges() {
    this.chartInitialize();
  }

  chartInitialize(){
    this.chartOptions = {
      series: this.series,
      chart: {
        type: "bar",
        height: 550,
        width: 580,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "center"
          },
          barHeight: this.barHeight
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis:{
        type:'category',
        categories:this.labels
      }  
    };
  }

}
