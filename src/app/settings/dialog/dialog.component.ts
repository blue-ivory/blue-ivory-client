import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { SettingsService } from 'app/settings/settings.service';
import { AuthService } from 'app/auth/auth.service';
import { User } from 'app/users/user';
import { UserService } from 'app/users/user.service';
import { I18nService } from 'angular2-i18n/src/I18nService';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {

  private phoneNumberChanged = false;
  private phoneNumber: string;
  private currentUser: User;

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private userService: UserService,
    private mdSnackBar: MdSnackBar,
    private i18n: I18nService
  ) {
    this.authService.currentUser$.subscribe((user: User) => {
      this.currentUser = user;
      this.phoneNumber = user.phoneNumber;
    });
  }

  ngOnInit() {
  }

  languageChanged(lang) {
    this.settingsService.setLanguage(lang.value);
  }

  toggleTheme(theme: string) {
    this.settingsService.toggleTheme(theme);
  }

  updatePhoneNumber() {
    this.userService.updatePhoneNumber(this.currentUser._id, this.phoneNumber).subscribe(() => {
      this.mdSnackBar.open(this.i18n.translate('update_succeeded'), null, { duration: 3000 });
    }, (err) => {
      this.mdSnackBar.open(this.i18n.translate('update_failed'), null, { duration: 3000 });
    });
  }
}
