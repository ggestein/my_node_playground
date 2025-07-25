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

    pb.set_main("test_enum_1")
    pb.set_prefilter((ctx, s) => true)

    pb.append_rule((ctx, s0, s1) => true, 1, "first rule")

    let p = pb.build()
    p.dump()
} catch(err) {
    console.log(err)
}
