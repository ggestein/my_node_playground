export default class SD {
    constructor(ctx, w, h) {
        this.ctx = ctx
        this.ox = 0
        this.oy = 0
        this.w = w
        this.h = h
    }

    draw(ctx, s) {
        // draw walls
        let walls = ctx.get_enum("lv_walls")
        let walls_count = walls.count()
        for (let i = 0; i < walls_count; i++) {
            let wc = walls.get(i)
            const wx = wc.g("x")
            const wy = wc.g("y")
            this.ctx.fillStyle = "#ff00cc"
            this.ctx.fillRect(50 + wx * 50, 50 + wy * 50, 50, 50)
        }

        // draw goals
        let goals = ctx.get_enum("lv_goals")
        let goals_count = goals.count()
        for (let i = 0; i < goals_count; i++) {
            let gc = goals.get(i)
            const gx = gc.g("x")
            const gy = gc.g("y")
            this.ctx.fillStyle = "#cc00ff"
            this.ctx.fillRect(50 + gx * 50, 50 + gy * 50, 50, 50)
        }

        // draw pedals
        let pedals = ctx.get_enum("lv_pedals")
        let pedals_count = pedals.count()
        for (let i = 0; i < pedals_count; i++) {
            let pc = pedals.get(i)
            const px = pc.g("x")
            const py = pc.g("y")
            this.ctx.fillStyle = "#00ccff"
            this.ctx.fillRect(50 + px * 50, 50 + py * 50, 50, 50)
        }

        // draw doors
        let doors = ctx.get_enum("lv_doors")
        let doors_count = doors.count()
        for (let i = 0; i < doors_count; i++) {
            let dc = doors.get(i)
            const did = dc.g("id")
            const dx = dc.g("x")
            const dy = dc.g("y")
            const on = s.doors[did].on
            this.ctx.fillStyle = on === 1 ? "#770000" : "#ff0000"
            this.ctx.fillRect(50 + dx * 50, 50 + dy * 50, 50, 50)
        }
        // draw boxes
        let boxes = s.boxes
        for (let k in boxes) {
            let b = boxes[k]
            const bx = b.x
            const by = b.y
            this.ctx.fillStyle = "#772222"
            this.ctx.fillRect(50 + bx * 50 + 2, 50 + by * 50 + 2, 50 - 4, 50 - 4)
            this.ctx.fillStyle = "#ffffff"
            this.ctx.strokeRect(50 + bx * 50 + 2, 50 + by * 50 + 2, 50 - 4, 50 - 4)
        }

        // draw player
        let pc = s.player
        const px = pc.x
        const py = pc.y
        this.ctx.fillStyle = "#ccff00"
        this.ctx.fillRect(50 + px * 50, 50 + py * 50, 50, 50)
    }
}