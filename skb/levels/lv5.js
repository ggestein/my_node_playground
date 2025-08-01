import {skb_box_rules} from "../skb_box_rules.js"

export let lv5 = {
    build: (pb) => {
        skb_box_rules.build(pb)

        pb.append_enum([

            ["lv_walls", "x"  , "y"  ],
                       [ "num", "num"],
            //-------------------------
            [0         , 0    , 0    ],
            [1         , 1    , 0    ],
            [2         , 2    , 0    ],
            [3         , 3    , 0    ],
            [4         , 4    , 0    ],
            [5         , 4    , 1    ],
            [6         , 4    , 2    ],
            [7         , 4    , 3    ],
            [8         , 4    , 4    ],
            [9         , 3    , 4    ],
            [10        , 2    , 4    ],
            [11        , 1    , 4    ],
            [12        , 0    , 4    ],
            [13        , 0    , 3    ],
            [14        , 0    , 2    ],
            [15        , 0    , 1    ],

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
            [0         , 3    , 1    ],
            [1         , 1    , 3    ],

        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 2,
                y: 2,
            },
            box_1: {
                x: 2,
                y: 3,
            }
        },
        player: {
            x: 2,
            y: 1
        }
    }
}