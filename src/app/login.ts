import { User } from "app/users/user";
import { environment } from 'environments/environment';

export let connecterUserProfile;

export function login(callback: Function) {
    /* Uncomment for popup support */
    /*let loginPopup = window.open(environment.iframe_url', '');

    window.addEventListener('message', (event) => {
        connecterUserProfile = event.data;
        if (connecterUserProfile.user) {
            loginPopup.close();
            callback(connecterUserProfile.user);
        }
    });*/


    window.addEventListener('message', (event) => {
        connecterUserProfile = event.data;
        if (connecterUserProfile.user) {
            let iframeElement = document.getElementById('iframe');
            iframeElement.parentElement.removeChild(iframeElement);
            callback(connecterUserProfile.user);
        }
    });

    let iframe = document.createElement('iframe');
    iframe.id = 'iframe'
    iframe.src = environment.iframe_url;
    document.body.appendChild(iframe);
}