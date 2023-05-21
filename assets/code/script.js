
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.createElement("canvas");
canvas.classList.add("threejs")
document.body.appendChild(canvas);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true });
function sizeRenderer(){
    const width = window.innerWidth - 12;
    const height = 1200;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    positionUpdate();
    animate(true);
}
sizeRenderer();
document.body.appendChild( renderer.domElement );


/**
 * Translates from one range to another
 * @param {Int} n The number to translate
 * @param {[Int, Int]} x The number's original range as [Min, Max]
 * @param {[Int, Int]} y The new range to translate to as [Min, Max]
 * @returns 
 */
function rangeTranslate(n, x, y){
    var OldRange = (x[1] - x[0]);
    var NewRange = (y[1] - y[0]);
    return (((n - x[0]) * NewRange) / OldRange) + y[0];
}

const loader = new GLTFLoader();
var arduinoModel;
var arduinocredit = document.getElementById("arduinocredit");
function positionUpdate(){
    if(arduinoModel){
        if(window.scrollY<=300){
            arduinoModel.rotation.x = rangeTranslate(window.scrollY/100, [0, 3], [-.62, 0]);
            arduinoModel.rotation.y = rangeTranslate(window.scrollY/100, [0, 3], [-.276, 0]);
            arduinoModel.rotation.z = rangeTranslate(window.scrollY/100, [0, 3], [-.25, 0]);
            arduinoModel.position.y = rangeTranslate(window.scrollY/100, [0, 3], [.5, 0]);
            var x = window.innerWidth*1.5/1920;
            if(window.innerWidth<950){
                x = window.innerWidth*.6/950;
            }
            if(window.innerWidth<680){
                arduinoModel.position.y = rangeTranslate(window.scrollY/100, [0, 3], [.3, 0]);
                x = 0;
            }
            arduinoModel.position.x = rangeTranslate(window.scrollY/100, [0, 3], [x, 0]);
        }
        if(window.scrollY<300){
            arduinocredit.classList.remove("active");
        }
        else{   
            arduinocredit.classList.add("active");
        }
    }
    if(flowermodel){
        flowermodel.position.x = -1;
        if(window.innerWidth<1000){
            flowermodel.position.x = -.55;
        }
    }
}

loader.load('assets/models/arduino_uno.glb', function (gltf) {
    arduinoModel = gltf.scene;
    positionUpdate()
    scene.add(arduinoModel);
    animate();
}, undefined, function ( error ) {
    console.error( error );
});


var flowermodel;
loader.load('assets/models/monstera_deliciosa_potted_mid-century_plant.glb', function (gltf) {
    flowermodel = gltf.scene;
    flowermodel.position.x = -1;
    flowermodel.position.y = -.34;
    flowermodel.position.z = 1;
    positionUpdate()
    scene.add(gltf.scene);
    animate(true);
}, undefined, function ( error ) {
    console.error( error );
});

// Lights
const ambientLight = new THREE.AmbientLight( 0xbbbbbb );
scene.add( ambientLight );

const pointLight = new THREE.PointLight( 0x00ff00, 4, 40 );
pointLight.position.set( -10, 2, 10 );
scene.add( pointLight );

// Line
// function line(){
//     const material = new THREE.LineBasicMaterial( { color: 0x00bfcd } );
//     const points = [];
//     points.push( new THREE.Vector3( -3, -1, 0 ) );
//     points.push( new THREE.Vector3( 0, -.5, 0 ) );
//     points.push( new THREE.Vector3( 3, -1, 0 ) );

//     const geometry = new THREE.BufferGeometry().setFromPoints( points );
//     const line = new THREE.Line( geometry, material );
//     return line;
// }
// scene.add( line() );

// Camera view
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

// Run render - This is the best optimization of my life
var lastScroll;
function animate(override) {
    if(lastScroll != window.scrollY && window.scrollY<=300){
        lastScroll = window.scrollY;
        renderer.render( scene, camera );
    }
    if(override==true){
        renderer.render( scene, camera );
    }
    requestAnimationFrame( animate );
}

// Resize on resize
window.addEventListener('resize', onWindowResize, false);
var resizeTimeout = {duration: 50};

function onWindowResize(){
    clearTimeout(resizeTimeout.timeout);
    resizeTimeout.timeout = setTimeout(function(){
        sizeRenderer();
    }, resizeTimeout.duration);
}

// Scroll animation
window.addEventListener('scroll', onWindowScroll)
function onWindowScroll(){
    sizeRenderer();
}