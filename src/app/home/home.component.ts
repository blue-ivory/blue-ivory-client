import { Router } from '@angular/router';
import { Component, ViewChild, ElementRef, Renderer, OnInit } from '@angular/core';
import { ObservableMedia } from "@angular/flex-layout";
import { Observable } from 'rxjs';
import { User } from './../users/user';
import { Permission } from './../users/permission';
import { AuthService } from "app/auth/auth.service";
import { CreateRequestComponent } from "app/requests/create/create.component";
import { CreateOrganizationComponent } from "app/organizations/create/create.component";
import { SettingsComponent } from "app/settings/settings.component";
import { SettingsService } from "app/settings/settings.service";
import { MdDialog } from "@angular/material";
import { IntroductionDialogComponent } from "app/introduction/dialog/dialog.component";
import { SettingsDialogComponent } from "app/settings/dialog/dialog.component";
import { CreateOrganizationDialogComponent } from "app/organizations/create/dialog/dialog.component";
import { CreateRequestDialogComponent } from "app/requests/create/dialog/dialog.component";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private user$: Observable<User> = null;
  private linkClicked: boolean = false;
  private activeLinkIndex: number;
  private searchTerm: string;
  private activeResource: string;
  private firstLoad: boolean = true;
  private keys = Object.keys;

  @ViewChild(CreateRequestComponent) createRequestComponent: CreateRequestComponent;
  @ViewChild(CreateOrganizationComponent) createOrganizationComponent: CreateOrganizationComponent;
  @ViewChild(SettingsComponent) settingsComponent: SettingsComponent;

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
    public media: ObservableMedia,
    public dialog: MdDialog
  ) {
    this.user$ = this.authService.currentUser$;
  }

  activateLink(index: number, resource: string) {
    this.linkClicked = true;
    this.activeLinkIndex = index;
    this.activeResource = resource;
  }

  onSearch(term) {
    this.searchTerm = term;
    this.firstLoad = false;
  }

  onClear() {
    this.linkClicked = false;
    this.searchTerm = '';
  }

  createRequestDialog() {
    this.dialog.open(CreateRequestDialogComponent, { width: '700px', disableClose: true });
    // if (this.createRequestDialog) {
    //   this.createRequestComponent.openDialog();
    // }
  }

  createOrganizationDialog() {
    this.dialog.open(CreateOrganizationDialogComponent, { disableClose: false });
    // if (this.createOrganizationDialog) {
    //   this.createOrganizationComponent.openDialog();
    // }
  }

  settingsDialog() {
    this.dialog.open(SettingsDialogComponent, { disableClose: false, width: '400px' });
    // if (this.settingsComponent) {
    //   this.settingsComponent.openDialog();
    // }
  }

  openIntroDialog() {
    this.dialog.open(IntroductionDialogComponent, { disableClose: true, backdropClass: 'introduction-backdrop', width: '750px' });
  }
}
