export default class SD {
    constructor(ctx, w, h) {
        this.ctx = ctx
        this.ox = 0
        this.oy = 0
        this.w = w
        this.h = h
    }

    draw(s) {
        const x = s.g("pos0").g("x")
        const y = s.g("pos0").g("y")
        this.ctx.fillStyle = "#ddddcc"
        this.ctx.fillRect(100 + x * 50, 100 + y * 50, 50, 50)
    }
}