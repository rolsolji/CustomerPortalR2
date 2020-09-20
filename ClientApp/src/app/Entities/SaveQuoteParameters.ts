export interface SaveQuoteParameters {
  ClientId:                     number;
  PickupDate:                   string;
  OrgName:                      string;
  OrgAdr1:                      string;
  OrgCity:                      number;
  OrgState:                     number;
  OrgCountry:                   number;
  DestName:                     string;
  DestAdr1:                     string;
  DestCity:                     number;
  DestState:                    number;
  DestCountry:                  number;
  CarrierCode:                  string;
  CarrierName:                  string;
  TransTime:                    string;
  CarrierType:                  string;
  OriginTerminalName:           string;
  OriginTerminalAdd1:           string;
  OriginTerminalAdd2:           string;
  OriginTerminalCity:           string;
  OriginTerminalState:          string;
  OriginTerminalZip:            string;
  OriginTerminalContactPerson:  string;
  OriginTerminalFreePhone:      string;
  OriginTerminalPhone:          string;
  OriginTerminalEmail:          string;
  DestTerminalName:             string;
  DestTerminalAdd1:             string;
  DestTerminalAdd2:             string;
  DestTerminalCity:             string;
  DestTerminalState:            string;
  DestTerminalZip:              string;
  DestTerminalContactPerson:    string;
  DestTerminalFreePhone:        string;
  DestTerminalPhone:            string;
  DestTerminalEmail:            string;
  OriginTerminalFax:            string;
  DestTerminalFax:              string;
  ServiceLevelID:               number;
  BOlProductsList:              BOlProductsList[];
  BOLAccesorialList:            BOLAccesorial[];
  BOLDispatchNotesList:         any[];
  BuyRates:                     null;
  SellRates:                    SellRate;
  LoggedInUserId:               number;
  OrgCityName:                  string;
  OrgStateCode:                 string;
  OrgCountryCode:               string;
  OrgZipCode:                   string;
  DestCityName:                 string;
  DestStateCode:                string;
  DestCountryCode:              string;
  DestZipCode:                  string;
  OrgLocation:                  string;
  DestLocation:                 string;
  SalesPersonList:              any[];
  BolDocumentsList:             any[];
  TrackingDetailsList:          any[];
  ServiceLevelName:             string;
  ServiceLevelCode:             string;
  RatingResultId:               number;
  Mode:                         string;
  BOLStopLists:                 any[];
  CostWithCustomerPercentage:   number;
  WaterfallList:                any[];
  orgTerminalCityStateZipCode:  string;
  destTerminalCityStateZipCode: string;
  WaterfallDetailsList:         any[];
}

export interface BOlProductsList {
  Description:          string;
  Pallets:              string;
  Pieces:               string;
  Hazmat?:              boolean;
  NMFC:                 string;
  Class:                string;
  Weight:               string;
  Height:               string;
  Lenght:               string;
  Width:                string;
  PackageTypeID:        number;
  PCF:                  string;
  selectedProduct:      SelectedProduct;
  Status:               number;
  SelectedProductClass: SelectedProduct;
  Stackable:            boolean;
}

export interface SelectedProduct {
}

export interface SellRate {
  SCAC:                   string;
  CarrierName:            string;
  AccountInvoiceCostList: AccountInvoiceCost[];
}

export interface AccountInvoiceCost {
  AccessorialID: number;
  RatedCost:     number;
  BilledCost:    number;
  Description:   string;
  CostStatus:    number;
}

export interface BOLAccesorial {
  AccesorialID: number;
  IsAccesorial: true;
}