import { Directive, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[droppable]'
})
export class DroppableDirective implements OnInit {
    @Output() dropped: EventEmitter<any> = new EventEmitter();

    constructor(private _elementRef: ElementRef) { }

    ngOnInit() {
        let el = this._elementRef.nativeElement;

        // Add a style to indicate that this element is a drop target
        el.addEventListener('dragenter', (e) => {
            el.classList.add('drag-over');
        });

        // Remove the style
        el.addEventListener('dragleave', (e) => {
            el.classList.remove('drag-over');
        });

        el.addEventListener('dragover', (e) => {
            if (e.preventDefault) {
                e.preventDefault();
            }

            e.dataTransfer.dropEffect = 'move';
            return false;
        });

        // On drop, get the data and convert it back to a JSON object
        // and fire off an event passing the data
        el.addEventListener('drop', (e) => {
            if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
            }

            el.classList.remove('drag-over');
            let data = JSON.parse(e.dataTransfer.getData('text'));
            this.dropped.emit(data);
            return false;
        })
    }
}