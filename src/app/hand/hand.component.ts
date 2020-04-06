import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SocketsService } from '../services/sockets.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  @Input() hand: any[];
  @Input() display8: boolean;
  cardsToCheckboxes = false;
  cardsToButtons = false;
  scaleForm: FormGroup;

  constructor(protected socketsService: SocketsService,
              protected formBuilder: FormBuilder) {
    this.scaleForm = this.formBuilder.group({
      scale: new FormArray([])
    });
  }

  ngOnInit() {
    this.socketsService.callScaleEvent.subscribe(data => {
      this.cardsToCheckboxes = true;
      const formArray = this.scaleForm.get('scale') as FormArray;
      formArray.clear();
    });
  }

  calledScale(event) {
    event.preventDefault();
    this.socketsService.emit('calledScale', this.scaleForm.get('scale').value);
    this.cardsToCheckboxes = false;
  }

  onCheckChange(event) {
    const formArray = this.scaleForm.get('scale') as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      formArray.controls.forEach( ctrl => {
        if (ctrl.value === event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
