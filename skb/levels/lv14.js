import {skb_box_rules} from "../skb_box_rules.js"

export let lv14 = {
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
            [5         , 5    , 0    ],
            [6         , 6    , 0    ],
            [7         , 7    , 0    ],
            [8         , 8    , 0    ],
            [9         , 8    , 1    ],
            [10        , 8    , 2    ],
            [11        , 8    , 3    ],
            [12        , 8    , 4    ],
            [13        , 8    , 5    ],
            [14        , 8    , 6    ],
            [15        , 8    , 7    ],
            [16        , 8    , 8    ],
            [17        , 7    , 8    ],
            [18        , 6    , 8    ],
            [19        , 5    , 8    ],
            [20        , 4    , 8    ],
            [21        , 3    , 8    ],
            [22        , 2    , 8    ],
            [23        , 1    , 8    ],
            [24        , 0    , 8    ],
            [25        , 0    , 7    ],
            [26        , 0    , 6    ],
            [27        , 0    , 5    ],
            [28        , 0    , 4    ],
            [29        , 0    , 3    ],
            [30        , 0    , 2    ],
            [31        , 0    , 1    ],
            [32        , 4    , 1    ],
            [33        , 4    , 2    ],
            [34        , 2    , 2    ],
            [35        , 6    , 2    ],
            [36        , 1    , 4    ],
            [37        , 2    , 4    ],
            [38        , 4    , 4    ],
            [39        , 6    , 4    ],
            [40        , 7    , 4    ],
            [41        , 4    , 5    ],
            [42        , 2    , 6    ],
            [43        , 3    , 6    ],
            [44        , 4    , 6    ],
            [45        , 5    , 6    ],
            [46        , 6    , 6    ],

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
            [1         , 6    , 3    ],

        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 3,
                y: 4,
            },
            box_1: {
                x: 5,
                y: 4
            }
        },
        player: {
            x: 4,
            y: 7
        }
    }
}