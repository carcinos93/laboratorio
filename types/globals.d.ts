
import { Alpine as AlpineType } from 'alpinejs';

declare global {
  var Alpine: AlpineType;
  interface JQuery {
    select2(...args: any[]): JQuery;
  }

  interface AlpineComponent<T> {
    $el: HTMLInputElement;
    $data: T;
    $dispatch: (event: string, detail?: any) => void;
    $id: (name: string) => string;
    $nextTick: (callback: () => void) => Promise<void>;
    $watch: (property: string, callback: (value: any, oldValue: any) => void) => void;
    $store: (name: string) => any;
    $root: (name: string) => any;
    value: string;
    $refs: Record<string, HTMLElement>;
    init(): void;
  }
  interface Window {
    validaciones: Array<Object>;
    iconos: Array<{ name: string, icon: string }>;
    flatpickr: any;
  }
}

export { }