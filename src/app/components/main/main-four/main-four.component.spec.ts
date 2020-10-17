import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFourComponent } from './main-four.component';

describe('TableComponent', () => {
  let component: MainFourComponent;
  let fixture: ComponentFixture<MainFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
