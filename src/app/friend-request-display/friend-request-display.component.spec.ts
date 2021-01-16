import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestDisplayComponent } from './friend-request-display.component';

describe('FriendRequestDisplayComponent', () => {
  let component: FriendRequestDisplayComponent;
  let fixture: ComponentFixture<FriendRequestDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendRequestDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
