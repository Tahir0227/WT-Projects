import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Book {
  books: any[] = [];

  addBook(book: any) {
    this.books.push(book);
  }

  getBooks() {
    return this.books;
  }
}
