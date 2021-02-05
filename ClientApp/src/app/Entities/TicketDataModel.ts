import { ClassMethod } from "@angular/compiler";

export class TicketDataModel{
    TokenString: string;
    TokenIssueDate: string;
    TokenExpiryDate: string;

    constructor(ticketDataModel?: any) {
        this.TokenString = ticketDataModel && ticketDataModel.TokenString ? ticketDataModel.TokenString : null;
        this.TokenIssueDate = ticketDataModel && ticketDataModel.TokenIssueDate ? ticketDataModel.TokenIssueDate : null;
        this.TokenExpiryDate = ticketDataModel && ticketDataModel.TokenExpiryDate ? ticketDataModel.TokenExpiryDate : null;
    }
}