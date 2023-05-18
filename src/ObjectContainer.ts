import { mat4, quat, vec3 } from "gl-matrix";
import { MeshWithBuffers, OBJ } from "webgl-obj-loader";

function getRandom(value: number) {
  return (Math.random() < 0.5 ? -1 : 1) * Math.random() * value;
}

export class ObjectContainer {
  gl: WebGLRenderingContext;
  mesh: MeshWithBuffers;
  modelMatrix: mat4;
  quaternion: quat;
  position: vec3;

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
    if (initialScale) {
      mat4.scale(this.modelMatrix, this.modelMatrix, initialScale);
    }
  }

  rotateX(rotateValue: number) {
    quat.rotateX(this.quaternion, this.quaternion, rotateValue);
  }

  rotateY(rotateValue: number) {
    quat.rotateY(this.quaternion, this.quaternion, rotateValue);
  }

  rotateZ(rotateValue: number) {
    quat.rotateZ(this.quaternion, this.quaternion, rotateValue);
  }

  fall() {
    if (this.modelMatrix[13] < -15) {
      this.position[0] = getRandom(10);
      this.position[1] = -this.position[1];
      this.position[2] = getRandom(10);
    }
    this.position[1] -= 0.1;
    mat4.fromRotationTranslation(
      this.modelMatrix,
      this.quaternion,
      this.position
    );
  }

  render() {}
}
