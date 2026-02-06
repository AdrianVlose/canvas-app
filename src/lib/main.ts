import { App } from './app.js';
export const Main = () => {
  const canvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
  const loggerElement = document.querySelector(
    '#informations',
  ) as HTMLUListElement;
  const shapesSelectElement = document.querySelector(
    '#shapes-select',
  ) as HTMLSelectElement;
  const strokeSelectElement = document.querySelector(
    '#stroke-select',
  ) as HTMLSelectElement;
  const fillSelectElement = document.querySelector(
    '#fill-select',
  ) as HTMLSelectElement;
  const colorInputElement = document.querySelector(
    '#shape-color',
  ) as HTMLInputElement;

  const app = new App(
    canvasElement,
    loggerElement,
    shapesSelectElement,
    strokeSelectElement,
    fillSelectElement,
    colorInputElement,
  );
  
  app.initialize();
};
