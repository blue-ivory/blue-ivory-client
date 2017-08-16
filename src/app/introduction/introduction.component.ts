import { IntroductionDialogComponent } from './dialog/dialog.component';
import { MdDialog } from '@angular/material';
import { Component, AfterContentInit } from '@angular/core';
@Component({
    selector: 'app-introduction',
    template: ''
})
export class IntroductionComponent implements AfterContentInit {
    constructor(public dialog: MdDialog) {

    }

    ngAfterContentInit() {
        this.dialog.open(IntroductionDialogComponent, { disableClose: true, backdropClass: 'introduction-backdrop', width: '750px' });
    }
}