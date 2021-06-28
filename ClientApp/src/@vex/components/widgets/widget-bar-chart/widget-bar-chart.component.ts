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
  ApexStroke,
  ApexGrid, 
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
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
  @Input() chartHeight: number = 550;
  @Input() chartWidth: number = 580;
  @Input() dataLabels: ApexDataLabels;

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

  chartInitialize() {
    this.chartOptions = {
      series: this.series,
      chart: {
        type: "bar",
        height: this.chartHeight,
        width: this.chartWidth,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            //position: "top",
            orientation:"horizontal"
          },
          barHeight: this.barHeight
        }
      },
      // dataLabels: {
      //   enabled: true,
      //   // offsetX: 0,
      //   // offsetY: 0,        
      //   style: {
      //     fontSize: "12px",
      //     colors: ["#000"]
      //   }
      // },
      dataLabels: this.dataLabels,
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        type: 'category',
        categories: this.labels,        
      },
      yaxis:{        
        labels:{
          show:true,
          align:'left',
          minWidth:150
        }
      },
      // grid:{
      //   padding: {
      //     top: 0,
      //     right: 0,
      //     bottom: 0,
      //     left: 7
      //   }
      // }   
    };
  }

}
