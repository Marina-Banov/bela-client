import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { SocketService } from '../../services/socket.service';

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

  constructor(private socketService: SocketService,
              public gameService: GameService,
              protected formBuilder: FormBuilder) {
    this.scaleForm = this.formBuilder.group({
      scale: new FormArray([])
    });
  }

  ngOnInit() {
    this.gameService.handEvent.subscribe( data => {
      this.hand = data.hand.map(x => x.sign);
      this.displayAll = data.displayAll;
    });

    this.gameService.playCardEvent.subscribe( data => {
      this.cardsToButtons = data;
    });

    this.gameService.callScaleEvent.subscribe(() => {
      this.cardsToCheckboxes = true;
      this.scale = true;
      const formArray = this.scaleForm.get('scale') as FormArray;
      formArray.clear();
    });

    this.gameService.callBelaEvent.subscribe(data => {
      this.bela.callBela = true;
      this.bela.card = data;
    });

    this.gameService.discardTwo.subscribe(() => {
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
