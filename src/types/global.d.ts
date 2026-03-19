export {};

declare global {
  interface Window {
    __GWANYAN_DIAGNOSTICS__?: {
      getBufferedEntries: () => unknown[];
      downloadBufferedEntries: () => void;
    };
  }
}
