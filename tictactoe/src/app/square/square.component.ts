import { Component, Input } from "@angular/core";
//DUMB COMPONENT (DOESN'T CHANGE STATE)
@Component({
  selector: "app-square",
  template: `
    <button nbButton *ngIf="!value">{{ value }}</button>
    <button nbButton hero status="success" *ngIf="value == 'X'">
      {{ value }}
    </button>
    <button nbButton hero status="info" *ngIf="value == 'O'">
      {{ value }}
    </button>
  `,
  // template: `
  //   <p>
  //     {{ random }}
  //   </p>
  // `,
  styles: ["button { width: 100%; height: 100%; font-size: 5em !important; }"]
})
export class SquareComponent {
  @Input() value: `X` | `O`;
  // random;

  // constructor() {
  //   setInterval(() => this.random = Math.random(), 1000);
  // }
}
