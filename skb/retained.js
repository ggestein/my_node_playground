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


// math
const lerp = (a, b, t) => {
    return a * (1 - t) + b * t
}


// SKB init

const lv = lv4
let skb = new SKB()
let [br, p] = skb.build(skb_box_rules, lv)
let [sr, sid] = p.parse_situation_id(lv.start)
let pg = p.start(sid, (m, ps, ns) => pg_move_callback(m, ps, ns))
let pc = pg.get_context();
let we = pc.get_enum("lv_walls")
let ge = pc.get_enum("lv_goals")


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
const gec = ge.count()
for (let i = 0; i < gec; i++) {
    const x = ge.get(i).g("x")
    const y = ge.get(i).g("y")
    const geo = new THREE.BoxGeometry( 1, 1, 1)
    const mat = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x + 0.5, 0.05, y + 0.5)
    mesh.scale.set(1, 0.1, 1)
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


// models & animations
let char_model = undefined
let char_mixer = undefined
let char_actions = new Object()
let playing_action_name = undefined
const update_char_pos = () => {
    const [csitr, csit] = pg.cur_sdata()
    char_model.position.set(csit.player.x + 0.5, 0, csit.player.y + 0.5)
}
const update_char_rot = (face) => {
    char_model.rotation.y = face * (Math.PI / 2)
}
const update_char_action = (name) => {
    const action = char_actions[name]
    if (action) {
        if (playing_action_name) {
            const playing_action = char_actions[playing_action_name]
            if (playing_action) {
                playing_action.stop()
            }
        }
        action.play()
        playing_action_name = name
    }
}
const loader = new GLTFLoader()
loader.load("models/gltf/RobotExpressive/RobotExpressive.glb", (gltf) => {
    char_model = gltf.scene
    char_model.scale.set(0.36, 0.36, 0.36)
    update_char_pos()
    scene.add(gltf.scene)
    char_mixer = new THREE.AnimationMixer(char_model)
    for (let i = 0; i < gltf.animations.length; i++) {
        const clip = gltf.animations[i]
        char_actions[clip.name] = char_mixer.clipAction(clip)
    }
    update_char_action("Idle")
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
    if (evt === "KeyW") {
        up_pressing = true
    }
    if (evt === "KeyD") {
        right_pressing = true
    }
    if (evt === "KeyS") {
        down_pressing = true
    }
    if (evt === "KeyA") {
        left_pressing = true
    }
    if (evt === "KeyR") {
        if (pg.rewind()) {
            moving_state = null
            update_char_pos()
            update_boxes_pos()
        }
    }
}
onKeyup = (evt) => {
    if (evt === "KeyW") {
        up_pressing = false
    }
    if (evt === "KeyD") {
        right_pressing = false
    }
    if (evt === "KeyS") {
        down_pressing = false
    }
    if (evt === "KeyA") {
        left_pressing = false
    }
}


// PG events
const pg_move_callback = (m, ps, ns) => {
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
    if (m !== undefined) {
        if (ns !== undefined) {
            preparing_moving_state = {
                player: [
                    [ps.player.x + 0.5, 0, ps.player.y + 0.5],
                    [ns.player.x + 0.5, 0, ns.player.y + 0.5]
                ],
                boxes: []
            }
            for (let k in ns.boxes) {
                const v0 = ps.boxes[k]
                const v1 = ns.boxes[k]
                if (v0.x != v1.x || v0.y != v1.y) {
                    preparing_moving_state.boxes[k] = [
                        [v0.x + 0.5, 0.4, v0.y + 0.5],
                        [v1.x + 0.5, 0.4, v1.y + 0.5]
                    ]
                }
            }
        }
    }
}


// controlling
const move_duration = 0.24
const winning_duration = 3.4
const input_cd = 0.1
let preparing_moving_state = null
let moving_state = null
let winning_state = null
let up_pressing = false
let right_pressing = false
let down_pressing = false
let left_pressing = false
let last_input_time = 0
let won = false
const controlling_tick = (time) => {
    if (winning_state !== null) {
        if (time - winning_state.base_time > winning_duration) {
            winning_state = null
            update_char_action("Idle")
        }
    } else if (moving_state !== null) {
        const bt = moving_state.base_time
        const dt = time - bt
        let r = dt / move_duration
        const em = r >= 1.0
        if (em) {
            r = 1.0
        }
        r = 1 - (1 - r) * (1 - r) * (1 - r)
        char_model.position.set(
            lerp(moving_state.player[0][0], moving_state.player[1][0], r),
            lerp(moving_state.player[0][1], moving_state.player[1][1], r),
            lerp(moving_state.player[0][2], moving_state.player[1][2], r)
        )
        for (let k in moving_state.boxes) {
            const v = moving_state.boxes[k]
            box_map[k].position.set(
                lerp(v[0][0], v[1][0], r),
                lerp(v[0][1], v[1][1], r),
                lerp(v[0][2], v[1][2], r)
            )
        }
        if (em) {
            moving_state = null
            let need_idle = true
            if (!won) {
                won = pg.check_win()
                if (won) {
                    winning_state = {
                        base_time: time
                    }
                    update_char_rot(0)
                    update_char_action("Dance")
                    need_idle = false
                }
            }
            if (need_idle) {
                update_char_action("Idle")
            }
        }
    } else {
        if (preparing_moving_state != null)
        {
            moving_state = preparing_moving_state
            preparing_moving_state = null
            moving_state.base_time = time
            update_char_action("Running")
        } else {
            if (time - last_input_time > input_cd) {
                if (up_pressing) {
                    pg.move(0)
                    last_input_time = time
                } else if (right_pressing) {
                    pg.move(1)
                    last_input_time = time
                } else if (down_pressing) {
                    pg.move(2)
                    last_input_time = time
                } else if (left_pressing) {
                    pg.move(3)
                    last_input_time = time
                }
            }
        }
    }
}


// animation

let prev_time = null
function animate( time ) {

    const time_sec = time * 0.001
    let dt = 0
    if (prev_time !== null) {
        dt = time_sec - prev_time
    }
    controlling_tick(time_sec)
    if (char_mixer) {
        char_mixer.update(dt)
    }
    
    /*
    if (char_model) {
        char_model.position.set(0, 0, time_sec)
    }
    */

	renderer.render( scene, camera );
    prev_time = time_sec
}