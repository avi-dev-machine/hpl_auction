"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const FireShaderMaterial = shaderMaterial(
  { time: 0, resolution: new THREE.Vector2() },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader (basic perlin noise fire)
  `
    uniform float time;
    varying vec2 vUv;

    // Simple 2D noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i); 
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Animate UVs moving upwards
      vec2 q = uv;
      q.y -= time * 0.5;
      
      // Layer some noise
      float n = snoise(q * 3.0);
      n += 0.5 * snoise(q * 6.0);
      n += 0.25 * snoise(q * 12.0);
      
      // Map noise to a fire-like shape using the y coordinate
      float fire = n - (uv.y * 1.5);
      fire = smoothstep(0.0, 0.8, fire);
      
      // Map to colors (red -> orange -> yellow)
      vec3 color = mix(vec3(0.0), vec3(1.0, 0.2, 0.0), smoothstep(0.0, 0.3, fire));
      color = mix(color, vec3(1.0, 0.6, 0.0), smoothstep(0.3, 0.6, fire));
      color = mix(color, vec3(1.0, 0.9, 0.0), smoothstep(0.6, 1.0, fire));
      
      // Fade out top and bottom slightly
      float fade = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.6, uv.y);
      color *= fade;

      gl_FragColor = vec4(color, fire * fade);
    }
  `
);

extend({ FireShaderMaterial });

export default function FireBackground() {
  const materialRef = useRef<any>();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      {/* @ts-ignore */}
      <fireShaderMaterial ref={materialRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
