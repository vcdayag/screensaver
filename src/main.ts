import './style.css'
import vertexShaderSourceCode from './shaders/vertex.glsl?raw';
import fragmentShaderSourceCode from './shaders/fragment.glsl?raw';
import * as glMatrix from 'gl-matrix';
import { vec2by3, vec3by3 } from './types';
import { RawObjects } from './objectFiles';

var darkThemeCol = [0.082, 0.133, 0.22]
var lightThemeCol = [0.8, 0.8, 0.8]
var theme = [0.8, 0.8, 0.8]

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
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

addEventListener("resize", (event) => {
  window.location.reload();
});

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
let vecLightDirection = [0, -1, -1]

//light direction
document.getElementById("xLightRange")?.addEventListener('input', function redraw(event) {
  let sliderValue = Number((document.getElementById('xLightRange') as HTMLInputElement)!.value);

  if (sliderValue < -1) {
    document.getElementById('x_light_value')!.innerHTML = String(-1);
    vecLightDirection[0] = -1;
  } else if (sliderValue > 1) {
    document.getElementById('x_light_value')!.innerHTML = String(1);
    vecLightDirection[0] = 1;
  } else {
    vecLightDirection[0] = sliderValue
    document.getElementById('x_light_value')!.innerHTML = String(sliderValue);
  }
});

document.getElementById("menu")!.style.backgroundColor = `rgb(${theme[0] * 255},${theme[1] * 255},${theme[2] * 255})`;
let optionsshown = true;
document.getElementById("hamburger")?.addEventListener('click', () => {
  if (optionsshown) {
    document.getElementById("menu")!.style.visibility = "hidden";
  } else {
    document.getElementById("menu")!.style.visibility = "visible";
  }
  optionsshown = !optionsshown;
});

document.getElementById("yLightRange")?.addEventListener('input', function redraw(event) {
  let sliderValue = Number((document.getElementById('yLightRange') as HTMLInputElement)!.value);
  if (sliderValue < -15) {
    document.getElementById('y_light_value')!.innerHTML = String(-15);
    vecLightDirection[1] = -15;
  } else if (sliderValue > 15) {
    document.getElementById('y_light_value')!.innerHTML = String(15);
    vecLightDirection[1] = 15;
  } else {
    vecLightDirection[1] = sliderValue
    document.getElementById('y_light_value')!.innerHTML = String(sliderValue);
  }

});
document.getElementById("zLightRange")?.addEventListener('input', function redraw(event) {
  let sliderValue = Number((document.getElementById('zLightRange') as HTMLInputElement)!.value);

  if (sliderValue < -15) {
    document.getElementById('z_light_value')!.innerHTML = String(-15);
    vecLightDirection[2] = -15;
  } else if (sliderValue > 15) {
    document.getElementById('z_light_value')!.innerHTML = String(15);
    vecLightDirection[2] = 15;
  } else {
    vecLightDirection[2] = sliderValue
    document.getElementById('z_light_value')!.innerHTML = String(sliderValue);
  }

});

gl.enableVertexAttribArray(vertexPositionAttribute);

// gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);

const CONST_VIEWS: vec3by3 = [0, 0, 0, 0, 0, -1, 0, 1, 0];
let VIEWS: vec3by3 = CONST_VIEWS;

const CONST_PROJECTION_ARRAY: vec2by3 = [-10, 10, -10, 10, -100, 100];
let PROJECTION_ARRAY: vec2by3 = CONST_PROJECTION_ARRAY;

let projectionMatrix = glMatrix.mat4.create();
let viewMatrix = glMatrix.mat4.create();
let modelMatrix = glMatrix.mat4.create();
glMatrix.mat4.ortho(projectionMatrix, ...PROJECTION_ARRAY);
glMatrix.mat4.lookAt(viewMatrix, new Float32Array(VIEWS.slice(0, 3)), new Float32Array(VIEWS.slice(3, 6)), new Float32Array(VIEWS.slice(6, 9)));
gl.uniformMatrix4fv(uViewMatrixPointer, false, new Float32Array(viewMatrix));
gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));


