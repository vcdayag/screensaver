import { mat4, quat, vec3 } from "gl-matrix";
import { MeshWithBuffers, OBJ } from "webgl-obj-loader";

function getRandom(value: number) {
  return (Math.random() < 0.5 ? -1 : 1) * Math.random() * value;
}

function getRandomNegative(value: number) {
  return -1 * Math.random() * value;
}

const rotatingrange = 1 / 32;
const fallingrange = 0.2;

export class ObjectContainer {
  gl: WebGLRenderingContext;
  mesh: MeshWithBuffers;
  modelMatrix: mat4;
  quaternion: quat;
  position: vec3;

  rotateValue: number;
  fallingValue: number;

  constructor(
    gl: WebGLRenderingContext,
    objectString: string,
    initialScale?: [number, number, number]
  ) {
    this.gl = gl;
    this.mesh = OBJ.initMeshBuffers(gl, new OBJ.Mesh(objectString));

    this.modelMatrix = mat4.create();
    this.position = [getRandom(5), getRandom(5), getRandom(5)];
    this.quaternion = quat.create();
    this.rotateValue = getRandom(rotatingrange);
    this.fallingValue = getRandomNegative(fallingrange);

    if (initialScale) {
      mat4.scale(this.modelMatrix, this.modelMatrix, initialScale);
    }
  }

  objectReset() {
    this.quaternion = quat.create();
    this.rotateValue = getRandom(rotatingrange);
    this.fallingValue = getRandomNegative(fallingrange);
    this.position[0] = getRandom(10);
    this.position[1] = -this.position[1];
    this.position[2] = getRandom(10);
  }

  rotateX(rotateValue: number) {
    quat.rotateX(this.quaternion, this.quaternion, this.rotateValue);
  }

  rotateY(rotateValue: number) {
    quat.rotateY(this.quaternion, this.quaternion, this.rotateValue);
  }

  rotateZ(rotateValue: number) {
    quat.rotateZ(this.quaternion, this.quaternion, this.rotateValue);
  }

  fall() {
    if (this.modelMatrix[13] < -15) {
      this.objectReset();
    }

    this.position[1] += this.fallingValue;
    mat4.fromRotationTranslation(
      this.modelMatrix,
      this.quaternion,
      this.position
    );
  }

  render() { }
}
