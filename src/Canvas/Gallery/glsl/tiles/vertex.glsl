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
#define PI 3.141592653589793238

attribute vec3 position;
attribute vec2 uv;

uniform float uSpeed;
uniform float uTime;
uniform vec2 uViewportSizes;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying float speed;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vec3 vPosition = position;
  speed = uSpeed;


  vec4 newPosition = modelViewMatrix * vec4(vPosition, 1.0);
  
  // newPosition.x += sin(PI * uv.x);
  // newPosition.z += (sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0)) * uSpeed;
  gl_Position = projectionMatrix * newPosition;
}
