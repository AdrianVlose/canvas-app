import { Canvas } from './components/canvas.js';
import { Logger } from './components/logger.js';

export class App {
  public canvas: Canvas;
  public shapesSelectElement: HTMLSelectElement;
  public strokeSelectElement: HTMLSelectElement;
  public fillSelectElement: HTMLSelectElement;
  public colorInputElement: HTMLInputElement;
  public logger: Logger;

  constructor(
    canvasElement: HTMLCanvasElement,
    loggerElement: HTMLUListElement,
    shapesSelectElement: HTMLSelectElement,
    strokeSelectElement: HTMLSelectElement,
    fillSelectElement: HTMLSelectElement,
    colorInputElement: HTMLInputElement,
  ) {
    this.logger = new Logger(loggerElement);

    this.canvas = new Canvas(canvasElement, this.logger.boundUpdateLogger);
    this.shapesSelectElement = shapesSelectElement;
    this.strokeSelectElement = strokeSelectElement;
    this.fillSelectElement = fillSelectElement;
    this.colorInputElement = colorInputElement;
  }

  initialize() {
    this.shapesSelectElement.addEventListener(
      'change',
      this.canvas.boundShapeHandler,
    );

    this.strokeSelectElement.addEventListener(
      'change',
      this.canvas.boundStrokeHandler,
    );

    this.fillSelectElement.addEventListener(
      'change',
      this.canvas.boundIsFilledHandler,
    );

    this.colorInputElement.addEventListener(
      'change',
      this.canvas.boundColorHandler,
    );
  }

  updateLogger() {}
}
