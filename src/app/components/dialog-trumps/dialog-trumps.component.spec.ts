import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTrumpsComponent } from './dialog-trumps.component';

describe('DialogTrumpsComponent', () => {
  let component: DialogTrumpsComponent;
  let fixture: ComponentFixture<DialogTrumpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTrumpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTrumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
