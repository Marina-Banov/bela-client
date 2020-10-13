import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-three',
  templateUrl: './main-three.component.html',
  styleUrls: ['./main-three.component.scss']
})
export class MainThreeComponent implements OnInit {

  @Input() orderedUsernames: any[];
  @Input() turn: string;
  @Input() scales: any[];
  @Input() playedCards: any[];

  constructor() { }

  ngOnInit() {
  }

}
