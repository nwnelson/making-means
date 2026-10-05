declare module "@meforma/vue-toaster" {
  import type { VNode } from "vue";

  export interface ToastOptions {
    position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";
    type?: string;
    maxToasts?: number | boolean;
    duration?: number | boolean;
    dismissible?: boolean;
    queue?: boolean;
    pauseOnHover?: boolean;
    useDefaultCss?: boolean;
    onClose?: () => void;
    onClick?: () => void;
  }

  export interface ToastHandle {
    vNode: VNode;
    el: HTMLElement;
    destroy(): void;
  }

  export interface Toaster {
    show(message: string, options?: ToastOptions): ToastHandle;
    success(message: string, options?: ToastOptions): ToastHandle;
    error(message: string, options?: ToastOptions): ToastHandle;
    info(message: string, options?: ToastOptions): ToastHandle;
    warning(message: string, options?: ToastOptions): ToastHandle;
    clear(): void;
  }

  export function createToaster(options?: ToastOptions): Toaster;
}
