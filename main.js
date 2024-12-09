import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

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
// const plane = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.MeshPhongMaterial({ color: 0x0a7d15 }));
// plane.rotation.x = Math.PI / 2;
// plane.receiveShadow = true;
// scene.add(plane);

const geometry = new THREE.PlaneGeometry( 200, 200 );
const material = new THREE.MeshBasicMaterial( {color: 0x0a7d15, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;
scene.add( plane );

// HEMISPHERE LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// POINT LIGHT
const light1 = new THREE.PointLight(0xff6666,1,100);
light1.castShadow = true;
light1.shadow.mapSize.width = 4096;
light1.shadow.mapSize.height = 4096;
light1.position.set( 0, 0, 0 );
scene.add(light1);

const light2 = new THREE.PointLight(0x33ff33,1,100);
light2.castShadow = true;
light2.shadow.mapSize.width = 4096;
light2.shadow.mapSize.height = 4096;
scene.add(light2);


// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
	const alphabetGeometry = new TextGeometry( 'A', {
		font: font,
		size: 6,
		depth: 2,
		// curveSegments: 12,
		// bevelEnabled: true,
		// bevelThickness: 10,
		// bevelSize: 8,
		// bevelOffset: 0,
		// bevelSegments: 5
	} );
	const alphabetMaterial = [new THREE.MeshPhongMaterial({ color: 0xef1a2d }),
							new THREE.MeshPhongMaterial({ color: 0x5c2301 })
	]
	const alphabetMesh = new THREE.Mesh(alphabetGeometry, alphabetMaterial);
	alphabetMesh.position.set(-15, 0, 0); // Left side of the view
	scene.add(alphabetMesh)

	const numberGeometry = new TextGeometry( '9', {
		font: font,
		size: 6,
		depth: 2,
		// curveSegments: 12,
		// bevelEnabled: true,
		// bevelThickness: 10,
		// bevelSize: 8,
		// bevelOffset: 0,
		// bevelSegments: 5
	} );
	const numberMaterial = [new THREE.MeshPhongMaterial({ color: 0x10e5d2 }),
							new THREE.MeshPhongMaterial({ color: 0x5c2301 })
	]
	const numberMesh = new THREE.Mesh(numberGeometry, numberMaterial);
	numberMesh.position.set(15, 0, 0); // Left side of the view
	scene.add(numberMesh)
} );

function animate() {
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
	const now = Date.now() / 1000;
	light1.position.y = 15;
	light1.position.x = Math.cos(now) * 20;
	light1.position.z = Math.sin(now) * 20;

	light2.position.y = 15;
	light2.position.x = Math.cos(now) * 20;
	light2.position.z = Math.sin(now) * 20;
	renderer.render( scene, camera );
	requestAnimationFrame(animate);
}
document.body.appendChild( renderer.domElement );
animate();