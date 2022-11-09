 precision highp float;
 
// attribute vec3 position;
// attribute vec2 uv;
 
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
 
// varying vec2 vUv;
// varying vec3 vPosition;
 
// void main() {
//   vUv = uv;
//   vPosition = position;
 
//   vec3 p = position;
 
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
// }
#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute vec2 uv;

uniform float uSpeed;
uniform vec2 uViewportSizes;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying float speed;
varying vec2 vUv;

void main() {
  vUv = uv;
  //speed = uSpeed;

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  //newPosition.z += (sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0)) * uSpeed;

  gl_Position = projectionMatrix * newPosition;
}
