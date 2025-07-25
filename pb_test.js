import {PB} from "./pb.js"

try {
    let pb = new PB()

    pb.append_enum([

    ["test_enum_0", "name", "desc"        , "price"],
    //-----------------------------------------------
    [0            , "John", "This is John", 100    ],
    [1            , "Tom" , "Tom desu"    , 150    ],

    ])

    pb.append_enum([

    ["test_enum_1", "from", "to"],
    //-----------------------------------------------
    [0            , 10    , 20  ],
    [1            , 20    , 30  ],

    ])

    pb.append_struct([

    "test_struct",
    //-----------------------------------------------
    ["toy", "test_enum_0"],
    ["range", "test_enum_1"],
    ["x", "-10~10"],
    ["y", "-10~10"],

    ])

    pb.build()
} catch(err) {
    console.log(`ERR_NAME: ${err.name}`)
    console.log(`ERR_MESSAGE: ${err.message}`)
}
