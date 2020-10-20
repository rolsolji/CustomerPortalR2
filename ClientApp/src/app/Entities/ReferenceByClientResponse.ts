
export interface ReferenceByClient {
    ApplicationID: number;
    ClientID:      number;
    Description:   string;
    Format:        string;
    IsRequired:    boolean | null;
    ReferenceCode: string;
    ReferenceID:   number;
}
