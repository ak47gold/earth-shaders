import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const AtmosphereMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    pointer: new THREE.Vector2(),
    uSunDirection: new THREE.Vector3(), 
    uAtmosphereDayColor: new THREE.Color(),
    uAtmosphereTwilightColor: new THREE.Color(),
  },
  /*glsl*/ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main()
        {
            // Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
        
            // Model normal
            vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
        
            // Varyings
            vNormal = modelNormal;
            vPosition = modelPosition.xyz;
        }`,
  /*glsl*/ `
        uniform vec3 uSunDirection;
        uniform vec3 uAtmosphereDayColor;
        uniform vec3 uAtmosphereTwilightColor;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main()
        {
            vec3 viewDirection = normalize(vPosition - cameraPosition);
            vec3 normal = normalize(vNormal);
            vec3 color = vec3(0.0);
        
            // Sun orientation
            float sunOrientation = dot(uSunDirection, normal);
        
            // Atmosphere
            float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
            vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
            color = mix(color, atmosphereColor, atmosphereDayMix);
            color += atmosphereColor;
        
            // Alpha
            float edgeAlpha = dot(viewDirection, normal);
            edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);
        
            float dayAlpha = smoothstep(- 0.5, 0.0, sunOrientation);
        
            float alpha = edgeAlpha * dayAlpha;
        
            // Final color
            gl_FragColor = vec4(color, alpha);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }`
)

extend({ AtmosphereMaterial })

export { AtmosphereMaterial }
