import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeUsersComponent } from './arrange-users.component';

describe('ArrangeUsersComponent', () => {
  let component: ArrangeUsersComponent;
  let fixture: ComponentFixture<ArrangeUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangeUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
