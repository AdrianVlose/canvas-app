import type { Point2D } from '../types';

export class Shape {
  protected startX: number;
  protected startY: number;
  protected endX: number;
  protected endY: number;

  protected color: string;
  protected lineSize: number;
  protected isShapeFilled: boolean;

  constructor(startX: number, startY: number) {
    this.startX = startX;
    this.startY = startY;
    this.endX = startX;
    this.endY = startY;
    this.color = '';
    this.lineSize = 0;
    this.isShapeFilled = false;
  }

  checkIfPointIsInside(point: Point2D): boolean {
    if (
      (this.startX <= point.x && this.endX >= point.x) ||
      (this.startX <= point.x && this.endX >= point.x)
    ) return true;

    return false;
  }

  dragShape(newStartX: number, newStartY: number) {
    this.startX = newStartX;
    this.startY = newStartY;
  }

  setNewEndCoords(x: number, y: number) {
    this.endX = x;
    this.endY = y;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.startX, this.startY);
    context.lineTo(this.endX, this.endY);
    context.stroke();
    context.closePath();
  }

  public get startPointX() {
    return this.startX;
  }

  public get startPointY() {
    return this.startY;
  }

  public get endPointX() {
    return this.endX;
  }

  public get endPointY() {
    return this.endY;
  }

  public set setColor(color: string) {
    this.color = color;
  }

  public set setLineSize(type: number) {
    switch (type) {
      case 0:
        this.lineSize = 3;
        break;
      case 1:
        this.lineSize = 5;
        break;
      case 2:
        this.lineSize = 10;
        break;
      default:
        return;
    }
  }

  public set setIsShapeFilled(isFilled: boolean) {
    this.isShapeFilled = isFilled;
  }
}
