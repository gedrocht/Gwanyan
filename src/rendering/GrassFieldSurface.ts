import * as THREE from 'three';
import type { GrassPatchSimulationState } from '@/simulation/GrassPatchPhysicsSimulation';
import type { PlanarVector } from '@/simulation/WindFieldModel';

interface GrassBladeDescriptor {
  readonly patchIdentifier: number;
  readonly rootHorizontalPositionInWorldUnits: number;
  readonly rootDepthPositionInWorldUnits: number;
  readonly heightInWorldUnits: number;
  readonly widthInWorldUnits: number;
  readonly facingAngleInRadians: number;
  readonly color: THREE.Color;
  readonly swayPhaseInRadians: number;
}

/**
 * GrassFieldSurface owns the renderable mesh for every blade of grass. The
 * geometry is updated on the CPU each frame so that the same scene can run on
 * both the WebGPU renderer and the automatic WebGL fallback without needing a
 * custom shader language branch for each backend.
 */
export class GrassFieldSurface {
  public readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;

  private readonly bladeDescriptors: GrassBladeDescriptor[];

  private readonly segmentsPerBlade: number;

  private readonly positionAttribute: THREE.BufferAttribute;

  private readonly normalAttribute: THREE.BufferAttribute;

  private readonly verticesPerBlade: number;

  /**
   * Creates the dynamic grass mesh and seeds its static geometry attributes.
   */
  public constructor(parameters: {
    readonly bladeCount: number;
    readonly segmentsPerBlade: number;
    readonly patchStates: GrassPatchSimulationState[];
    readonly minimumBladeHeightInWorldUnits: number;
    readonly maximumBladeHeightInWorldUnits: number;
    readonly minimumBladeWidthInWorldUnits: number;
    readonly maximumBladeWidthInWorldUnits: number;
    readonly groundWidthInWorldUnits: number;
    readonly groundDepthInWorldUnits: number;
  }) {
    this.segmentsPerBlade = parameters.segmentsPerBlade;
    this.verticesPerBlade = (parameters.segmentsPerBlade + 1) * 2;
    this.bladeDescriptors = this.createBladeDescriptors(parameters);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.bladeDescriptors.length * this.verticesPerBlade * 3);
    const normals = new Float32Array(this.bladeDescriptors.length * this.verticesPerBlade * 3);
    const colors = new Float32Array(this.bladeDescriptors.length * this.verticesPerBlade * 3);
    const textureCoordinates = new Float32Array(
      this.bladeDescriptors.length * this.verticesPerBlade * 2,
    );
    const indices = new Uint32Array(this.bladeDescriptors.length * this.segmentsPerBlade * 6);

    this.positionAttribute = new THREE.BufferAttribute(positions, 3);
    this.normalAttribute = new THREE.BufferAttribute(normals, 3);

    geometry.setAttribute('position', this.positionAttribute);
    geometry.setAttribute('normal', this.normalAttribute);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(textureCoordinates, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    this.populateStaticGeometryAttributes(colors, textureCoordinates, indices);

    geometry.computeBoundingSphere();

    this.mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshPhysicalMaterial({
        color: '#7db55c',
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.82,
        clearcoat: 0.04,
        clearcoatRoughness: 0.8,
      }),
    );

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  /**
   * Recomputes blade vertex positions for the current simulation state.
   */
  public updateSurfaceGeometry(
    patchStates: GrassPatchSimulationState[],
    elapsedSceneTimeInSeconds: number,
  ): void {
    const patchStateByIdentifier = new Map<number, GrassPatchSimulationState>(
      patchStates.map((patchState) => [patchState.descriptor.identifier, patchState]),
    );

    for (
      let bladeDescriptorIndex = 0;
      bladeDescriptorIndex < this.bladeDescriptors.length;
      bladeDescriptorIndex += 1
    ) {
      const bladeDescriptor = this.bladeDescriptors[bladeDescriptorIndex];

      if (bladeDescriptor === undefined) {
        continue;
      }

      const matchingPatchState = patchStateByIdentifier.get(bladeDescriptor.patchIdentifier);
      const patchTipDisplacement = matchingPatchState?.tipDisplacementInWorldUnits ?? {
        horizontalComponent: 0,
        depthComponent: 0,
      };

      this.updateBladeGeometry(
        bladeDescriptorIndex,
        bladeDescriptor,
        patchTipDisplacement,
        elapsedSceneTimeInSeconds,
      );
    }

    this.positionAttribute.needsUpdate = true;
    this.normalAttribute.needsUpdate = true;
    this.mesh.geometry.computeBoundingSphere();
  }

