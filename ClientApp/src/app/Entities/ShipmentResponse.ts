
export interface ShipmentResponse {
    AccountInfoID:                    string;
    AccountNumber:                    string;
    AccsCost:                         string;
    ActualDeliveryDate:               string;
    ActualShipDate:                   string;
    AddDate:                          string;
    AddedBy:                          string;
    BOLAccesorialList:                BOLAccesorialList[];
    BOLDispatchNotesList:             any[];
    BOLStatus:                        string;
    BOLStopLists:                     string;
    BOlProductsList:                  BOlProductsList[];
    BillToAdr1:                       string;
    BillToAdr2:                       string;
    BillToCity:                       number;
    BillToCityName:                   string;
    BillToCountry:                    number;
    BillToCountryCode:                string;
    BillToFaxNo:                      string;
    BillToID:                         number;
    BillToName:                       string;
    BillToState:                      number;
    BillToStateCode:                  string;
    BillToStateName:                  string;
    BillToZip:                        number;
    BillToZipCode:                    string;
    BolDocumentsList:                 any[];
    BolInfoList:                      BolInfoList[];
    BolStatusSeq:                     number;
    BrokerCarrierCode:                string;
    BrokerReferenceNo:                string;
    BuyProfileID:                     number;
    BuyRates:                         Rates;
    CarrierBolNo:                     string;
    CarrierCode:                      string;
    CarrierName:                      string;
    CarrierNotes:                     string;
    CarrierType:                      string;
    ClientId:                         number;
    ClientLadingNo:                   string;
    ClientName:                       string;
    ConsigneeCode:                    string;
    ConsigneeNotes:                   string;
    ContactName:                      string;
    ContactPhone:                     string;
    CorporateID:                      number;
    CostWithCustomerPercentage:       number;
    CreatedBy:                        string;
    CreatedDate:                      string;
    CurrentStatus:                    string;
    CustRefNo:                        string;
    CustomerTmsSyncDate:              string;
    CustomerTmsSyncStatus:            string;
    CustomerType:                     string;
    DeliveryAppointmentTimeFrom:      string;
    DeliveryAppointmentTimeTo:        string;
    DeliveryDate:                     string;
    DeliveryTime:                     string;
    DestAdr1:                         string;
    DestAdr2:                         string;
    DestCity:                         number;
    DestCityName:                     string;
    DestContactPerson:                string;
    DestContactPhone:                 string;
    DestCountry:                      number;
    DestCountryCode:                  string;
    DestEmail:                        string;
    DestFaxNo:                        string;
    DestID:                           string;
    DestName:                         string;
    DestState:                        number;
    DestStateCode:                    string;
    DestStateName:                    string;
    DestTerminalAdd1:                 string;
    DestTerminalAdd2:                 string;
    DestTerminalCity:                 string;
    DestTerminalContactPerson:        string;
    DestTerminalCountry:              string;
    DestTerminalEmail:                string;
    DestTerminalFax:                  string;
    DestTerminalFreePhone:            string;
    DestTerminalName:                 string;
    DestTerminalPhone:                string;
    DestTerminalState:                string;
    DestTerminalZip:                  string;
    DestZip:                          number;
    DestZipCode:                      string;
    DestinationLocation:              string;
    DoNotConsiderRateModification:    boolean;
    DueDate:                          string;
    EDIShipmentID:                    string;
    EDItransactionNo:                 string;
    EdiGeneratedDate:                 string;
    EntrySourceID:                    string;
    EqpType:                          string;
    EquipmentID:                      number;
    ExpectedDeliveryDate:             string;
    ExpectedShipDate:                 string;
    FreightCost:                      string;
    FuelCost:                         string;
    InvoiceDate:                      string;
    IsApprove:                        boolean;
    IsBalanceDue:                     string;
    IsBillToAddToMaster:              boolean;
    IsBolDocument:                    boolean;
    IsBuyRatesSupplied:               boolean;
    IsDestintationAddToMaster:        boolean;
    IsDispatch:                       string;
    IsDuplicate:                      string;
    IsEDIGenerated:                   string;
    IsEnablePickup:                   boolean;
    IsOriginAddToMaster:              boolean;
    IsOthDocument:                    boolean;
    IsPODDocument:                    boolean;
    IsPayAsBill:                      boolean;
    IsPushImmediately:                boolean;
    IsReRated:                        boolean;
    IsSellRatesSupplied:              boolean;
    IsSendOfferToALLFromRatingResult: boolean;
    LadingID:                         number;
    LoadID:                           string;
    LoggedInUserId:                   number;
    MasterDto:                        string;
    MasterMode:                       string;
    Miles:                            string;
    Mode:                             string;
    ModifiedBy:                       string;
    ModifiedDate:                     string;
    OldBOLStatusID:                   number;
    OrgAdr1:                          string;
    OrgAdr2:                          string;
    OrgCity:                          number;
    OrgCityName:                      string;
    OrgCountry:                       number;
    OrgCountryCode:                   string;
    OrgFaxNo:                         string;
    OrgID:                            string;
    OrgName:                          string;
    OrgState:                         number;
    OrgStateCode:                     string;
    OrgStateName:                     string;
    OrgZip:                           number;
    OrgZipCode:                       string;
    OriginContactPerson:              string;
    OriginContactPhone:               string;
    OriginEmail:                      string;
    OriginLocation:                   string;
    OriginTerminalAdd1:               string;
    OriginTerminalAdd2:               string;
    OriginTerminalCity:               string;
    OriginTerminalContactPerson:      string;
    OriginTerminalCountry:            string;
    OriginTerminalEmail:              string;
    OriginTerminalFax:                string;
    OriginTerminalFreePhone:          string;
    OriginTerminalName:               string;
    OriginTerminalPhone:              string;
    OriginTerminalState:              string;
    OriginTerminalZip:                string;
    PONumber:                         string;
    ParentLadingID:                   string;
    PaymentTermID:                    string;
    PickupApiCallStatusId:            string;
    PickupApiCallStatusName:          string;
    PickupDate:                       string;
    PickupNumber:                     string;
    PickupTime:                       string;
    PriorityID:                       string;
    ProDate:                          string;
    ProNumber:                        string;
    QuoteDate:                        string;
    QuoteNumber:                      string;
    QuoteRequestedMailId:             string;
    Rate:                             string;
    RatingResultId:                   number;
    RatingShipmentID:                 number;
    Ref1ID:                           string;
    Ref1Value:                        string;
    Ref2ID:                           string;
    Ref2Value:                        string;
    Ref3ID:                           string;
    Ref3Value:                        string;
    Ref4ID:                           string;
    Ref4Value:                        string;
    RefNo:                            number;
    RequestedDeliveryCloseTime:       string;
    RequestedDeliveryDate:            string;
    RequestedDeliveryTime:            string;
    RequestedPickupDateFrom:          string;
    RequestedPickupDateTo:            string;
    RequestedPickupTimeFrom:          string;
    RequestedPickupTimeTo:            string;
    SONumber:                         string;
    SalesPersonList:                  string;
    SellProfileID:                    number;
    SellRates:                        Rates;
    ServiceLevelCode:                 string;
    ServiceLevelID:                   number;
    ServiceLevelName:                 string;
    ShipCost:                         number;
    ShipmentDirection:                string;
    ShipmentErrorID:                  string;
    ShipmentValue:                    string;
    ShipperCode:                      string;
    ShipperNotes:                     string;
    ShortName:                        string;
    SplNotes:                         string;
    Status:                           number;
    StatusReasonCodeId:               string;
    StopList:                         string;
    TimeCritical:                     boolean;
    TotalHeight:                      number;
    TotalLength:                      number;
    TotalWidth:                       number;
    TrackingDetailsList:              any[];
    TrackingID:                       string;
    TrackingNumber:                   string;
    TransTime:                        string;
    TransitDays:                      string;
    UserName:                         string;
    ValuePerPound:                    string;
    WaterfallList:                    string;
}

