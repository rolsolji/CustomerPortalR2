export interface Carrier {
    Address1: string;
    Address2: string;
    BusinessSizeID: number;
    CarrierID: string;
    CarrierLogo?: any;
    CarrierName: string;
    CarrierTypeID: number;
    CarrierUrl: string;
    CityID: number;
    CityName?: any;
    ClientID: number;
    ContactEmail: string;
    ContactFaxNo: string;
    ContactName: string;
    ContactPhone: string;
    CorporateCarrierID: string;
    CountryId: number;
    CountryName?: any;
    CreatedBy: string;
    CreatedDate?: any;
    DefaultRatingMode: number;
    EffectiveDate: string;
    FuelRequired: string;
    IsCorporateCarrier: string;
    IsCorporateCarrierTrue: boolean;
    IsFuelRequiredTrue: boolean;
    IsPickupApi?: any;
    IsProNoAllowed: string;
    IsProNoAllowedTrue: boolean;
    MCNumber: string;
    ModifiedBy: string;
    ModifiedDate: Date;
    PostalCode?: any;
    PostalID: number;
    ProLength: number;
    ProMask: string;
    StateId: number;
    StateName?: any;
    Status: boolean;
    TenderEmail: string;
    USDotNumber: string;
}