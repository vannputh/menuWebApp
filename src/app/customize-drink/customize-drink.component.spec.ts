import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeDrinkComponent } from './customize-drink.component';

describe('CustomizeDrinkComponent', () => {
  let component: CustomizeDrinkComponent;
  let fixture: ComponentFixture<CustomizeDrinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeDrinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
