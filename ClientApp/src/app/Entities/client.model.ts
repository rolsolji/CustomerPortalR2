export class Client {
  AccountID: number;
  AdminUserID: number;
  ClientDefaults: any;
  ClientID: number;
  ClientName: string;
  ClientType: string;
  ContactEmail: string;
  ContactFax: string;
  ContactPhone: string;
  CorporateID: number;
  IsTopLevelClient: boolean;
  MasUserDto: any;
  ShortName: string;
  UserName: string;

  constructor(client?: any) {
    this.AccountID = client && client.AccountID ? client.AccountID : null;
    this.AdminUserID = client && client.AdminUserID ? client.AdminUserID : null;
    this.ClientDefaults = client && client.ClientDefaults ? client.ClientDefaults : null;
    this.ClientID = client && client.ClientID ? client.ClientID : null;
    this.ClientName = client && client.ClientName ? client.ClientName : null;
    this.ClientType = client && client.ClientType ? client.ClientType : null;
    this.ContactEmail = client && client.ContactEmail ? client.ContactEmail : null;
    this.ContactFax = client && client.ContactFax ? client.ContactFax : null;
    this.ContactPhone = client && client.ContactPhone ? client.ContactPhone : null;
    this.CorporateID = client && client.CorporateID ? client.CorporateID : null;
    this.IsTopLevelClient = client && client.IsTopLevelClient !== null ? client.IsTopLevelClient : null;
    this.MasUserDto = client && client.MasUserDto ? client.MasUserDto : null;
    this.ShortName = client && client.ShortName ? client.ShortName : null;
    this.UserName = client && client.UserName ? client.UserName : null;
  }

}
