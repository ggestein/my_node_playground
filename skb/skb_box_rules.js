export let skb_box_rules = {
    build: (pb) => {
        pb.append_prefilter((ctx, s) => {
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
        const push = (ctx, s, dx, dy) => {
            let r = structuredClone(s)
            const tx = s.player.x + dx
            const ty = s.player.y + dy
            r.player.x = tx
            r.player.y = ty
            for (let bk in r.boxes) {
                let bv = r.boxes[bk]
                if (bv.x == tx && bv.y == ty) {
                    bv.x = tx + dx
                    bv.y = ty + dy
                    break
                }
            }
            return r
        }
        pb.append_move(0, (ctx, s) => push(ctx, s, 0, -1))
        pb.append_move(1, (ctx, s) => push(ctx, s, 1, 0))
        pb.append_move(2, (ctx, s) => push(ctx, s, 0, 1))
        pb.append_move(3, (ctx, s) => push(ctx, s, -1, 0))
    }
}