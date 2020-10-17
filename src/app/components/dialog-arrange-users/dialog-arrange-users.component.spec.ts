import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogArrangeUsersComponent } from './dialog-arrange-users.component';

describe('DialogArrangeUsersComponent', () => {
  let component: DialogArrangeUsersComponent;
  let fixture: ComponentFixture<DialogArrangeUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogArrangeUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogArrangeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
