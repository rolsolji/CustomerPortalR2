export class User {
  ClientID: number;
  CorporateID: number;
  FirstName: string;
  IsAdmin: boolean;
  IsAutoLogin: boolean;
  IsShowAllClient: boolean;
  TokenString: string;
  UserID: number;
  UserName: string;
  TokenIssueDate: string;
  TokenExpiryDate: string;

  constructor(user?: any) {
    this.ClientID = user && user.ClientID ? user.ClientID : null;
    this.CorporateID = user && user.CorporateID ? user.CorporateID : null;
    this.FirstName = user && user.FirstName ? user.FirstName : null;
    this.IsAdmin = user && user.IsAdmin !== null ? user.IsAdmin : null;
    this.IsAutoLogin = user && user.IsAutoLogin !== null ? user.IsAutoLogin : null;
    this.IsShowAllClient = user && user.IsShowAllClient !== null ? user.IsShowAllClient : null;
    this.TokenString = user && user.TokenString ? user.TokenString : null;
    this.UserID = user && user.UserID ? user.UserID : null;
    this.UserName = user && user.UserName ? user.UserName : null;
    this.TokenIssueDate = user && user.TokenIssueDate ? user.TokenIssueDate : null;
    this.TokenExpiryDate = user && user.TokenExpiryDate ? user.TokenExpiryDate : null;
  }

}
