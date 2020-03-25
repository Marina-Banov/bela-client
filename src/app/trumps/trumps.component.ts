import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trumps',
  templateUrl: './trumps.component.html',
  styleUrls: ['./trumps.component.scss']
})
export class TrumpsComponent implements OnInit {

  private trumps = ['S', 'C', 'D', 'H'];

  constructor() { }

  ngOnInit() {
  }

}
