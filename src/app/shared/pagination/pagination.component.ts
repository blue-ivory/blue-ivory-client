import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input('collectionSize') collectionSize: number;
  @Input('pageSize') pageSize: number = 10;
  @Input('page') page: number = 1;
  @Input('pagesRange') pagesRange: number = 3;
  @Output('onPageChange') onPageChange: EventEmitter<number>;
  private pages: Observable<number[]>;
  private totalPages: number;

  constructor() {
    this.onPageChange = new EventEmitter<number>();
  }

  ngOnInit() {
    this.page = +this.page;
    this.totalPages = this.getTotalPagesAmount();
    this.pages = this.getPages();
  }

  ngOnChanges() {
    this.pages = this.getPages();
  }

  private getTotalPagesAmount(): number {
    return Math.ceil(Math.max(this.collectionSize, 1) / Math.max(this.pageSize, 1));
  }

  private isValidPageNumber(page: number): boolean {
    return page > 0 && page <= this.totalPages;
  }

  private getPages(): Observable<number[]> {
    this.totalPages = this.getTotalPagesAmount();
    return Observable.range(-this.pagesRange, this.pagesRange * 2 + 1)
      .map(offset => (+this.page) + (+offset))
      .filter(page => this.isValidPageNumber(page))
      .toArray();
  }

  public setPage(page) {
    this.page = page;
    this.onPageChange.emit(this.page);
    this.pages = this.getPages();
  }

  public prevPage() {
    if (this.isValidPageNumber(this.page - 1)) {
      this.setPage(this.page - 1);
    }
  }

  public nextPage() {
    if (this.isValidPageNumber(this.page + 1)) {
      this.setPage(this.page + 1);
    }
  }
}
