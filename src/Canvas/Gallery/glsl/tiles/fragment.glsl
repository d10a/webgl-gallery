// 
precision highp float;

uniform float uAlpha;
uniform float uTime;
uniform sampler2D tMap;
uniform float uVelo;
uniform vec2 uMouse;
uniform vec2 uViewportSizes;

varying vec2 vUv;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  uv*= uViewportSizes;
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

void main() {
  vec4 texture = texture2D(tMap, vUv);

  // vec2 uv = vUv;

  // float c = circle(newUV, uMouse, 0.0, 0.6);

  // float r = texture2D(tMap, uv.xy += c * (uVelo * .9)).x;
	// float g = texture2D(tMap, uv.xy += c * (uVelo * .925)).y;
	// float b = texture2D(tMap, uv.xy += c * (uVelo * .95)).z;


  // vec4 texture = vec4(r, g, b, 1.);
gl_FragColor = texture;
  gl_FragColor.a *= uAlpha * uTime;
}
