declare module 'three/webgpu' {
  import type { WebGLRenderer, WebGLRendererParameters } from 'three';

  export class WebGPURenderer extends WebGLRenderer {
    public constructor(parameters?: WebGLRendererParameters & { forceWebGL?: boolean });
    public init(): Promise<void>;
  }
}

declare module 'three/addons/controls/OrbitControls.js' {
  export { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
}

declare module 'three/addons/objects/Sky.js' {
  export { Sky } from 'three/examples/jsm/objects/Sky.js';
}
