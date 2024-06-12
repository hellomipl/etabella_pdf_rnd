import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableRectangleComponent } from './resizable-rectangle.component';

describe('ResizableRectangleComponent', () => {
  let component: ResizableRectangleComponent;
  let fixture: ComponentFixture<ResizableRectangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableRectangleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResizableRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
