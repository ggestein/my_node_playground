export let SKB = {
    build: (pb) => {
        pb.append_struct([

            "point",
            //----------------------------
            ["x", "0~13"],
            ["y", "0~9"],

        ])
        pb.append_enum([

            ["lv_walls", "x"  , "y"  ],
                        [ "num", "num"],
            //-------------------------
        ])
        pb.append_struct([

            "lv_boxes",
            //-----------------------
        ])

        pb.append_struct([

            "skb_state",
            //----------------------------
            ["boxes" , "lv_boxes"],
            ["player", "point"],

        ])

        pb.set_main("skb_state")
        pb.append_prefilter((ctx, s, pf0) => {
            let goals = ctx.get_enum("lv_goals").collect()
            goals.push(s.player)
            return ctx.get_enum("lv_walls").collect()
                .filter(x => goals
                    .filter(y => x.x == y.x && x.y == y.y).length > 0
                )
                .map(x => {return {wall: true}})
        })

        const moveAndCollide = (ctx, s, dx, dy) => {
            let r = structuredClone(s)
            const tx = s.player.x + dx
            const ty = s.player.y + dy
            r.player.x = tx
            r.player.y = ty
            return r
        }

        pb.append_move(0, (ctx, s, m0) => moveAndCollide(ctx, s, 0, -1))
        pb.append_move(1, (ctx, s, m0) => moveAndCollide(ctx, s, 1, 0))
        pb.append_move(2, (ctx, s, m0) => moveAndCollide(ctx, s, 0, 1))
        pb.append_move(3, (ctx, s, m0) => moveAndCollide(ctx, s, -1, 0))

        pb.append_win_check((ctx, s, w0) => {
            let ex = []
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
                    ex.push({})
                }
            }
            return ex
        })
    }
}