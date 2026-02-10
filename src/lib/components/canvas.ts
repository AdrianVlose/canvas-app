import type { Point2D } from '../types.js';
import { Shape } from '../utils/shape.js';
import { ShapeType } from './shape-factory.js';
import { DrawTool, MoveTool } from './draw-tool.js';
import type { CanvasTool } from './draw-tool.js';

export class Canvas {
  public shapes: Shape[] = [];
  public shapeType: ShapeType = ShapeType.Rectangle;
  public color: string = '#000000';
  public lineSize: number = 0;
  public isFilled: boolean = false;

  private currentTool: CanvasTool;
  private drawTool = new DrawTool();
  private moveTool = new MoveTool();

  constructor(
    public canvasElement: HTMLCanvasElement,
    private updateLogger: Function,
  ) {
    this.currentTool = this.drawTool;
    this.bindEvents();
  }

  getRelativeCoords(event: MouseEvent): Point2D {
    const rect = this.canvasElement.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  private bindEvents() {
    this.canvasElement.addEventListener('mousedown', (e) => {
      // Logic to decide tool: if clicking a shape, use MoveTool, else DrawTool
      const coords = this.getRelativeCoords(e);
      const isOverShape = this.shapes.some((s) =>
        s.checkIfPointIsInside(coords),
      );

      this.currentTool = isOverShape ? this.moveTool : this.drawTool;
      this.currentTool.onMouseDown(e, this);

      const move = (me: MouseEvent) => {
        this.clearCanvas();
        this.currentTool.onMouseMove(me, this);
        this.redraw();
      };

      const up = (ue: MouseEvent) => {
        this.currentTool.onMouseUp(ue, this);
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
        this.updateLogger('numberOfShapes', this.shapes.length);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    });
  }

  clearCanvas() {
    const ctx = this.canvasElement.getContext('2d');
    ctx?.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  redraw() {
    const ctx = this.canvasElement.getContext('2d');
    if (ctx) this.shapes.forEach((s) => s.draw(ctx));
  }
}
