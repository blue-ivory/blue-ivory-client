import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { I18nService } from 'angular2-i18n';
import { Organization } from '../../organization';
import { OrganizationsService } from '../../organizations.service';



@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class CreateOrganizationDialogComponent {

  private organization: Organization;
  private createOrganizationForm: FormGroup;

  constructor( @Optional() public dialogRef: MdDialogRef<CreateOrganizationDialogComponent>,
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private mdSnackBar: MdSnackBar,
    private i18n: I18nService) {

    this.createOrganizationForm = this.formBuilder.group({
      'name': [null, Validators.required]
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    debugger;
    let formData = this.createOrganizationForm.value;

    this.organization = new Organization(formData.name);

    this.organizationsService.addOrganization(this.organization).subscribe(organization => {
      this.mdSnackBar.open(this.i18n.translate('ORGANIZATION_SUCCESSFULLY_CREATED'), null, { duration: 3000 });
    }, err => {
      this.mdSnackBar.open(this.i18n.translate('ERROR_SAVING_ORGANIZATION'), null, { duration: 3000 });
    });
    this.dialogRef.close();
  }

}
