import './style.css'
import vertexShaderSourceCode from './shaders/vertex.glsl?raw';
import fragmentShaderSourceCode from './shaders/fragment.glsl?raw';
import * as glMatrix from 'gl-matrix';
import { vec2by3, vec3by3 } from './types';
import {RawObjects, mtlFiles} from './objectFiles';

//obj materials
var ns: number, ni: number, d: number, illum: number;
var ka = [0, 0, 0]; //ambient color
var kd = [0 ,0, 0]; //diffuse color
var ks = [0, 0, 0]; //specular color
var ke = [0, 0, 0];

//function to extract materials & texture from mtl file
function parseMTLFile(matFile: String) {
  var matFileSplit = matFile.split('\n');

  //file read per line
  for (var line = 0; line < matFileSplit.length; line++) {
    let lineSplit = matFileSplit[line].split(' ');

    if (lineSplit[0] == 'Ns') {
      ns = Number(lineSplit[1]);
    } else if (lineSplit[0] == 'Ka' || lineSplit[0] == 'Kd' || lineSplit[0] == 'Ks' || lineSplit[0] == 'Ke') {
      for (var word = 1; word < lineSplit.length; word++) {
        if (lineSplit[0] == 'Ka') {
          ka[word-1] = (Number(lineSplit[word]));
        } else if (lineSplit[0] == 'Kd') {
          kd[word-1]=(Number(lineSplit[word]));
        } else if (lineSplit[0] == 'Ks') {
          ks[word-1]=(Number(lineSplit[word]));
        } else if (lineSplit[0] == 'Ke') {
          ke[word-1]=(Number(lineSplit[word]));
        }
      }
    } else if (lineSplit[0] == 'Ni') {
      ni = Number(lineSplit[1]);
    } else if (lineSplit[0] == 'd') {
      d = Number(lineSplit[1]);
    } else if (lineSplit[0] == 'illum') {
      illum = Number(lineSplit[1]);
    }
  }
}

function createShader(gl: WebGLRenderingContext, type: number, sourceCode: string): WebGLShader {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  var shader = gl.createShader(type)!;
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var info = gl.getShaderInfoLog(shader);
    throw 'Could not compile WebGL program. \n\n' + info;
  }
  return shader;
}

let canvas = document.querySelector<HTMLCanvasElement>('#screensaver')!;
canvas.height = window.screen.height;
canvas.width = window.screen.width;

const gl = canvas.getContext('webgl2')!;
let program = gl.createProgram()!;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode)!;
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode)!;

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  var info = gl.getProgramInfoLog(program);
  throw 'Could not compile WebGL program. \n\n' + info;
}

// set the program created earlier
gl.useProgram(program);

const uModelMatrixPointer = gl.getUniformLocation(program, "u_model_matrix");
const uViewMatrixPointer = gl.getUniformLocation(program, "u_view_matrix");
const uProjectionMatrixPointer = gl.getUniformLocation(program, "u_projection_matrix");
const uNormalMatrixPointer = gl.getUniformLocation(program, 'u_normal_matrix');
const uLightDirectPointer = gl.getUniformLocation(program, 'light_position');
const uLightDiffuse = gl.getUniformLocation(program, 'u_light_diffuse');

const vertexNormalAttribute = gl.getAttribLocation(program, 'a_normal');
const vertexPositionAttribute = gl.getAttribLocation(program, "a_position");
const colorAttrib = gl.getAttribLocation(program, "a_color");

let normalMatrix = glMatrix.mat3.create();
let vecLightDirection = [2.0, 8.5, 1.0]


gl.enableVertexAttribArray(vertexPositionAttribute);

// gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);

const CONST_VIEWS: vec3by3 = [0, 0, 0, 0, 0, -1, 0, 1, 0];
let VIEWS: vec3by3 = CONST_VIEWS;

const CONST_PROJECTION_ARRAY: vec2by3 = [-10, 10, -10, 10, -10, 100];
let PROJECTION_ARRAY: vec2by3 = CONST_PROJECTION_ARRAY;

