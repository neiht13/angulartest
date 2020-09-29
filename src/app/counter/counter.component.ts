import { Component } from '@angular/core';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']

})
export class CounterComponent {
  public currentCount = 0;

  public upCounter() {
    this.currentCount++;
  }

  public downCounter() {
    this.currentCount--;
  }
}
