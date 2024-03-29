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
import { TopLanes } from 'src/app/Entities/TopLanes';
import { formatCurrency } from '@angular/common';
import { ChartType } from 'ng-apexcharts';
import { DashBoardMissedPickupModel } from 'src/app/Entities/DashBoardMissedPickupModel';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})
export class DashboardAnalyticsComponent implements OnInit {

  dateFrom: string = null;
  dateTo: string = null;
  isIncludeSubClient: boolean = true;
  isDateRangeVisible: boolean = false;
  dateFromForDatePicker: Date = null;
  dateToForDatePicker: Date = null;
  showSpinnerOnDateChanges: boolean = false;
  pickupDateFromDatePicker: Date = null;
  pickupDateToDatePicker: Date = null;
  pickupDateFrom: string = null;
  pickupDateTo: string = null;
  private baseEndpoint: string;
  securityToken: string;

  chart1Name: string = "Total Shipments By Mode";
  SeriesOfTotalShipmentsChart: ApexNonAxisChartSeries = [];
  labelsOfTotalShipmentsChart: any;
  heightOfTopShipmentsChart: number = 450;
  widthOfTopShipmentsChart: number = 550;

  chart2Name: string = "Cost By Freight Fuel & Accessorial";
  chart2Type: ChartType = 'donut';
  SeriesOfCostByFirgationChart: ApexNonAxisChartSeries = [];
  labelsOfCostByFirgationChart: any;
  heightOfCostByFirgationChart: number = 450;
  widthOfCostByFirgationChart: number = 550;

  chart3Name: string = "Top Accessorials";
  SeriesOfTopAccessorialsChart: ApexNonAxisChartSeries = [];
  labelsOfTopAccessorialsChart: any;
  heightOfTopAccessorialsChart: number = 450;
  widthOfTopAccessorialsChart: number = 550;

  chart4Name: string = "Top Carriers by Volume";
  SeriesOfTopCarriersChart: ApexAxisChartSeries = [];
  labelsOfTopCarriersChart: any;
  barHeightOfTopCarriersChart: string = "50";
  heightOfTopCarriersChart: number = 550;
  widthOfTopCarriersChart: number = 580;
  DataLabelsOfTopCarriersChart: ApexDataLabels;

  chart5Name: string = "Top 10 Lanes - Cost";
  SeriesOfTopLanesChart: ApexNonAxisChartSeries = [];
  labelsOfTopLanesChart: any;
  heightOfTopLanesChart: number = 450;
  widthOfTopLanesChart: number = 550;
  selectedOption: string = 'cost';
  lanetypesOfChart: any = [{ text: "By ZipCode", value: 1 }, { text: "By ZipCode-City", value: 2 }, { text: "By State", value: 3 }];
  selectedLaneType: number = 1;
  showSpinner: boolean;

  chart6Name: string = "Top Vendors By Volume";
  SeriesOfTopVendorsByVolumeChart: ApexAxisChartSeries = [];
  labelsOfTopVendorsByVolumeChart: any;
  barHeightOfTopVendorsByVolumeChart: string = "50";
  DataLabelsOfTopVendorsByVolumeChart: ApexDataLabels;

  chart7Name: string = "Missed Deliveries";
  SeriesOfMissedDeliveriesChart: ApexAxisChartSeries = [];
  labelsOfMissedDeliveriesChart: any;
  barHeightOfMissedDeliveriesChart: string = "50";
  heightOfMissedDeliverysChart: number = 550;
  widthOfMissedDeliverysChart: number = 580;
  DataLabelsOfMissedDeliverysChart: ApexDataLabels;

  chart8Name: string = "Missed Pickups";
  SeriesOfMissedPickupsChart: ApexAxisChartSeries = [];
  labelsOfMissedPickupsChart: any;
  barHeightOfMissedPickupsChart: string = "50";
  DataLabelsOfMissedPickupsChart: ApexDataLabels;

  chart11Name: string = "On Time Pickups";
  SeriesOfMissedPickupsOnTimeChart: ApexAxisChartSeries = [];
  labelsOfMissedPickupsOnTimeChart: any;
  barHeightOfMissedPickupsOnTimeChart: string = "50";
  DataLabelsOfMissedPickupsOnTimeChart: ApexDataLabels;

  chart9Name: string = "Performance By Carrier - Late";
  SeriesOfCarrierPerformanceChart: ApexAxisChartSeries = [];
  labelsOfCarrierPerformanceChart: any;
  barHeightOfCarrierPerformanceChart: string = "50";
  DataLabelsOfCarrierPerformanceChart: ApexDataLabels;

