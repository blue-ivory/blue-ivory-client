import { Component, OnInit, Input } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { I18nService } from 'angular2-i18n';
import { Observable } from 'rxjs';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { AuthService } from '../../../auth/auth.service';
import { OrganizationsService } from '../../../organizations/organizations.service';
import { Permission } from '../../permission';
import { Organization } from '../../../organizations/organization';
import { Collection } from '../../../classes/collection';

@Component({
  selector: 'app-user-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class UserItemDialogComponent implements OnInit {

  @Input('userId') userId: string;
  private organizationsCollection$: Observable<Collection<Organization>>;
  private editableOrganizations$: Observable<Organization[]>;
  private dataLoaded: boolean = false;
  private user: User;
  private selectedOrganization: string;
  private currentUser: User;
  private editMode: boolean = false;
  private organizationPermissions: Permission[];
  private permissionKeys: string[];
  private displayPermissions: any[];
  private selectedOrganizationForPermissions: Organization;

  constructor(private userService: UserService,
    private organizationService: OrganizationsService,
    private authService: AuthService,
    private mdSnackBar: MdSnackBar,
    private i18n: I18nService) {

    this.organizationsCollection$ = this.organizationService.getOrganizations();
  }

  ngOnInit() {

    let currentUserObservable: Observable<User> = this.authService.currentUser$;
    let userObservable: Observable<User> = this.userService.getUser(this.userId);

    Observable.zip(currentUserObservable, userObservable, (currentUser: User, user: User) => {
      this.currentUser = currentUser;
      this.user = user;
      this.selectUserOrganization();
      this.permissionKeys = Object.keys(Permission);
      this.dataLoaded = true;
      this.editableOrganizations$ = this.organizationService.getEditableOrganizations(this.currentUser, Permission.EDIT_USER_PERMISSIONS);
    }).subscribe();
  }

  private selectUserOrganization() {
    this.selectedOrganization = this.user.organization ? this.user.organization._id : null;
  }

  private saveUserChanges() {
    let checkedPermissions = this.getCheckedPermissions();
    let observablesToWait: Observable<User>[] = [];

    observablesToWait.push(this.saveUserOrganization());

    if (checkedPermissions) {
      observablesToWait.push(this.savePermissionsForOrganization(this.selectedOrganizationForPermissions, checkedPermissions));
    }

    // Save both organization and permissions and then fetch the user
    Observable.forkJoin(observablesToWait).subscribe(() => {
      this.userService.getUser(this.userId).subscribe(user => {
        this.user = user;
        this.selectUserOrganization();
        this.editMode = false;
        this.mdSnackBar.open(this.i18n.translate('USER_UPDATED_SUCCESSFULLY'), null, { duration: 3000 });
      });
    });
  }

  private discardUserChanges() {
    this.selectUserOrganization();
    this.selectedOrganizationForPermissions = null;
    this.displayPermissions = [];
    this.editMode = false;
  }

  private savePermissionsForOrganization(organization: Organization, permissions: Permission[]): Observable<User> {
    return this.userService.setPermissions(this.user._id, organization, permissions);
  }

  private saveUserOrganization(): Observable<User> {
    return this.userService.setOrganization(this.user._id, this.selectedOrganization);
  }

  private getPermissionForOrganization(organization: Organization): Permission[] {
    let organizationPermissions = [];
    if (organization) {
      let permissions = this.user.permissions.find(permission => {
        return permission.organization._id === organization._id
      });

      organizationPermissions = permissions ? permissions.organizationPermissions : [];
    }

    return organizationPermissions;
  }

  private onOrganizationForPermissionSelected() {
    
    let permissionsForOrganization = this.getPermissionForOrganization(this.selectedOrganizationForPermissions);

    this.displayPermissions = this.permissionKeys.map(permission => {
      return {
        name: permission,
        checked: permissionsForOrganization.indexOf(Permission[permission]) !== -1
      };
    });
  }

  private getCheckedPermissions(): Permission[] {
    let checkedPermissions = undefined;
    if (this.displayPermissions) {
      checkedPermissions = this.displayPermissions.filter(permission => {
        return permission.checked;
      }).map(permission => {
        return permission.name;
      });
    }

    return checkedPermissions;
  }

}
