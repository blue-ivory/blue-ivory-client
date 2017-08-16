import { Component, Input } from '@angular/core';
import { Organization } from '../organization';

@Component({
  selector: 'app-organizations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganizationsListComponent {

  @Input('organizations') organizations: Organization[];

  constructor() { }
}
