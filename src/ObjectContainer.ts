import { mat4 } from "gl-matrix";
import { MeshWithBuffers, OBJ } from "webgl-obj-loader";

function getRandom(value: number){
    return (Math.random() < 0.5 ? -1 : 1) * Math.random()*value;
}

export class ObjectContainer {
    gl: WebGLRenderingContext;
    mesh: MeshWithBuffers;
    modelMatrix: mat4;

    constructor(gl: WebGLRenderingContext, objectString: string) {
      this.gl = gl;
      this.mesh = OBJ.initMeshBuffers(gl, new OBJ.Mesh(objectString));
      this.modelMatrix = mat4.create();
      mat4.translate(this.modelMatrix, this.modelMatrix, [getRandom(5), getRandom(5), getRandom(5)]);
    }

    rotateX(rotateValue: number){
        mat4.rotateX(this.modelMatrix,this.modelMatrix,rotateValue);
    }

    rotateY(rotateValue: number){
        mat4.rotateY(this.modelMatrix,this.modelMatrix,rotateValue);
    }

    rotateZ(rotateValue: number){
        mat4.rotateZ(this.modelMatrix,this.modelMatrix,rotateValue);
    }

    render(){
    }
  }
  