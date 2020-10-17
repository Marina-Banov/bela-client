import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent implements OnInit {

  public win: string;
  private readonly username: string;

  constructor(private socketService: SocketService,
              private router: Router,
              private route: ActivatedRoute) {
    this.win = this.route.snapshot.paramMap.get('win');
    this.username = sessionStorage.getItem('username');
  }

  ngOnInit() {
  }

  restart() {
    // this.socketService.newUser(this.username);
    this.router.navigate(['/']).then();
  }

  destroy() {
    this.socketService.disconnect(this.username);
  }
}
