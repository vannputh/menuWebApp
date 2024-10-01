import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideDishesComponent } from './side-dishes.component';

describe('SideDishesComponent', () => {
  let component: SideDishesComponent;
  let fixture: ComponentFixture<SideDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideDishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
