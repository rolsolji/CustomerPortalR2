// Generated by https://quicktype.io

export interface GetQuotesParameters {
    ClientID:           number;
    PageNumber:         number;
    PageSize:           number;
    FromShipDate:       string;
    ToShipDate:         string;
    SCAC:               null;
    Status:             null;
    ClientName:         null;
    OrderBy:            string;
    IsAccending:        boolean;
    UserRowID:          number;
    LadingIDList:       any[];
    LoadNo:             null;
    IsExpired:          boolean;
    IsQuote:            boolean;
    BOlStatusIDList:    any[];
    OrgName:            null;
    DestName:           null;
    OrgZipCode:         null;
    DestZipCode:        null;
    PickupNumber:       null;
    ProNumber:          null;
    Ref1Value:          null;
    Ref2Value:          null;
    Ref3Value:          null;
    QuoteNo:            null;
    PONumber:           null;
    FromDeliveryDate:   string;
    ToDeliveryDate:     string;
    IsIncludeSubClient: boolean;
    EquipmentID:        number;
    Mode:               string;
    FreeSearch:         null;
    Ref4Value:          null;
    ShipmentType:       string;
}