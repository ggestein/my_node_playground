// module importing

import PB from "./lib/pb.js"
import { all_levels } from "./levels/all_levels.js"
import * as THREE from "./three.module.js"
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


// math
const lerp = (a, b, t) => {
    return a * (1 - t) + b * t
}


// SKB init
const lvs = all_levels
let lvi = -1
let p = null
let pg = null
let we = null
let ge = null
let pc = null
const next_level = () => {
    const nlvi = lvi + 1
    if (nlvi < lvs.length) {
        lvi = nlvi
        const lv = lvs[lvi]
        let pb = new PB()
        lv.build(pb)
        p = pb.build()
        let [sr, sid] = p.parse_situation_id(lv.start)
        pg = p.start(sid, (m, ps, ns) => pg_move_callback(m, ps, ns))
        pc = pg.get_context();
        we = pc.get_enum("lv_walls")
        ge = pc.get_enum("lv_goals")
        setup_current_level()
        const [csitr, csit] = pg.cur_sdata()
        pre_preparing_state = {
            player_next_pos: [csit.player.x + 0.5, csit.player.y + 0.5]
        }
        if (char_model) {
            pre_preparing_state.player_prev_pos = [char_model.position.x, char_model.position.z]
        }
        const wec = we.count()
        let x0 = null
        let x1 = null
        let y0 = null
        let y1 = null
        for (let i = 0; i < wec; i++) {
            const x = we.get(i).g("x")
            const y = we.get(i).g("y")
            if (x0 === null || x0 > x) {
                x0 = x
            }
            if (x1 === null || x1 < x) {
                x1 = x
            }
            if (y0 === null || y0 > y) {
                y0 = y
            }
            if (y1 === null || y1 < y) {
                y1 = y
            }
        }
        if (x0 !== null && x1 !== null && y0 !== null && y1 !== null) {
            const dx = x1 - x0
            const dy = y1 - y0
            const d = Math.sqrt(dx * dx + dy * dy)
            const f = d * 0.11
            set_camera_focus_target((x0 + x1) * 0.5 + 0.5, 0, (y0 + y1) * 0.5 + 0.5, f, f)
        }
        won = false
        return true
    }
    return false
}


//  scene initialization with THREE

const width = 960
const height = 540

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 1000 );
let camera_focus = [3, 0, 3]
let camera_focus_target = [3, 0, 3]
let camera_distance_factor_y = 1
let camera_distance_factor_z = 1
let camera_distance_factor_target_y = 1
let camera_distance_factor_target_z = 1
let camera_easing = false
const set_camera_focus = (x, y, z, fy, fz) => {
    camera_focus[0] = x
    camera_focus[1] = y
    camera_focus[2] = z
    camera_distance_factor_y = fy
    camera_distance_factor_z = fz
    camera.position.set( 0 + x, 10 * camera_distance_factor_y + y, 4 * camera_distance_factor_z + z );
    camera.lookAt( x, y, z );
}
set_camera_focus(3, 0, 3, 1, 1);
const set_camera_focus_target = (x, y, z, fy, fz) => {
    camera_focus_target = [x, y, z]
    camera_distance_factor_target_y = fy
    camera_distance_factor_target_z = fz
    camera_easing = true
}
const update_camera = (dt) => {
    if (camera_easing) {
        let nx = camera_focus[0] + (camera_focus_target[0] - camera_focus[0]) * dt * 2
        let ny = camera_focus[1] + (camera_focus_target[1] - camera_focus[1]) * dt * 2
        let nz = camera_focus[2] + (camera_focus_target[2] - camera_focus[2]) * dt * 2
        let nfy = camera_distance_factor_y + (camera_distance_factor_target_y - camera_distance_factor_y) * dt * 2
        let nfz = camera_distance_factor_z + (camera_distance_factor_target_z - camera_distance_factor_z) * dt * 2
        if (
            Math.abs(nx - camera_focus_target[0]) < 0.0001 &&
            Math.abs(ny - camera_focus_target[1]) < 0.0001 &&
            Math.abs(nz - camera_focus_target[2]) < 0.0001 &&
            Math.abs(nfy - camera_distance_factor_target_y) < 0.0001 &&
            Math.abs(nfz - camera_distance_factor_target_z) < 0.0001
        ) {
            nx = camera_focus_target[0]
            ny = camera_focus_target[1]
            nz = camera_focus_target[2]
            nfy = camera_distance_factor_target_y
            nfz = camera_distance_factor_target_z
            camera_easing = true
        }
        set_camera_focus(nx, ny, nz, nfy, nfz)
    }
}
/*
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
*/
let height_animation_info_pre = []
let height_animation_info_post = null
let box_map = null
const update_boxes_pos = (override_y) => {
    const [csitr, csit] = pg.cur_sdata()
    for (let k in box_map) {
        const v = csit.boxes[k]
        const x = v.x
        const y = v.y
        let height = 0.4
        if (override_y) {
            height = override_y
        }
        box_map[k].position.set(x + 0.5, height, y + 0.5)
    }
}
const crate_texture = new THREE.TextureLoader().load("textures/crate.gif")
crate_texture.colorSpace = THREE.SRGBColorSpace

