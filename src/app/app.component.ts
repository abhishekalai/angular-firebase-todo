import { Component } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';

interface Item extends DocumentData {
  name?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Taskmaster';
}
