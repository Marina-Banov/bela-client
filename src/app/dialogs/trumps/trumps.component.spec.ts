import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrumpsComponent } from './trumps.component';

describe('TrumpsComponent', () => {
  let component: TrumpsComponent;
  let fixture: ComponentFixture<TrumpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrumpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
