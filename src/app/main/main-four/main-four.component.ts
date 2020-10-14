import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-main-four',
  templateUrl: './main-four.component.html',
  styleUrls: ['./main-four.component.scss']
})
export class MainFourComponent implements OnInit {

  orderedUsernames: any[] = [];

  constructor(public socketService: SocketService) { }

  ngOnInit() {
    this.socketService.updateUsersEvent.subscribe(data => {
      this.orderedUsernames = data.orderedUsers;
    });
  }

}
