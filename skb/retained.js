// module importing

import SKB from "./skb.js"
import {skb_box_rules} from "./skb_box_rules.js"
import {lv1} from "./levels/lv1.js"
import {lv2} from "./levels/lv2.js"
import {lv3} from "./levels/lv3.js"
import {lv4} from "./levels/lv4.js"
import {lv5} from "./levels/lv5.js"
import * as THREE from "./three.module.js"
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


// SKB init

let skb = new SKB()
let [br, p] = skb.build(skb_box_rules, lv1)
let [sr, sid] = p.parse_situation_id(lv1.start)
let pg = p.start(sid, (m, ps, ns) => pg_move_callback(m, ps, ns))
let pc = pg.get_context();
console.log("PG", pg)
console.log("PC", pc)
let we = pc.get_enum("lv_walls")
console.log("WE", we)


//  scene initialization with THREE

const width = 960
const height = 540

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 1000 );
let camera_focus = [3, 3, 3]
const set_camera_focus = (x, y, z) => {
    camera_focus[0] = x
    camera_focus[1] = y
    camera_focus[2] = z
    camera.position.set( 0 + x, 12 + y, 5 + z );
    camera.lookAt( x, y, z );
}
set_camera_focus(2, 0, 2);
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
const wec = we.count()
for (let i = 0; i < wec; i++) {
    const x = we.get(i).g("x")
    const y = we.get(i).g("y")
    const geo = new THREE.BoxGeometry( 1, 1, 1)
    const mat = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x + 0.5, 0.5, y + 0.5)
    scene.add(mesh)
}
let box_map = new Object()
const update_boxes_pos = () => {
    const [csitr, csit] = pg.cur_sdata()
    for (let k in box_map) {
        const v = csit.boxes[k]
        const x = v.x
        const y = v.y
        box_map[k].position.set(x + 0.5, 0.4, y + 0.5)
    }
}
const [sitr, sit] = pg.cur_sdata()
for (let k in sit.boxes) {
    const v = sit.boxes[k]
    const geo = new THREE.BoxGeometry( 1, 1, 1)
    const mat = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geo, mat)
    mesh.scale.set(0.9, 0.8, 0.9)
    scene.add(mesh)
    box_map[k] = mesh
}
update_boxes_pos()


// models
let char_model = undefined
const update_char_pos = () => {
    const [csitr, csit] = pg.cur_sdata()
    char_model.position.set(csit.player.x + 0.5, 0, csit.player.y + 0.5)
}
const update_char_rot = (face) => {
    char_model.rotation.y = face * (Math.PI / 2)
}
const loader = new GLTFLoader()
loader.load("models/gltf/RobotExpressive/RobotExpressive.glb", (gltf) => {
    char_model = gltf.scene
    char_model.scale.set(0.36, 0.36, 0.36)
    update_char_pos()
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

const grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


// input handling
let keyStates = {}
let onKeydown = null
const handleKeydown = (evt) => {
    if (keyStates[evt.code]) {
        return
    }
    keyStates[evt.code] = true
    if (onKeydown != null) {
        onKeydown(evt.code)
    }
}
let onKeyup = null
const handleKeyup = (evt) => {
    keyStates[evt.code] = false
    if (onKeyup != null) {
        onKeyup(evt.code)
    }
}
document.addEventListener("keydown", handleKeydown)
document.addEventListener("keyup", handleKeyup)
onKeydown = (evt) => {
    console.log(evt, "DOWN")
    if (evt === "KeyW") {
        if (pg.move(0)) {
            update_char_pos()
            update_boxes_pos()
        }
    }
    if (evt === "KeyD") {
        if (pg.move(1)) {
            update_char_pos()
            update_boxes_pos()
        }
    }
    if (evt === "KeyS") {
        if (pg.move(2)) {
            update_char_pos()
            update_boxes_pos()
        }
    }
    if (evt === "KeyA") {
        if (pg.move(3)) {
            update_char_pos()
            update_boxes_pos()
        }
    }
    if (evt === "KeyR") {
        if (pg.rewind()) {
            update_char_pos()
            update_boxes_pos()
        }
    }
}
onKeyup = (evt) => {
    console.log(evt, "UP")
}


// PG events
const pg_move_callback = (m, ps, ns) => {
    console.log(m, ps, ns)
    let face = -1
    if (ns !== undefined) {
        if (ns.player.x == ps.player.x) {
            if (ns.player.y < ps.player.y) {
                face = 2
            } else if (ns.player.y > ps.player.y) {
                face = 0
            }
        } else if (ns.player.y == ps.player.y) {
            if (ns.player.x < ps.player.x) {
                face = 3
            } else if (ns.player.x > ps.player.x) {
                face = 1
            }
        }
    } else if (m !== undefined) {
        if (m == 0) {
            face = 2
        } else if (m == 2) {
            face = 0
        } else {
            face = m
        }
    }
    if (face != -1) {
        update_char_rot(face)
    }
}


// animation

function animate( time ) {

    const time_sec = time * 0.001

    /*
    if (char_model) {
        char_model.position.set(0, 0, time_sec)
    }
    */

	renderer.render( scene, camera );

}