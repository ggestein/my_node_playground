export let lv1 = {
    build: (pb) => {
        console.log("lv1.build")
    },
    start_query: (ctx, s) => {
        const b0 = s.g("pos0").g("x") == -1
        const b1 = s.g("pos0").g("y") == -1
        const b2 = s.g("toy").idx == 0
        const b3 = s.g("range").idx == 0
        return b0 && b1 && b2 && b3
    }
}