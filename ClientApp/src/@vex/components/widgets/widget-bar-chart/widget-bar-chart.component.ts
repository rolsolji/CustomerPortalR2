import { Component, Input, OnInit } from '@angular/core';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import { ApexOptions } from '../../chart/chart.component';
import { defaultChartOptions } from '../../../utils/default-chart-options';

@Component({
  selector: 'vex-widget-bar-chart',
  templateUrl: './widget-bar-chart.component.html',
  styleUrls: ['./widget-bar-chart.component.scss']
})
export class WidgetBarChartComponent implements OnInit {

  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;  
  @Input() titleName: string;
  @Input() options: ApexOptions = defaultChartOptions({
    series: [
      {
        name: "serie1",
        data: [44, 55, 41, 64, 22, 43, 21]
      },
      {
        name: "serie2",
        data: [53, 32, 33, 52, 13, 44, 32]
      }
    ],
    chart: {
      type: "bar",
      height: 430
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top"
        }
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
    xaxis: {
      categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007]
    }
  });  

  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;

  constructor() { }

  ngOnInit(): void {
  }

}
