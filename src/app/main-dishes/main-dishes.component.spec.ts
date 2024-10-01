import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDishesComponent } from './main-dishes.component';

describe('MainDishesComponent', () => {
  let component: MainDishesComponent;
  let fixture: ComponentFixture<MainDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
