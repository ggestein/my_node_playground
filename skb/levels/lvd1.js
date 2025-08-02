import { skb_door_rules } from "../skb_door_rules.js";

export let lvd1 = {
    build: (pb) => {
        skb_door_rules.build(pb)

        pb.append_enum([

            ["lv_walls", "x"  , "y"  ],
                       [ "num", "num"],
            //-------------------------
            [0         , 0    , 0    ],
            [1         , 1    , 0    ],
            [2         , 2    , 0    ],
            [3         , 3    , 0    ],
            [3         , 4    , 0    ],
            [3         , 5    , 0    ],
            [3         , 6    , 0    ],
            [3         , 7    , 0    ],
            [3         , 8    , 0    ],
            [3         , 9    , 0    ],
            [3         , 9    , 1    ],
            [3         , 9    , 2    ],
            [3         , 9    , 3    ],
            [3         , 9    , 4    ],
            [3         , 8    , 4    ],
            [3         , 7    , 4    ],
            [3         , 6    , 4    ],
            [3         , 5    , 4    ],
            [3         , 4    , 4    ],
            [3         , 4    , 5    ],
            [3         , 3    , 5    ],
            [3         , 2    , 5    ],
            [3         , 1    , 5    ],
            [3         , 0    , 5    ],
            [3         , 0    , 4    ],
            [3         , 0    , 3    ],
            [3         , 0    , 2    ],
            [3         , 0    , 1    ],
            [3         , 4    , 1    ],
            [3         , 4    , 3    ],

        ])

        pb.append_struct([

            "lv_boxes",
            //-----------------------
            ["box_0", "point"],
            ["box_1", "point"],

        ])

        pb.append_enum([
            
            ["lv_goals", "x"  , "y"  ],
                       [ "num", "num"],
            //-------------------------
            [0         , 1    , 1    ],
            [0         , 1    , 4    ],

        ])

        pb.append_struct([
            "lv_door_insts",
            //--------------------------
            ["door_01", "trigger"]
        ])
        pb.append_enum([
            ["lv_doors", "id"     , "x"  , "y"  ],
                       [ "str"    , "num", "num"],
            //--------------------------------
            [0         , "door_01", 4    , 2    ]
        ])
        pb.append_enum([
            ["lv_pedals", "id"     , "x"  , "y"  ],
                        [ "str"    , "num", "num"],
            //---------------------------------
            [0          , "door_01", 1    , 3    ]
        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 2,
                y: 2,
            },
            box_1: {
                x: 5,
                y: 2,
            },
        },
        player: {
            x: 2,
            y: 3
        },
        doors: {
            door_01: {
                on: 0
            }
        }
    }
}