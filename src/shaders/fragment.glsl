#version 300 es

precision mediump float;
in vec4 v_color; //Before, this was a uniform vec4 variable.
out vec4 outColor;
    // uniform vec4 u_color;

void main(void) {
      //outColor = vec4(1, 0, 0, 1); //red
    outColor = v_color;
}