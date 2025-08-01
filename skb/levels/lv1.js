import {skb_box_rules} from "../skb_box_rules.js"

export let lv1 = {
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
            [4         , 3    , 1    ],
            [5         , 4    , 1    ],
            [6         , 4    , 2    ],
            [7         , 4    , 3    ],
            [8         , 4    , 4    ],
            [8         , 3    , 4    ],
            [9         , 2    , 4    ],
            [10        , 1    , 4    ],
            [11        , 0    , 4    ],
            [12        , 0    , 3    ],
            [13        , 0    , 2    ],
            [14        , 0    , 1    ],

        ])

        pb.append_struct([

            "lv_boxes",
            //-----------------------
            ["box_0", "point"],

        ])

        pb.append_enum([
            
            ["lv_goals", "x"  , "y"  ],
                       [ "num", "num"],
            //-------------------------
            [0         , 1    , 1    ],

        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 2,
                y: 2,
            },
        },
        player: {
            x: 2,
            y: 3
        }
    }
}