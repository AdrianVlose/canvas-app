import { Canvas } from './canvas.js';
import { ShapeFactory } from './shape-factory.js';
import type { Point2D } from '../types.js';
import { Shape } from '../utils/shape.js';

export interface CanvasTool {
  onMouseDown(event: MouseEvent, canvas: Canvas): void;
  onMouseMove(event: MouseEvent, canvas: Canvas): void;
  onMouseUp(event: MouseEvent, canvas: Canvas): void;
}

// Concrete Strategy for Drawing
export class DrawTool implements CanvasTool {
  onMouseDown(event: MouseEvent, canvas: Canvas) {
    const { x, y } = canvas.getRelativeCoords(event);
    const shape = ShapeFactory.createShape(canvas.shapeType, x, y);

    shape.setColor = canvas.color;
    shape.setLineSize = canvas.lineSize;
    shape.setIsShapeFilled = canvas.isFilled;

    canvas.shapes.push(shape);
  }

  onMouseMove(event: MouseEvent, canvas: Canvas) {
    const { x, y } = canvas.getRelativeCoords(event);
    canvas.shapes.at(-1)?.setNewEndCoords(x, y);
  }

  onMouseUp() {}
}

// Concrete Strategy for Moving
export class MoveTool implements CanvasTool {
  private targetShape: Shape | null = null;
  private offset: Point2D = { x: 0, y: 0 };

  onMouseDown(event: MouseEvent, canvas: Canvas) {
    const { x, y } = canvas.getRelativeCoords(event);
    // Find shape from top to bottom
    const foundIndex = canvas.shapes.findLastIndex((s) =>
      s.checkIfPointIsInside({ x, y }),
    );

    if (foundIndex !== -1) {
      this.targetShape = canvas.shapes.splice(foundIndex, 1)[0];
      canvas.shapes.push(this.targetShape); // Bring to front
      this.offset = {
        x: x - this.targetShape.startPointX,
        y: y - this.targetShape.startPointY,
      };
    }
  }

  onMouseMove(event: MouseEvent, canvas: Canvas) {
    if (!this.targetShape) return;
    const { x, y } = canvas.getRelativeCoords(event);
    this.targetShape.dragShape(x - this.offset.x, y - this.offset.y);
  }

  onMouseUp() {
    this.targetShape = null;
  }
}
