import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { createAppModule } from './app/app.module';
import { login } from "app/login";
import { HomeModule } from "app/home";

login((user) => {
  // console.log(user);
  platformBrowserDynamic().bootstrapModule(createAppModule(user));
});

// if (environment.production) {
enableProdMode();
// }

let hackBuild = false;
if(hackBuild) {
  platformBrowserDynamic().bootstrapModule(HomeModule);
}




console.log('Developed by %cRon Borysovski', `
  font-family: "Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif;
  font-size: 20px;
  padding: 10px;
  text-align: center;
  line-height:50px;
  text-transform: uppercase;
  text-rendering: optimizeLegibility;color: #e0dfdc;
  background-color: #333;
  letter-spacing: .1em;
  text-shadow: 
    0 -1px 0 #fff, 
    0 1px 0 #2e2e2e, 
    0 2px 0 #2c2c2c, 
    0 2px 0 #2a2a2a, 
    0 2px 0 #282828, 
    0 3px 0 #262626, 
    0 3px 0 #242424, 
    0 3px 0 #222, 
    0 4px 0 #202020, 
    0 4px 0 #1e1e1e, 
    0 4px 0 #1c1c1c, 
    0 6px 0 #1a1a1a, 
    0 6px 0 #181818, 
    0 6px 0 #161616, 
    0 7px 0 #141414, 
    0 8px 0 #121212, 
    0 8px 10px rgba(0, 0, 0, 0.9);`)