  chart12Name: string = "Performance By Carrier - On Time";
  SeriesOfCarrierPerformanceOnTimeChart: ApexAxisChartSeries = [];
  labelsOfCarrierPerformanceOnTimeChart: any;
  barHeightOfCarrierPerformanceOnTimeChart: string = "50";
  DataLabelsOfCarrierPerformanceOnTimeChart: ApexDataLabels;

  chart10Name: string = "Top Carriers by Revenue";
  SeriesOfTopCarriersByShipmentValueChart: ApexAxisChartSeries = [];
  labelsOfTopCarriersByShipmentValueChart: any;
  barHeightOfTopCarriersByShipmentValueChart: string = "50";
  heightOfTopCarriersByShipmentValueChart: number = 550;
  widthOfTopCarriersByShipmentValueChart: number = 580;
  DataLabelsOfTopCarriersByShipmentValueChart: ApexDataLabels;

  dateRanges: any = [
    { text: "This Year", value: "YTD" },
    { text: "This Quarter", value: "QUARTER" },
    { text: "This Month", value: "MTD" },
    { text: "Custom Dates", value: "Custom" }
  ];
  selectedDateRange: string = "MTD";

  chartType: any = [
    { text: "This Year", value: "YTD" },
    { text: "This Quarter", value: "QUARTER" },
    { text: "This Month", value: "MTD" },
    { text: "Custom Dates", value: "Custom" }
  ];
  
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
  topLanesByZip: TopLanes[] = [];
  topLanesByZipAndCity: TopLanes[] = [];
  topLanesByState: TopLanes[] = [];
  topVendorsByVolume: weightcostCompareModel[] = [];
  missedDeliveryDetails: CarrierPerformanceModel[] = [];
  missedPickupDetails: DashBoardMissedPickupModel[] = [];
  missedPickupDetailsOnTime: DashBoardMissedPickupModel[] = [];
  carrierPerformanceDetails: CarrierPerformanceModel[] = [];
  carrierPerformanceDetailsOnTime: CarrierPerformanceModel[] = [];
  topCarriersByShipmentValueDetails: CarrierPerformanceModel[] = [];

  icGroup = icGroup;
  icPageView = icPageView;
  icCloudOff = icCloudOff;
  icTimer = icTimer;
  icMoreVert = icMoreVert;

  constructor(private cd: ChangeDetectorRef, private dashBoardService: DashBoardService, public datepipe: DatePipe,
    private authenticationService: AuthenticationService) {
      this.baseEndpoint = environment.baseEndpoint;
      this.securityToken = this.authenticationService.ticket$.value;
    }

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
    
