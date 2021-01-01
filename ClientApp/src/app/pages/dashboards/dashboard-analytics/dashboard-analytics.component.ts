import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icGroup from '@iconify/icons-ic/twotone-group';
import icPageView from '@iconify/icons-ic/twotone-pageview';
import icCloudOff from '@iconify/icons-ic/twotone-cloud-off';
import icTimer from '@iconify/icons-ic/twotone-timer';
import { defaultChartOptions } from '../../../../@vex/utils/default-chart-options';
import { Order, tableSalesData } from '../../../../static-data/table-sales-data';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { DashBoardService } from './dashboard-analytics.service';
import { weightcostCompareModel } from 'src/app/Entities/WeightCostCompareModel';
import { AuthenticationService } from 'src/app/common/authentication.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { AccessorialPerformance } from 'src/app/Entities/AccessorialPerformance';
import { CarrierPerformanceModel } from 'src/app/Entities/CarrierPerformanceModel';


@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})
export class DashboardAnalyticsComponent implements OnInit {

  dateFrom: string = null;
  dateTo: string = null;
  isIncludeSubClient: boolean = true;
  chart1Name: string = "Total Shipments By MTD";
  chart2Name: string = "Cost By Firgation";
  chart3Name: string = "Top Accessorials";
  chart4Name: string = "Top Carriers";

  tableColumns: TableColumn<Order>[] = [
    {
      label: '',
      property: 'status',
      type: 'badge'
    },
    {
      label: 'PRODUCT',
      property: 'name',
      type: 'text'
    },
    {
      label: '$ PRICE',
      property: 'price',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'DATE',
      property: 'timestamp',
      type: 'text',
      cssClasses: ['text-secondary']
    }
  ];
  tableData = tableSalesData;

  tableColumnsShipments: TableColumn<Order>[] = [];

  tableDataShipments: weightcostCompareModel[] = [];

  topAccessorialDetails: AccessorialPerformance[] = [];

  topCarriersDetails: CarrierPerformanceModel[] = [];

  // series: ApexAxisChartSeries = [{
  //   name: 'Subscribers',
  //   data: [28, 40, 36, 0, 52, 38, 60, 55, 67, 33, 89, 44]
  // }];

  // uniqueUsersOptionsTotalShipmentChart = defaultChartOptions({
  //   chart: {
  //     type: 'pie'
  //   },
  //   series: [1281, 326, 0, 0, 0, 0, 0],
  //   labels: ['TL', 'LTL', 'OCEAN', 'Small Package', 'AIR FREIGHT', 'INTERMODAL', 'TL Spot Quote']
  //   //,
  //   //legend: {
  //   //    show: true,
  //   //    position: 'bottom'
  //   //} 
  // });

  // salesSeries: ApexAxisChartSeries = [{
  //   name: 'Sales',
  //   data: [28, 40, 36, 0, 52, 38, 60, 55, 99, 54, 38, 87]
  // }];

  // pageViewsSeries: ApexAxisChartSeries = [{
  //   name: 'Page Views',
  //   data: [405, 800, 200, 600, 105, 788, 600, 204]
  // }];

  // uniqueUsersSeries: ApexAxisChartSeries = [{
  //   name: 'Unique Users',
  //   data: [356, 806, 600, 754, 432, 854, 555, 1004]
  // }];

  // uniqueUsersOptions = defaultChartOptions({
  //   chart: {
  //     type: 'area',
  //     height: 100
  //   },
  //   colors: ['#ff9800']
  // });

  icGroup = icGroup;
  icPageView = icPageView;
  icCloudOff = icCloudOff;
  icTimer = icTimer;
  icMoreVert = icMoreVert;

  TotalShipmentsOptions = defaultChartOptions({
    chart: {
      type: 'pie'
    },
    series: [],
    labels: []
  });

  CostByFirgation = defaultChartOptions({
    chart: {
      type: 'donut'
    },
    series: [],
    labels: []
  });

