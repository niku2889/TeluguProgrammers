import { Component } from '@angular/core';
import { DisableRightClickService } from './shared/disableRightClick';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TeluguProgrammer';
  constructor(private rightClickDisable: DisableRightClickService,) {
    this.rightClickDisable.disableRightClick();
  }
}
