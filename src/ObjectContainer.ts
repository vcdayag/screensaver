import { mat4, quat, vec3 } from "gl-matrix";
import { MeshWithBuffers, OBJ } from "webgl-obj-loader";

type materialType = {
  ns: number;
  ni: number;
  d: number;
  illum: number;
  ka: readonly [number, number, number];
  kd: readonly [number, number, number];
  ks: readonly [number, number, number];
  ke: readonly [number, number, number];
};

function parseMTLFile(matFile: String): materialType {
  var matFileSplit = matFile.split('\n');

  var ns: number = 0, ni: number = 0, d: number = 0, illum: number = 0;
  var ka = [0, 0, 0]; //ambient color
  var kd = [0, 0, 0]; //diffuse color
  var ks = [0, 0, 0]; //specular color
  var ke = [0, 0, 0];

  //file read per line
  for (var line = 0; line < matFileSplit.length; line++) {
    let lineSplit = matFileSplit[line].split(' ');

    // reads the Ka, Kd, Ks, and Ke attributes from the mtl file
    if (lineSplit[0] == 'Ns') {
      ns = Number(lineSplit[1]);
    } else if (lineSplit[0] == 'Ka' || lineSplit[0] == 'Kd' || lineSplit[0] == 'Ks' || lineSplit[0] == 'Ke') {
      for (var word = 1; word < lineSplit.length; word++) {
        if (lineSplit[0] == 'Ka') {
          ka[word - 1] = (Number(lineSplit[word]));
        } else if (lineSplit[0] == 'Kd') {
          kd[word - 1] = (Number(lineSplit[word]));
        } else if (lineSplit[0] == 'Ks') {
          ks[word - 1] = (Number(lineSplit[word]));
        } else if (lineSplit[0] == 'Ke') {
          ke[word - 1] = (Number(lineSplit[word]));
        }
      }
    } else if (lineSplit[0] == 'Ni') {     // Reads the Ni, d, and illum components
      ni = Number(lineSplit[1]);
    } else if (lineSplit[0] == 'd') {
      d = Number(lineSplit[1]);
    } else if (lineSplit[0] == 'illum') {
      illum = Number(lineSplit[1]);
    }
  }

  return {    // Returns the different lighting components
    ns,
    ni,
    d,
    illum,
    ka: ka as unknown as readonly [number, number, number],
    kd: kd as unknown as readonly [number, number, number],
    ks: ks as unknown as readonly [number, number, number],
    ke: ke as unknown as readonly [number, number, number],
  }
}

function getRandom(value: number) {   // Gets a random value to set as the rotation value
  return (Math.random() < 0.5 ? -1 : 1) * Math.random() * value;
}

function getRandomNegative(value: number) {
  return -1 * Math.random() * value;
}

const rotatingrange = 1 / 64;
const fallingrange = 0.05;

// The class ObjectContainer below contains the definition of the object along with its different properties

export class ObjectContainer {
  gl: WebGLRenderingContext;      // These are the different attributes for an ObjectContainer
  mesh: MeshWithBuffers;        
  modelMatrix: mat4;
  quaternion: quat;
  position: vec3;

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
    this.position = [getRandom(5), getRandom(5), getRandom(5)];   // Randomizes the position of the object
    if(initialPosition){
      this.position = initialPosition;
    }
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
    this.position[0] = getRandom(10);
    this.position[1] = -this.position[1];
    this.position[2] = getRandom(10);
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
  fall(falldown: boolean) {
    if(falldown){
      if (this.modelMatrix[13] < -15) {   // If the object has reached the bottom of the window then it resets
        this.objectReset();
      }
      // The position of the object is incremented depending on its fallingValue
      this.position[1] += this.fallingValue;
    }else{
      if (this.modelMatrix[13] > 15) {   // If the object has reached the bottom of the window then it resets
        this.objectReset();
      }
      this.position[1] -= this.fallingValue;
    }

    mat4.fromRotationTranslation(
      this.modelMatrix,
      this.quaternion,
      this.position
    );
  }

  render() { }
}
