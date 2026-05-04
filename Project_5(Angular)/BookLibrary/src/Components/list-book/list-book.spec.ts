import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBook } from './list-book';

describe('ListBook', () => {
  let component: ListBook;
  let fixture: ComponentFixture<ListBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBook],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