export interface BOLAccesorialList {
    AccesorialID:    number;
    AccessorialCode: string;
    AccessorialName: string;
    IsAccesorial:    boolean;
    LadingID:        number;
}

export interface BOlProductsList {
    AccountNumber:          string;
    AddProductToParent:     boolean;
    BOLProductID:           number;
    Class:                  string;
    Commodity:              string;
    Description:            string;
    DestinationStop:        string;
    DestinationStopID:      string;
    DestinationStopSeq:     string;
    Hazmat:                 boolean;
    HazmatContact:          string;
    Height:                 number;
    LadingID:               number;
    Lenght:                 number;
    NMFC:                   string;
    OriginStop:             string;
    OriginStopID:           string;
    OriginStopSeq:          string;
    PCF:                    number;
    PackageTypeDescription: string;
    PackageTypeID:          number;
    Pallets:                number;
    Pieces:                 number;
    PortCode:               string;
    ProductID:              string;
    Quantity:               string;
    Remarks:                string;
    SKUNumber:              string;
    ScheduleID:             string;
    Stackable:              boolean;
    Status:                 number;
    StopID:                 string;
    Weight:                 number;
    Width:                  number;
}

export interface BolInfoList {
    Bol_InfoId:           number;
    ContactName:          string;
    ContactPhone:         string;
    CustomerType:         string;
    LadingID:             number;
    Mode:                 string;
    QuoteRequestedMailId: string;
    ServiceLevelCode:     string;
    ServiceLevelName:     string;
    TimeCritical:         boolean;
}

