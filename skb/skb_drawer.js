export default class SD {
    constructor(ctx, w, h) {
        this.ctx = ctx
        this.ox = 0
        this.oy = 0
        this.w = w
        this.h = h
    }

    draw(s) {
        console.log(this.ctx)
        console.log(String(s))
        this.ctx.clearRect(0, 0, this.w, this.h)
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0, 0, this.w, this.h)
        this.ctx.fillStyle = "#ddddcc"
        this.ctx.fillRect(20 + this.ox, 20 + this.oy, 50, 30)
        this.ctx.font = "50px serif"
        this.ctx.textAlign = "left"
        this.ctx.textBaseline = "top"
        this.ctx.fillText("Hello", 100 + this.ox, 20 + this.oy)
    }
}