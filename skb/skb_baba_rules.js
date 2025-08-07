import { skb_door_rules } from "./skb_door_rules.js";

export let skb_baba_rules = {
    build: (pb) => {
        skb_door_rules.build(pb)

        pb.append_enum([
            ["lv_runes", "box_id", "rune_id"],
                       [ "str"   , "num"    ],
            //-----------------------------
            // [0         , "box_01", 0]
        ])

        pb.append_enum([
            ["baba_default", "wall_default_stop", "box_default_push"],
                           [ "num"              , "num"             ],
            //-----------------------------
            // [0         , "box_01", 0]
        ])

        const calculate_rules =(ctx, s) => {
            let result = new Map()
            const runes = ctx.get_enum("lv_runes")
            let rune_map = new Object()
            const runes_count = runes.count()
            for (let i = 0; i < runes_count; i++) {
                const c = runes.get(i)
                rune_map[c.g("box_id")] = c.g("rune_id")
            }
            for (let k in s.boxes) {
                if (rune_map[k] !== 0) {
                    continue
                }
                const v = s.boxes[k]
                const bx = v.x
                const by = v.y
                // horizon matching
                let rune0 = null
                let rune1 = null
                for (let k1 in s.boxes) {
                    const v1 = s.boxes[k1]
                    if (v1 === v) { // exclude itself
                        continue
                    }
                    const bx1 = v1.x
                    const by1 = v1.y
                    if (bx - 1 === bx1 && by === by1) {
                        const r = rune_map[k1]
                        if (r && r >= 100 && r < 200) {
                            rune0 = r
                        }
                    } else if (bx + 1 === bx1 && by === by1) {
                        const r = rune_map[k1]
                        if (r && r >= 200) {
                            rune1 = r
                        }
                    }
                }
                if (rune0 !== null && rune1 !== null) {
                    let m = result.get(rune0)
                    if (!m) {
                        m = []
                        result.set(rune0, m)
                    }
                    m.push(rune1)
                }
                // vertical matching
                rune0 = null
                rune1 = null
                for (let k1 in s.boxes) {
                    const v1 = s.boxes[k1]
                    if (v1 === v) { // exclude itself
                        continue
                    }
                    const bx1 = v1.x
                    const by1 = v1.y
                    if (bx === bx1 && by - 1 === by1) {
                        const r = rune_map[k1]
                        if (r && r >= 100 && r < 200) {
                            rune0 = r
                        }
                    } else if (bx === bx1 && by + 1 === by1) {
                        const r = rune_map[k1]
                        if (r && r >= 200) {
                            rune1 = r
                        }
                    }
                }
                if (rune0 !== null && rune1 !== null) {
                    let m = result.get(rune0)
                    if (!m) {
                        m = []
                        result.set(rune0, m)
                    }
                    m.push(rune1)
                }
            }
            return result
        }

        const default_wall_stop = (ctx) => {
            const e = ctx.get_enum("baba_default")
            if (!e) {
                return false
            }
            const c = e.get(0)
            if (!c) {
                return false
            }
            return c.g("wall_default_stop") === 1
        }
        const default_box_push = (ctx) => {
            const e = ctx.get_enum("baba_default")
            if (!e) {
                return false
            }
            const c = e.get(0)
            if (!c) {
                return false
            }
            return c.g("box_default_push") === 1
        }

        pb.append_prefilter((ctx, s, pf0) => {
            let ex = pf0(ctx, s)
            const rule_mod = calculate_rules(ctx, s)
            const wall_mod = rule_mod.get(101)
            const wall_stop = default_wall_stop(ctx) || (wall_mod && wall_mod.includes(201))
            if (!wall_stop) {
                ex = ex.filter(x => x.wall !== true)
            }
            return ex
        })

        const box_stop = (ctx, se, m0, dx, dy) => {
            let [s, e] = se
            let se1 = m0(ctx, se)
            let [s1, e1] = se1
            const rule_mod = calculate_rules(ctx, s)
            const box_mod = rule_mod.get(102)
            const box_push = default_box_push(ctx) || (box_mod && box_mod.includes(202))
            if (!box_push) {
                let pushed_box = null
                for (let k in s.boxes) {
                    const v = s.boxes[k]
                    if (v.x === s1.player.x && v.y === s1.player.y) {
                        pushed_box = k
                        break
                    }
                }
                if (pushed_box) {
                    let is_rune = false
                    const runes = ctx.get_enum("lv_runes")
                    for (let i = 0; i < runes.count(); i++) {
                        const c = runes.get(i)
                        if (c.g("box_id") == pushed_box) {
                            is_rune = true
                            break
                        }
                    }
                    if (!is_rune) {
                        return null
                    }
                }
            }
            return [s1, e1]
        }

        pb.append_move(0, (ctx, se, m0) => box_stop(ctx, se, m0, 0, -1))
        pb.append_move(1, (ctx, se, m0) => box_stop(ctx, se, m0, 1, 0))
        pb.append_move(2, (ctx, se, m0) => box_stop(ctx, se, m0, 0, 1))
        pb.append_move(3, (ctx, se, m0) => box_stop(ctx, se, m0, -1, 0))
    }
}