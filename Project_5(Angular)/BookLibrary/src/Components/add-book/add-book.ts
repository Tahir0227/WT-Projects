import { Component } from '@angular/core';
import { Book } from '../../Services/book';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-book',
  imports: [FormsModule],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
})
export class AddBook {
  book = {
    title: '',
    author: '',
    price: '',
  };

  constructor(private bookService: Book) {}

  addBook() {
    this.bookService.addBook(this.book);
    alert('Book Added!');

    this.book = { title: '', author: '', price: '' };
  }
}
