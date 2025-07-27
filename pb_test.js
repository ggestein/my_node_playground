import PB from "./lib/pb.js"

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
    const test_branch = 0
    if (test_branch == 0) {
        pb.set_main("test_enum_0")
        pb.set_prefilter((ctx, s) => {
            let sid = ctx.query(s)
            console.log(` <<<${sid}>>>`)
            let c = ctx.get_enum("test_enum_0").get(1)
            return ctx.eq(c, s)
        })
        pb.append_move(1, (ctx, s) => {
            return {
                name: "Tom",
                desc: "Tom desu",
                price: 150,
            }
        })
        let p = pb.build()
        let x = p.get_situation(0)
        console.log(100, x)
        x = p.get_situation(1)
        console.log(101, x)
        x = p.get_situation(2)
        console.log(102, x)
        x = p.get_situation(0)
        console.log(200, x)
        x = p.get_situation(1)
        console.log(201, x)
        x = p.get_situation(2)
        console.log(202, x)
        let mt = p.get_move_target(0, 1)
        console.log("mt = ", mt)
        let avm0 = p.get_valid_input(0)
        console.log("avm0 = ", avm0)
        let avm1 = p.get_valid_input(1)
        console.log("avm1 = ", avm1)
    } else if (test_branch == 1) {
        pb.set_main("test_enum_1")
        pb.set_prefilter((ctx, s) => true)
        pb.append_rule((ctx, s0, s1) => true, 1, "first rule")
        let p = pb.build()
        let [result, sl] = p.query_situation((ctx, s) => true)
        if (result) {
            for (let i = 0; i < sl.length; i++) {
                const s = sl[i]
                console.log(`****[${i}]`)
                console.log(`from: ${s.g("from")}`)
                console.log(`to: ${s.g("to")}`)
            }
        }
    } else if (test_branch == 2) {
        pb.set_main("test_struct")
        pb.set_prefilter((ctx, s) => true)
        let p = pb.build()
        let [result, sl] = p.query_situation((ctx, s) => {
            const x = s.g("pos0").g("x")
            const y = s.g("pos0").g("y")
            const r = x == -1 && y == -1
            return r
        })
    }
} catch(err) {
    console.log(err)
}
