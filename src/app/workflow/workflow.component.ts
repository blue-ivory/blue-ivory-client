import { AuthService } from './../auth/auth.service';
import { User } from './../users/user';
import { Permission } from './../users/permission';
import { OrganizationsService } from './../organizations/organizations.service';
import { Organization } from './../organizations/organization';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  private editableOrganizations$: Observable<Organization[]>;
  private currentUser$: Observable<User>;
  private currentUser: User;

  constructor(private organizationService: OrganizationsService, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.editableOrganizations$ = this.organizationService.getEditableOrganizations(user, Permission.EDIT_WORKFLOW, true);
    });
  }

  ngOnInit() {
  }

}
