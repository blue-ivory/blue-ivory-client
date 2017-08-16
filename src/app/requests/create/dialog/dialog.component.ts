import { Component, Optional, OnInit, ChangeDetectorRef, Input, AfterContentInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MdSnackBar, MdOptionSelectionChange, MdDialogRef } from '@angular/material';
import { StepState } from '@covalent/core';
import { Observable } from 'rxjs';
import { I18nService } from 'angular2-i18n';

import { Collection } from '../../../classes/collection';
import { Request, CarType } from '../../request';
import { User } from '../../../users/user';
import { Organization } from '../../../organizations/organization';
import { VisitorTypes } from './../../../visitors/visitor-types';
import { Visitor } from '../../../visitors/visitor';


import { UserService } from './../../../users/user.service';
import { RequestService } from '../../request.service';
import { OrganizationsService } from '../../../organizations/organizations.service';
import { VisitorService } from '../../../visitors/visitor.service';
import { AuthService } from '../../../auth/auth.service';


@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class CreateRequestDialogComponent implements OnInit {

  @Input('duplicatedRequest') duplicatedRequest: Request;
  private approvableUsers: User[];
  private request: Request;
  private createRequestForm: FormGroup;
  private selectedOrganizationId: string;
  private organizations: Organization[];
  private carTypeKeys: string[];
  private currentUser: User;
  private visitorTypes: { name: string, ranks?: string[] }[];
  private ranks: string[];
  private activeStep: number = 0;
  private visitorStepState: StepState = StepState.None;
  private requestStepState: StepState = StepState.None;
  private requestorStepState: StepState = StepState.None;
  private mailingList: User[] = [];
  private isSoldier: boolean = true;
  private hasCar: boolean = false;
  private loading: boolean = false;
  private filteredApprovableUsers: Observable<User[]>;

  constructor( @Optional() public dialogRef: MdDialogRef<CreateRequestDialogComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private requestService: RequestService,
    private mdSnackBar: MdSnackBar,
    private i18n: I18nService,
    private organizationsService: OrganizationsService,
    private visitorService: VisitorService,
    private userService: UserService,
    private authService: AuthService) {

    this.carTypeKeys = Object.keys(CarType);
    this.visitorTypes = VisitorTypes;

    this.createRequestForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'pid': ['', Validators.pattern('^[0-9]{6,9}$')],
      'company': ['', Validators.required],
      'phoneNumber': ['', Validators.required],
      'startDate': [null, Validators.required],
      'endDate': [null, Validators.required],
      'description': [''],
      'car': [CarType.NONE, Validators.required],
      'carNumber': [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(9)])],
      'organization': [null, Validators.required],
      'type': [null, Validators.required],
      'rank': [{ value: null, disabled: true }, Validators.required],
      'usersMailingList': [{ value: null, disabled: true }]
    }, { validator: this.endDateAfterOrEqualValidator });

    this.authService.currentUser$.do((user: User) => {
      this.currentUser = user;
    }).flatMap(() => this.organizationsService.getRequestableOrganizations())
      .subscribe((organizations: Organization[]) => {
        this.organizations = organizations;

        let userOrganization = this.currentUser.organization ? organizations.find((organization: Organization) => {
          return this.currentUser.organization._id === organization._id;
        }) : null;

        this.selectedOrganizationId = userOrganization ? userOrganization._id : null;

        this.createRequestForm.get('phoneNumber').setValue(this.currentUser.phoneNumber);
        this.createRequestForm.get('organization').setValue(this.selectedOrganizationId);
      });
  }

  ngOnInit(): void {
    if (this.duplicatedRequest) {
      this.loadRequest(this.duplicatedRequest);
    }
    this.filteredApprovableUsers = this.createRequestForm.get('usersMailingList').valueChanges.startWith(null)
      .map(user => user && typeof user === 'object' ? user.firstName + ' ' + user.lastName : user)
      .map(name => name ? this.filterUsers(name) : (this.approvableUsers ? this.approvableUsers.slice() : []));
  }

  private endDateAfterOrEqualValidator(formGroup): any {
    let startDate = formGroup.get('startDate').value;
    let endDate = formGroup.get('endDate').value;
    if (startDate && endDate) {
      let startDateTimestamp = Date.parse(startDate);
      let endDateTimestamp = Date.parse(endDate);

      return (endDateTimestamp < startDateTimestamp) ? { endDateLessThenStartDate: true } : null;
    }

    return { noDateProvided: true };
  }

  private loadRequest(request: Request) {
    this.createRequestForm.get('pid').setValue(request.visitor._id);
    this.visitorIdChanged();
    this.createRequestForm.get('phoneNumber').setValue(request.phoneNumber);
    this.createRequestForm.get('startDate').setValue(request.startDate);
    this.createRequestForm.get('endDate').setValue(request.endDate);
    this.createRequestForm.get('description').setValue(request.description);
    this.createRequestForm.get('car').setValue(request.car);
    this.createRequestForm.get('carNumber').setValue(request.carNumber);
    this.createRequestForm.get('organization').setValue(request.organization._id);
    this.selectedOrganizationId = request.organization._id;

    let visitorType = this.visitorTypes.find(type => request.type == type.name);
    if (visitorType) {
      this.createRequestForm.get('type').setValue(visitorType);
      this.visitorTypeChanged(visitorType);
      this.createRequestForm.get('rank').setValue(request.rank);
    }
  }

  private filterUsers(name: string): User[] {
    return this.approvableUsers ? this.approvableUsers.filter(user => new RegExp(`${name}`, 'gi').test(user.firstName + ' ' + user.lastName)) : [];
  }

  addUserToMailingList(event: MdOptionSelectionChange, user: User) {
    if (event.source.selected) {
      if (this.mailingList.findIndex(usr => usr._id === user._id) === -1) {
        this.mailingList.push(user);
      }
    }
  }

  removeFromMailingList(user: User) {
    let userIndex = this.mailingList.findIndex(usr => usr._id === user._id);
    if (userIndex !== -1) {
      this.mailingList.splice(userIndex, 1);
    }
  }

  private loadApprovableUsers() {
    if (this.selectedOrganizationId && !!this.createRequestForm.get('pid').value) {
      this.userService.getApprovableUsersByOrganization(this.selectedOrganizationId, this.isSoldier, this.hasCar).debounceTime(1000).distinctUntilChanged().subscribe((users: User[]) => {
        this.approvableUsers = users;
        if (this.approvableUsers.length > 0) {
          this.createRequestForm.get('usersMailingList').enable();
        } else {
          this.createRequestForm.get('usersMailingList').disable();
        }
        this.mailingList = this.mailingList.filter(usr => {
          return this.approvableUsers.findIndex(approvableUser => approvableUser._id === usr._id) !== -1;
        });
      });
    }
  }

  updateApprovableUsers() {
    let pid = this.createRequestForm.get('pid').value;
    if (pid) {
      this.hasCar = this.createRequestForm.get('car').value !== CarType.NONE;
      this.isSoldier = pid.toString().length <= 7;
      this.loadApprovableUsers();
    }
  }

  save() {
    let formData = this.createRequestForm.value;

    this.request = new Request();
    this.request.description = formData.description;
    this.request.phoneNumber = formData.phoneNumber;
    this.request.startDate = formData.startDate;
    this.request.endDate = formData.endDate;
    this.request.visitor = new Visitor(formData.pid, formData.name, formData.company);
    this.request.car = formData.car;
    this.request.carNumber = formData.carNumber;
    this.request.organization = { _id: formData.organization, name };
    this.request.type = formData.type.name;
    this.request.rank = formData.rank;

    let mailingListMails = this.mailingList.map(user => user.mail);

    this.loading = true;
    this.requestService.addRequest(this.request, mailingListMails).subscribe(requests => {
      this.mdSnackBar.open(this.i18n.translate('new_request_created'), null, { duration: 3000 });

      this.dialogRef.close();
      this.router.navigateByUrl('requests/my');
    }, err => {
      this.mdSnackBar.open(this.i18n.translate('error_saving_request'), null, { duration: 3000 });
    });
  }

  carTypeChanged(data) {
    this.updateApprovableUsers();
    if (data.value !== CarType.NONE) {
      this.createRequestForm.get('carNumber').enable();
    } else {
      this.createRequestForm.get('carNumber').disable();
    }
  }

  visitorIdChanged() {
    this.updateApprovableUsers();
    let id = this.createRequestForm.get('pid').value;
    if (id) {
      id = id.toString();
      this.visitorService.getVisitor(id).subscribe((visitor: Visitor) => {
        if (visitor) {
          this.createRequestForm.get('name').setValue(visitor.name);
          this.createRequestForm.get('company').setValue(visitor.company);
          this.createRequestForm.get('name').disable();
          this.createRequestForm.get('company').disable();
        } else {
          this.createRequestForm.get('name').enable();
          this.createRequestForm.get('company').enable();
        }
      });
    }
  }

  visitorTypeChanged(type) {
    this.ranks = (type && type.ranks) ? type.ranks : [];
    this.createRequestForm.get('rank').setValue(null);
    if (this.ranks && this.ranks.length > 0) {
      this.createRequestForm.get('rank').enable();
    } else {
      this.createRequestForm.get('rank').disable();
    }
  }

  checkVisitorDetails() {
    let visitorValid = !(this.hasErrors('pid') ||
      this.hasErrors('name') ||
      this.hasErrors('company') ||
      this.hasErrors('type') ||
      this.hasErrors('rank') ||
      this.hasErrors('carNumber'));

    this.visitorStepState = visitorValid ? StepState.Complete : StepState.Required;
  }

  checkRequestDetails() {
    let requestValid = !(this.hasErrors('startDate') ||
      this.hasErrors('endDate') ||
      this.hasErrors('organization'));

    if (this.createRequestForm.hasError('endDateLessThenStartDate')) {
      requestValid = false;
    }

    this.requestStepState = requestValid ? StepState.Complete : StepState.Required;
  }

  checkRequestorDetails() {
    let requestorValid = !this.hasErrors('phoneNumber');

    this.requestorStepState = requestorValid ? StepState.Complete : StepState.Required;
  }

  nextStep() {
    this.activeStep++;
    this.cdRef.detectChanges();
  }

  selectStep(step: number) {
    this.activeStep = step;
    this.cdRef.detectChanges();
  }

  private hasErrors(controlName: string): boolean {
    return !!this.createRequestForm.get(controlName).errors;
  }

}
