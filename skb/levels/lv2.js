import {skb_box_rules} from "../skb_box_rules.js"

export let lv2 = {
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
            [7         , 6    , 1    ],
            [8         , 7    , 1    ],
            [9         , 7    , 2    ],
            [10        , 7    , 3    ],
            [11        , 6    , 3    ],
            [12        , 5    , 3    ],
            [13        , 4    , 3    ],
            [14        , 3    , 3    ],
            [15        , 2    , 3    ],
            [16        , 1    , 3    ],
            [17        , 0    , 3    ],
            [18        , 0    , 2    ],
            [19        , 0    , 1    ],

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
            [0         , 6    , 2    ],

        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 4,
                y: 2,
            },
        },
        player: {
            x: 5,
            y: 2
        }
    }
}