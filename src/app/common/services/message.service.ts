import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, take } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessageRequest, MessageResponse } from '../models/message';
import { PresenceService } from './presence.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<MessageResponse[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(
    private presenceService: PresenceService, 
    private http: HttpClient,
  ) {
  }

  createHubConnection(token: string, otherUserId: number) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + '/chat?otherId=' + otherUserId, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
      this.readMessage(otherUserId);
    })

    this.hubConnection.on('NewMessage', (message: MessageResponse) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message]);
          this.readMessage(message.sender.id);
        }
      })
    })

    this.hubConnection.on('ReadedMessage', otherUserId => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next(messages.map(x => x.receiver.id == otherUserId ? { ...x, isReaded: true } : x));
        }
      })
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection?.stop();
    }
  }

  async sendMessage(request: MessageRequest) {
    return this.hubConnection?.invoke('SendMessage', request)
      .catch(error => console.log(error));
  }

  async readMessage(otherId: number) {
    this.presenceService.readMessage(otherId);
    return this.hubConnection?.invoke('ReadMessage', otherId)
      .catch(error => console.log(error));
  }
}
