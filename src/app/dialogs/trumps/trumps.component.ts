import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-trumps',
  templateUrl: './trumps.component.html',
  styleUrls: ['./trumps.component.scss']
})
export class TrumpsComponent implements OnInit {

  public trumps = ['S', 'C', 'D', 'H'];

  constructor(@Inject(MAT_DIALOG_DATA) public dealer: boolean) { }

  ngOnInit() {
  }

}
