import PB from "./pb.js"

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

    "test_struct",
    //-----------------------------------------------
    ["toy", "test_enum_0"],
    ["range", "test_enum_1"],
    ["x", "0~2"],
    ["y", "0~2"],

    ])
    const test_branch = 2
    if (test_branch == 0) {
        pb.set_main("test_enum_0")
        pb.set_prefilter((ctx, s) => true)
        pb.append_rule((ctx, s0, s1) => true, 1, "first rule")
        let p = pb.build()
        let [result, sl] = p.query_situation((ctx, s) => true)
        if (result) {
            for (let i = 0; i < sl.length; i++) {
                const s = sl[i]
                console.log(`****[${i}]`)
                console.log(`name: ${s.g("name")}`)
                console.log(`desc: ${s.g("desc")}`)
                console.log(`price: ${s.g("price")}`)
            }
        }
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
        pb.append_rule((ctx, s0, s1) => true, 1, "first rule")
        let p = pb.build()
        let [result, sl] = p.query_situation((ctx, s) => s.g("x") == 1)
        if (result) {
            for (let i = 0; i < sl.length; i++) {
                const id = sl[i]
                const s = p.get_situation(id)
                console.log(`****[${id}]`)
                console.log(`toy: ${s.g("toy")}`)
                console.log(`toy.name: ${s.g("toy").g("name")}`)
                console.log(`toy.desc: ${s.g("toy").g("desc")}`)
                console.log(`toy.price: ${s.g("toy").g("price")}`)
                console.log(`range: ${s.g("range")}`)
                console.log(`range.from: ${s.g("range").g("from")}`)
                console.log(`range.to: ${s.g("range").g("to")}`)
                console.log(`x: ${s.g("x")}`)
                console.log(`y: ${s.g("y")}`)
            }
        }
    }
} catch(err) {
    console.log(err)
}
