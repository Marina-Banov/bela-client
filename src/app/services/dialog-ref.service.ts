import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogRefService {

  public dialogRef: MatDialogRef<any>;
  constructor() { }
}
