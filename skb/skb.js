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
                    points.push([bx, by])
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

            pb.append_move(0, (ctx, s) => {
                let r = structuredClone(s)
                r.player.y -= 1
                return r
            })
            pb.append_move(1, (ctx, s) => {
                let r = structuredClone(s)
                r.player.x += 1
                return r
            })
            pb.append_move(2, (ctx, s) => {
                let r = structuredClone(s)
                r.player.y += 1
                return r
            })
            pb.append_move(3, (ctx, s) => {
                let r = structuredClone(s)
                r.player.x -= 1
                return r
            })

            let p = pb.build()
            return [true, p]

        } catch (err) {
            console.error(err)
            return [false, err]
        }
    }
}