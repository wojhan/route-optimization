import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WebSocketMessage } from 'rxjs/internal/observable/dom/WebSocketSubject';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor() {}

  private subject;

  public connect(url) {
    return this.create(url);
  }

  onReceive() {
    console.log('receive');
  }

  onDisconnect() {
    console.log('disconnect');
  }

  onError() {
    console.log('error');
  }

  private create(url) {
    return webSocket(url);
  }

  sendMessage(message: WebSocketMessage) {
    this.subject.next(message);
  }
}

export interface WebSocketMessage {
  type: string;
  message: string;
}
