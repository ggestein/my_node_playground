import SKB from "./skb.js"
import {lv1} from "./levels/lv1.js"
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

const skb = new SKB()
let [result, p] = skb.build(lv1.build)
if (result) {
    l("SUCCESS TO BUILD")
    let pg = null
    let sd = new SD(ctx, canvas.width, canvas.height)
    const drawFunc = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        if (pg != null) {
            sd.draw(pg.cur_sdata())
        } else {
            ctx.font = "30px serif"
            ctx.fillText("pg == null", 10, 10)
        }
    }
    let [r, sid] = p.query_situation(lv1.start_query)
    let rightKey = null
    if (r && sid.length > 0) {
        pg = p.start(sid[0])
        rightKey = () => {
            pg.move(1)
            drawFunc()
        }
    } else {

    }
    drawFunc()
    onKeyup = (code) => {
        l(`onKeyup: ${code}`)
        let r = false
        if (code == "ArrowLeft") {
            sd.ox -= 10
            r = true
        } else if (code == "ArrowRight") {
            sd.ox += 10
            if (rightKey != null) {
                rightKey()
            }
            r = true
        } else if (code == "ArrowUp") {
            sd.oy -= 10
            r = true
        } else if (code == "ArrowDown") {
            sd.oy += 10
            r = true
        } else if (code == "KeyC") {
            log_buf = ""
            log.value = log_buf
        } else if (code == "KeyR") {
            sd.ox = 0
            sd.oy = 0
            r = true
        }
        if (r) {
            sd.draw(p)
        }
    }
    onKeydown = (code) => {
        l(`onKeydown: ${code}`)
    }
} else {
    l("FAILED TO BUILD")
    l(p)
}

})()