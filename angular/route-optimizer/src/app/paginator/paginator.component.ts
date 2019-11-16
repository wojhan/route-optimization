import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Page } from '../pagination';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() page: Page<any>;
  @Output() pageChange = new EventEmitter<string>();

  counter = Array;

  pagesFirst = [];
  pagesBefore = [];
  pagesLast = [];
  currentPage = 1;
  pagesAfter = [];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.page) {
      const totalPages = Math.ceil(this.page.count / 40);
      this.pagesFirst = [];
      this.pagesBefore = [];
      this.pagesAfter = [];
      this.pagesLast = [];

      if (!this.page.previous) {
        this.currentPage = 1;
      }

      if (this.page.previous) {
        const previousPageUrl = this.page.previous;
        const pageStringMatch = previousPageUrl.match(/page=(.?)+&/);
        let pagesCounter = 1;
        if (pageStringMatch) {
          pagesCounter = parseInt(pageStringMatch[0].slice(5, pageStringMatch[0].length - 1), 10);
        }

        this.currentPage = pagesCounter + 1;
        if (this.currentPage >= 5) {
          this.pagesFirst = [1, 2, 3];
        }

        let startIndex = pagesCounter - 2;
        let endIndex = startIndex + 2;

        if (startIndex < 1) {
          startIndex = 1;
        }

        if (startIndex <= this.pagesFirst[2]) {
          startIndex = 4;
        }

        if (endIndex >= this.currentPage) {
          endIndex = this.currentPage - 1;
        }

        for (let i = startIndex; i <= endIndex; i++) {
          this.pagesBefore.push(i);
        }
      }

      if (this.page.next) {
        const nextPageUrl = this.page.next;
        const nextPage = parseInt(nextPageUrl.match(/page=(.?)/)[1], 10);

        const startIndex = this.currentPage + 1;
        let endIndex = startIndex + 2;

        if (this.currentPage <= totalPages - 3) {
          for (let i = totalPages - 2; i <= totalPages; i++) {
            this.pagesLast.push(i);
          }
        } else {
          for (let i = this.currentPage + 1; i <= totalPages; i++) {
            this.pagesLast.push(i);
          }
        }

        if (startIndex <= this.pagesLast[0]) {
          if (endIndex >= this.pagesLast[0]) {
            endIndex = this.pagesLast[0] - 1;
          }
          for (let i = startIndex; i <= endIndex; i++) {
            this.pagesAfter.push(i);
          }
        }
      }
    }
  }
}
