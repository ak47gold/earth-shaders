import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const EarthMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    pointer: new THREE.Vector2()
  },
  /*glsl*/ `
        varying vec2 vUv;
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
            vUv = uv;
            vNormal = modelNormal;
            vPosition = modelPosition.xyz;
        }`,
  /*glsl*/ `
        uniform sampler2D uDayTexture;
        uniform sampler2D uNightTexture;
        uniform sampler2D uSpecularCloudsTexture;
        uniform vec3 uSunDirection;
        uniform vec3 uAtmosphereDayColor;
        uniform vec3 uAtmosphereTwilightColor;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main()
        {
            vec3 viewDirection = normalize(vPosition - cameraPosition);
            vec3 normal = normalize(vNormal);
            vec3 color = vec3(0.0);

            // Sun orientation
            float sunOrientation = dot(uSunDirection, normal);

            // Day / night color
            float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);
            vec3 dayColor = texture(uDayTexture, vUv).rgb;
            vec3 nightColor = texture(uNightTexture, vUv).rgb;
            color = mix(nightColor, dayColor, dayMix);

            // Specular cloud color
            vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

            // Clouds
            float cloudsMix = smoothstep(0.5, 1.0, specularCloudsColor.g);
            cloudsMix *= dayMix;
            color = mix(color, vec3(1.0), cloudsMix);

            // Fresnel
            float fresnel = dot(viewDirection, normal) + 1.0;
            fresnel = pow(fresnel, 2.0);

            // Atmosphere
            float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
            vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
            color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

            // Specular
            vec3 reflection = reflect(- uSunDirection, normal);
            float specular = - dot(reflection, viewDirection);
            specular = max(specular, 0.0);
            specular = pow(specular, 32.0);
            specular *= specularCloudsColor.r;

            vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
            color += specular * specularColor;

            // Final color
            gl_FragColor = vec4(color, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }`
)

extend({ EarthMaterial })

export { EarthMaterial }