  /**
   * Creates the static per-blade descriptors that do not change from frame to
   * frame, such as root position, nominal width, and color variation.
   */
  private createBladeDescriptors(parameters: {
    readonly bladeCount: number;
    readonly patchStates: GrassPatchSimulationState[];
    readonly minimumBladeHeightInWorldUnits: number;
    readonly maximumBladeHeightInWorldUnits: number;
    readonly minimumBladeWidthInWorldUnits: number;
    readonly maximumBladeWidthInWorldUnits: number;
    readonly groundWidthInWorldUnits: number;
    readonly groundDepthInWorldUnits: number;
  }): GrassBladeDescriptor[] {
    const bladeDescriptors: GrassBladeDescriptor[] = [];
    const patchCount = parameters.patchStates.length;

    if (patchCount === 0) {
      return bladeDescriptors;
    }

    for (let bladeIndex = 0; bladeIndex < parameters.bladeCount; bladeIndex += 1) {
      const patchIdentifier = bladeIndex % patchCount;
      const patchState = parameters.patchStates[patchIdentifier];

      if (patchState === undefined) {
        continue;
      }

      const pseudoRandomSeed = bladeIndex * 13.123;
      const randomWidth = (Math.sin(pseudoRandomSeed * 2.3) * 0.5 + 1.5) % 1;
      const randomHeight = (Math.cos(pseudoRandomSeed * 1.9) * 0.5 + 1.5) % 1;
      const randomOffsetHorizontal = Math.sin(pseudoRandomSeed * 4.1) * 0.5 * 0.8;
      const randomOffsetDepth = Math.cos(pseudoRandomSeed * 3.7) * 0.5 * 0.8;
      const colorVariation = Math.sin(pseudoRandomSeed * 5.1) * 0.5 * 0.08;

      bladeDescriptors.push({
        patchIdentifier: patchState.descriptor.identifier,
        rootHorizontalPositionInWorldUnits: THREE.MathUtils.clamp(
          patchState.descriptor.groundCoordinate.horizontalPositionInWorldUnits +
            randomOffsetHorizontal,
          -parameters.groundWidthInWorldUnits / 2,
          parameters.groundWidthInWorldUnits / 2,
        ),
        rootDepthPositionInWorldUnits: THREE.MathUtils.clamp(
          patchState.descriptor.groundCoordinate.depthPositionInWorldUnits + randomOffsetDepth,
          -parameters.groundDepthInWorldUnits / 2,
          parameters.groundDepthInWorldUnits / 2,
        ),
        heightInWorldUnits:
          parameters.minimumBladeHeightInWorldUnits +
          randomHeight *
            (parameters.maximumBladeHeightInWorldUnits - parameters.minimumBladeHeightInWorldUnits),
        widthInWorldUnits:
          parameters.minimumBladeWidthInWorldUnits +
          randomWidth *
            (parameters.maximumBladeWidthInWorldUnits - parameters.minimumBladeWidthInWorldUnits),
        facingAngleInRadians: randomWidth * Math.PI * 2,
        color: new THREE.Color().setHSL(0.27 + colorVariation, 0.42, 0.36 + colorVariation),
        swayPhaseInRadians: randomHeight * Math.PI * 2,
      });
    }

    return bladeDescriptors;
  }

  /**
   * Fills in vertex colors, UVs, and triangle indices that never change after
   * initialization. Only positions and normals need per-frame updates.
   */
  private populateStaticGeometryAttributes(
    colors: Float32Array,
    textureCoordinates: Float32Array,
    indices: Uint32Array,
  ): void {
    for (
      let bladeDescriptorIndex = 0;
      bladeDescriptorIndex < this.bladeDescriptors.length;
      bladeDescriptorIndex += 1
    ) {
      const bladeDescriptor = this.bladeDescriptors[bladeDescriptorIndex];

      if (bladeDescriptor === undefined) {
        continue;
      }

      const bladeVertexStartIndex = bladeDescriptorIndex * this.verticesPerBlade;
      const bladeTextureCoordinateStartIndex = bladeDescriptorIndex * this.verticesPerBlade * 2;
      const bladeColorStartIndex = bladeDescriptorIndex * this.verticesPerBlade * 3;
      const bladeIndexStartIndex = bladeDescriptorIndex * this.segmentsPerBlade * 6;

      for (let segmentIndex = 0; segmentIndex <= this.segmentsPerBlade; segmentIndex += 1) {
        const normalizedHeight = segmentIndex / this.segmentsPerBlade;
        const leftVertexIndex = bladeVertexStartIndex + segmentIndex * 2;
        const rightVertexIndex = leftVertexIndex + 1;
        const colorStartIndex = bladeColorStartIndex + segmentIndex * 6;
        const textureCoordinateStartIndex = bladeTextureCoordinateStartIndex + segmentIndex * 4;

        colors[colorStartIndex] = bladeDescriptor.color.r;
        colors[colorStartIndex + 1] = bladeDescriptor.color.g;
        colors[colorStartIndex + 2] = bladeDescriptor.color.b;
        colors[colorStartIndex + 3] = bladeDescriptor.color.r * 0.98;
        colors[colorStartIndex + 4] = bladeDescriptor.color.g * 0.98;
        colors[colorStartIndex + 5] = bladeDescriptor.color.b * 0.98;

        textureCoordinates[textureCoordinateStartIndex] = 0;
        textureCoordinates[textureCoordinateStartIndex + 1] = normalizedHeight;
        textureCoordinates[textureCoordinateStartIndex + 2] = 1;
        textureCoordinates[textureCoordinateStartIndex + 3] = normalizedHeight;

        if (segmentIndex < this.segmentsPerBlade) {
          const indexStartIndex = bladeIndexStartIndex + segmentIndex * 6;

          indices[indexStartIndex] = leftVertexIndex;
          indices[indexStartIndex + 1] = rightVertexIndex;
          indices[indexStartIndex + 2] = leftVertexIndex + 2;
          indices[indexStartIndex + 3] = rightVertexIndex;
          indices[indexStartIndex + 4] = rightVertexIndex + 2;
          indices[indexStartIndex + 5] = leftVertexIndex + 2;
        }
      }
    }
  }

