import PB from "./lib/pb.js"

export default class SKB {
    build(box_moves, level) {
        try {
            const pb = new PB()
            
            pb.append_struct([

                "point",
                //----------------------------
                ["x", "0~20"],
                ["y", "0~20"],

            ])

            level.build(pb)

            pb.append_struct([

                "skb_state",
                //----------------------------
                ["boxes" , "lv_boxes"],
                ["player", "point"],

            ])

            pb.set_main("skb_state")
            pb.append_prefilter((ctx, s) => {
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
                let px = s.player.x
                let py = s.player.y
                for (let j = 0; j < points.length; j++) {
                    if (points[j][0] == px && points[j][1] == py) {
                        return false
                    }
                }
                return true
            })

            const moveAndCollide = (ctx, s, dx, dy) => {
                let r = structuredClone(s)
                const tx = s.player.x + dx
                const ty = s.player.y + dy
                r.player.x = tx
                r.player.y = ty
                return r
            }

            pb.append_move(0, (ctx, s) => moveAndCollide(ctx, s, 0, -1))
            pb.append_move(1, (ctx, s) => moveAndCollide(ctx, s, 1, 0))
            pb.append_move(2, (ctx, s) => moveAndCollide(ctx, s, 0, 1))
            pb.append_move(3, (ctx, s) => moveAndCollide(ctx, s, -1, 0))

            box_moves.build(pb)

            pb.set_win_check((ctx, s) => {
                let goals = ctx.get_enum("lv_goals")
                let goals_count = goals.count()
                for (let i = 0; i < goals_count; i++) {
                    let gc = goals.get(i)
                    let gx = gc.g("x")
                    let gy = gc.g("y")
                    let ok = false
                    for (let bk in s.boxes) {
                        let bv = s.boxes[bk]
                        if (gx == bv.x && gy == bv.y) {
                            ok = true
                            break
                        }
                    }
                    if (!ok) {
                        return false
                    }
                }
                return true
            })

            let p = pb.build()
            return [true, p]

        } catch (err) {
            console.error(err)
            return [false, err]
        }
    }
}