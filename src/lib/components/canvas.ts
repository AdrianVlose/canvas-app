import type { Point2D } from '../types.js';
import { Rectangle } from '../utils/rectangle.js';
import { Shape } from '../utils/shape.js';
import { Circle } from '../utils/circle.js';
import { Square } from '../utils/square.js';

export class Canvas {
  public canvasElement: HTMLCanvasElement;
  public canvasContext: CanvasRenderingContext2D | null;
  public canvasTopLeftCorner: Point2D;
  public startPointForDrawing: Point2D;
  public lastMouseCoordsOnCircleDrag: Point2D;
  public shapes: Shape[];
  public shapeIndex: number;
  public isDrawMode: boolean;
  public offset: Point2D;
  public color: string;
  public lineSize: number;
  public isFilled: boolean;
  public shapeType: number;

  public boundMouseMove: (event: MouseEvent) => void;
  public boundMouseUp: (event: MouseEvent) => void;
  public boundShapeHandler: (event: Event) => void;
  public boundStrokeHandler: (event: Event) => void;
  public boundIsFilledHandler: (event: Event) => void;
  public boundColorHandler: (event: Event) => void;

  protected updateLogger: (
    field: string,
    value: number | string | boolean,
  ) => void;

  constructor(
    canvasElement: HTMLCanvasElement,
    boundUpdateLogger: (
      field: string,
      value: number | string | boolean,
    ) => void,
  ) {
    this.updateLogger = boundUpdateLogger;
    this.canvasElement = canvasElement;
    this.canvasContext = canvasElement.getContext('2d');
    this.shapes = [];
    this.shapeIndex = -1;
    this.color = '#000000';
    this.lineSize = 0;
    this.isFilled = false;
    this.shapeType = 0;
    this.isDrawMode = true;

    const canvasArea = this.canvasElement.getBoundingClientRect();
    this.canvasTopLeftCorner = { x: canvasArea.left, y: canvasArea.top };
    this.startPointForDrawing = { x: 0, y: 0 };
    this.lastMouseCoordsOnCircleDrag = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    
    this.boundMouseMove = this.mouseMoveInCanvasHandler.bind(this);
    this.boundMouseUp = this.mouseUpInCanvasHandler.bind(this);
    this.boundShapeHandler = this.selectShapeHandler.bind(this);
    this.boundStrokeHandler = this.selectStrokeHandler.bind(this);
    this.boundIsFilledHandler = this.selectFillHandler.bind(this);
    this.boundColorHandler = this.inputColorHandler.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.canvasElement.addEventListener(
      'mousedown',
      this.mouseDownInCanvasHandler.bind(this),
    );
  }

  selectShapeHandler(event: Event) {
    const eventTarget = event.target as HTMLSelectElement;

    this.shapeType = Number(eventTarget.value);
  }

  selectStrokeHandler(event: Event) {
    const eventTarget = event.target as HTMLSelectElement;
    this.lineSize = Number(eventTarget.value);

    this.updateLogger('lineWidth', this.lineSize);
  }

  selectFillHandler(event: Event) {
    const eventTarget = event.target as HTMLSelectElement;
    this.isFilled = Number(eventTarget.value) ? true : false;

    this.updateLogger('isFilled', this.isFilled);
  }

  inputColorHandler(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    this.color = eventTarget.value;

    this.updateLogger('color', this.color);
  }

  mouseDownInCanvasHandler(event: MouseEvent) {
    this.startPointForDrawing.x = event.clientX - this.canvasTopLeftCorner.x;
    this.startPointForDrawing.y = event.clientY - this.canvasTopLeftCorner.y;
    this.lastMouseCoordsOnCircleDrag.x =
      event.clientX - this.canvasTopLeftCorner.x;
    this.lastMouseCoordsOnCircleDrag.y =
      event.clientY - this.canvasTopLeftCorner.y;
    this.getModeForCanvas();

    this.canvasElement.addEventListener('mousemove', this.boundMouseMove);
    this.canvasElement.addEventListener('mouseup', this.boundMouseUp);
  }

  getModeForCanvas() {
    this.shapes.toReversed().forEach((shape, index) => {
      const pointForChecking: Point2D = {
        x: this.startPointForDrawing.x,
        y: this.startPointForDrawing.y,
      };

      if (
        this.shapeIndex === -1 &&
        shape.checkIfPointIsInside(pointForChecking)
      ) {
        this.shapeIndex = index;
        this.offset.x = this.startPointForDrawing.x - shape.startPointX;
        this.offset.y = this.startPointForDrawing.y - shape.startPointY;

        this.shapes.splice(this.shapes.length - 1 - index, 1);
        this.shapes.push(shape);

        this.isDrawMode = false;
      }
    });

    if (this.isDrawMode) this.createShape();
    
  }

  createShape() {
    switch (this.shapeType) {
      case 0:
        const rectangle = new Rectangle(
          this.startPointForDrawing.x,
          this.startPointForDrawing.y,
        );
        rectangle.setColor = this.color;
        rectangle.setLineSize = this.lineSize;
        rectangle.setIsShapeFilled = this.isFilled;
        this.shapes.push(rectangle);
        break;

      case 1:
        const circle = new Circle(
          this.startPointForDrawing.x,
          this.startPointForDrawing.y,
        );
        circle.setColor = this.color;
        circle.setLineSize = this.lineSize;
        circle.setIsShapeFilled = this.isFilled;
        this.shapes.push(circle);
        break;

      case 2:
        const square = new Square(
          this.startPointForDrawing.x,
          this.startPointForDrawing.y,
        );
        square.setColor = this.color;
        square.setLineSize = this.lineSize;
        square.setIsShapeFilled = this.isFilled;
        this.shapes.push(square);
        break;

      default: 
        return;
    }

    this.updateLogger('numberOfShapes', this.shapes.length);
  }

  mouseMoveInCanvasHandler(event: MouseEvent) {
    const currentCanvasX = event.clientX - this.canvasTopLeftCorner.x;
    const currentCanvasY = event.clientY - this.canvasTopLeftCorner.y;

    this.clearCanvas();

    if (!this.isDrawMode) {
      const startPointX = currentCanvasX - this.offset.x;
      const startPointY = currentCanvasY - this.offset.y;
      const lastShape = this.shapes.at(-1);

      if (lastShape instanceof Circle) {
        const mouseOffsetX =
          currentCanvasX - this.lastMouseCoordsOnCircleDrag.x;
        const mouseOffsetY =
          currentCanvasY - this.lastMouseCoordsOnCircleDrag.y;
        this.lastMouseCoordsOnCircleDrag.x = currentCanvasX;
        this.lastMouseCoordsOnCircleDrag.y = currentCanvasY;
        lastShape.dragShape(mouseOffsetX, mouseOffsetY);

      } else {
        lastShape?.dragShape(startPointX, startPointY);
      }
    } else {
      const lastShape = this.shapes.at(-1);
      lastShape?.setNewEndCoords(currentCanvasX, currentCanvasY);
    }

    this.redraw();
  }

  mouseUpInCanvasHandler(event: MouseEvent) {
    event.stopPropagation();

    this.canvasElement.removeEventListener('mousemove', this.boundMouseMove);
    this.canvasElement.removeEventListener('mouseup', this.boundMouseUp);

    if (!this.isDrawMode) {
      this.isDrawMode = true;
      this.shapeIndex = -1;
    }
  }

  clearCanvas() {
    this.canvasContext?.clearRect(0, 0, 900, 700);
  }

  redraw() {
    this.shapes.forEach((shape) => {
      if (this.canvasContext) shape.draw(this.canvasContext);
    });
  }
}
