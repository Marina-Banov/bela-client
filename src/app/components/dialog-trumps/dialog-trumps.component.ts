import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-trumps',
  templateUrl: './dialog-trumps.component.html',
  styleUrls: ['./dialog-trumps.component.scss']
})
export class DialogTrumpsComponent implements OnInit {

  public trumps = ['S', 'C', 'D', 'H'];

  constructor(@Inject(MAT_DIALOG_DATA) public dealer: boolean) { }

  ngOnInit() {
  }

}
