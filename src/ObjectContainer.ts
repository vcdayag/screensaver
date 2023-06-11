import { mat4, quat, vec3 } from "gl-matrix";
import { MeshWithBuffers, OBJ } from "webgl-obj-loader";
import { getRandom, getRandomNegative, materialType, parseMTLFile } from "./helpers";

const rotatingrange = 1 / 64;
const fallingrange = 0.05;
const sidewaysmovement = 0.02;
const YvalueOutOfRange = 15;

// The class ObjectContainer below contains the definition of the object along with its different properties
export class ObjectContainer {
  gl: WebGLRenderingContext;      // These are the different attributes for an ObjectContainer
  mesh: MeshWithBuffers;
  modelMatrix: mat4;
  quaternion: quat;

  initialposition: vec3;
  position: vec3;
  isMovingSideways: boolean;

  rotateValue: number;
  fallingValue: number;
  materials: materialType;

  constructor(   // Constructor for the ObjectContainer
    gl: WebGLRenderingContext,
    objectString: string,
    mtlFile: string,
    initialPosition?: [number, number, number],
    initialScale?: [number, number, number],
  ) {
    this.gl = gl;
    this.mesh = OBJ.initMeshBuffers(gl, new OBJ.Mesh(objectString));   // initializes a new MeshBuffer

    this.modelMatrix = mat4.create();   // Each object has its own model mattrix
    this.initialposition = [getRandom(5), getRandom(5), getRandom(5)];   // Randomizes the position of the object
    if (initialPosition) {
      this.initialposition = initialPosition;
    }
    this.position = [...this.initialposition];
    this.isMovingSideways = false;

    this.quaternion = quat.create();
    this.rotateValue = getRandom(rotatingrange);   // Uses the getRandom() function to randomize the rotation value of an object
    this.fallingValue = getRandomNegative(fallingrange) - fallingrange / 8;

    this.materials = parseMTLFile(mtlFile ?? "");   // Sets the lighting and color components of the object

    if (initialScale) {
      mat4.scale(this.modelMatrix, this.modelMatrix, initialScale);
    }
  }

  objectReset() {  // Resets the object to fall once again from the top of the screen
    this.quaternion = quat.create();
    this.rotateValue = getRandom(rotatingrange);
    this.fallingValue = getRandomNegative(fallingrange) - fallingrange / 8;
    this.initialposition[0] = getRandom(10);
    this.initialposition[1] = -this.position[1];
    this.initialposition[2] = getRandom(10);
    this.position = [...this.initialposition] as vec3;
  }

  // These functions allow an object to rotate either around the x-axis, y-axis, or z-axis
  rotateX(rotateValue: number) {
    quat.rotateX(this.quaternion, this.quaternion, this.rotateValue);
  }

  rotateY(rotateValue: number) {
    quat.rotateY(this.quaternion, this.quaternion, this.rotateValue);
  }

  rotateZ(rotateValue: number) {
    quat.rotateZ(this.quaternion, this.quaternion, this.rotateValue);
  }

  // Simulates the falling motion of the object on the screen
  fall(falldown: boolean, xmovement: number) {
    if (falldown) {
      if (this.modelMatrix[13] < -YvalueOutOfRange) {   // If the object has reached the bottom of the window then it resets
        this.objectReset();
      }
      // The position of the object is incremented depending on its fallingValue
      this.position[1] += this.fallingValue;
    } else {
      if (this.modelMatrix[13] > YvalueOutOfRange) {   // If the object has reached the bottom of the window then it resets
        this.objectReset();
      }
      this.position[1] -= this.fallingValue;
    }

    if (xmovement !== 0) { // increment/decrement the x values of the object based on the user input.
      this.position[0] = this.position[0] + xmovement;
      this.isMovingSideways = true;
    } else if (this.isMovingSideways) {
      // go back to the original x coordinate slowly
      const difference = this.initialposition[0] - this.position[0];
      if (-sidewaysmovement < difference && difference < sidewaysmovement) {
        this.position[0] = this.initialposition[0];
        this.isMovingSideways = false;
      } else if (this.initialposition[0] > this.position[0]) {
        this.position[0] += sidewaysmovement;
      } else {
        this.position[0] -= sidewaysmovement;
      }
    }

    mat4.fromRotationTranslation(
      this.modelMatrix,
      this.quaternion,
      this.position
    );
  }
}
