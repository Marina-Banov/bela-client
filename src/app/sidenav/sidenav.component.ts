import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() trump: any;
  @Input() points: any;
  @Input() teams: any;

  constructor() { }

  ngOnInit() {
  }

}
