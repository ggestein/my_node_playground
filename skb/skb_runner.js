import PB from "./lib/pb.js"
import PB_AUX from "./lib/pb_aux.js"
import {lv1} from "./levels/lv1.js"
import {lv2} from "./levels/lv2.js"
import {lv3} from "./levels/lv3.js"
import {lv4} from "./levels/lv4.js"
import {lv5} from "./levels/lv5.js"
import {lv6} from "./levels/lv6.js"
import {lv7} from "./levels/lv7.js"
import {lv8} from "./levels/lv8.js"
import {lv9} from "./levels/lv9.js"
import {lv10} from "./levels/lv10.js"
import {lv11} from "./levels/lv11.js"
import {lv12} from "./levels/lv12.js"
import {lv13} from "./levels/lv13.js"
import {lv14} from "./levels/lv14.js"
import {lv15} from "./levels/lv15.js"
import {lvd1} from "./levels/lvd1.js"
import {lvb1} from "./levels/lvb1.js"
import {lvb2} from "./levels/lvb2.js"
import SD from "./skb_drawer.js"

(() => {
const log = document.getElementById("log")
let log_buf = ""
const l = (obj) => {
    log_buf = log_buf + String(obj) + "\n"
    log.value = log_buf
}

const canvas = document.getElementById("screen")
const ctx = canvas.getContext("2d")

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

const lvs = [
    lvb2
]
let lvidx = 0
let pb = new PB()
lvs[lvidx].build(pb)
let p = pb.build()
l("SUCCESS TO BUILD")
const bp_aux = new PB_AUX(p)
const [sidr, sid] = p.parse_situation_id(lvs[lvidx].start)
bp_aux.sample_island_graph(sid)
let pg = null
let sd = new SD(ctx, canvas.width, canvas.height)
let win = false
const drawFunc = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#181818"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (pg != null) {
        sd.draw(pg.get_context(), pg.cur_sdata()[1])
    } else {
        ctx.font = "30px serif"
        ctx.fillText("pg == null", 10, 10)
    }
    if (win) {
        ctx.font = "100px serif"
        ctx.textBaseline = "top"
        ctx.fillStyle = "#ffffff"
        ctx.fillText("WIN", 100, 100)
    }
}
let [sr, startId] = p.parse_situation_id(lvs[lvidx].start)
let upKey = null
let rightKey = null
let downKey = null
let leftKey = null
const trigger_win = () => {
    if (lvidx < lvs.length - 1) {
        setTimeout(() => {
            lvidx++
            win = false
            let [nxr, nxp] = skb.build(skb_box_rules, lvs[lvidx])
            result = nxr
            p = nxp
            let [sr, startId] = p.parse_situation_id(lvs[lvidx].start)
            pg = p.start(startId)
            drawFunc()
        }, 1500)
    }
}
if (sr) {
    pg = p.start(startId)
    upKey = () => {
        if (win) {
            return
        }
        if (pg.move(0)) {
            drawFunc()
            win = pg.check_win()
            if (win) {
                trigger_win()
            }
        }
    }
    rightKey = () => {
        if (win) {
            return
        }
        if (pg.move(1)) {
            drawFunc()
            win = pg.check_win()
            if (win) {
                trigger_win()
            }
        }
    }
    downKey = () => {
        if (win) {
            return
        }
        if (pg.move(2)) {
            drawFunc()
            win = pg.check_win()
            if (win) {
                trigger_win()
            }
        }
    }
    leftKey = () => {
        if (win) {
            return
        }
        if (pg.move(3)) {
            drawFunc()
            win = pg.check_win()
            if (win) {
                trigger_win()
            }
        }
    }
} else {
    l(`FAILED TO PARSE START SITUATION:\n${startId}`)
}
drawFunc()
onKeyup = (code) => {
    l(`onKeyup: ${code}`)
    let r = false
    if (code == "ArrowLeft") {
        if (leftKey != null) {
            leftKey()
        }
        r = true
    } else if (code == "ArrowRight") {
        if (rightKey != null) {
            rightKey()
        }
        r = true
    } else if (code == "ArrowUp") {
        if (upKey != null) {
            upKey()
        }
        r = true
    } else if (code == "ArrowDown") {
        if (downKey != null) {
            downKey()
        }
        r = true
    } else if (code == "KeyC") {
        log_buf = ""
        log.value = log_buf
    } else if (code == "KeyR") {
        if (win) {
            return
        }
        pg.rewind()
        r = true
    }
    if (r) {
        drawFunc()
    }
}
onKeydown = (code) => {
    l(`onKeydown: ${code}`)
}

})()
