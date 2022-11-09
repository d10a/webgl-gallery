// 
precision highp float;

uniform float uAlpha;
uniform sampler2D uTexture;
uniform float uDuration;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // vec4 texture = texture2D(uTexture, vUv);
  // gl_FragColor = texture;
  // gl_FragColor.a *= uAlpha * uTime;

  float len = length(vPosition.xy);
  vec2 ripple = vUv + vPosition.xy / len*0.03 * cos(len * 12.0 - uTime * 4.0);
  float delta = (((sin(uTime)+1.0)/2.0)* uDuration)/uDuration;
  vec2 uv = mix(ripple, vUv, delta);
  vec3 color = texture2D(uTexture, uv).rgb;
  gl_FragColor = vec4(color, 1.0);
  gl_FragColor.a *= uAlpha * uTime;
}
