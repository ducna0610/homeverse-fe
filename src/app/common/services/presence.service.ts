import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessageResponse } from '../models/message';
import { FriendResponse } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection!: HubConnection;
  private friendsSource = new BehaviorSubject<FriendResponse[]>([]);
  friends$ = this.friendsSource.asObservable();

  constructor(
    private alertifyService: AlertifyService, 
    private router: Router,
  ) { }

  createHubConnection(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + '/presence', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on('GetFriends', friends => {
      this.friendsSource.next(friends);
    })

    this.hubConnection.on('UpdateFriend', (friend: FriendResponse) => {
      this.friends$.pipe(take(1)).subscribe({
        next: friends => {
          if (friends.find(x => x.id === friend.id)) {
            this.friendsSource.next(friends.map(x => x.id === friend.id ? friend : x))
          }
          else {
            this.friendsSource.next([...friends, friend])
          }
        }
      })
    })

    this.hubConnection.on('NewMessageReceived', (message: MessageResponse) => {
      this.alertifyService.success(message.sender.name + ' đã gửi tin nhắn cho bạn!')
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }

  async updateToFriends() {
    return this.hubConnection?.invoke('UpdateToFriends')
      .catch(error => console.log(error));
  }

  readMessage(otherId: number) {
    this.friends$.pipe(take(1)).subscribe({
      next: friends => {
        this.friendsSource.next(friends.map(x => x.id === otherId ? { ...x, messageUnread: 0 } : x))
      }
    })
  }
}