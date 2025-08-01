import {SKB} from "./skb.js"

export let skb_box_rules = {
    build: (pb) => {
        SKB.build(pb)
        pb.append_prefilter((ctx, s, pf0) => {
            if (!pf0(ctx, s)) {
                return false
            }
            let points = []
            let walls = ctx.get_enum("lv_walls")
            let walls_count = walls.count()
            for (let i = 0; i < walls_count; i++) {
                const wc = walls.get(i)
                const wx = wc.g("x")
                const wy = wc.g("y")
                points.push([wx, wy])
            }
            let px = s.player.x
            let py = s.player.y
            points.push([px, py])
            let boxes = s.boxes
            for (let k in boxes) {
                const bc = boxes[k]
                const bx = bc.x
                const by = bc.y
                for (let j = 0; j < points.length; j++) {
                    if (points[j][0] == bx && points[j][1] == by) {
                        return false
                    }
                }
            }
            return true
        })
        const push = (ctx, s, m0, dx, dy) => {
            let s1 = m0(ctx, s)
            const tx = s1.player.x
            const ty = s1.player.y
            for (let bk in s1.boxes) {
                let bv = s1.boxes[bk]
                if (bv.x == tx && bv.y == ty) {
                    bv.x = tx + dx
                    bv.y = ty + dy
                    break
                }
            }
            return s1
        }
        pb.append_move(0, (ctx, s, m0) => push(ctx, s, m0, 0, -1))
        pb.append_move(1, (ctx, s, m0) => push(ctx, s, m0, 1, 0))
        pb.append_move(2, (ctx, s, m0) => push(ctx, s, m0, 0, 1))
        pb.append_move(3, (ctx, s, m0) => push(ctx, s, m0, -1, 0))
    }
}