import { Component } from '@angular/core';
import { DisableRightClickService } from './shared/disableRightClick';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TeluguProgrammer';
  constructor(private rightClickDisable: DisableRightClickService, public fbAuth: AngularFireAuth) {
    this.rightClickDisable.disableRightClick();
  }

  successLoginCallback(event: any) {

  }

  errorLoginCallback(event: any) {

  }

}
