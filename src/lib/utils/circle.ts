import type { Point2D } from '../types.js';
import { Shape } from './shape.js';

export class Circle extends Shape {
  protected radius: number;
  protected centerX: number;
  protected centerY: number;
  constructor(startX: number, startY: number) {
    super(startX, startY);
    this.radius = 0;
    this.centerX = startX;
    this.centerY = startY;
  }
  override checkIfPointIsInside(point: Point2D): boolean {
    const differenceOnX = this.centerX - point.x;
    const differenceOnY = this.centerY - point.y;
    const squaredDistance =
      differenceOnX * differenceOnX + differenceOnY * differenceOnY;
    const squaredRadius = this.radius * this.radius;
    return squaredDistance < squaredRadius;
  }

  override dragShape(newStartX: number, newStartY: number): void {
    this.startX += newStartX;
    this.startY += newStartY;
    this.centerX += newStartX;
    this.centerY += newStartY;
    this.endX += newStartX;
    this.endY += newStartY;
  }

  override setNewEndCoords(x: number, y: number) {
    this.endX = x;
    this.endY = y;
    this.centerX = (this.startX + this.endX) / 2;
    this.centerY = (this.startY + this.endY) / 2;
    const differenceOnX = this.centerX - this.startX;
    const differenceOnY = this.centerY - this.startY;
    this.radius = Math.sqrt(
      Math.pow(differenceOnX, 2) + Math.pow(differenceOnY, 2),
    );
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    if (this.isShapeFilled) {
      context.lineWidth = 1;
      context.fillStyle = this.color;
      context.arc(
        this.centerX,
        this.centerY,
        this.radius,
        0,
        Math.PI * 2,
        false,
      );
      context.fill();
    } else {
      context.strokeStyle = this.color;
      context.lineWidth = this.lineSize;
      context.arc(
        this.centerX,
        this.centerY,
        this.radius,
        0,
        Math.PI * 2,
        false,
      );
      context.stroke();
    }
    context.closePath();
  }
}
