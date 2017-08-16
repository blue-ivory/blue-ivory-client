import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/material';
import { I18nService } from 'angular2-i18n/src/I18nService';


@Injectable()
export class SettingsService {

  public defaultLanguage: string;
  public isDarkTheme: boolean;
  public theme: string;

  constructor(
    private i18n: I18nService,
    private overlayContainer: OverlayContainer
  ) {
    this.loadLanguage();
    this.loadTheme();
  }

  private loadLanguage() {
    this.defaultLanguage = localStorage.getItem('lang') || 'he';
    this.i18n.setUserLang(this.defaultLanguage);
  }

  public setLanguage(lang: string) {
    this.defaultLanguage = lang;
    this.i18n.setUserLang(lang);
    localStorage.setItem('lang', lang);
  }

  private loadTheme() {
    let theme = JSON.parse(localStorage.getItem('theme'));
    this.toggleTheme(theme ? theme : 'default');
  }

  public toggleTheme(theme: string) {
    this.theme = theme;
    this.overlayContainer.themeClass = `${theme}-theme`;
    localStorage.setItem('theme', JSON.stringify(theme));
  }
}