  /**
   * Updates one blade's geometry strip from the current patch displacement.
   */
  private updateBladeGeometry(
    bladeDescriptorIndex: number,
    bladeDescriptor: GrassBladeDescriptor,
    patchTipDisplacement: PlanarVector,
    elapsedSceneTimeInSeconds: number,
  ): void {
    const bladeVertexStartIndex = bladeDescriptorIndex * this.verticesPerBlade * 3;
    const forwardDirection = new THREE.Vector3(
      Math.cos(bladeDescriptor.facingAngleInRadians),
      0,
      Math.sin(bladeDescriptor.facingAngleInRadians),
    );
    const patchBendDirection = new THREE.Vector3(
      patchTipDisplacement.horizontalComponent,
      0,
      patchTipDisplacement.depthComponent,
    );

    if (patchBendDirection.lengthSq() < 0.0001) {
      patchBendDirection.copy(forwardDirection).multiplyScalar(0.01);
    }

    patchBendDirection.normalize();

    const sidewaysDirection = new THREE.Vector3()
      .crossVectors(new THREE.Vector3(0, 1, 0), patchBendDirection)
      .normalize();

    for (let segmentIndex = 0; segmentIndex <= this.segmentsPerBlade; segmentIndex += 1) {
      const normalizedHeight = segmentIndex / this.segmentsPerBlade;
      const bendWeight = normalizedHeight * normalizedHeight;
      const ambientSwayMagnitude =
        Math.sin(elapsedSceneTimeInSeconds * 2.5 + bladeDescriptor.swayPhaseInRadians) *
        0.04 *
        normalizedHeight;
      const centerPosition = new THREE.Vector3(
        bladeDescriptor.rootHorizontalPositionInWorldUnits,
        normalizedHeight * bladeDescriptor.heightInWorldUnits,
        bladeDescriptor.rootDepthPositionInWorldUnits,
      );

      centerPosition.addScaledVector(
        patchBendDirection,
        Math.hypot(patchTipDisplacement.horizontalComponent, patchTipDisplacement.depthComponent) *
          bendWeight,
      );
      centerPosition.addScaledVector(forwardDirection, 0.08 * bendWeight);
      centerPosition.addScaledVector(sidewaysDirection, ambientSwayMagnitude);

      const segmentWidthInWorldUnits =
        bladeDescriptor.widthInWorldUnits * (1 - normalizedHeight * 0.85);
      const leftVertex = new THREE.Vector3()
        .copy(centerPosition)
        .addScaledVector(sidewaysDirection, segmentWidthInWorldUnits);
      const rightVertex = new THREE.Vector3()
        .copy(centerPosition)
        .addScaledVector(sidewaysDirection, -segmentWidthInWorldUnits);
      const bladeVertexOffset = bladeVertexStartIndex + segmentIndex * 6;

      this.positionAttribute.array[bladeVertexOffset] = leftVertex.x;
      this.positionAttribute.array[bladeVertexOffset + 1] = leftVertex.y;
      this.positionAttribute.array[bladeVertexOffset + 2] = leftVertex.z;
      this.positionAttribute.array[bladeVertexOffset + 3] = rightVertex.x;
      this.positionAttribute.array[bladeVertexOffset + 4] = rightVertex.y;
      this.positionAttribute.array[bladeVertexOffset + 5] = rightVertex.z;

      const bladeNormal = new THREE.Vector3()
        .crossVectors(
          new THREE.Vector3().subVectors(rightVertex, leftVertex),
          new THREE.Vector3(0, 1, 0).addScaledVector(patchBendDirection, bendWeight),
        )
        .normalize();

      this.normalAttribute.array[bladeVertexOffset] = bladeNormal.x;
      this.normalAttribute.array[bladeVertexOffset + 1] = bladeNormal.y;
      this.normalAttribute.array[bladeVertexOffset + 2] = bladeNormal.z;
      this.normalAttribute.array[bladeVertexOffset + 3] = bladeNormal.x;
      this.normalAttribute.array[bladeVertexOffset + 4] = bladeNormal.y;
      this.normalAttribute.array[bladeVertexOffset + 5] = bladeNormal.z;
    }
  }
}