    this.SetDateRangeForMTD();    
  }

  prepareDetailsOfAllCharts() {
    
    /* Start Details of Total shipments by MTD chart and Shipments table. */
    this.GetDetailsForTotalShipmentsChartAndTable();
    /* END */

    /* Start Details of Top Accessorials and Cost By Firgation chart. */
    this.GetDetailsForTopAccessorialsChart();
    /* END */

    /* Start Details of Top Carriers chart. */
    this.GetDetailsForTopCarriersChart();
    /* END */

    /* Start Details of Top Carriers By Shipment value chart. */
    this.GetDetailsForTopCarriersByShipmentValueChart();
    /* END */

    /* Start Details of Top Lanes Chart. */
    this.GetDetailsForTopLanesChart();
    /* END */

    /* Start Details of Top Vendors By Volume Chart. */
    this.GetDetailsForTopVendorsByVolumeChart();
    /* END */

    /* Start Details of Missed Delivery Chart. */
    this.GetDetailsForMissedDeliveryChart();
    /* END */

    /* Start Details of Missed Pickup On Late Chart. */
    this.GetDetailsForMissedPickupChart();
    /* END */

    /* Start Details of Missed Pickup On Time Chart. */
    this.GetDetailsForMissedPickupOnTimeChart();
    /* END */

    /* Start Details of Carrier Performance On Late Chart. */
    this.GetDetailsForOnTimeCarrierPerformanceChart();
    /* END */    

    /* Start Details of Carrier Performance On Time Chart. */
    this.GetDetailsForCarrierPerformanceOnTimeChart();
    /* END */
  }

  async GetDetailsForTotalShipmentsChartAndTable() {
    this.showSpinnerOnDateChanges = true;
    this.tableDataShipments = await this.dashBoardService.DashBoard_GetTotalShipmentByMTDByDate(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.calculateTotal();
    this.PrepareDetailsForChart();    
  }

  PrepareDetailsForChart() {
    var labelForTotalShipments: string[] = [];
    var seriesForTotalShipments: ApexNonAxisChartSeries = [];

    for (let i = 0; i < this.tableDataShipments.length; i++) {      
      labelForTotalShipments.push(this.tableDataShipments[i].Mode);
      seriesForTotalShipments.push(this.tableDataShipments[i].ShipmentCount);      
    }

    this.SeriesOfTotalShipmentsChart = seriesForTotalShipments;
    this.labelsOfTotalShipmentsChart = labelForTotalShipments;
    this.heightOfTopShipmentsChart = 450;
    this.widthOfTopShipmentsChart = 600;
  }

  calculateTotal() {

    var totalQtyShipment = this.tableDataShipments.reduce((a, b) => a + b.ShipmentCount, 0);
    var totalWeight = this.tableDataShipments.reduce((a, b) => a + b.TotalWeight, 0);
    var totalSpend = this.tableDataShipments.reduce((a, b) => a + b.TotalSpend, 0);

    var totalAvgCost = 0;
    if (totalQtyShipment && totalQtyShipment !== 0) {
      totalAvgCost = (totalSpend / totalQtyShipment);
    }
    else {
      totalAvgCost = 0;
    }

    var totalCostPerPound = 0;
    if (totalWeight && totalWeight !== 0) {
      totalCostPerPound = (totalSpend / totalWeight);
    }
    else {
      totalCostPerPound = 0;
    }

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
        footer: totalQtyShipment.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      {
        label: '$ Avg Cost',
        property: 'CostPerShipment',
        type: 'text',
        cssClasses: ['font-medium'],
        footer: "$" + totalAvgCost.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      {
        label: 'Weight',
        property: 'TotalWeight',
        type: 'text',
        footer: totalWeight.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      {
        label: '$ Cost Per Pound',
        property: 'CostPerPound',
        type: 'text',
        cssClasses: ['font-medium'],
        footer: "$" + totalCostPerPound.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      {
        label: '$ Total Spend',
        property: 'TotalSpend',
        type: 'text',
        cssClasses: ['font-medium'],
        footer: "$" + totalSpend.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    ];

  }

  async GetDetailsForTopAccessorialsChart() {
    this.topAccessorialDetails = await this.dashBoardService.DashBoard_GetTopAccesorial(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForTopAccessorialsChart();    
    this.PrepareDetailsForByFirgationChart();    
  }

  PrepareDetailsForTopAccessorialsChart() {

    var accDesc: string[] = [];
    var accCost: ApexNonAxisChartSeries = [];
    var otherAccCharg: number = 0;

    for (let i = 0; i < this.topAccessorialDetails.length; i++) {
      if (this.topAccessorialDetails[i].Description !== "FREIGHT" && this.topAccessorialDetails[i].Description !== "FUEL"
        && this.topAccessorialDetails[i].Description !== "DISCOUNT") {
          if(accDesc.length < 9){
            accDesc.push(this.topAccessorialDetails[i].Description);
            accCost.push(this.topAccessorialDetails[i].AccessorialCost);
          }
          else{
            otherAccCharg = (otherAccCharg + this.topAccessorialDetails[i].AccessorialCost);
          }        
      }
    }

    if (otherAccCharg !== 0){
      accDesc.push("OTHER ACCESSORIALS");
      accCost.push(Number(otherAccCharg.toFixed(2)));
    }

    this.SeriesOfTopAccessorialsChart = accCost;
    this.labelsOfTopAccessorialsChart = accDesc;
    // this.heightOfTopAccessorialsChart = 430;
    // this.widthOfTopAccessorialsChart = 520;
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
      accCost.push(Number(fuel.toFixed(2)));
    }

    var totalAccessorialChrg = this.topAccessorialDetails.filter(a => a.Description.trim() != "FREIGHT" && a.Description.trim() != "FUEL" && a.Description.trim() != "DISCOUNT").reduce((a, b) => a + b.AccessorialCost, 0);
    if (totalAccessorialChrg > 0) {
      accDesc.push("TOTAL ACCESSORIALS");
      accCost.push(Number(totalAccessorialChrg.toFixed(2)));
    }

    this.SeriesOfCostByFirgationChart = accCost;
    this.labelsOfCostByFirgationChart = accDesc;
    this.heightOfCostByFirgationChart = 430;
    this.widthOfCostByFirgationChart = 520;    
  }

  async GetDetailsForTopCarriersChart() {
    this.topCarriersDetails = await this.dashBoardService.DashBoard_GetTopCarriers(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForTopCarriersChart();
  }

  PrepareDetailsForTopCarriersChart() {
    
    var costOfSeries2: number[] = [];
    var labelOfCarriers: string[] = [];

    for (let i = 0; i < this.topCarriersDetails.length; i++) {
      costOfSeries2.push(this.topCarriersDetails[i].ShipmentCount);
      labelOfCarriers.push(this.topCarriersDetails[i].CarrierName.trim());
    }

    this.SeriesOfTopCarriersChart = [
      {
        name: "Shipments Count",
        data: costOfSeries2
      }
    ];
    this.labelsOfTopCarriersChart = labelOfCarriers;
    this.barHeightOfTopCarriersChart = "60";
    this.DataLabelsOfTopCarriersChart = {
      enabled: true,
      formatter: function (val, opt) {
        return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      style: {
          fontSize: "13px",
          colors: ["#000"]
      }
    };
  }

  async GetDetailsForTopCarriersByShipmentValueChart() {
    this.topCarriersByShipmentValueDetails = await this.dashBoardService.DashBoard_GetTopCarriersByShipmentValue(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForTopCarriersByShipmentValueChart();
  }

  PrepareDetailsForTopCarriersByShipmentValueChart() {

    var costOfSeries1: number[] = [];
    var labelOfCarriers: string[] = [];

    for (let i = 0; i < this.topCarriersByShipmentValueDetails.length; i++) {
      costOfSeries1.push(Number(this.topCarriersByShipmentValueDetails[i].TotalBilledAmount.toFixed(2)));
      labelOfCarriers.push(this.topCarriersByShipmentValueDetails[i].CarrierName.trim());
    }

    this.SeriesOfTopCarriersByShipmentValueChart = [
      {
        name: "Total Amount",
        data: costOfSeries1
      }
    ];
    this.labelsOfTopCarriersByShipmentValueChart = labelOfCarriers;
    this.barHeightOfTopCarriersByShipmentValueChart = "60";
    this.DataLabelsOfTopCarriersByShipmentValueChart = {
      enabled: true,
      offsetX: 15,
      formatter: function (val, opt) {
        return "$" + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      style: {
          fontSize: "13px",
          colors: ["#000"]
      }
    };
  }

  GetDetailsForTopLanesChart() {
    this.GetDataForTopLanesByZipChart();
  }

  onLaneTypeselectionChange() {

    this.selectedOption = 'cost';
    this.chart5Name = "Top 10 Lanes - Cost";

    if (this.selectedLaneType === 2) {
      this.GetDataForTopLanesByZipAndCityChart();
    }
    else if (this.selectedLaneType === 3) {
      this.GetDataForTopLanesByStateChart();
    }
    else {
      this.GetDataForTopLanesByZipChart();
    }

  }

  async GetDataForTopLanesByZipChart() {
    this.showSpinner = true;
    this.topLanesByZip = await this.dashBoardService.DashBoard_GetTopLaneForZip(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.showSpinner = false;
    this.PrepareDetailsForTopLanesByZipChart();
  }

  PrepareDetailsForTopLanesByZipChart() {
    var label: string[] = [];
    var series: ApexNonAxisChartSeries = [];

    for (let i = 0; i < this.topLanesByZip.length; i++) {
      var DestAndOrgZipLabel = 'Org Zip:' + this.topLanesByZip[i].OrgPostalCode + ' - Dest Zip:' + this.topLanesByZip[i].DestPostalCode;
      label.push(DestAndOrgZipLabel);
      series.push(this.topLanesByZip[i].SellCost);
    }

    this.SeriesOfTopLanesChart = series;
    this.labelsOfTopLanesChart = label;
    this.heightOfTopLanesChart = 450;
    this.widthOfTopLanesChart = 550;
  }

  async GetDataForTopLanesByZipAndCityChart() {
    this.showSpinner = true;
    this.topLanesByZipAndCity = await this.dashBoardService.DashBoard_GetTopLaneForZipCity(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.showSpinner = false;
    this.PrepareDetailsForTopLanesByZipAndCityChart();
  }

  PrepareDetailsForTopLanesByZipAndCityChart() {
    var label: string[] = [];
    var series: ApexNonAxisChartSeries = [];

    for (let i = 0; i < this.topLanesByZipAndCity.length; i++) {
      var DestAndOrgZipCityLabel = this.topLanesByZipAndCity[i].OrgPostalCode + '/' + this.topLanesByZipAndCity[i].OrgCityName.trim() + ' - ' + this.topLanesByZipAndCity[i].DestPostalCode + '/' + this.topLanesByZipAndCity[i].DestCityName.trim();
      label.push(DestAndOrgZipCityLabel);
      series.push(this.topLanesByZipAndCity[i].SellCost);
    }

    this.SeriesOfTopLanesChart = series;
    this.labelsOfTopLanesChart = label;
    this.heightOfTopLanesChart = 530;
    this.widthOfTopLanesChart = 680;
  }

  async GetDataForTopLanesByStateChart() {
    this.showSpinner = true;
    this.topLanesByState = await this.dashBoardService.DashBoard_GetTopLaneForState(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.showSpinner = false;
    this.PrepareDetailsForTopLanesByStateChart();
  }

  PrepareDetailsForTopLanesByStateChart() {
    var label: string[] = [];
    var series: ApexNonAxisChartSeries = [];

    for (let i = 0; i < this.topLanesByState.length; i++) {
      var DestAndOrgStateLabel = this.topLanesByState[i].OrgStateName.trim() + ' - ' + this.topLanesByState[i].DestStateName.trim();
      label.push(DestAndOrgStateLabel);
      series.push(this.topLanesByState[i].SellCost);
    }

    this.SeriesOfTopLanesChart = series;
    this.labelsOfTopLanesChart = label;
    this.heightOfTopLanesChart = 450;
    this.widthOfTopLanesChart = 550;
  }

  onSelectionChange(value: string) {
    var series: ApexNonAxisChartSeries = [];

    if (this.selectedLaneType === 2) {
      if (this.topLanesByZipAndCity && this.topLanesByZipAndCity.length > 0) {
        for (let i = 0; i < this.topLanesByZipAndCity.length; i++) {
          if (value === 'cost') {
            series.push(this.topLanesByZipAndCity[i].SellCost);
          }
          else {
            series.push(this.topLanesByZipAndCity[i].Volume);
          }
        }
      }
    }
    else if (this.selectedLaneType === 3) {
      if (this.topLanesByState && this.topLanesByState.length > 0) {
        for (let i = 0; i < this.topLanesByState.length; i++) {
          if (value === 'cost') {
            series.push(this.topLanesByState[i].SellCost);
          }
          else {
            series.push(this.topLanesByState[i].Volume);
          }
        }
      }
    }
    else {
      if (this.topLanesByZip && this.topLanesByZip.length > 0) {
        for (let i = 0; i < this.topLanesByZip.length; i++) {
          if (value === 'cost') {
            series.push(this.topLanesByZip[i].SellCost);
          }
          else {
            series.push(this.topLanesByZip[i].Volume);
          }
        }
      }
    }

    if (value === 'cost') {
      this.chart5Name = "Top 10 Lanes - Cost";
    }
    else {
      this.chart5Name = "Top 10 Lanes - Volume";
    }

    this.SeriesOfTopLanesChart = series;
  }

  async GetDetailsForTopVendorsByVolumeChart() {
    this.topVendorsByVolume = await this.dashBoardService.DashBoard_GetTopVendorForPPS(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForTopVendorsByVolumeChart();
  }

  PrepareDetailsForTopVendorsByVolumeChart() {

    var costOfSeries1: number[] = [];
    var labelOfVendors: string[] = [];

    for (let i = 0; i < this.topVendorsByVolume.length; i++) {
      costOfSeries1.push(this.topVendorsByVolume[i].ShipmentCount);
      labelOfVendors.push(this.topVendorsByVolume[i].ClientName.trim());
    }

    this.SeriesOfTopVendorsByVolumeChart = [
      {
        name: "Shipments Count",
        data: costOfSeries1
      }
    ];
    this.labelsOfTopVendorsByVolumeChart = labelOfVendors;
    this.barHeightOfTopVendorsByVolumeChart = "60";
    this.DataLabelsOfTopVendorsByVolumeChart = {
      enabled: true,
      formatter: function (val, opt) {
        return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      style: {
          fontSize: "13px",
          colors: ["#000"]
      }
    };
  }

  async GetDetailsForMissedDeliveryChart() {
    this.missedDeliveryDetails = await this.dashBoardService.DashBoard_GetCarrierPerformanceByDate(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForMissedDeliveryChart();
  }

  PrepareDetailsForMissedDeliveryChart() {

    var costOfSeries1: number[] = [];
    var labelOfMissedDel: string[] = [];

    if (this.missedDeliveryDetails && this.missedDeliveryDetails.length > 0) {
      this.missedDeliveryDetails = this.missedDeliveryDetails.sort(
        function (a, b) {
          return b.ShipmentCount - a.ShipmentCount;
        }
      ).filter(a => a.DeliveryStatus == 'Late').slice(0, 10);

      for (let i = 0; i < this.missedDeliveryDetails.length; i++) {
        costOfSeries1.push(this.missedDeliveryDetails[i].ShipmentCount);
        labelOfMissedDel.push(this.missedDeliveryDetails[i].CarrierName.trim());
      }

      this.SeriesOfMissedDeliveriesChart = [
        {
          name: "Late Shipments Count",
          data: costOfSeries1
        }
      ];
      this.labelsOfMissedDeliveriesChart = labelOfMissedDel;
      this.barHeightOfMissedDeliveriesChart = "60";
      this.DataLabelsOfMissedDeliverysChart = {
        enabled: true,
        formatter: function (val, opt) {
          return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        style: {
            fontSize: "13px",
            colors: ["#000"]
        }
      };
    }
  }

  async GetDetailsForMissedPickupChart() {
    this.missedPickupDetails = await this.dashBoardService.DashBoard_GetMissedPickup(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForMissedPickupChart();
  }

  PrepareDetailsForMissedPickupChart() {

    var costOfSeries1: number[] = [];    
    var labelOfMissedPickup: string[] = [];

    if (this.missedPickupDetails && this.missedPickupDetails.length > 0) {

      const calculated = this.missedPickupDetails.reduce((acc, item) => {
        let accItem = acc.find(ai => ai.CarrierName === item.CarrierName)
        if (accItem) {
          accItem.ClientName = item.ClientName,
            accItem.LatePickupTime += item.LatePickupTime,
            accItem.OnTimePickup += item.OnTimePickup
        } else {
          acc.push(item)
        }
        return acc;
      }, [])

      this.missedPickupDetails = calculated;

      this.missedPickupDetails = this.missedPickupDetails.sort(
        function (a, b) {
          return b.LatePickupTime - a.LatePickupTime;
        }
      ).slice(0, 10);

      for (let i = 0; i < this.missedPickupDetails.length; i++) {
        costOfSeries1.push(this.missedPickupDetails[i].LatePickupTime);        
        labelOfMissedPickup.push(this.missedPickupDetails[i].CarrierName.trim());
      }

      this.SeriesOfMissedPickupsChart = [
        {
          name: "Late",
          data: costOfSeries1
        }
      ];
      this.labelsOfMissedPickupsChart = labelOfMissedPickup;
      this.barHeightOfMissedPickupsChart = "60";
      this.DataLabelsOfMissedPickupsChart = {
        enabled: true,
        formatter: function (val, opt) {
          return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        style: {
            fontSize: "13px",
            colors: ["#000"]
        }
      };  
    }
  }

  async GetDetailsForOnTimeCarrierPerformanceChart() {
    this.carrierPerformanceDetails = await this.dashBoardService.DashBoard_GetCarrierPerformance(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForOnTimeCarrierPerformanceChart();    
  }

  PrepareDetailsForOnTimeCarrierPerformanceChart() {

    var costOfSeries1: number[] = [];    
    var labelOfCarrierPerformance: string[] = [];
    var finalData: DashBoardMissedPickupModel[] = [];

    if (this.carrierPerformanceDetails && this.carrierPerformanceDetails.length > 0) {

      for (let i = 0; i < this.carrierPerformanceDetails.length; i++) {
        let temp = <DashBoardMissedPickupModel>{};
        let oldItem = finalData.find(ai => ai.CarrierName === this.carrierPerformanceDetails[i].CarrierName.trim())
        if (oldItem) { }
        else {
          temp.CarrierName = this.carrierPerformanceDetails[i].CarrierName.trim();
          finalData.push(temp);
        }
      }

      for (let i = 0; i < this.carrierPerformanceDetails.length; i++) {
        let oldItem = finalData.find(ai => ai.CarrierName === this.carrierPerformanceDetails[i].CarrierName.trim())
        if (this.carrierPerformanceDetails[i].DeliveryStatus === 'Late') {
          oldItem.LatePickupTime = this.carrierPerformanceDetails[i].ShipmentCount;
        }
      }

      finalData = finalData.sort(
        function (a, b) {
          return b.LatePickupTime - a.LatePickupTime;
        }
      );

      for (let i = 0; i < finalData.length; i++) {
        if (finalData[i].LatePickupTime) {
          costOfSeries1.push(finalData[i].LatePickupTime);
        }
        else {
          costOfSeries1.push(0);
        }

        labelOfCarrierPerformance.push(finalData[i].CarrierName.trim());
      }

      this.SeriesOfCarrierPerformanceChart = [
        {
          name: "Late",
          data: costOfSeries1
        }
      ];
      this.labelsOfCarrierPerformanceChart = labelOfCarrierPerformance;
      this.barHeightOfCarrierPerformanceChart = "60";
      this.DataLabelsOfCarrierPerformanceChart = {
        enabled: true,
        formatter: function (val, opt) {
          return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        style: {
            fontSize: "13px",
            colors: ["#000"]
        }
      };
    }
  }

  onDateRangeselectionChange() {
    if (this.selectedDateRange === "YTD") {
      this.SetDateRangeForYTD();
    }
    else if (this.selectedDateRange === "QUARTER") {
      this.SetDateRangeForQUARTER();
    }
    else if (this.selectedDateRange === "Custom") {
      this.SetDateRangeForCustom();
    }
    else {
      this.SetDateRangeForMTD();
    }
  }

  SetDateRangeForYTD() {
    this.isDateRangeVisible = false;

    var currentTime = new Date();
    this.dateTo = (currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear();
    var d = new Date(new Date().getFullYear(), 0, 1);
    this.dateFrom = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();

    this.prepareDetailsOfAllCharts();
  }

  SetDateRangeForQUARTER() {
    this.isDateRangeVisible = false;

    var currentTime = new Date();
    this.dateTo = (currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear();
    var fq = this.getQuarterFirstDay();
    this.dateFrom = (fq.getMonth() + 1) + '/' + fq.getDate() + '/' + fq.getFullYear();

    this.prepareDetailsOfAllCharts();
  }

  getQuarterFirstDay() {
    var now = new Date();
    var quarter = Math.floor((now.getMonth() / 3));
    var firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate;
  }

  SetDateRangeForMTD() {
    this.isDateRangeVisible = false;

    var currentTime = new Date();
    this.dateTo = (currentTime.getMonth() + 1) + '/' + currentTime.getDate() + '/' + currentTime.getFullYear();
    var fdm = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
    this.dateFrom = (fdm.getMonth() + 1) + '/' + fdm.getDate() + '/' + fdm.getFullYear();
    //this.dateFrom = "01/01/2020";

    this.prepareDetailsOfAllCharts();
  }

  SetDateRangeForCustom() {
    this.dateFromForDatePicker = new Date();
    this.dateToForDatePicker = new Date();
    this.isDateRangeVisible = true;
  }

  refreshChartsUsingSelectedDate() {
    this.dateFrom = this.datepipe.transform(this.dateFromForDatePicker, 'MM/dd/yyyy');
    this.dateTo = this.datepipe.transform(this.dateToForDatePicker, 'MM/dd/yyyy');
    this.prepareDetailsOfAllCharts();
  }

  changedValueOfIsIncludeSubClient() {
    this.prepareDetailsOfAllCharts();
  }

  async GetDetailsForMissedPickupOnTimeChart() {
    this.missedPickupDetailsOnTime = await this.dashBoardService.DashBoard_GetMissedPickupOnTime(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForMissedPickupOnTimeChart();
  }

  PrepareDetailsForMissedPickupOnTimeChart() {
    
    var costOfSeries2: number[] = [];
    var labelOfMissedPickupOnTime: string[] = [];

    if (this.missedPickupDetailsOnTime && this.missedPickupDetailsOnTime.length > 0) {

      const calculated = this.missedPickupDetailsOnTime.reduce((acc, item) => {
        let accItem = acc.find(ai => ai.CarrierName === item.CarrierName)
        if (accItem) {
          accItem.ClientName = item.ClientName,
            accItem.LatePickupTime += item.LatePickupTime,
            accItem.OnTimePickup += item.OnTimePickup
        } else {
          acc.push(item)
        }
        return acc;
      }, [])

      this.missedPickupDetailsOnTime = calculated;

      this.missedPickupDetailsOnTime = this.missedPickupDetailsOnTime.sort(
        function (a, b) {
          return b.OnTimePickup - a.OnTimePickup;
        }
      ).slice(0, 10);

      for (let i = 0; i < this.missedPickupDetailsOnTime.length; i++) {
        costOfSeries2.push(this.missedPickupDetailsOnTime[i].OnTimePickup);
        labelOfMissedPickupOnTime.push(this.missedPickupDetailsOnTime[i].CarrierName.trim());
      }

      this.SeriesOfMissedPickupsOnTimeChart = [        
        {
          name: "OnTime",
          data: costOfSeries2
        }
      ];
      this.labelsOfMissedPickupsOnTimeChart = labelOfMissedPickupOnTime;
      this.barHeightOfMissedPickupsOnTimeChart = "60";
      this.DataLabelsOfMissedPickupsOnTimeChart = {
        enabled: true,
        formatter: function (val, opt) {
          return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        style: {
            fontSize: "13px",
            colors: ["#000"]
        }
      };
    }
  }

  async GetDetailsForCarrierPerformanceOnTimeChart() {
    this.carrierPerformanceDetailsOnTime = await this.dashBoardService.DashBoard_GetCarrierPerformanceOnTime(this.authenticationService.getDefaultClientFromStorage().ClientID, this.dateFrom, this.dateTo, this.isIncludeSubClient);
    this.PrepareDetailsForCarrierPerformanceOnTimeChart();
    this.showSpinnerOnDateChanges = false;
  }

  PrepareDetailsForCarrierPerformanceOnTimeChart() {
    
    var costOfSeries2: number[] = [];
    var labelOfCarrierPerformanceOnTime: string[] = [];
    var finalData: DashBoardMissedPickupModel[] = [];

    if (this.carrierPerformanceDetailsOnTime && this.carrierPerformanceDetailsOnTime.length > 0) {

      for (let i = 0; i < this.carrierPerformanceDetailsOnTime.length; i++) {
        let temp = <DashBoardMissedPickupModel>{};
        let oldItem = finalData.find(ai => ai.CarrierName === this.carrierPerformanceDetailsOnTime[i].CarrierName.trim())
        if (oldItem) { }
        else {
          temp.CarrierName = this.carrierPerformanceDetailsOnTime[i].CarrierName.trim();
          finalData.push(temp);
        }
      }      

      for (let i = 0; i < this.carrierPerformanceDetailsOnTime.length; i++) {
        let oldItem = finalData.find(ai => ai.CarrierName === this.carrierPerformanceDetailsOnTime[i].CarrierName.trim())
        if (this.carrierPerformanceDetailsOnTime[i].DeliveryStatus === 'Late') {          
        }
        else {
          oldItem.OnTimePickup = this.carrierPerformanceDetailsOnTime[i].ShipmentCount;
        }
      }    
      
      finalData = finalData.sort(
        function (a, b) {
          return b.OnTimePickup - a.OnTimePickup;
        }
      );

      for (let i = 0; i < finalData.length; i++) {        
        if (finalData[i].OnTimePickup) {
          costOfSeries2.push(finalData[i].OnTimePickup);
        }
        else {
          costOfSeries2.push(0);
        }

        labelOfCarrierPerformanceOnTime.push(finalData[i].CarrierName.trim());
      }

      this.SeriesOfCarrierPerformanceOnTimeChart = [        
        {
          name: "On Time",
          data: costOfSeries2
        }
      ];
      this.labelsOfCarrierPerformanceOnTimeChart = labelOfCarrierPerformanceOnTime;
      this.barHeightOfCarrierPerformanceOnTimeChart = "60";
      this.DataLabelsOfCarrierPerformanceOnTimeChart = {
        enabled: true,
        formatter: function (val, opt) {
          return val == 0 ? "" : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        style: {
            fontSize: "13px",
            colors: ["#000"]
        }
      };
    }
  }

  accessorialSummaryReportClick() {
    if(this.pickupDateFromDatePicker !== null && this.pickupDateFromDatePicker !== undefined 
      && this.pickupDateToDatePicker !== null && this.pickupDateToDatePicker !== undefined) {

      this.pickupDateFrom = this.datepipe.transform(this.pickupDateFromDatePicker, 'MM/dd/yyyy');
      this.pickupDateTo = this.datepipe.transform(this.pickupDateToDatePicker, 'MM/dd/yyyy');
      var selectedClientID = this.authenticationService.getDefaultClientFromStorage().ClientID;
      var ReportHanderUrl = "";
  
      ReportHanderUrl = this.baseEndpoint + "Handlers/AccessorialSummaryByLoadClientAndBranchHandler.ashx?ClientID=" + selectedClientID;
      ReportHanderUrl = ReportHanderUrl + "&FromPickupDate=" + this.pickupDateFrom + "&ToPickupDate=" + this.pickupDateTo;
      ReportHanderUrl = ReportHanderUrl + "&IsIncludeSubClient=true";	        
      ReportHanderUrl = ReportHanderUrl + "&Ticket=" + this.securityToken;
  
      if (ReportHanderUrl !== null && ReportHanderUrl !== undefined && ReportHanderUrl !== "") {
        window.open(ReportHanderUrl);
      }
    }
  }

  exportKPIDetailReportClick() {    
    if(this.pickupDateFromDatePicker !== null && this.pickupDateFromDatePicker !== undefined 
      && this.pickupDateToDatePicker !== null && this.pickupDateToDatePicker !== undefined) {        
      this.pickupDateFrom = this.datepipe.transform(this.pickupDateFromDatePicker, 'MM/dd/yyyy');
      this.pickupDateTo = this.datepipe.transform(this.pickupDateToDatePicker, 'MM/dd/yyyy');
      var selectedClientID = this.authenticationService.getDefaultClientFromStorage().ClientID;
      var ReportHanderUrl = "";
  
      ReportHanderUrl = this.baseEndpoint + "Handlers/TPLShipmentDetailHandler.ashx?ClientID=" + selectedClientID;
      ReportHanderUrl = ReportHanderUrl + "&FromPickupDate=" + this.pickupDateFrom + "&ToPickupDate=" + this.pickupDateTo;
      ReportHanderUrl = ReportHanderUrl + "&IsIncludeSubClient=true";	        
      ReportHanderUrl = ReportHanderUrl + "&Ticket=" + this.securityToken;
  
      if (ReportHanderUrl !== null && ReportHanderUrl !== undefined && ReportHanderUrl !== "") {
        window.open(ReportHanderUrl);
      }
    }
  }
}
