import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icGroup from '@iconify/icons-ic/twotone-group';
import icPageView from '@iconify/icons-ic/twotone-pageview';
import icCloudOff from '@iconify/icons-ic/twotone-cloud-off';
import icTimer from '@iconify/icons-ic/twotone-timer';
import { defaultChartOptions } from '../../../../@vex/utils/default-chart-options';
import { Order, tableSalesData } from '../../../../static-data/table-sales-data';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';

@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})
export class DashboardAnalyticsComponent implements OnInit {

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

    tableColumnsShipments: TableColumn<Order>[] = [
        {
            label: 'Mode',
            property: 'Mode',
            type: 'text'
        },
        {
            label: 'Qty Shipments',
            property: 'ShipmentCount',
            type: 'text'
        },
        {
            label: '$ Avg Cost',
            property: 'CostPerShipment',
            type: 'text',
            cssClasses: ['font-medium']
        },
        {
            label: 'Weight',
            property: 'TotalWeight',
            type: 'text'            
        },
        {
            label: '$ Total Spend',
            property: 'TotalSpend',
            type: 'text',
            cssClasses: ['font-medium']
        }
    ];
    tableDataShipments = [
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0.06,
            "CostPerShipment": 1646.55,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "TL",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 1281,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 2109231.83,
            "TotalWeight": 38177436,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        },
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0.19,
            "CostPerShipment": 388.43,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "LTL",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 326,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 126629.59,
            "TotalWeight": 670310,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        },
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0,
            "CostPerShipment": 0,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "OCEAN",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 0,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 0,
            "TotalWeight": 0,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        },
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0,
            "CostPerShipment": 0,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "Small Package",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 0,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 0,
            "TotalWeight": 0,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        },
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0,
            "CostPerShipment": 0,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "AIR FREIGHT",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 0,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 0,
            "TotalWeight": 0,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        },
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0,
            "CostPerShipment": 0,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "INTERMODAL",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 0,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 0,
            "TotalWeight": 0,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        },
        {
            "BnmkCost": 0,
            "BnmkCostByCarrier": 0,
            "BnmkCostByDirection": 0,
            "BnmkCostByMonth": 0,
            "BolCustomerCost": 0,
            "BusiestLane": null,
            "BusiestMonth": null,
            "CarrierCode": null,
            "ClientLogo": null,
            "ClientName": null,
            "CorporateLogo": null,
            "CostPerPound": 0,
            "CostPerShipment": 0,
            "Direction": null,
            "EffectiveCarrierName": null,
            "EffectiveClientName": null,
            "InvoiceDate": null,
            "LTLShipmentCount": 0,
            "LTLShipmentCountByLoadlane": 0,
            "Length": 0,
            "LoadCountByCarrier": 0,
            "LoadCountByDirection": 0,
            "LoadCountByLoadlane": 0,
            "LoadCountByMonth": 0,
            "LoadLane": null,
            "LoadNumber": null,
            "Location": null,
            "Miles": 0,
            "MilesByMonth": 0,
            "Mode": "TL Spot Quote",
            "Month": 0,
            "Month_year": null,
            "Pallets": 0,
            "PalletsByLoadlane": 0,
            "PickupDate": null,
            "Savings": 0,
            "ShipmentCount": 0,
            "ShipmentCountRange": null,
            "TopCustomer": null,
            "TopVendor": null,
            "TotalBilledAmount": 0,
            "TotalBilledAmountByCarrier": 0,
            "TotalBilledAmountByDirection": 0,
            "TotalPaidAmount": 0,
            "TotalSpend": 0,
            "TotalWeight": 0,
            "Weight": 0,
            "WeightByDirection": 0,
            "WeightByLoadlane": 0,
            "WeightByMonth": 0,
            "WeightCountRange": null,
            "Year": 0
        }
    ];

  series: ApexAxisChartSeries = [{
    name: 'Subscribers',
    data: [28, 40, 36, 0, 52, 38, 60, 55, 67, 33, 89, 44]
  }];

  //userSessionsSeries: ApexAxisChartSeries = [
  //  {
  //    name: 'Users',
  //    data: [10, 50, 26, 50, 38, 60, 50, 25, 61, 80, 40, 60]
  //  },
  //  {
  //    name: 'Sessions',
  //    data: [5, 21, 42, 70, 41, 20, 35, 50, 10, 15, 30, 50]
  //  },
  //];

    //totalShipmentByMTDLabels: [
    //    ['TL', 'LTL', 'OCEAN', 'Small Package', 'AIR FREIGHT', 'INTERMODAL', 'TL Spot Quote']
    //];

    uniqueUsersOptionsTotalShipmentChart = defaultChartOptions({
        chart: {
            type: 'pie'
        },
        series: [1281, 326, 0, 0, 0, 0, 0],
        labels: ['TL', 'LTL', 'OCEAN', 'Small Package', 'AIR FREIGHT', 'INTERMODAL', 'TL Spot Quote']
        //,
        //legend: {
        //    show: true,
        //    position: 'bottom'
        //} 
    });

    //totalShipmentByMTD: ApexAxisChartSeries = [
    //    {
    //        name: 'Total Shipments by MTD',
    //        data: [1281, 326, 0, 0, 0, 0, 0]
    //    }
    //];

    

  salesSeries: ApexAxisChartSeries = [{
    name: 'Sales',
    data: [28, 40, 36, 0, 52, 38, 60, 55, 99, 54, 38, 87]
  }];

  pageViewsSeries: ApexAxisChartSeries = [{
    name: 'Page Views',
    data: [405, 800, 200, 600, 105, 788, 600, 204]
  }];

  uniqueUsersSeries: ApexAxisChartSeries = [{
    name: 'Unique Users',
    data: [356, 806, 600, 754, 432, 854, 555, 1004]
  }];

  uniqueUsersOptions = defaultChartOptions({
    chart: {
      type: 'area',
      height: 100
    },
    colors: ['#ff9800']
  });

  icGroup = icGroup;
  icPageView = icPageView;
  icCloudOff = icCloudOff;
  icTimer = icTimer;
  icMoreVert = icMoreVert;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
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
  }

}
