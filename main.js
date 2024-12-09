import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

// Cube glow shader (vertex and fragment shaders)
const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 glowColor = vec3(1.0, 1.0, 1.0); // White glow
    gl_FragColor = vec4(glowColor * intensity, 1.0);
}
`;

const alphabetVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const alphabetFragmentShader = `
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 lightPosition;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Ambient lighting
    vec3 ambient = ambientColor * 0.369;

    // Diffuse lighting
    vec3 lightDir = normalize(lightPosition - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 diffuse = diffuseColor * diff;

    // Specular lighting (Phong model)
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, vNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularColor * spec;

    // Final color
    vec3 color = ambient + diffuse + specular;
    gl_FragColor = vec4(color, 1.0);
}
`;

const numberVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const numberFragmentShader = `
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 lightPosition;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Ambient lighting
    vec3 ambient = ambientColor * 0.369;

    // Diffuse lighting
    vec3 lightDir = normalize(lightPosition - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 diffuse = diffuseColor * diff;

    // Specular lighting (Metal-like)
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, vNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = mix(diffuseColor, specularColor, 0.5) * spec;

    // Final color
    vec3 color = ambient + diffuse + specular;
    gl_FragColor = vec4(color, 1.0);
}
`;

const loader = new FontLoader();

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHex( 0x112233 );

// CAMERA
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 3;
camera.position.y = 20;
camera.position.z = 45;

// RENDERER
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0,0,-40)
controls.update();

// PLANE
const geometry = new THREE.PlaneGeometry( 200, 200 );
const material = new THREE.MeshBasicMaterial( {color: 0x0a7d15, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;
scene.add( plane );

// HEMISPHERE LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// 3D ALPHABET AND NUMBER
loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
	const alphabetGeometry = new TextGeometry( 'A', {
		font: font,
		size: 6,
		depth: 2,
	} );
	const alphabetMaterial = new THREE.ShaderMaterial({
		vertexShader: alphabetVertexShader,
		fragmentShader: alphabetFragmentShader,
		uniforms: {
			ambientColor: { value: new THREE.Color(0.2, 0.2, 0.2) },
			diffuseColor: { value: new THREE.Color(0xef1a2d) },
			specularColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
			lightPosition: { value: cube.position },
			shininess: { value: 20.0 }
		}
	});
	const alphabetMesh = new THREE.Mesh(alphabetGeometry, alphabetMaterial);
	alphabetMesh.position.set(-15, 0, 0); // Left side of the view
	scene.add(alphabetMesh)

	const numberGeometry = new TextGeometry( '9', {
		font: font,
		size: 6,
		depth: 2,
	} );
	const numberMaterial = new THREE.ShaderMaterial({
		vertexShader: numberVertexShader,
		fragmentShader: numberFragmentShader,
		uniforms: {
			ambientColor: { value: new THREE.Color(0.2, 0.2, 0.2) },
			diffuseColor: { value: new THREE.Color(0x10e5d2) },
			specularColor: { value: new THREE.Color(0x10e5d2) },
			lightPosition: { value: cube.position },
			shininess: { value: 50.0 }
		}
	});
	const numberMesh = new THREE.Mesh(numberGeometry, numberMaterial);
	numberMesh.position.set(15, 0, 0); // Left side of the view
	scene.add(numberMesh)
} );

// Cube shader material
const cubeMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending, // Adds a glowing effect
});

// Create the glowing cube
const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(2, 3, 0);
scene.add(cube);

// Add a point light to make the cube illuminate the scene
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light
pointLight.position.copy(cube.position);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 4096;
pointLight.shadow.mapSize.height = 4096;
scene.add(pointLight);

// Optional: Add bloom for an enhanced glow
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.5, // Strength of bloom
    0.4, // Radius of bloom
    0.85 // Threshold of bloom
);
composer.addPass(bloomPass);

function animate() {
    requestAnimationFrame(animate);
    composer.render(); // Use composer instead of renderer for effects
}
document.body.appendChild( renderer.domElement );
animate();