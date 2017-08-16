import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective {
    @Input('draggable') data: any;
    private target = false;

    constructor(private _elementRef: ElementRef) { }

    ngOnInit() {
        // Get the current element
        let handle = this._elementRef.nativeElement;
        let dragSurface = this._elementRef.nativeElement;

        // Set the draggable attribute to the element
        dragSurface.draggable = 'true';

        dragSurface.addEventListener('mousedown', (e) => this.target = e.target);
        // Set up the dragstart event and add the drag-src CSS class 
        // to change the visual appearance. Set the current todo as the data
        // payload by stringifying the object first
        dragSurface.addEventListener('dragstart', (e) => {
            if (handle.contains(this.target)) {

                let cloned = dragSurface.cloneNode(true);
                cloned.style.display = "none";
                e.dataTransfer.setDragImage(cloned, 0, 0);
                dragSurface.classList.add('dragged-element')
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text', JSON.stringify(this.data));
            } else {
                e.preventDefault();
            }
        });

        // Remove the drag-src class
        dragSurface.addEventListener('dragend', (e) => {
            e.preventDefault();
            dragSurface.classList.remove('dragged-element')
        });
    }
}