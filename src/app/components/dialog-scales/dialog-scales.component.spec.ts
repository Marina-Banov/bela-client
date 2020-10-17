import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogScalesComponent } from './dialog-scales.component';

describe('DialogScalesComponent', () => {
  let component: DialogScalesComponent;
  let fixture: ComponentFixture<DialogScalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogScalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogScalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
