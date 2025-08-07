import {skb_box_rules} from "./skb_box_rules.js"

export let skb_door_rules = {
    build: (pb) => {
        skb_box_rules.build(pb)
        pb.append_struct([
            "trigger",
            //-------------------
            ["on", "0~1"],
        ])
        pb.append_struct([
            "lv_door_insts",
            //--------------------
            // ["door_01", "trigger"]
        ])
        pb.append_enum([
            ["lv_doors", "id" , "x"  , "y"  ],
                       [ "str", "num", "num"],
            //--------------------------------
            // [0      , "door_01", 3, 3]
        ])
        pb.append_enum([
            ["lv_pedals", "id" , "x"  , "y"  ],
                        [ "str", "num", "num"],
            //---------------------------------
            // [0       , "door_01", 5, 5]
        ])
        pb.append_struct([

            "skb_state",
            //----------------------------
            ["doors", "lv_door_insts"],
        ])
        pb.append_prefilter((ctx, s, pf0) => {
            let ex = pf0(ctx, s)
            let points = []
            let doors = ctx.get_enum("lv_doors")
            let doors_count = doors.count()
            for (let i = 0; i < doors_count; i++) {
                const dc = doors.get(i)
                const did = dc.g("id")
                const on = s.doors[did].on
                if (on === 1) {
                    continue
                }
                const dx = dc.g("x")
                const dy = dc.g("y")
                points.push([dx, dy])
            }
            let boxes = s.boxes
            for (let k in boxes) {
                const bc = boxes[k]
                const bx = bc.x
                const by = bc.y
                for (let j = 0; j < points.length; j++) {
                    if (points[j][0] == bx && points[j][1] == by) {
                        ex.push({})
                    }
                }
            }
            let px = s.player.x
            let py = s.player.y
            for (let i = 0; i < points.length; i++) {
                if (points[i][0] == px && points[i][1] == py) {
                    ex.push({})
                }
            }
            return ex
        })
        const pedal_trigger_door = (ctx, se, m0, dx, dy) => {
            let [s, e] = se
            let se1 = m0(ctx, se)
            let [s1, e1] = se1
            const tx = s1.player.x
            const ty = s1.player.y
            let on_pedals = []
            const pe = ctx.get_enum("lv_pedals")
            const pc = pe.count()
            for (let i = 0; i < pc; i++) {
                const c = pe.get(i)
                const px = c.g("x")
                const py = c.g("y")
                let is_in = false
                for (let k in s1.boxes) {
                    const b = s1.boxes[k]
                    if (px === b.x && py === b.y) {
                        is_in = true
                        break
                    }
                }
                if (!is_in) {
                    is_in = s1.player.x == px && s1.player.y == py
                }
                if (is_in) {
                    on_pedals.push(c.g("id"))
                }
            }
            for (let dk in s1.doors) {
                let dv = s1.doors[dk]
                dv.on = on_pedals.includes(dk) ? 1 : 0
            }
            return [s1, e1]

        }
        pb.append_move(0, (ctx, se, m0) => pedal_trigger_door(ctx, se, m0, 0, -1))
        pb.append_move(1, (ctx, se, m0) => pedal_trigger_door(ctx, se, m0, 1, 0))
        pb.append_move(2, (ctx, se, m0) => pedal_trigger_door(ctx, se, m0, 0, 1))
        pb.append_move(3, (ctx, se, m0) => pedal_trigger_door(ctx, se, m0, -1, 0))
    }
}