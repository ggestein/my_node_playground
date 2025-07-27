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
    /*
    (ctx, s) => {
        const b0 = s.g("boxes").g("box_0").g("x") == 1
        const b1 = s.g("boxes").g("box_0").g("y") == 3
        const b2 = s.g("boxes").g("box_1").g("x") == 2
        const b3 = s.g("boxes").g("box_1").g("y") == 2
        const b6 = s.g("player").g("x") == 3
        const b7 = s.g("player").g("y") == 3
        return b0 && b1 && b2 && b3 && b6 && b7
    }
    */
}