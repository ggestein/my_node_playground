export let lv1 = {
    build: (pb) => {
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
            [0         , 0    , 1    ],

        ])
    },
    start: {
        boxes: {
            box_0: {
                x: 1,
                y: 3,
            },
            box_1: {
                x: 2,
                y: 2
            }
        },
        player: {
            x: 3,
            y: 3
        }
    }
}