const setup_current_level = () => {
    box_map = new Object()
    const wec = we.count()
    for (let i = 0; i < wec; i++) {
        const x = we.get(i).g("x")
        const y = we.get(i).g("y")
        const geo = new THREE.BoxGeometry( 1, 1, 1)
        const mat = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x + 0.5, 100.0, y + 0.5)
        scene.add(mesh)
        height_animation_info_pre.push([0.5, mesh])
    }
    const gec = ge.count()
    for (let i = 0; i < gec; i++) {
        const x = ge.get(i).g("x")
        const y = ge.get(i).g("y")
        const geo = new THREE.BoxGeometry( 1, 1, 1)
        const mat = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x + 0.5, 100.0, y + 0.5)
        mesh.scale.set(0.6, 0.1, 0.6)
        scene.add(mesh)
        height_animation_info_pre.push([0.05, mesh])
    }
    const [sitr, sit] = pg.cur_sdata()
    for (let k in sit.boxes) {
        const v = sit.boxes[k]
        const geo = new THREE.BoxGeometry( 1, 1, 1)
        // const mat = new THREE.MeshNormalMaterial();
        const mat = new THREE.MeshBasicMaterial( { map: crate_texture} )
        const mesh = new THREE.Mesh(geo, mat)
        scene.add(mesh)
        box_map[k] = mesh
        height_animation_info_pre.push([0.4, mesh])
    }
    update_boxes_pos(100)
}


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

const grid = new THREE.GridHelper( 50, 50, 0x000000, 0x000000 );
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
        if (!won && moving_state === null) {
            if (pg.rewind()) {
                moving_state = null
                update_char_pos()
                update_boxes_pos()
            }
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
const preparing_duration = 1.5
const winning_duration = 4.9
const input_cd = 0.1
let pre_preparing_state = null
let preparing_state = null
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
    if (preparing_state != null) {
        const dt = time - preparing_state.base_time
        if (dt > preparing_duration) {
            preparing_state = null
            update_char_action("Idle")
            for (let i = 0; i < height_animation_info_pre.length; i++) {
                height_animation_info_pre[i][1].position.y = height_animation_info_pre[i][0]
            }
        } else {
            for (let i = 0; i < height_animation_info_pre.length; i++) {
                let dist = height_animation_info_pre[i][1].position.x * height_animation_info_pre[i][1].position.x
                dist += height_animation_info_pre[i][1].position.z * height_animation_info_pre[i][1].position.z
                dist = Math.sqrt(dist)
                let r = dt / preparing_duration * 12 - dist * 1.1 + 0.2
                if (r > 1) {
                    r = 1
                }
                r = (1 - r) * (1 - r) * (1 - r)
                height_animation_info_pre[i][1].position.y = height_animation_info_pre[i][0] + 10 * r
            }
            if (char_model)
            {
                const f = (x, z) => {
                    char_model.position.set(x, 0, z)
                }
                if (preparing_state.player_prev_pos) {
                    let cr = dt
                    if (cr > 1) {
                        cr = 1
                    }
                    cr = 1 - (1 - cr) * (1 - cr) * (1 - cr)
                    f (
                        lerp(preparing_state.player_prev_pos[0], preparing_state.player_next_pos[0], cr),
                        lerp(preparing_state.player_prev_pos[1], preparing_state.player_next_pos[1], cr)
                    )
                } else {
                    f (
                        preparing_state.player_next_pos[0],
                        preparing_state.player_next_pos[1]
                    )
                    // char_model.position.set(preparing_state.player_next_pos[0], 0, preparing_state.player_next_pos[1])
                }
            }
        }
    } else if (winning_state !== null) {
        let dt = time - winning_state.base_time
        if (dt > winning_duration) {
            if (next_level()) {
                winning_state = null
                update_char_action("Idle")
                for (let i = 0; i < height_animation_info_post.length; i++) {
                    height_animation_info_post[i][1].material.dispose()
                    height_animation_info_post[i][1].geometry.dispose()
                    scene.remove(height_animation_info_post[i][1])
                }
            } else {
                set_camera_focus_target(char_model.position.x, char_model.position.y + 0.5, char_model.position.z, 0.2, 0.7)
            }
        } else {
            if (dt > 3.4) {
                dt = dt - 3.4
                for (let i = 0; i < height_animation_info_post.length; i++) {
                    let dist = height_animation_info_post[i][1].position.x * height_animation_info_post[i][1].position.x
                    dist += height_animation_info_post[i][1].position.z * height_animation_info_post[i][1].position.z
                    dist = Math.sqrt(dist)
                    let r = dt / preparing_duration * 12 - dist * 1.1 + 0.2
                    if (r < 0) {
                        r = 0
                    }
                    r = r * r * r
                    height_animation_info_post[i][1].position.y = height_animation_info_post[i][0] + 10 * r
                }
            }
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
                    height_animation_info_post = height_animation_info_pre
                    height_animation_info_pre = []
                }
            }
            if (need_idle) {
                update_char_action("Idle")
            }
        }
    } else {
        if (pre_preparing_state != null) {
            preparing_state = pre_preparing_state
            pre_preparing_state = null
            preparing_state.base_time = time
        }
        if (preparing_moving_state != null) {
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
    update_camera(dt)
    
    /*
    if (char_model) {
        char_model.position.set(0, 0, time_sec)
    }
    */

	renderer.render( scene, camera );
    prev_time = time_sec
}

next_level()