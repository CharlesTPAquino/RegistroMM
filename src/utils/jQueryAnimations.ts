import 'jquery';
import 'jquery.transit';

declare global {
  interface Window {
    $: JQuery;
    jQuery: JQuery;
  }
}

export const animateLabel = (element: HTMLElement, x: string, duration: number = 500) => {
  window.$(element).transition({ x }, duration, 'ease');
};

export const animateIcon = (element: HTMLElement, x: string, duration: number = 500) => {
  window.$(element).transition({ x }, duration, 'ease');
};

export const addPenAnimation = (element: HTMLElement) => {
  setTimeout(() => {
    element.classList.add('move-pen');
  }, 100);
};

export const removePenAnimation = (element: HTMLElement) => {
  element.classList.remove('move-pen');
};
