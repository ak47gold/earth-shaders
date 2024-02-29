import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';
import { AtmosphereMaterial } from '@/components/AtmosphereMaterial';
import { EarthMaterial } from '@/components/EarthMaterial';

import { EffectComposer, Selection, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"

import { easing } from 'maath';
import Overlay from './Overlay';


// TODO - Leva controls
// const Earth = ({ parameters }) => {
//     const meshRef = useRef();
//     const atmosphereRef = useRef();
  
//     const defaultParameters = {
//       atmosphereDayColor: '#00aaff',
//       atmosphereTwilightColor: '#ff6600',
//     };
  
//     const earthParameters = parameters || defaultParameters;
  
//     // Load textures
//     const textures = useMemo(() => {
//       const loader = new THREE.TextureLoader();
//       return {
//         dayTexture: loader.load('/earth/day.jpg'),
//         nightTexture: loader.load('/earth/night.jpg'),
//         specularCloudsTexture: loader.load('/earth/specularClouds.jpg'),
//       };
//     }, []);
  
//     // Define Leva controls for color parameters
//     const { atmosphereDayColor, atmosphereTwilightColor } = useControls({
//       atmosphereDayColor: { label: 'Atmosphere Day Color', value: earthParameters.atmosphereDayColor },
//       atmosphereTwilightColor: { label: 'Atmosphere Twilight Color', value: earthParameters.atmosphereTwilightColor },
//     });
  
//     // Create uniforms with updated color values
//     const uniforms = useMemo(() => {
//       return {
//         uDayTexture: { value: textures.dayTexture },
//         uNightTexture: { value: textures.nightTexture },
//         uSpecularCloudsTexture: { value: textures.specularCloudsTexture },
//         uSunDirection: { value: new THREE.Vector3(0, 0, 1) },
//         uAtmosphereDayColor: { value: new THREE.Color(atmosphereDayColor) },
//         uAtmosphereTwilightColor: { value: new THREE.Color(atmosphereTwilightColor) },
//       };
//     }, [textures, atmosphereDayColor, atmosphereTwilightColor]);
  
//     const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
  
//     useFrame(() => {
//       meshRef.current.rotation.y += 0.0002;
//     });
  
//     return (
//       <>
//         <mesh ref={meshRef} geometry={earthGeometry}>
//           <earthMaterial uniforms={uniforms} key={EarthMaterial.key} />
//         </mesh>
//         <mesh ref={atmosphereRef} geometry={earthGeometry} scale={[1.04, 1.04, 1.04]}>
//           <atmosphereMaterial uniforms={uniforms} key={AtmosphereMaterial.key} side={THREE.BackSide} transparent={true} />
//         </mesh>
//       </>
//     );
//   };

const Earth = ({ parameters }) => {
  const meshRef = useRef();
  const atmosphereRef = useRef();

  const defaultParameters = {
    atmosphereDayColor: '#00aaff',
    atmosphereTwilightColor: '#ff6600',
  };

  const earthParameters = parameters || defaultParameters;

  // Load textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return {
      dayTexture: loader.load('/earth/day.jpg'),
      nightTexture: loader.load('/earth/night.jpg'),
      specularCloudsTexture: loader.load('/earth/specularClouds.jpg'),
    };
  }, []);

  const uniforms = useMemo(() => {
    return {
      uDayTexture: { value: textures.dayTexture },
      uNightTexture: { value: textures.nightTexture },
      uSpecularCloudsTexture: { value: textures.specularCloudsTexture },
      uSunDirection: { value: new THREE.Vector3(0, 0, 1) },
      uAtmosphereDayColor: { value: new THREE.Color(earthParameters.atmosphereDayColor) },
      uAtmosphereTwilightColor: { value: new THREE.Color(earthParameters.atmosphereTwilightColor) },
    };
  }, [textures, earthParameters]);

  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);

  useFrame(() => {
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <>
      <mesh ref={meshRef} geometry={earthGeometry}>
        <earthMaterial uniforms={uniforms} key={EarthMaterial.key} />
      </mesh>
      <mesh ref={atmosphereRef} geometry={earthGeometry} scale={[1.04, 1.04, 1.04]}>
        <atmosphereMaterial uniforms={uniforms} key={AtmosphereMaterial.key} side={THREE.BackSide} transparent={true} />
      </mesh>
    </>
  );
};

const Sun = () => {
  const meshRef = useRef();

  const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
  const sunDirection = new THREE.Vector3();

  useFrame(() => {
    sunDirection.setFromSpherical(sunSpherical);
    meshRef.current.position.copy(sunDirection).multiplyScalar(5);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.1, 2]} />
      <meshBasicMaterial />
    </mesh>
  );
};

// Loads the skybox texture and applies it to the scene.
function SkyBox() {
    const { scene } = useThree();
    const loader = new THREE.CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
      "/kosmo2k/px.jpg",
      "/kosmo2k/nx.jpg",
      "/kosmo2k/py.jpg",
      "/kosmo2k/ny.jpg",
      "/kosmo2k/pz.jpg",
      "/kosmo2k/nz.jpg"
    ]);
  
    // Set the scene background property to the resulting texture.
    scene.background = texture;
    return null;
  }

  function Effects() {
    const { size } = useThree()
    useFrame((state, delta) => {
      // easing.damp3(state.camera.position, [state.pointer.x, 1 + state.pointer.y / 2, 8 + Math.atan(state.pointer.x * 2)], 0.3, delta)
      // state.camera.lookAt(state.camera.position.x * 0.9, 0, -4)
    })
    return (
      <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={4}>
        {/* <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.75} intensity={1} /> */}
        {/* <TiltShift2 samples={5} blur={0.1} /> */}
        {/* <ToneMapping /> */}
      </EffectComposer>
    )
  }
  

const Experience = () => {
  return (
    <>
      <Canvas>
        <Earth />
        <Sun />
        {/* <SkyBox /> */}
        <Stars radius={500} depth={50} count={1000} factor={10} />
        {/* <Environment preset="dawn" /> */}
        <Effects />
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.05} />
      </Canvas>
        <Overlay />
      <Leva />
    </>
  );
};

export default Experience;
