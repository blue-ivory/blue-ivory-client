import { CreateRequestDialogComponent } from './../../create/dialog/dialog.component';
import { MdDialog } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { Request } from './../../request';
import { RequestService } from './../../request.service';
import { MdSnackBar } from '@angular/material';
import { I18nService } from 'angular2-i18n';
import { Observable } from "rxjs/Observable";
import { TdDialogService } from "@covalent/core";
import { TaskStatus, TaskType, Task } from "app/workflow/task";
import { AuthService } from "app/auth/auth.service";
import { Permission } from "app/users/permission";
import { User } from "app/users/user";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: 'app-request-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: [
    trigger('marginItem', [
      state('false', style({
        'margin': '0px 0px'
      })),
      state('true', style({
        'margin': '50px -20px'
      })),
      transition('0 => 1', animate('200ms ease-in')),
      transition('1 => 0', animate('200ms ease-out'))
    ]),
    trigger('previewItem', [
      state('true', style({
        'line-height': '1.5',
        'padding': '16px 20px',
        'border-bottom': '1px solid rgba(0,0,0,0.1)'
      })),
      state('false', style({
        'line-height': '20px',
        'padding': '12px 0',
        'border-bottom': 'none'
      })),
      transition('0 => 1', animate('200ms ease-in')),
      transition('1 => 0', animate('200ms ease-out'))
    ]),
    trigger('expandItem', [
      state('false', style({
        'max-height': '0px',
      })),
      state('true', style({
        'max-height': '999px',
      })),
      transition('0 => 1', animate('400ms ease-in')),
      transition('1 => 0', animate('250ms ease-out')),
    ])
  ]
})
export class RequestItemComponent implements OnInit {
  @Input('request') request: Request;
  private currentUser: User;
  private animateExpandItem: string = 'closed';
  private expandItem: boolean = false;
  private editMode: boolean = false;
  private canEditRequest: boolean = false;
  private canDeleteRequest: boolean = false;
  private loading: boolean = false;

  constructor(private requestService: RequestService,
    private dialog: MdDialog,
    private authService: AuthService,
    private dialogService: TdDialogService,
    private mdSnackBar: MdSnackBar,
    private i18n: I18nService) {
  }

  ngOnInit() { }

  onClick() {
    this.expandItem = !this.expandItem;
    if (this.expandItem) {
      this.requestService.selectedRequestId = this.request._id;
      this.animateExpandItem = 'expanded';
      this.loading = true;
      this.authService.currentUser$.do((user: User) => {
        this.currentUser = user;
      }).flatMap(() => {
        return this.requestService.getRequest(this.request._id);
      }).subscribe(request => {
        this.request = request;

        this.canEditRequest = request.requestor && request.requestor._id === this.currentUser._id;
        this.canDeleteRequest = this.canEditRequest;
        let permissions = this.currentUser.permissions.find(permission => permission.organization._id === request.organization._id);
        if (permissions) {
          if (permissions.organizationPermissions && permissions.organizationPermissions.indexOf(Permission.DELETE_REQUEST) !== -1) {
            this.canDeleteRequest = true;
          }
        }
        this.request.workflow = this.initTasks(this.request.workflow);
        this.loading = false;
      });
    } else {
      this.animateExpandItem = 'closed';
    }
  }

  onClickOutside() {
    this.expandItem = false;
    this.animateExpandItem = 'closed';
  }

  save() {
    if (this.request.phoneNumber) {
      this.requestService.updateRequest(this.request).subscribe(request => {
        this.mdSnackBar.open(this.i18n.translate('request_successfully_saved'), null, { duration: 3000 });
        this.request = request;
        this.request.workflow = this.initTasks(request.workflow);
      }, err => {
        this.mdSnackBar.open(this.i18n.translate('error_saving_request'), null, { duration: 3000 });
      });
    } else {
      this.mdSnackBar.open(this.i18n.translate('phone_is_required'), null, { duration: 3000 });
    }
  }

  remove() {
    this.dialogService.openConfirm({
      message: this.i18n.translate('remove_request?'),
      disableClose: true,
      cancelButton: this.i18n.translate('cancel'),
      acceptButton: this.i18n.translate('remove'),
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.requestService.removeRequest(this.request._id).subscribe(() => {
          this.mdSnackBar.open(this.i18n.translate('request_successfully_removed'), null, { duration: 3000 });
        });
      }
    });
  }

  changeTaskStatus(taskId: any, status: TaskStatus, needEscort?: boolean, needTag?: boolean, securityClearance?: number, confirmationNumber?: number) {
    this.requestService.changeTaskStatus(this.request._id,
      taskId,
      status,
      needEscort,
      needTag,
      securityClearance,
      confirmationNumber).subscribe((request: Request) => {
        this.request = request;
        this.request.workflow = this.initTasks(request.workflow);
      }, (err) => {
        this.mdSnackBar.open(this.i18n.translate('failed_to_change_task_status'), null, { duration: 3000 });
      });
  }

  initTasks(workflow: Task[]): Task[] {

    return workflow.map(task => {
      task.canEdit = this.canChangeStatus(task.type, task.organization._id);
      return task;
    });
  }

  duplicate() {
    let dialogRef = this.dialog.open(CreateRequestDialogComponent, {
      width: '700px', disableClose: true
    });
    dialogRef.componentInstance.duplicatedRequest = this.request;
  }

  isExpired(endDate: Date) {
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    return new Date(endDate) < yesterdayDate;
  }

  private canChangeStatus(type: TaskType, organizationId: any): boolean {
    let requiredPermissions = null;
    if (type === TaskType.CAR) {
      requiredPermissions = Permission.APPROVE_CAR;
    } else {
      if (this.request.isSoldier) {
        requiredPermissions = Permission.APPROVE_SOLDIER;
      } else {
        requiredPermissions = Permission.APPROVE_CIVILIAN;
      }
    }
    return this.hasPermissionForOrganization([requiredPermissions], organizationId);
  }

  private hasPermissionForOrganization(permissions: Permission[], organizationId: any): boolean {
    let userPermissions = this.currentUser.permissions;
    let orgPermissions = userPermissions.find(permission => {
      return permission.organization._id === organizationId;
    });

    let organizationPermissions = orgPermissions ? orgPermissions.organizationPermissions : [];

    return this.currentUser.isAdmin || permissions.every(permission => organizationPermissions.indexOf(permission) > -1);
  }
}
