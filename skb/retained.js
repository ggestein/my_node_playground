import SKB from "./skb.js"
import {skb_box_rules} from "./skb_box_rules.js"
import {lv1} from "./levels/lv1.js"
import {lv2} from "./levels/lv2.js"
import {lv3} from "./levels/lv3.js"
import {lv4} from "./levels/lv4.js"
import {lv5} from "./levels/lv5.js"
import * as THREE from "./three.module.js"
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
console.log(GLTFLoader)

let skb = new SKB()

console.log(skb)
console.log(skb_box_rules)
console.log(lv1)
console.log(lv2)
console.log(lv3)
console.log(lv4)
console.log(lv5)

skb.build(skb_box_rules, lv1)

const width = 960
const height = 540

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 1000 );
let camera_focus = [3, 3, 3]
const set_camera_focus = (x, y, z) => {
    camera_focus[0] = x
    camera_focus[1] = y
    camera_focus[2] = z
    camera.position.set( 0 + x, 15 + y, 7 + z );
    camera.lookAt( x, y, z );
}
set_camera_focus(0, 0, 0);
const geometry_x = new THREE.BoxGeometry( 1000, 0.05, 0.05 );
const material_x = new THREE.MeshNormalMaterial();
const mesh_x = new THREE.Mesh( geometry_x, material_x );
console.log(mesh_x)
scene.add(mesh_x)
const geometry_y = new THREE.BoxGeometry( 0.05, 1000, 0.05 );
const material_y = new THREE.MeshNormalMaterial();
const mesh_y = new THREE.Mesh( geometry_y, material_y );
scene.add(mesh_y)
const geometry_z = new THREE.BoxGeometry( 0.05, 0.05, 1000 );
const material_z = new THREE.MeshNormalMaterial();
const mesh_z = new THREE.Mesh( geometry_z, material_z );
scene.add(mesh_z)
/*
for (let i = 0; i < 36; i++) {
    const geometry = new THREE.BoxGeometry( 0.95, 0.95, 0.95 );
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh( geometry, material );
    const m = i % 6
    const n = (i - m) / 6
    mesh.position.set(m + 0.5, -0.15, n + 0.5)
    mesh.scale.set(1, 0.3, 1)
    scene.add( mesh );
}
*/
const loader = new GLTFLoader()
loader.load("models/gltf/RobotExpressive/RobotExpressive.glb", (gltf) => {
    scene.add(gltf.scene)
}, undefined, (err) => {
    console.log(`FAILED TO LOAD GLTF: ${err}`)
})

// lights

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );

// ground

const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
scene.add( mesh );

const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

function animate( time ) {

    set_camera_focus(Math.sin(time * 0.001), 0, 0)
	renderer.render( scene, camera );

}