export interface Rates {
    AccountInfoID:                string;
    AccountInvoiceAuditList:      string;
    AccountInvoiceCostList:       any[];
    AccountInvoiceDetail:         string;
    AccountPaymentMasterId:       string;
    AuditStatusID:                string;
    BolNumber:                    string;
    CarrBillAccountInvoiceDetail: string;
    CarrierName:                  string;
    CheckDate:                    string;
    CheckNumber:                  string;
    ClientId:                     number;
    ClientName:                   string;
    CostModifyDate:               string;
    CrAcID:                       number;
    CreatedBy:                    string;
    CreatedDate:                  string;
    CustRefNo:                    string;
    Distance:                     string;
    DrAcID:                       number;
    DueDate:                      string;
    EDIShipmentID:                string;
    EmailStatus:                  string;
    EntrySourceID:                string;
    ExcessPaymentCheckDate:       string;
    ExcessPaymentCheckNo:         string;
    ExcessPaymentProNo:           string;
    GL_No:                        string;
    HistoryID:                    string;
    InvDate:                      string;
    InvDetailID:                  number;
    InvNumber:                    string;
    InvReceiveDate:               string;
    InvoiceAmt:                   number;
    InvoiceCreatedBy:             string;
    InvoiceCreatedDate:           string;
    IsApprove:                    boolean;
    IsBaseProfile:                string;
    IsSynchronized:               boolean;
    LadingID:                     string;
    LoadNo:                       string;
    ManiInvoiceID:                string;
    ManifestNumber:               string;
    MappedProfileID:              string;
    MarkupCharge:                 string;
    MarkupTariffTypeID:           string;
    MarkupType:                   string;
    Miles:                        string;
    ModifiedBy:                   string;
    ModifiedDate:                 string;
    Notes:                        string;
    PaymentDate:                  string;
    PaymentStatus:                string;
    PaymentSubDate:               string;
    PaymentTerm:                  string;
    PaymentTermID:                string;
    PrintStatus:                  string;
    ProNumber:                    string;
    ProReceiveDate:               string;
    ProfileID:                    string;
    QbEditSeq:                    string;
    QbSyncDate:                   string;
    QbTxnID:                      string;
    QuoteAmt:                     number;
    RefInvDetailID:               string;
    ResultDetailID:               string;
    RevNumber:                    string;
    RevPrefix:                    string;
    SCAC:                         string;
    SaasRefID:                    string;
    ShipDate:                     string;
    ShipperNotes:                 string;
    SourceRecordID:               string;
    TotalBilledAmount:            string;
    TotalPaidAmount:              string;
    TotalRatedCost:               string;
    UserId:                       number;
    VoucherTypeID:                string;
}