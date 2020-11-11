export interface SelectedProductSQD {
    }

    export interface SelectedProductClassSQD {
    }

    export interface BOlProductsListSQD {
        BOLProductID: number;
        Description: string;
        Pallets: string;
        Pieces: string;
        NMFC: string;
        Class: string;
        Weight: string;
        Height: string;
        Lenght: string;
        Width: string;
        PackageTypeID: number;
        PCF: string;
        selectedProduct: SelectedProductSQD;
        Status: number;
        SelectedProductClass: SelectedProductClassSQD;
        PortCode: string;
        Hazmat?:  boolean;
        Stackable?: boolean;
    }

    export interface BOLAccesorialListSQD {
        AccesorialID: number;
        IsAccesorial?: boolean;
    }

    export interface BuyRatesSQD {
        AccountInvoiceCostList: any[];
    }

    export interface AccountInvoiceCostListSQD {
        AccessorialID: number;
        RatedCost: number;
        BilledCost: number;
        Description: string;
        AccessorialCode: string;
        CostStatus: number;
    }

    export interface SellRatesSQD {
        SCAC: string;
        CarrierName: string;
        AccountInvoiceCostList: AccountInvoiceCostListSQD[];
    }

    export interface SaveQuoteData {
        ClientId: number;
        PickupDate: string;
        DeliveryDate?: any;
        OrgName: string;
        OrgAdr1: string;
        OrgAdr2: string;
        OrgCity: number;
        OrgState: number;
        OrgZip: number;
        OrgCountry: number;
        DestName: string;
        DestAdr1: string;
        DestAdr2: string;
        DestCity: number;
        DestState: number;
        DestZip: number;
        DestCountry: number;
        BillToName: string;
        BillToAdr1: string;
        BillToAdr2: string;
        BillToState: number;
        BillToCity: number;
        BillToZip: number;
        BillToCountry: number;
        CarrierCode: string;
        CarrierName: string;
        ProNumber: string;
        SplNotes: string;
        Ref1ID: number;
        Ref2ID: number;
        Ref3ID: number;
        Ref1Value: string;
        Ref2Value: string;
        Ref3Value: string;
        TransTime: string;
        ShipCost: number;
        FreightCost: number;
        FuelCost: number;
        AccsCost: number;
        ShipperNotes: string;
        PaymentTermID: number;
        OriginContactPerson: string;
        OriginContactPhone: string;
        DestContactPerson: string;
        DestContactPhone: string;
        OriginEmail: string;
        DestEmail: string;
        EquipmentID: number;
        ShipmentValue: string;
        ValuePerPound: string;
        PriorityID: number;
        CarrierType: string;
        QuoteNumber: string;
        OriginTerminalAdd1: string;
        OriginTerminalCity: string;
        OriginTerminalState: string;
        OriginTerminalZip: string;
        OriginTerminalFreePhone: string;
        OriginTerminalPhone: string;
        DestTerminalAdd1: string;
        DestTerminalCity: string;
        DestTerminalState: string;
        DestTerminalZip: string;
        DestTerminalFreePhone: string;
        DestTerminalPhone: string;
        OriginTerminalFax: string;
        DestTerminalFax: string;
        RequestedPickupDateFrom: string;
        RequestedPickupTimeFrom: string;
        RequestedPickupTimeTo: string;
        OrgFaxNo?: any;
        DestFaxNo?: any;
        RequestedDeliveryDate: string;
        ServiceLevelID: number;
        Miles: number;
        BrokerCarrierCode?: any;
        BrokerReferenceNo: string;
        ShipmentErrorID: number;
        BOlProductsList: BOlProductsListSQD[];
        BOLAccesorialList: BOLAccesorialListSQD[];
        BOLDispatchNotesList: any[];
        BuyRates: BuyRatesSQD;
        SellRates: SellRatesSQD;
        RefNo: number;
        LoggedInUserId: number;
        OrgCityName: string;
        OrgStateCode: string;
        OrgCountryCode: string;
        OrgZipCode: string;
        OrgPostWithCity: string;
        DestCityName: string;
        DestStateCode: string;
        DestCountryCode: string;
        DestZipCode: string;
        DestStateName: string;
        DestPostalWithCity: string;
        BillToStateName: string;
        BillToPostalWithCity: string;
        SellProfileID: number;
        OrgLocation: string;
        DestLocation: string;
        BillToCityName: string;
        BillToStateCode: string;
        BillToCountryCode: string;
        BillToZipCode: string;
        SalesPersonList: any[];
        BolDocumentsList: any[];
        TrackingDetailsList: any[];
        ServiceLevelName: string;
        ServiceLevelCode: string;
        RatingResultId: number;
        Mode: string;
        BOLStopLists: any[];
        CostWithCustomerPercentage: number;
        WaterfallList: any[];
        orgTerminalCityStateZipCode: string;
        destTerminalCityStateZipCode: string;
        WaterfallDetailsList: any[];
        StatusReasonCodeId: number;
    }