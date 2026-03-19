import * as THREE from 'three';
import { createGroundSurfaceNoiseField } from '@/rendering/groundSurfacePattern';

/**
 * Creates a richly shaded ground plane with procedurally generated color,
 * roughness, and normal textures. This avoids the need for a separate asset
 * download while still producing a believable mix of dirt and sparse grass.
 */
export function createGroundSurface(parameters: {
  readonly widthInWorldUnits: number;
  readonly depthInWorldUnits: number;
  readonly textureResolutionInPixels: number;
}): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> {
  const groundColorTexture = createGroundColorTexture(parameters.textureResolutionInPixels);
  const roughnessTexture = createRoughnessTexture(parameters.textureResolutionInPixels);
  const normalTexture = createNormalTexture(parameters.textureResolutionInPixels);

  groundColorTexture.colorSpace = THREE.SRGBColorSpace;

  const groundMaterial = new THREE.MeshPhysicalMaterial({
    map: groundColorTexture,
    roughnessMap: roughnessTexture,
    normalMap: normalTexture,
    metalness: 0,
    roughness: 1,
    clearcoat: 0.05,
    clearcoatRoughness: 0.95,
  });

  const groundGeometry = new THREE.PlaneGeometry(
    parameters.widthInWorldUnits,
    parameters.depthInWorldUnits,
  );
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;

  return groundMesh;
}

function createGroundColorTexture(textureResolutionInPixels: number): THREE.CanvasTexture {
  const noiseField = createGroundSurfaceNoiseField(textureResolutionInPixels);
  const colorCanvas = document.createElement('canvas');

  colorCanvas.width = textureResolutionInPixels;
  colorCanvas.height = textureResolutionInPixels;

  const drawingContext = colorCanvas.getContext('2d');

  if (drawingContext === null) {
    throw new Error('A 2D drawing context is required to generate the ground color texture.');
  }

  const imageData = drawingContext.createImageData(
    textureResolutionInPixels,
    textureResolutionInPixels,
  );

  for (let depthIndex = 0; depthIndex < textureResolutionInPixels; depthIndex += 1) {
    for (
      let horizontalIndex = 0;
      horizontalIndex < textureResolutionInPixels;
      horizontalIndex += 1
    ) {
      const normalizedNoise = noiseField[depthIndex]?.[horizontalIndex] ?? 0;
      const pixelStartIndex = (depthIndex * textureResolutionInPixels + horizontalIndex) * 4;
      const dirtWeight = 0.55 + normalizedNoise * 0.45;
      const grassWeight = 1 - dirtWeight;

      imageData.data[pixelStartIndex] = Math.round(82 * dirtWeight + 56 * grassWeight);
      imageData.data[pixelStartIndex + 1] = Math.round(67 * dirtWeight + 102 * grassWeight);
      imageData.data[pixelStartIndex + 2] = Math.round(42 * dirtWeight + 38 * grassWeight);
      imageData.data[pixelStartIndex + 3] = 255;
    }
  }

  drawingContext.putImageData(imageData, 0, 0);

  const colorTexture = new THREE.CanvasTexture(colorCanvas);

  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;
  colorTexture.repeat.set(4, 4);

  return colorTexture;
}

function createRoughnessTexture(textureResolutionInPixels: number): THREE.CanvasTexture {
  const noiseField = createGroundSurfaceNoiseField(textureResolutionInPixels);
  const roughnessCanvas = document.createElement('canvas');

  roughnessCanvas.width = textureResolutionInPixels;
  roughnessCanvas.height = textureResolutionInPixels;

  const drawingContext = roughnessCanvas.getContext('2d');

  if (drawingContext === null) {
    throw new Error('A 2D drawing context is required to generate the roughness texture.');
  }

  const imageData = drawingContext.createImageData(
    textureResolutionInPixels,
    textureResolutionInPixels,
  );

  for (let depthIndex = 0; depthIndex < textureResolutionInPixels; depthIndex += 1) {
    for (
      let horizontalIndex = 0;
      horizontalIndex < textureResolutionInPixels;
      horizontalIndex += 1
    ) {
      const normalizedNoise = noiseField[depthIndex]?.[horizontalIndex] ?? 0;
      const grayscaleValue = Math.round(190 + normalizedNoise * 50);
      const pixelStartIndex = (depthIndex * textureResolutionInPixels + horizontalIndex) * 4;

      imageData.data[pixelStartIndex] = grayscaleValue;
      imageData.data[pixelStartIndex + 1] = grayscaleValue;
      imageData.data[pixelStartIndex + 2] = grayscaleValue;
      imageData.data[pixelStartIndex + 3] = 255;
    }
  }

  drawingContext.putImageData(imageData, 0, 0);

  const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);

  roughnessTexture.wrapS = THREE.RepeatWrapping;
  roughnessTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.repeat.set(4, 4);

  return roughnessTexture;
}

function createNormalTexture(textureResolutionInPixels: number): THREE.CanvasTexture {
  const noiseField = createGroundSurfaceNoiseField(textureResolutionInPixels);
  const normalCanvas = document.createElement('canvas');

  normalCanvas.width = textureResolutionInPixels;
  normalCanvas.height = textureResolutionInPixels;

  const drawingContext = normalCanvas.getContext('2d');

  if (drawingContext === null) {
    throw new Error('A 2D drawing context is required to generate the normal texture.');
  }

  const imageData = drawingContext.createImageData(
    textureResolutionInPixels,
    textureResolutionInPixels,
  );

  for (let depthIndex = 0; depthIndex < textureResolutionInPixels; depthIndex += 1) {
    for (
      let horizontalIndex = 0;
      horizontalIndex < textureResolutionInPixels;
      horizontalIndex += 1
    ) {
      const sampleLeft = noiseField[depthIndex]?.[Math.max(0, horizontalIndex - 1)] ?? 0;
      const sampleRight =
        noiseField[depthIndex]?.[Math.min(textureResolutionInPixels - 1, horizontalIndex + 1)] ?? 0;
      const sampleUp = noiseField[Math.max(0, depthIndex - 1)]?.[horizontalIndex] ?? 0;
      const sampleDown =
        noiseField[Math.min(textureResolutionInPixels - 1, depthIndex + 1)]?.[horizontalIndex] ?? 0;

      const horizontalGradient = (sampleRight - sampleLeft) * 0.5;
      const depthGradient = (sampleDown - sampleUp) * 0.5;
      const normalVector = new THREE.Vector3(-horizontalGradient, 1, -depthGradient).normalize();
      const pixelStartIndex = (depthIndex * textureResolutionInPixels + horizontalIndex) * 4;

      imageData.data[pixelStartIndex] = Math.round((normalVector.x * 0.5 + 0.5) * 255);
      imageData.data[pixelStartIndex + 1] = Math.round((normalVector.y * 0.5 + 0.5) * 255);
      imageData.data[pixelStartIndex + 2] = Math.round((normalVector.z * 0.5 + 0.5) * 255);
      imageData.data[pixelStartIndex + 3] = 255;
    }
  }

  drawingContext.putImageData(imageData, 0, 0);

  const normalTexture = new THREE.CanvasTexture(normalCanvas);

  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(4, 4);

  return normalTexture;
}
