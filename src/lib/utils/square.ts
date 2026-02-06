import type { Point2D } from '../types.js';
import { Shape } from './shape.js';

export class Square extends Shape {
  protected width: number;
  constructor(startX: number, startY: number) {
    super(startX, startY);
    this.width = 1;
  }
  override checkIfPointIsInside(point: Point2D): boolean {
    const topLeftX = Math.min(this.startX, this.endX);
    const topLeftY = Math.min(this.startY, this.endY);
    if (
      point.x >= topLeftX &&
      point.x <= topLeftX + this.width &&
      point.y >= topLeftY &&
      point.y <= topLeftY + this.width
    ) {
      return true;
    }
    return false;
  }

  override setNewEndCoords(x: number, y: number) {
    this.endX = x;
    this.endY = y;
    this.width = Math.abs(this.endX - this.startX);
  }

  override draw(context: CanvasRenderingContext2D): void {
    const topLeftX = Math.min(this.startX, this.endX);
    const topLeftY = Math.min(this.startY, this.endY);
    context.beginPath();
    if (this.isShapeFilled) {
      context.fillStyle = this.color;
      context.fillRect(topLeftX, topLeftY, this.width, this.width);
    } else {
      context.strokeStyle = this.color;
      context.lineWidth = this.lineSize;
      context.strokeRect(topLeftX, topLeftY, this.width, this.width);
    }
    context.closePath();
  }
}
