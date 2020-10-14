import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  hand: string[];
  displayAll: boolean;
  cardsToButtons: boolean;
  cardsToCheckboxes = false;
  scale: boolean;
  scaleForm: FormGroup;
  bela: any = {
    card: '',
    callBela: false
  };

  constructor(public socketService: SocketService,
              protected formBuilder: FormBuilder) {
    this.scaleForm = this.formBuilder.group({
      scale: new FormArray([])
    });
  }

  ngOnInit() {
    this.socketService.handEvent.subscribe( data => {
      this.hand = data.hand.map(x => x.sign);
      this.displayAll = data.displayAll;
    });

    this.socketService.playCardEvent.subscribe( data => {
      this.cardsToButtons = data;
    });

    this.socketService.callScaleEvent.subscribe(data => {
      this.cardsToCheckboxes = true;
      this.scale = true;
      const formArray = this.scaleForm.get('scale') as FormArray;
      formArray.clear();
    });

    this.socketService.callBelaEvent.subscribe(data => {
      this.bela.callBela = true;
      this.bela.card = data;
    });

    this.socketService.discardTwo.subscribe(() => {
      this.cardsToCheckboxes = true;
      this.scale = false;
      const formArray = this.scaleForm.get('scale') as FormArray;
      formArray.clear();
    });
  }

  calledScale(event, shouldCall) {
    event.preventDefault();
    if (this.scale) {
      this.socketService.emit('calledScale', shouldCall ? this.scaleForm.get('scale').value : []);
    } else {
      this.socketService.emit('discarded', this.scaleForm.get('scale').value);
    }
    this.cardsToCheckboxes = false;
  }

  playCard(card) {
    this.socketService.emit('cardPlayed', card);
  }

  callBela(called) {
    this.socketService.emit('calledBela', { card: this.bela.card, called });
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
