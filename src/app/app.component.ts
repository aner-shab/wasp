import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="hex-row">
    <div class="hex">
      <app-cell [placeholder]="true" ></app-cell>
    </div>
    <div class="hex even">
      <app-cell [letter]="lettersInRotation[0]" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
  </div>
  <div class="hex-row">
    <div class="hex">
      <app-cell [letter]="lettersInRotation[1]" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
    <div class="hex even">
      <app-cell [letter]="lettersInRotation[2]" [isKey]="true" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
    <div class="hex">
      <app-cell [letter]="lettersInRotation[3]" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
  </div>
  <div class="hex-row">
    <div class="hex">
      <app-cell [letter]="lettersInRotation[4]" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
    <div class="hex even">
      <app-cell [letter]="lettersInRotation[5]" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
    <div class="hex">
      <app-cell [letter]="lettersInRotation[6]" (clicked)="onLetterClicked($event)"></app-cell>
    </div>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wasp';
  lettersInRotation = [];
    
  ngOnInit(){
    this.initializeLetters();
  }

  initializeLetters(){
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let letters = [];
    while (letters.length < 7){
      const alphaLength = alphabet.length;
      let randomIndex = Math.floor(Math.random() * alphaLength);
      letters.push(alphabet.splice(randomIndex,1));
    }
    this.lettersInRotation = letters;
  }
  onLetterClicked(event){
    console.log(event);
  }
}
