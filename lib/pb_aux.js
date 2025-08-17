console.log("Hello, This is pb_aux.js")

export default class PB_AUX {
    constructor(p) {
	this.p = p
    }

    sample_island_graph(sid) {
	const vi = this.p.get_valid_input(sid)
	console.log(vi)
    }
}
