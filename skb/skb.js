import PB from "./pb.js"

export default class SKB {
    build(level) {
        const l = console.log
        try {
            let pb = new PB()

            pb.append_enum([

            ["test_enum_0", "name", "desc"        , "price"],
                        [ "str" , "str"         , "num"  ],
            //-----------------------------------------------
            [0            , "John", "This is John", 100    ],
            [1            , "Tom" , "Tom desu"    , 150    ],

            ])

            pb.append_enum([

            ["test_enum_1", "from", "to" ],
                        [ "num" , "num"],
            //-----------------------------------------------
            [0            , 10    , 20   ],
            [1            , 20    , 30   ],

            ])

            pb.append_struct([

            "point",
            //-----------------------------------------------
            ["x", "-1~1"],
            ["y", "-1;3"],

            ])

            pb.append_struct([

            "test_struct",
            //-----------------------------------------------
            ["toy", "test_enum_0"],
            ["range", "test_enum_1"],
            ["pos0", "point"],

            ])

            level(pb)

            pb.set_main("test_struct")
            pb.set_prefilter((ctx, s) => true)
            pb.append_rule((ctx, s0, s1) => {
                const s0pos0x = s0.g("pos0").g("x")
                const s0pos0y = s0.g("pos0").g("y")
                const s1pos0x = s1.g("pos0").g("x")
                const s1pos0y = s1.g("pos0").g("y")
                const s0toy = s0.g("toy")
                const s1toy = s1.g("toy")
                const s0range = s0.g("range")
                const s1range = s1.g("range")
                const b0 = s1pos0x - s0pos0x == 1
                const b1 = s1pos0y == s0pos0y
                const b2 = ctx.eq(s0toy, s1toy)
                const b3 = ctx.eq(s0range, s1range)
                return b0 && b1 && b2 && b3
            }, 1, "move right")
            let p = pb.build()
            l(`TOTAL SITUATION COUNT: ${p.total_situation_count()}`)
            let [result, sl] = p.query_situation((ctx, s) => {
                const x = s.g("pos0").g("x")
                const y = s.g("pos0").g("y")
                const r = x == -1 && y == -1
                return r
            })
            const ls = (id, s) => {
                l(`****[${id}]`)
                const ks = s.ks()
                l(`ks.length = ${ks.length}`)
                for (let i = 0; i < ks.length; i++) {
                    l(` ===== ${ks[i]}`)
                }
                l(`toy: ${s.g("toy")}`)
                l(`toy.name: ${s.g("toy").g("name")}`)
                l(`toy.desc: ${s.g("toy").g("desc")}`)
                l(`toy.price: ${s.g("toy").g("price")}`)
                l(`range: ${s.g("range")}`)
                l(`range.from: ${s.g("range").g("from")}`)
                l(`range.to: ${s.g("range").g("to")}`)
                l(`pos0.x: ${s.g("pos0").g("x")}`)
                l(`pos0.y: ${s.g("pos0").g("y")}`)
                const vm = p.get_valid_input(id)
                l(`---- [${vm.length}]`)
                for (let j = 0; j < vm.length; j++) {
                    l(`   ${vm[j][0]} => ${vm[j][1]}`)
                }
            }
            if (result) {
                l("QUERY RESULT COUNT: ", sl.length)
                for (let i = 0; i < sl.length; i++) {
                    const id = sl[i]
                    const s = p.get_situation(id)
                    // ls(id, s)
                }
                if (sl.length > 0) {
                    let mr = false
                    let pg = p.start(sl[sl.length - 1])
                    ls(pg.cur_sid(), pg.cur_sdata())
                    mr = pg.move(1)
                    l(`INPUT 1----- [0] ${mr}`)
                    ls(pg.cur_sid(), pg.cur_sdata())
                    mr = pg.move(1)
                    l(`INPUT 1----- [1] ${mr}`)
                    ls(pg.cur_sid(), pg.cur_sdata())
                    mr = pg.move(1)
                    l(`INPUT 1----- [2] ${mr}`)
                    ls(pg.cur_sid(), pg.cur_sdata())
                }
            } else {
                l("QUERY ERROR:\n", sl)
            }
            return [true, p]
        } catch (err) {
            return [false, err]
        }
    }
}