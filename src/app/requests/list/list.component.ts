import { Component, Input } from '@angular/core';
import { Request } from './../request';

@Component({
  selector: 'app-requests-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class RequestsListComponent {

  @Input('requests') requests: Request[];

  constructor() { }

}
