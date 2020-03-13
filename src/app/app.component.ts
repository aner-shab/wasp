import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

enum Guess {
  None = 0,
  Correct = 1,
  Wrong = 2
}

@Component({
  selector: 'app-root',
  template: `
  <div class="beehive" [ngClass]="{'loading': !loaded}">
    <div class="query animated" [ngClass]="{ 
      'shake': isGuess === 2, 'bounceOutUp': isGuess === 1}">{{currentQuery}} 
      <span class="blinking-cursor" [hidden]="isGuess !== 0">|</span>
    </div>
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
  </div>

  <div class="buttons-bar">
    <button class="game-button" (click)="onBackspaceClicked()">Delete</button>
    <button class="game-button" (click)="onJumbleClicked()">Jumble</button>
    <button class="game-button" (click)="onEnterClicked()">Enter</button>
  </div>

  <div class="buttons-bar">
    <button class="game-button reset" (click)="onResetClicked()">Reset</button>
  </div>

  <div class="hint">You have found {{wordsFound.length}} words out of {{wordsBank.length}}</div>
  <div class="words-found">
    <span *ngFor="let word of wordsFound">{{word}}</span>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  lettersInRotation = [];
  wordsBank = [];
  wordsFound = [];
  currentQuery = '';
  loaded = false;
  isGuess: Guess = Guess.None;

  constructor(private http: HttpClient){
  }  

  ngOnInit(){
    this.initializeLetters();   
  }

  initializeLetters(){
    this.loaded = false;
    this.wordsFound = [];
    this.currentQuery = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let letters = [];
    while (letters.length < 7){
      const alphaLength = alphabet.length;
      const randomIndex = Math.floor(Math.random() * alphaLength);
      letters.push(alphabet.splice(randomIndex,1));
    }
    if (this.hasVowel(letters.join(''))){
      this.lettersInRotation = letters;
      this.loadListOfWords();
    }else{
      this.initializeLetters();
    }
  }

  hasVowel(letters){
    const regex = letters.match(/[aeiou]/gi);
    return regex === null ? false : true;
  }

  async loadListOfWords(){
    console.log(this.lettersInRotation);
    let words = await this.http.get(
    `https://api.yourdictionary.com/wordfinder/v1/unscrambler?dictionary=US%2CWWF&dictionary_opt=YDR&limit=0&tiles=${this.lettersInRotation}`)
    .toPromise();
    // TODO this is scrabble! we don't have double-letter support
    this.wordsBank = (<any>words).data._items.map(x=> x.word).filter(x=> x.length > 3);
    console.log(this.wordsBank);
    if (this.wordsBank.length > 2){
      this.loaded = true;
    }else{
      this.initializeLetters();
    }
  }

  onLetterClicked(letter){
    this.currentQuery += letter;
  }

  onJumbleClicked(){
    const keyLetter = this.lettersInRotation[2];
    for (let i = this.lettersInRotation.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.lettersInRotation[i], this.lettersInRotation[j]] = [this.lettersInRotation[j], this.lettersInRotation[i]];
    }
    const indexOfKeyLetter = this.lettersInRotation.findIndex((key)=> key === keyLetter);
    if (indexOfKeyLetter !== 2){
      const letterInKeyIndex = this.lettersInRotation[2];
      this.lettersInRotation[2] = keyLetter;
      this.lettersInRotation[indexOfKeyLetter] = letterInKeyIndex;
    }
  }

  onResetClicked(){
    if (confirm("Are you sure you want to reset?")){
      this.initializeLetters();
    }
  }

  onBackspaceClicked(){
    this.currentQuery = this.currentQuery.slice(0,-1);
  }

  onEnterClicked(){
    if (this.wordsFound.find(word => word === this.currentQuery)){
      // Word already found!
    }else{
      if (this.wordsBank.find(word=> word === this.currentQuery)){
        this.wordsFound.push(this.currentQuery);
        this.isGuess = Guess.Correct;
      }else{
        this.isGuess = Guess.Wrong;
      }
    }
    setTimeout(()=> {
      this.isGuess = Guess.None;
      this.currentQuery = '';
    }, 1000);
  }
}