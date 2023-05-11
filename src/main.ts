import './style.css'
import vertexShaderSourceCode from './shaders/vertex.glsl?raw';
import fragmentShaderSourceCode from './shaders/fragment.glsl?raw';
import { mat4 } from 'gl-matrix';
import { vec2by3, vec3by3 } from './types';

// objects
import gourd from './objects/gourd.obj?raw';
import kyub from './objects/cube.obj?raw';
import donut from './objects/donut.obj?raw';

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
canvas.height = 360;
canvas.width = 360;

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

const vertexPositionAttribute = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(vertexPositionAttribute);

gl.enable(gl.DEPTH_TEST);


const CONST_VIEWS: vec3by3 = [0, 0, 0, 0, 0, -1, 0, 1, 0];
let VIEWS: vec3by3 = CONST_VIEWS;

const CONST_PROJECTION_ARRAY: vec2by3 = [-10, 10, -10, 10, -10, 100];
let PROJECTION_ARRAY: vec2by3 = CONST_PROJECTION_ARRAY;

let projectionMatrix = mat4.create();
let viewMatrix = mat4.create();
mat4.ortho(projectionMatrix, ...PROJECTION_ARRAY);
mat4.lookAt(viewMatrix, new Float32Array(VIEWS.slice(0, 3)), new Float32Array(VIEWS.slice(3, 6)), new Float32Array(VIEWS.slice(6, 9)));
gl.uniformMatrix4fv(uViewMatrixPointer, false, new Float32Array(viewMatrix));
gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));

function renderObject(object: ObjectContainer) {
  gl.uniformMatrix4fv(uModelMatrixPointer, false, new Float32Array(object.modelMatrix));

  // now to render the mesh
  gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.vertexBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, object.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.mesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, object.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function renderAll(objarray: ObjectContainer[]) {
  // TODO translate back to top for optimization

  //clear screen
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // render objects
  for (let index = 0; index < objarray.length; index++) {
    let rotatevalue = (Math.PI / 64) + index * 0.1;
    const element = objarray[index];
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

    renderObject(element);

  }
}

import { ObjectContainer } from './ObjectContainer';

const requestAnimationFrame =
  window.requestAnimationFrame
const cancelAnimationFrame =
  window.cancelAnimationFrame

let animation: number;
let model: ObjectContainer = new ObjectContainer(gl, gourd);

let ObjectList: ObjectContainer[] = [];

ObjectList.push(new ObjectContainer(gl, donut));
ObjectList.push(new ObjectContainer(gl, donut));
ObjectList.push(new ObjectContainer(gl, kyub));
ObjectList.push(new ObjectContainer(gl, gourd));
ObjectList.push(new ObjectContainer(gl, donut));
ObjectList.push(new ObjectContainer(gl, kyub));

// Catch user inputs
let direction = 0;
const handleUserKeyPress = (event: KeyboardEvent) => {
  const { key } = event;
  console.log(key);
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

  renderObject(model);

}

renderAll(ObjectList);

function requestAnimate() {
  renderAll(ObjectList);
  // recursive call
  animation = requestAnimationFrame(requestAnimate);
}

window.addEventListener('keydown', handleUserKeyPress);