let projectionMatrix = glMatrix.mat4.create();
let viewMatrix = glMatrix.mat4.create();
glMatrix.mat4.ortho(projectionMatrix, ...PROJECTION_ARRAY);
glMatrix.mat4.lookAt(viewMatrix, new Float32Array(VIEWS.slice(0, 3)), new Float32Array(VIEWS.slice(3, 6)), new Float32Array(VIEWS.slice(6, 9)));
gl.uniformMatrix4fv(uViewMatrixPointer, false, new Float32Array(viewMatrix));
gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));

function renderObject(object: ObjectContainer, mtlFile: String) {
  glMatrix.mat3.normalFromMat4(normalMatrix, object.modelMatrix);    // get normal matrix from modelmatrix
  gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));
  gl.uniformMatrix3fv(uNormalMatrixPointer, false, new Float32Array(normalMatrix));

  parseMTLFile(mtlFile);

  gl.uniformMatrix4fv(uModelMatrixPointer, false, new Float32Array(object.modelMatrix));

  gl.uniform3f(uLightDirectPointer, vecLightDirection[0],vecLightDirection[1],vecLightDirection[2]);
  gl.uniform3f(uLightDiffuse, ka[0], ka[1], ka[2]);
  // now to render the mesh
  gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.vertexBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, object.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.vertexAttrib4f(colorAttrib, kd[0], kd[1], kd[2], 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.normalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, object.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.mesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, object.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

function renderAll(objarray: ObjectContainer[], mtlArray: String[]) {
  // TODO translate back to top for optimization

  //clear screen
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // render objects
  for (let index = 0; index < objarray.length; index++) {
    let rotatevalue = (Math.PI / 64) + index * 0.1;
    const element = objarray[index];
    const materials = mtlArray[index];

    switch (direction) {
      case 0:
        element.rotateX(rotatevalue);
        break;
      case 1:
        element.rotateY(rotatevalue);
        break;
      case 2:
        element.rotateZ(rotatevalue);
        break;

      default:
        break;
    }
    element.fall();
    renderObject(element, materials);

  }
}

import { ObjectContainer } from './ObjectContainer';

const requestAnimationFrame =
  window.requestAnimationFrame
const cancelAnimationFrame =
  window.cancelAnimationFrame

// objects
import gourd from './objects/gourd.obj?raw';
import kyub from './objects/cube.obj?raw';
import donut from './objects/donut.obj?raw';
import bdaycake from './objects/bday_cake.obj?raw';
import pizza from './objects/pizza.obj?raw';
import strawberry from './objects/strawberry.obj?raw';
import strawberryMtl from './objects/strawberry.mtl?raw';
import icecream from './objects/icecream.obj?raw';
import icecreamMtl from './objects/icecream.mtl?raw';

let animation: number;
let model: ObjectContainer = new ObjectContainer(gl, gourd);

let ObjectList: ObjectContainer[] = [];
let mtlList: String[] = [];

for(var index = 0; index < 3; index ++){
  RawObjects.forEach(obj =>{
    ObjectList.push(new ObjectContainer(gl, obj));
  })

  mtlFiles.forEach(file =>{
    mtlList.push(file);
  })
}


// Catch user inputs
let direction = 0;
const handleUserKeyPress = (event: KeyboardEvent) => {
  const { key } = event;
  switch (key) {
    case "ArrowUp":
      direction = 0;
      break;
    case "ArrowDown":
      direction = 1;
      break;
    case "ArrowLeft":
      direction = 2;
      break;
    case "ArrowRight":
      break;
    case "Escape":
      cancelAnimationFrame(animation);
      break;
    case " ":
      requestAnimate();
  }
  renderAll(ObjectList, mtlList);
}

renderAll(ObjectList, mtlList);

function requestAnimate() {
  renderAll(ObjectList, mtlList);
  // recursive call
  animation = requestAnimationFrame(requestAnimate);
}

window.addEventListener('keydown', handleUserKeyPress);
