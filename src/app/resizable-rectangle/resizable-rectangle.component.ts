import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-resizable-rectangle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resizable-rectangle.component.html',
  styleUrl: './resizable-rectangle.component.scss'
})
export class ResizableRectangleComponent {
  rect: { x: number; y: number; width: number; height: number } = null as any;
  isDrawing = false;
  isDragging = false;
  isResizing = false;
  startX = 0;
  startY = 0;
  resizeDirection: any = null;

  get resizeHandles() {
    if (!this.rect) {
      return [];
    }
    const { x, y, width, height } = this.rect;
    return [
      { cx: x, cy: y, position: 'top-left' },
      { cx: x + width / 2, cy: y, position: 'top' },
      { cx: x + width, cy: y, position: 'top-right' },
      { cx: x + width, cy: y + height / 2, position: 'right' },
      { cx: x + width, cy: y + height, position: 'bottom-right' },
      { cx: x + width / 2, cy: y + height, position: 'bottom' },
      { cx: x, cy: y + height, position: 'bottom-left' },
      { cx: x, cy: y + height / 2, position: 'left' }
    ];
  }

  startDrawing(event: MouseEvent) {
    if (!this.rect) {
      this.isDrawing = true;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
      this.rect = { x: this.startX, y: this.startY, width: 0, height: 0 };
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      this.updateRectSize(event.offsetX, event.offsetY);
    } else if (this.isDragging) {
      const dx = event.offsetX - this.startX;
      const dy = event.offsetY - this.startY;
      this.rect.x += dx;
      this.rect.y += dy;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
    } else if (this.isResizing) {
      this.resizeRectangle(event.offsetX, event.offsetY);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isDrawing = false;
    this.isDragging = false;
    this.isResizing = false;
    this.resizeDirection = null;
  }

  startDragging(event: MouseEvent) {
    event.stopPropagation();
    this.isDragging = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

  startResizing(event: MouseEvent, direction: string) {
    event.stopPropagation();
    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

  updateRectSize(mouseX: number, mouseY: number) {
    const width = Math.abs(mouseX - this.startX);
    const height = Math.abs(mouseY - this.startY);

    const x = Math.min(mouseX, this.startX);
    const y = Math.min(mouseY, this.startY);

    this.rect = { x, y, width, height };
  }

  resizeRectangle(mouseX: number, mouseY: number) {
    const dx = mouseX - this.startX;
    const dy = mouseY - this.startY;

    switch (this.resizeDirection) {
      case 'top-left':
        this.rect.width -= dx;
        this.rect.height -= dy;
        this.rect.x += dx;
        this.rect.y += dy;
        break;
      case 'top':
        this.rect.height -= dy;
        this.rect.y += dy;
        break;
      case 'top-right':
        this.rect.width += dx;
        this.rect.height -= dy;
        this.rect.y += dy;
        break;
      case 'right':
        this.rect.width += dx;
        break;
      case 'bottom-right':
        this.rect.width += dx;
        this.rect.height += dy;
        break;
      case 'bottom':
        this.rect.height += dy;
        break;
      case 'bottom-left':
        this.rect.width -= dx;
        this.rect.height += dy;
        this.rect.x += dx;
        break;
      case 'left':
        this.rect.width -= dx;
        this.rect.x += dx;
        break;
    }

    this.startX = mouseX;
    this.startY = mouseY;

    // Ensure width and height are positive
    if (this.rect.width < 0) {
      this.rect.width = Math.abs(this.rect.width);
      this.rect.x -= this.rect.width;
    }
    if (this.rect.height < 0) {
      this.rect.height = Math.abs(this.rect.height);
      this.rect.y -= this.rect.height;
    }
  }
}
