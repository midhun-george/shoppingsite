import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoutiqueComponent } from './components/boutique/boutique.component';

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
 template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'boutique';
}
