import { Component } from '@angular/core';
import { Book } from '../../Services/book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-book',
  imports: [CommonModule],
  templateUrl: './list-book.html',
  styleUrl: './list-book.css',
})
export class ListBook {
  books: any[] = [];

  constructor(private bookService: Book) {}

  ngOnInit() {
    this.books = this.bookService.getBooks();
  }
}
