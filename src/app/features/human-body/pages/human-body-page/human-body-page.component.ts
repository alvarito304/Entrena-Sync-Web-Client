import { Component } from '@angular/core';
import {HumanBodyComponent} from '../../components/human-body/human-body.component';

@Component({
  selector: 'app-human-body-page',
  imports: [
    HumanBodyComponent
  ],
  templateUrl: './human-body-page.component.html',
  standalone: true,
  styleUrl: './human-body-page.component.css'
})
export class HumanBodyPageComponent {

}
