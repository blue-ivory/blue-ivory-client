import { Directive, ElementRef, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[ngModel][maskSpecialCharacter]',
    host: {
        '(ngModelChange)': 'onInputChange($event)',
        '(input)': 'onInputChange($event.target.value, true)'
    }
})
export class SpecialCharacterMaskDirective {
    constructor(public model: NgControl, public ele: ElementRef, public render: Renderer) { }

    onInputChange(event, backspace) {
        let position = this.ele.nativeElement.selectionStart;
        let value = event.replace(/[!$%^&*()+|~=`{}\[\]:";#@<>?,.\/\\]/gi, '');
        this.render.setElementProperty(this.ele.nativeElement, 'value', value);
        this.ele.nativeElement.selectionEnd = position;
    }
}