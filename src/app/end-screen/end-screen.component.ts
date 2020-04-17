import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketsService } from '../sockets.service';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent implements OnInit {

  public win: string;
  private readonly username: string;

  constructor(protected socketsService: SocketsService,
              protected router: Router,
              private route: ActivatedRoute) {
    this.win = this.route.snapshot.paramMap.get('win');
    this.username = sessionStorage.getItem('username');
  }

  ngOnInit() {
  }

  restart() {
    this.socketsService.newUser(this.username);
    this.router.navigate(['/']);
  }

  destroy() {
    this.socketsService.disconnect(this.username);
  }
}
