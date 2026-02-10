import { Rectangle } from '../utils/rectangle.js';
import { Circle } from '../utils/circle.js';
import { Square } from '../utils/square.js';

export enum ShapeType {
  Rectangle,
  Circle,
  Square,
}

export class ShapeFactory {
  private static registry: Record<number, new (x: number, y: number) => Shape> =
    {
      [ShapeType.Rectangle]: Rectangle,
      [ShapeType.Circle]: Circle,
      [ShapeType.Square]: Square,
    };

  static createShape(type: ShapeType, x: number, y: number): Shape {
    const ShapeClass = this.registry[type];
    if (!ShapeClass) throw new Error('Shape type not supported');
    return new ShapeClass(x, y);
  }
}
