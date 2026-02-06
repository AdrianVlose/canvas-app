export class Logger {
  protected loggerElement: HTMLUListElement;
  protected color: string;
  protected lineWidth: number;
  protected isShapeFilled: boolean;
  protected numberOfShapes: number;

  public boundUpdateLogger: (
    field: string,
    value: number | string | boolean,
  ) => void;

  constructor(loggerElement: HTMLUListElement) {
    this.loggerElement = loggerElement;
    this.color = '#000000';
    this.lineWidth = 3;
    this.isShapeFilled = false;
    this.numberOfShapes = 0;

    this.boundUpdateLogger = this.updateLogger.bind(this);
  }

  updateLogger(field: string, value: number | string | boolean) {
    switch (field) {
      case 'color':
        if (typeof value === 'string') {
          this.color = value;
          this.renderLoggerInformation();
        }
        break;

      case 'numberOfShapes':
        if (typeof value === 'number') {
          this.numberOfShapes = value;
          this.renderLoggerInformation();
        }
        break;

      case 'lineWidth':
        if (typeof value === 'number') {
          this.updateLineWidth(value);
          this.renderLoggerInformation();
        }
        break;

      case 'isFilled':
        if (typeof value === 'boolean') {
          this.isShapeFilled = value;
          this.renderLoggerInformation();
        }
        break;
        
      default:
        return;
    }
  }

  updateLineWidth(value: number) {
    switch (value) {
      case 0:
        this.lineWidth = 3;
        break;

      case 1:
        this.lineWidth = 5;
        break;

      case 2:
        this.lineWidth = 10;
        break;

      default:
        return;
    }
  }

  renderLoggerInformation() {
    const numberOfShapesListElement = this.loggerElement.children.namedItem(
      'number-of-shapes',
    ) as HTMLLIElement | null;

    if (numberOfShapesListElement) numberOfShapesListElement.textContent = `Number of Shapes created: ${this.numberOfShapes}`;

    const currentColorListElement = this.loggerElement.children.namedItem(
      'current-color',
    ) as HTMLLIElement | null;

    if (currentColorListElement) currentColorListElement.textContent = `Current color: ${this.color}`;

    const currentLineWidthListElement = this.loggerElement.children.namedItem(
      'current-line-size',
    ) as HTMLLIElement | null;

    if (currentLineWidthListElement) currentLineWidthListElement.textContent = `Current line width: ${this.lineWidth}px`;

    const CurrentIsFilledShapeElement = this.loggerElement.children.namedItem(
      'current-filled',
    ) as HTMLLIElement | null;

    if (CurrentIsFilledShapeElement) CurrentIsFilledShapeElement.textContent = `Current shape to be filled: ${this.isShapeFilled}`;
  }
}
