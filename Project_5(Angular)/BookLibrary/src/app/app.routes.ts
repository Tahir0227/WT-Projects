import { Routes } from '@angular/router';
import { ListBook } from '../Components/list-book/list-book';
import { AddBook } from '../Components/add-book/add-book';
import { Home } from '../Components/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'add', component: AddBook },
  { path: 'list', component: ListBook },
];
