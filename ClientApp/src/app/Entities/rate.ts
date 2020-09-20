export interface Product {
    FAKClass: number;
    HazMat: boolean;
    Height: number;
    Length: number;
    NmfcNumber?: any;
    PackageType?: any;
    PackageTypeID?: any;
    Pallets: number;
    Pieces: number;
    ProductClass: number;
    ProductCost: number;
    ProductDescription?: any;
    RateBase: number;
    Stackable: boolean;
    Weight: number;
    Width: number;
}
    
export interface UsedRatingFuel {
    EffectiveFrom: Date;
    EffectiveTo: Date;
    FuelLevel?: any;
    FuelRate: number;
    FuelRateType: string;
    MaxRate: number;
    Message: string;
    MinRate: number;
}

export interface AccessorialBase {
    AccessorialCode: string;
    AccessorialID: number;
}

export interface Accessorial {
    AccessorialCode: string;
    AccessorialID: number;
    AccessorialCharge: number;
    AccessorialDescription: string;
    AccessorialLevel?: string;
    AccessorialRate: number;
    AccessorialType: number;
    IsIncluded: boolean;
    IsNotRated: boolean;
    IsSystem: boolean;
    Message?: string;
    ShowTrueCost: boolean;
    WeightFrom: number;
    WeightTo: number;
}

export interface ServiceLevel {
    ServiceLevelID: number;
    ServiceLevelCode: string;
}

export interface Rate {
    Accessorials: Accessorial[];
    ApiCallDuration: string;
    BenchMarkCost?: any;
    CarrierConnectRequestResponseString?: any;
    CarrierCost: number;
    CarrierCostWithOutTrueCost: number;
    CarrierID: string;
    CarrierName: string;
    CarrierType: string;
    CarrierTypeID: number;
    CostWithCustomerPercentage: number;
    CostWithCustomerPercentageWithOutTrueCost: number;
    CustomerCost: number;
    DeficitCharge: number;
    DeficitWeight: number;
    DestTerminalAddress1: string;
    DestTerminalAddress2: string;
    DestTerminalCity: string;
    DestTerminalCode: string;
    DestTerminalContactName: string;
    DestTerminalContactTitle: string;
    DestTerminalEmail: string;
    DestTerminalFaxNo: string;
    DestTerminalFreePhone: string;
    DestTerminalName: string;
    DestTerminalPhoneNo: string;
    DestTerminalState: string;
    DestTerminalZip: string;
    DestTerminalZipCode: string;
    Discount: number;
    DiscountID: number;
    DiscountRate: number;
    EquipmentCharges?: any;
    Equipments?: any;
    ExcludeReason: string;
    FreightCost: number;
    FuelCost: number;
    FuelRate: number;
    GrossAmount: number;
    IsClientGainShare: boolean;
    IsExcluded: boolean;
    IsMinimumApplied: boolean;
    IsVendorPortalRate: boolean;
    LaneID: number;
    LaneName: string;
    LaneWiseMiles: number;
    MaxHeightShipmentLimit: string;
    MaxLenghtShipmentLimit: string;
    Miles: number;
    MinAmount: number;
    ModeType?: any;
    NewInsuranceCost: number;
    OldInsuranceCost: number;
    OriginTerminalAddress1: string;
    OriginTerminalAddress2: string;
    OriginTerminalCity: string;
    OriginTerminalCode: string;
    OriginTerminalContactName: string;
    OriginTerminalContactTitle: string;
    OriginTerminalEmail: string;
    OriginTerminalFaxNo: string;
    OriginTerminalFreePhone: string;
    OriginTerminalName: string;
    OriginTerminalPhoneNo: string;
    OriginTerminalState: string;
    OriginTerminalZip: string;
    OriginTerminalZipCode: string;
    PaymentType: string;
    Products: Product[];
    ProfileID: number;
    QuoteNumber: string;
    RateType: string;
    RatingMarkUp?: any;
    RatingResultId: number;
    ReferenceNo: number;
    Remarks: string;
    SAASQuoteNumber: number;
    SaasBrokerCarrierCode?: any;
    SaasBrokerCarrierName?: any;
    SaasServiceLevelCode: string;
    ServiceLevel: string;
    ServiceLevelCode?: any;
    ShowTrueCost: boolean;
    StatusCode: number;
    TariffName?: any;
    TotalAccCost: number;
    TotalAccCostWithOutTrueCost: number;
    TotalCost: number;
    TotalCostWithCustCostWithOutTrueCost: number;
    TotalCostWithOutTrueCost: number;
    TotalShipmentCostWithCustomerCost: number;
    TransitTime: string;
    UsedRatingFuel: UsedRatingFuel;
    UsedRatingWeeklyFuel?: any;
    ZoneAreaID: number;
    ZoneID: number;
    ZoneRateID: number;
}
    
    
    