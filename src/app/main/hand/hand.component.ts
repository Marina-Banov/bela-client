import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SocketsService } from '../../services/sockets.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  @Input() hand: string[];
  @Input() display8: boolean;
  @Input() cardsToButtons: boolean;
  cardsToCheckboxes = false;
  scaleForm: FormGroup;
  bela: any = {
    card: '',
    callBela: false
  };

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

    this.socketsService.callBelaEvent.subscribe(data => {
      this.bela.card = data;
      this.bela.callBela = true;
    });
  }

  calledScale(event) {
    event.preventDefault();
    this.socketsService.emit('calledScale', this.scaleForm.get('scale').value);
    // this.socketsService.emit('calledScale', ['H7', 'C7', 'S7', 'D7']);
    this.cardsToCheckboxes = false;
  }

  playCard(card) {
    this.socketsService.emit('cardPlayed', card);
  }

  callBela(called) {
    this.socketsService.emit('calledBela', { card: this.bela.card, called });
    this.bela.callBela = false;
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
