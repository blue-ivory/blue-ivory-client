import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private isDarkTheme = false;

  constructor(private overlayContainer: OverlayContainer) {
  }

  changeTheme() {
    this.overlayContainer.themeClass = this.isDarkTheme ? 'dark-theme' : 'default';
  }
}
