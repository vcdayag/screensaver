import './style.css'
import vertexShaderSourceCode from './shaders/vertex.glsl?raw';
import fragmentShaderSourceCode from './shaders/fragment.glsl?raw';
import { mat4 } from 'gl-matrix';
import { OBJ } from 'webgl-obj-loader';
import { vec2by3, vec3by3 } from './types';

// objects
import gourd from './objects/gourd.obj?raw';

// function drawParts(gl: WebGL2RenderingContext, vertices: Array<number>, glmode: number, colors: Array<number>) {
//   // Declaration of pointers to the attributes

//   // helper function to draw each part of the parakeet
//   const CONST_VIEWS = [0, 0, 0, 0, 0, -1, 0, 1, 0];
//   // const CONST_PROJECTION_ARRAY = [-10, 10, -10, 10, -10, 10];

//   var VIEWS = CONST_VIEWS;
//   // var PROJECTION_ARRAY = CONST_PROJECTION_ARRAY;

//   var modelMatrix = mat4.create();
//   var projectionMatrix = mat4.create();
//   mat4.ortho(projectionMatrix, -10, 10, -10, 10, -10, 10);
//   var viewMatrix = mat4.create();
//   mat4.lookAt(viewMatrix, new Float32Array(VIEWS.slice(0, 3)), new Float32Array(VIEWS.slice(3, 6)), new Float32Array(VIEWS.slice(6, 9)));
//   // var modelMatrix = glMatrix.mat4.create();
//   mat4.rotateX(modelMatrix, modelMatrix, Math.PI / 4);
//   // glMatrix.mat4.rotateY(modelMatrix, modelMatrix, Math.PI);
//   mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 4);

//   // clear and make background black
//   gl.clearColor(0, 0, 0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.enable(gl.DEPTH_TEST);

//   let vertWithColors = [];
//   for (let index = 0; index < vertices.length / 4; index++) {
//     const offset = 4;
//     const start = index * offset;
//     const end = (index + 1) * offset;

//     vertWithColors.push(...vertices.slice(start, end));
//     vertWithColors.push(...colors);
//   }

//   var vertexBuffer = gl.createBuffer();
//   gl.vertexAttrib1f(aPointSizePointer, 10);
//   gl.enableVertexAttribArray(aPositionPointer);
//   gl.enableVertexAttribArray(colorLocation);
//   gl.uniformMatrix4fv(uModelMatrixPointer, false, new Float32Array(modelMatrix));
//   gl.uniformMatrix4fv(uViewMatrixPointer, false, new Float32Array(viewMatrix));
//   gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));

//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertWithColors), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(aPositionPointer, 4, gl.FLOAT, false, 8 * 4, 0);
//   gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 8 * 4, 4 * 4);

//   var count = vertices.length / 4;
//   gl.drawArrays(glmode, 0, count);
// }


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

// const aPositionPointer = gl.getAttribLocation(program, 'a_position');
// const aPointSizePointer = gl.getAttribLocation(program, 'a_point_size');
// const colorLocation = gl.getAttribLocation(program, "a_color");


const uModelMatrixPointer = gl.getUniformLocation(program, "u_model_matrix");
const uViewMatrixPointer = gl.getUniformLocation(program, "u_view_matrix");
const uProjectionMatrixPointer = gl.getUniformLocation(program, "u_projection_matrix");

const vertexPositionAttribute = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(vertexPositionAttribute);

gl.enable(gl.DEPTH_TEST);


const CONST_VIEWS: vec3by3 = [0, 0, 0, 0, 0, -1, 0, 1, 0];
let VIEWS: vec3by3 = CONST_VIEWS;

const CONST_PROJECTION_ARRAY: vec2by3 = [-10, 10, -10, 10, -10, 10];
let PROJECTION_ARRAY: vec2by3 = CONST_PROJECTION_ARRAY;

let projectionMatrix = mat4.create();
let viewMatrix = mat4.create();
let modelMatrix = mat4.create();

function useLibrary(object: string) {
  // compile the shaders and create a shader program
  var m = new OBJ.Mesh(object);

  projectionMatrix = mat4.create();
  mat4.ortho(projectionMatrix, ...PROJECTION_ARRAY);

  viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, new Float32Array(VIEWS.slice(0, 3)), new Float32Array(VIEWS.slice(3, 6)), new Float32Array(VIEWS.slice(6, 9)));

  // modelMatrix = mat4.create();
  // mat4.scale(modelMatrix, modelMatrix, [5, 5, 5]);
  // // var modelMatrix = glMatrix.mat4.create();
  // mat4.rotateX(modelMatrix, modelMatrix, Math.PI / 4);
  // // glMatrix.mat4.rotateY(modelMatrix, modelMatrix, Math.PI);
  // mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 4);

  gl.uniformMatrix4fv(uModelMatrixPointer, false, new Float32Array(modelMatrix));
  gl.uniformMatrix4fv(uViewMatrixPointer, false, new Float32Array(viewMatrix));
  gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));

  // create and initialize the vertex, vertex normal, and texture coordinate buffers
  // and save on to the mesh object
  let mesh = OBJ.initMeshBuffers(gl, m);

  // now to render the mesh
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // it's possible that the mesh doesn't contain
  // any texture coordinates (e.g. suzanne.obj in the development branch).
  // in this case, the texture vertexAttribArray will need to be disabled
  // before the call to drawElements
  // if(!mesh.textures.length){
  //   gl.disableVertexAttribArray(program.textureCoordAttribute);
  // }
  // else{
  //   // if the texture vertexAttribArray has been previously
  //   // disabled, then it needs to be re-enabled
  //   gl.enableVertexAttribArray(program.textureCoordAttribute);
  //   gl.bindBuffer(gl.ARRAY_BUFFER, mesh.);
  //   gl.vertexAttribPointer(program.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
  // }

  // gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
  // gl.vertexAttribPointer(vertexNormalAttribute, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


// import kyub from './objects/cube.obj?raw';
// useLibrary(kyub);

useLibrary(gourd);

const requestAnimationFrame =
  window.requestAnimationFrame
const cancelAnimationFrame =
  window.cancelAnimationFrame

let animation: number;

// Catch user inputs
let direction = 0;
const handleUserKeyPress = (event: KeyboardEvent) => {
  const { key } = event;
  console.log(key);
  switch (key) {
    case "ArrowUp":
      // mat4.translate(modelMatrix, modelMatrix, [0, 0.2, 0]);
      direction = 0;
      break;
    case "ArrowDown":
      // mat4.translate(modelMatrix, modelMatrix, [0, -0.2, 0]);
      direction = 1;
      break;
    case "ArrowLeft":
      // mat4.translate(modelMatrix, modelMatrix, [-0.2, 0, 0]);
      direction = 2;
      break;
    case "ArrowRight":
      // mat4.translate(modelMatrix, modelMatrix, [0.2, 0, 0]);
      break;
    case "Escape":
      cancelAnimationFrame(animation);
      break;
    case " ":
      requestAnimate();
  }

  function requestAnimate() {
    let rotatevalue = (Math.PI / 64);
    switch (direction) {
      case 0:
        mat4.rotateX(modelMatrix, modelMatrix, rotatevalue);
        break;
      case 1:
        mat4.rotateY(modelMatrix, modelMatrix, rotatevalue);
        break;
      case 2:
        mat4.rotateZ(modelMatrix, modelMatrix, rotatevalue);
        break;

      default:
        break;
    }
    useLibrary(gourd);
    animation = requestAnimationFrame(requestAnimate);
  }
}

window.addEventListener('keydown', handleUserKeyPress);