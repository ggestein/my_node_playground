import { skb_baba_rules } from "../skb_baba_rules.js";

export let lvb1 = {
    build: (pb) => {
        skb_baba_rules.build(pb)

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
            [3         , 9    , 4    ],
            [3         , 9    , 5    ],
            [3         , 9    , 6    ],
            [3         , 9    , 7    ],
            [3         , 9    , 8    ],
            [3         , 9    , 9    ],
            [3         , 4    , 4    ],
            [3         , 8    , 9    ],
            [3         , 7    , 9    ],
            [3         , 6    , 9    ],
            [3         , 5    , 9    ],
            [3         , 4    , 9    ],
            [3         , 3    , 9    ],
            [3         , 2    , 9    ],
            [3         , 1    , 9    ],
            [3         , 0    , 9    ],
            [3         , 0    , 8    ],
            [3         , 0    , 7    ],
            [3         , 0    , 6    ],
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
            ["rune_wall", "point"],
            ["rune_is_0", "point"],
            ["rune_stop", "point"],
            ["rune_box", "point"],
            ["rune_is_1", "point"],
            ["rune_push", "point"],
        ])

        pb.append_enum([
            ["lv_runes", "box_id"   , "rune_id"],
                       [ "str"      , "num"    ],
            //-----------------------------------
            [0         , "rune_wall", 101      ],
            [1         , "rune_is_0",   0      ],
            [2         , "rune_stop", 201      ],
            [3         , "rune_box" , 102      ],
            [4         , "rune_is_1",   0      ],
            [5         , "rune_push", 202      ],
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
            [0         , "door_01", 4    , 2    ],
        ])
        pb.append_enum([
            ["lv_pedals", "id"     , "x"  , "y"  ],
                        [ "str"    , "num", "num"],
            //---------------------------------
            [0          , "door_01", 1    , 3    ],
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
            rune_wall: {
                x: 10,
                y: 0,
            },
            rune_is_0: {
                x: 10,
                y: 1,
            },
            rune_stop: {
                x: 10,
                y: 2,
            },
            rune_box: {
                x: 5,
                y: 5,
            },
            rune_is_1: {
                x: 5,
                y: 7,
            },
            rune_push: {
                x: 7,
                y: 7,
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