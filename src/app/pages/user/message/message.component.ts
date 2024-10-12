import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserResponse } from '../../../common/models/user';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../common/services/user.service';
import { MessageService } from '../../../common/services/message.service';
import { PresenceService } from '../../../common/services/presence.service';
import { MessageRequest } from '../../../common/models/message';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../core-ui/pipes/filter.pipe';
import { TimeagoPipe } from '../../../core-ui/pipes/timeago.pipe';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FilterPipe,
    TimeagoPipe,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  receiverId = 0;
  receiver!: UserResponse;
  searchName = ''
  content = ''

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public messageService: MessageService,
    public presenceService: PresenceService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        if (params['id']) {
          this.receiverId = +params['id'];
          this.userService.getUser(this.receiverId).subscribe(data => {
            this.receiver = data;
            this.messageService.createHubConnection(this.userService.getToken(), this.receiverId);
          })
        }
      }
    );

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onSubmit() {
    const request: MessageRequest = {
      content: this.content,
      receiverId: this.receiverId
    }

    if (this.content.trim().length !== 0) {
      this.messageService.sendMessage(request);
      this.content = ''
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