function renderObject(object: ObjectContainer) {
  glMatrix.mat3.normalFromMat4(normalMatrix, object.modelMatrix);    // get normal matrix from modelmatrix
  gl.uniformMatrix4fv(uProjectionMatrixPointer, false, new Float32Array(projectionMatrix));
  gl.uniformMatrix3fv(uNormalMatrixPointer, false, new Float32Array(normalMatrix));

  gl.uniformMatrix4fv(uModelMatrixPointer, false, new Float32Array(object.modelMatrix));

  gl.uniform3f(uLightDirectPointer, vecLightDirection[0], vecLightDirection[1], vecLightDirection[2]);
  gl.uniform3f(uLightDiffuse, ...object.materials.ka);
  // now to render the mesh
  gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.vertexBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, object.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.vertexAttrib4f(colorAttrib, ...object.materials.kd, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.mesh.vertexNormals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 4 * 3, 0);

  gl.enableVertexAttribArray(vertexNormalAttribute);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.mesh.indexBuffer);
  gl.drawElements(gl.TRIANGLES, object.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);



}

function renderAll(objarray: ObjectContainer[]) {
  // TODO translate back to top for optimization

  //clear screen
  gl.clearColor(theme[0], theme[1], theme[2], 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // render objects
  for (let index = 0; index < objarray.length; index++) {
    let rotatevalue = (Math.PI / 64) + index * 0.1;
    const element = objarray[index];
    const materials = element.materials;

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
    renderObject(element);
  }
}

import { ObjectContainer } from './ObjectContainer';

const requestAnimationFrame =
  window.requestAnimationFrame
const cancelAnimationFrame =
  window.cancelAnimationFrame

let animation: number;

let ObjectList: ObjectContainer[] = [];
for (var index = 0; index < 5; index++) {
  RawObjects.map((obj, index) => {
    ObjectList.push(new ObjectContainer(gl, obj[0], obj[1]));
  })
}

function addRandomObject() {
  const objindex = Math.round(Math.random() * (RawObjects.length - 1));
  ObjectList.push(new ObjectContainer(gl, RawObjects[objindex][0], RawObjects[objindex][1]));
}

function addRandomObjectXY(x: number, y: number) {
  const xloc = (x / window.innerWidth * 20) - 10;
  const yloc = (y / window.innerHeight * -20) + 10;
  const objindex = Math.round(Math.random() * (RawObjects.length - 1));
  ObjectList.push(new ObjectContainer(gl, RawObjects[objindex][0], RawObjects[objindex][1], [xloc, yloc, 0]));
}

function removeRandomObject() {
  ObjectList.pop();
}

function changeTheme() {
  if (theme[0] == lightThemeCol[0]) {
    theme = darkThemeCol;
    document.getElementById("menu")!.style.color = "white";
  }
  else if (theme[0] == darkThemeCol[0]) {
    theme = lightThemeCol;
    document.getElementById("menu")!.style.color = "black";
  }
  document.getElementById("menu")!.style.backgroundColor = `rgb(${theme[0] * 255},${theme[1] * 255},${theme[2] * 255})`;
}

let animationplaying = true;
let direction = 0;
// Catch user inputs
const handleUserKeyPress = (event: KeyboardEvent) => {
  const { key } = event;
  // console.log(key);
  switch (key) {
    case "=":
    case "+":
      addRandomObject();
      break;
    case "-":
      removeRandomObject();
      break;
    case "t":
      changeTheme();
      break;
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
    case " ":
      if (!animationplaying) {
        requestAnimate();
        animationplaying = true;
      } else {
        cancelAnimationFrame(animation);
        animationplaying = false
      }
  }

}

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length == 1) {
    addRandomObject();
  } else if (e.touches.length == 2) {
    removeRandomObject();
  } else if (e.touches.length == 3) {
    changeTheme();
  }
});

// left click
canvas.addEventListener("click", (e) => {
  addRandomObjectXY(e.clientX, e.clientY);
})

// right click
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// middle click
canvas.addEventListener("auxclick", (e) => {
  removeRandomObject();
});

function requestAnimate() {
  renderAll(ObjectList);
  // recursive call
  animation = requestAnimationFrame(requestAnimate);
}

requestAnimate()

window.addEventListener('keydown', handleUserKeyPress);
