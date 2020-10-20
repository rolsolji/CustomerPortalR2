import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: string[] = [];

  private quoteParameter = new BehaviorSubject("");
  SharedQuoteParameter = this.quoteParameter.asObservable();

  private ladingIDParameter = new BehaviorSubject("");
  SharedLadingIDParameter = this.ladingIDParameter.asObservable();

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  SendQuoteParameter(quote: string) {
    this.quoteParameter.next(quote)
  }

  SendLadingIDParameter(ladingID: string) {
    this.ladingIDParameter.next(ladingID)
  }

}