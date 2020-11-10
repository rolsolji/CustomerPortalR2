
export interface SendEmailParameters{
    ClientID:         number;
    CarrierID:        string;
    ApplicationID:    number;
    EventID:          number;
    EmailAddresses:   string;
    LadingID:         number;
    UserRowID:        number;
    InvoiceParameter: InvoiceParameter;
    LadingIDs:        any[];
}

export interface InvoiceParameter {
    InvoiceDetailIDs: any[];
}
