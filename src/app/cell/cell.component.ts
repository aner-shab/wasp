import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cell',
  template: `
  <div class="hex" [ngClass]="{'hidden': placeholder, 'key-letter': isKey}" (click)="onClick()">
    <div class="left"></div>
    <div class="middle">
      <span>{{letter}}</span>
    </div>
    <div class="right"></div>
  </div>
  `,
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() letter: string;
  @Input() isKey: boolean;
  @Input() placeholder: boolean;
  @Output() clicked = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    this.clicked.emit(this.letter);
  }

}
