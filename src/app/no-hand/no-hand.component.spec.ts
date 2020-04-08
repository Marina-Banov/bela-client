import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoHandComponent } from './no-hand.component';

describe('NoHandComponent', () => {
  let component: NoHandComponent;
  let fixture: ComponentFixture<NoHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
