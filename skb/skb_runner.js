import SKB from "./skb.js"
import lv1 from "./levels/lv1.js"
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

const skb = new SKB()
let [result, p] = skb.build(lv1)
if (result) {
    l("SUCCESS TO BUILD")
    l(p.__proto__.constructor)
    let sd = new SD(ctx, canvas.width, canvas.height)
    sd.draw(p)
} else {
    l("FAILED TO BUILD")
    l(p)
}

})()