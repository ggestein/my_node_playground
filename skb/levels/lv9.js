import {skb_box_rules} from "../skb_box_rules.js"

export let lv9 = {
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
            [6         , 5    , 1    ],
            [7         , 5    , 2    ],
            [8         , 6    , 2    ],
            [9         , 6    , 3    ],
            [10        , 6    , 4    ],
            [11        , 5    , 4    ],
            [12        , 4    , 4    ],
            [13        , 3    , 4    ],
            [14        , 2    , 4    ],
            [15        , 1    , 4    ],
            [16        , 0    , 4    ],
            [17        , 0    , 3    ],
            [18        , 0    , 2    ],
            [19        , 0    , 1    ],

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
            [0         , 2    , 3    ],
            [1         , 5    , 3    ],

        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 3,
                y: 2,
            },
            box_1: {
                x: 3,
                y: 3
            }
        },
        player: {
            x: 4,
            y: 3
        }
    }
}