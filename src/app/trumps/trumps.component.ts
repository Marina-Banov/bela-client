import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-trumps',
  templateUrl: './trumps.component.html',
  styleUrls: ['./trumps.component.scss']
})
export class TrumpsComponent implements OnInit {

  private trumps = ['S', 'C', 'D', 'H'];

  constructor(@Inject(MAT_DIALOG_DATA) public dealer: boolean) { }

  ngOnInit() {
  }

}
