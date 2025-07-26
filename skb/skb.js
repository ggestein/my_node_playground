import PB from "./lib/pb.js"

export default class SKB {
    build(level) {
        try {
            const pb = new PB()
            
            pb.append_struct([

                "point",
                //----------------------------
                ["x", "0~5"],
                ["y", "0~5"],

            ])

            level.build(pb)

            pb.append_struct([

                "skb_state",
                //----------------------------
                ["boxes" , "lv_boxes"],
                ["player", "point"],

            ])

            pb.set_main("skb_state")
            pb.set_prefilter((ctx, s) => {
                let points = []
                let walls = ctx.get_enum("lv_walls")
                let walls_count = walls.count()
                for (let i = 0; i < walls_count; i++) {
                    const wc = walls.get(i)
                    const wx = wc.g("x")
                    const wy = wc.g("y")
                    for (let j = 0; j < points.length; j++) {
                        if (points[j][0] == wx && points[j][1] == wy) {
                            return false
                        }
                    }
                    points.push([wx, wy])
                }
                let goals = ctx.get_enum("lv_goals")
                let goals_count = goals.count()
                for (let i = 0; i < goals_count; i++) {
                    const gc = goals.get(i)
                    const gx = gc.g("x")
                    const gy = gc.g("y")
                    for (let j = 0; j < points.length; j++) {
                        if (points[j][0] == gx && points[j][1] == gy) {
                            return false
                        }
                    }
                }
                let boxes = s.g("boxes")
                let bkv = boxes.ks()
                for (let i = 0; i < bkv.length; i++) {
                    const bc = boxes.g(bkv[i])
                    const bx = bc.g("x")
                    const by = bc.g("y")
                    for (let j = 0; j < points.length; j++) {
                        if (points[j][0] == bx && points[j][1] == by) {
                            return false
                        }
                    }
                    points.push([bx, by])
                }
                let pc = s.g("player")
                let px = pc.g("x")
                let py = pc.g("y")
                for (let j = 0; j < points.length; j++) {
                    if (points[j][0] == px && points[j][1] == py) {
                        return false
                    }
                }
                return true
            })

            const moveEmpty = (ctx, s0, s1, dx, dy) => {
                const b0 = s0.g("boxes")
                const b1 = s1.g("boxes")
                if (!ctx.eq(b0, b1)) {
                    return false
                }
                const pc0 = s0.g("player")
                const px0 = pc0.g("x")
                const py0 = pc0.g("y")
                const pc1 = s1.g("player")
                const px1 = pc1.g("x")
                const py1 = pc1.g("y")
                return px0 + dx == px1 && py0 + dy == py1
            }
            const movePush = (s0, s1, dx, dy) => {
                const pc0 = s0.g("player")
                const px0 = pc0.g("x")
                const py0 = pc0.g("y")
                const tx = px0 + dx
                const ty = py0 + dy
                const pc1 = s1.g("player")
                const px1 = pc1.g("x")
                const py1 = pc1.g("y")
                if (tx != px1 || ty != py1) {
                    return false;
                }
                const boxes = s0.g("boxes")
                const boxes1 = s1.g("boxes")
                const bks = boxes.ks()
                for (let i = 0; i < bks.length; i++) {
                    const bc = boxes.g(bks[i])
                    const bx = bc.g("x")
                    const by = bc.g("y")
                    const bc1 = boxes1.g(bks[i])
                    const bx1 = bc1.g("x")
                    const by1 = bc1.g("y")
                    if (bx == tx && by == ty) {
                        if (bx1 != tx + dx || by1 != ty + dy) {
                            return false
                        }
                    } else {
                        if (bx != bx1 || by != by1) {
                            return false
                        }
                    }
                }
                return true
            }

            pb.append_rule((ctx, s0, s1) => moveEmpty(ctx, s0, s1, 0, -1), 0, "UE") // TODO
            pb.append_rule((ctx, s0, s1) => moveEmpty(ctx, s0, s1, 1, 0), 1, "RE") // TODO
            pb.append_rule((ctx, s0, s1) => moveEmpty(ctx, s0, s1, 0, 1), 2, "DE") // TODO
            pb.append_rule((ctx, s0, s1) => moveEmpty(ctx, s0, s1, -1, 0), 3, "LE") // TODO
            pb.append_rule((ctx, s0, s1) => movePush(s0, s1, 0, -1), 0, "UP") // TODO
            pb.append_rule((ctx, s0, s1) => movePush(s0, s1, 1, 0), 1, "RP") // TODO
            pb.append_rule((ctx, s0, s1) => movePush(s0, s1, 0, 1), 2, "DP") // TODO
            pb.append_rule((ctx, s0, s1) => movePush(s0, s1, -1, 0), 3, "LP") // TODO

            let p = pb.build()
            return [true, p]

        } catch (err) {
            console.error(err)
            return [false, err]
        }
    }
}