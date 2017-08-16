import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { I18nService } from "angular2-i18n";
import { OrganizationsService } from './../../organizations/organizations.service';
import { Organization } from './../../organizations/organization';
import { UserService } from "app/users/user.service";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/users/user";

@Component({
  selector: 'app-introduction-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class IntroductionDialogComponent implements OnInit {

  private organizations$: Observable<Organization[]>;
  private index: number = 0;
  private userProfileForm: FormGroup;
  private currentUser: User;
  private slides: any[] = [
    {
      title: 'create_new_request',
      description: 'create_new_request_description',
      video: 'tutorial_videos/new-request-video.mp4'
    },
    {
      title: 'view_request_status',
      description: 'view_request_status_description',
      video: 'tutorial_videos/request-status-video.mp4'
    }
  ];

  constructor( @Optional() public dialogRef: MdDialogRef<IntroductionDialogComponent>,
    private organizationService: OrganizationsService,
    private userService: UserService,
    private authService: AuthService,
    private i18n: I18nService,
    private mdSnackBar: MdSnackBar,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.organizations$ = this.organizationService.getOrganizations().map(collection => collection.set);
    this.authService.currentUser$.subscribe((user: User) => {
      this.currentUser = user;
    });
    this.userProfileForm = this.formBuilder.group({
      'organization': [null, Validators.required],
      'phoneNumber': ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  toggleVideo(videoPlayer: any) {
    if (videoPlayer.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }

  isPlaying(videoPlayer: any) {
    return !!(videoPlayer.currentTime > 0 && !videoPlayer.paused && !videoPlayer.ended && videoPlayer.readyState > 2);
  }

  selectSlide(slideNumber: number) {
    if (slideNumber > this.slides.length - 1) {
      this.index = this.slides.length;
    } else if (slideNumber < 0) {
      this.index = 0;
    } else {
      this.index = slideNumber;
    }
  }

  save() {
    let organizationId = this.userProfileForm.get('organization').value;
    let phoneNumber = this.userProfileForm.get('phoneNumber').value;

    if (organizationId && phoneNumber && this.currentUser) {
      Observable.forkJoin(
        this.userService.updatePhoneNumber(this.currentUser._id, phoneNumber),
        this.userService.setOrganization(this.currentUser._id, organizationId)
      ).subscribe((data: User[]) => {
        if (data[1]) {
          this.authService.setUser(data[1]);
        }
        this.dialogRef.close();
        this.router.navigateByUrl('/requests/all');
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