  TopAccessorials = defaultChartOptions({
    chart: {
      type: 'donut'
    },
    series: [],
    labels: []
  });

  TopCarriers = defaultChartOptions({
    chart: {
      type: 'bar'
    },
    series: [],
    labels: []
  });

  constructor(private cd: ChangeDetectorRef, private dashBoardService: DashBoardService,
    private authenticationService: AuthenticationService) { }

  async ngOnInit() {
    setTimeout(() => {
      const temp = [
        {
          name: 'Subscribers',
          data: [55, 213, 55, 0, 213, 55, 33, 55]
        },
        {
          name: ''
        }
      ];
    }, 3000);

    this.calculationOfDateFromAndTo();

    /* Start Details of Total shipments by MTD chart and Shipments table. */
    this.GetDetailsForTotalShipmentsChartAndTable();
    /* END */

    /* Start Details of Top Accessorials and Cost By Firgation chart. */
    this.GetDetailsForTopAccessorialsChart();
    /* END */

    /* Start Details of Top Carriers chart. */
    this.GetDetailsForTopCarriersChart();
    /* END */
  }

  calculationOfDateFromAndTo() {
    var currentTime = new Date();
    this.dateTo = (currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear();
    var fdm = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
    //this.dateFrom = (fdm.getMonth() + 1) + '/' + fdm.getDate() + '/' + fdm.getFullYear();
    this.dateFrom = "01/01/2020";
  }

  async GetDetailsForTotalShipmentsChartAndTable() {
    this.tableDataShipments = await this.dashBoardService.DashBoard_GetTotalShipmentByMTDByDate(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.calculateTotal();
    this.PrepareDetailsForChart();
  }

  PrepareDetailsForChart() {
    var tlshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "TL").map(a => a.ShipmentCount));
    var ltlshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "LTL").map(a => a.ShipmentCount));
    var oceanshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "OCEAN").map(a => a.ShipmentCount));
    var smallPackageshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "Small Package").map(a => a.ShipmentCount));
    var airFreightshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "AIR FREIGHT").map(a => a.ShipmentCount));
    var intermodelshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "INTERMODAL").map(a => a.ShipmentCount));
    var tlSpotquoteshipment = Number(this.tableDataShipments.filter(a => a.Mode.trim() == "TL Spot Quote").map(a => a.ShipmentCount));

    this.TotalShipmentsOptions = defaultChartOptions({
      chart: {
        type: 'pie',
        height: 300,
        width: 550,
      },
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '8px',
        itemMargin: {
          horizontal: 5,
          vertical: 5
        },
      },
      series: [tlshipment, ltlshipment, oceanshipment, smallPackageshipment, airFreightshipment, intermodelshipment, tlSpotquoteshipment],
      labels: ['TL', 'LTL', 'OCEAN', 'Small Package', 'AIR FREIGHT', 'INTERMODAL', 'TL Spot Quote']
    });
  }

  calculateTotal() {

    var totalQtyShipment = this.tableDataShipments.reduce((a, b) => a + b.ShipmentCount, 0);
    var totalWeight = this.tableDataShipments.reduce((a, b) => a + b.TotalWeight, 0);
    var totalSpend = this.tableDataShipments.reduce((a, b) => a + b.TotalSpend, 0);
    var totalAvgCost = (totalSpend / totalQtyShipment);
    var totalCostPerPound = (totalSpend / totalWeight);

    this.TableHeaderAndFooterSetData(totalQtyShipment.toString(), totalAvgCost.toFixed(2).toString(), totalWeight.toString(), totalCostPerPound.toFixed(2).toString(), totalSpend.toFixed(2).toString());
  }

  TableHeaderAndFooterSetData(totalQtyShipment: string, totalAvgCost: string, totalWeight: string,
    totalCostPerPound: string, totalSpend: string) {
    this.tableColumnsShipments = [
      {
        label: 'Mode',
        property: 'Mode',
        type: 'text',
        footer: 'Total'
      },
      {
        label: 'Qty Shipments',
        property: 'ShipmentCount',
        type: 'text',
        footer: totalQtyShipment
      },
      {
        label: '$ Avg Cost',
        property: 'CostPerShipment',
        type: 'text',
        cssClasses: ['font-medium'],
        footer: "$" + totalAvgCost
      },
      {
        label: 'Weight',
        property: 'TotalWeight',
        type: 'text',
        footer: totalWeight
      },
      {
        label: 'Cost Per Pound',
        property: 'CostPerPound',
        type: 'text',
        footer: totalCostPerPound
      },
      {
        label: '$ Total Spend',
        property: 'TotalSpend',
        type: 'text',
        cssClasses: ['font-medium'],
        footer: "$" + totalSpend
      }
    ];

  }

  async GetDetailsForTopAccessorialsChart() {
    this.topAccessorialDetails = await this.dashBoardService.DashBoard_GetTopAccesorial(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForTopAccessorialsChart();
    /* Start Details of Cost By firgation chart. */
    this.PrepareDetailsForByFirgationChart();
    /* END */
  }

  PrepareDetailsForTopAccessorialsChart() {

    var accDesc: string[] = [];
    var accCost: ApexNonAxisChartSeries = [];

    for (let i = 0; i < this.topAccessorialDetails.length; i++) {
      if (this.topAccessorialDetails[i].Description !== "FREIGHT" && this.topAccessorialDetails[i].Description !== "FUEL"
        && this.topAccessorialDetails[i].Description !== "DISCOUNT") {
        accDesc.push(this.topAccessorialDetails[i].Description);
        accCost.push(this.topAccessorialDetails[i].AccessorialCost);
      }
    }

    this.TopAccessorials = defaultChartOptions({
      chart: {
        type: 'donut',
        height: 300,
        width: 550,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
          }
        }
      ],
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '8px',
        itemMargin: {
          horizontal: 5,
          vertical: 5
        },
      },
      series: accCost,
      labels: accDesc
    });
  }

  PrepareDetailsForByFirgationChart() {

    var accDesc: string[] = [];
    var accCost: ApexNonAxisChartSeries = [];

    var freight = Number(this.topAccessorialDetails.filter(a => a.Description.trim() == "FREIGHT").map(a => a.AccessorialCost));
    var fuel = Number(this.topAccessorialDetails.filter(a => a.Description.trim() == "FUEL").map(a => a.AccessorialCost));
    var discount = Number(this.topAccessorialDetails.filter(a => a.Description.trim() == "DISCOUNT").map(a => a.AccessorialCost));
    var discountedFreight = (freight + discount);

    if (discountedFreight > 0) {
      accDesc.push("FREIGHT");
      accCost.push(Number(discountedFreight.toFixed(2)));
    }

    if (fuel > 0) {
      accDesc.push("FUEL");
      accCost.push(fuel);
    }

    var totalAccessorialChrg = this.topAccessorialDetails.filter(a => a.Description.trim() != "FREIGHT" && a.Description.trim() != "FUEL" && a.Description.trim() != "DISCOUNT").reduce((a, b) => a + b.AccessorialCost, 0);
    if (totalAccessorialChrg > 0) {
      accDesc.push("Total Accessorials");
      accCost.push(totalAccessorialChrg);
    }

    this.CostByFirgation = defaultChartOptions({
      chart: {
        type: 'donut',
        height: 300,
        width: 550,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
          }
        }
      ],
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '8px',
        itemMargin: {
          horizontal: 5,
          vertical: 5
        },
      },
      series: accCost,
      labels: accDesc
    });
  }

  async GetDetailsForTopCarriersChart() {
    this.topCarriersDetails = await this.dashBoardService.DashBoard_GetTopCarriers(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForTopCarriersChart();
  }

  PrepareDetailsForTopCarriersChart() {

    this.TopCarriers = defaultChartOptions({
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

  }
}
