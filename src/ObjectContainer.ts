import { mat4 } from "gl-matrix";
import { MeshWithBuffers, OBJ } from "webgl-obj-loader";

export class ObjectContainer {
    gl: WebGLRenderingContext;
    mesh: MeshWithBuffers;
    modelMatrix: mat4;

    constructor(gl: WebGLRenderingContext, objectString: string) {
      this.gl = gl;
      this.mesh = OBJ.initMeshBuffers(gl, new OBJ.Mesh(objectString));
      this.modelMatrix = mat4.create();
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
  