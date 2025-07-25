const TYPE_I2S = new Map()
TYPE_I2S.set(0, "num")
TYPE_I2S.set(1, "str")
TYPE_I2S.set(2, "bol")
TYPE_I2S.set(3, "ref")
const TYPE_S2I = new Map()
for (const [k, v] of TYPE_I2S) {
    TYPE_S2I.set(v, k)
}

// test
console.log("TYPE_I2S:")
for (const [k, v] of TYPE_I2S) {
    console.log(k, v)
}
console.log("TYPE_S2I:")
for (const [k, v] of TYPE_S2I) {
    console.log(k, v)
}

class C {
    constructor(bne, idx, data) {
        this.belongNamedEnum = bne
        this.idx = idx
        this.data = data
    }
    get(name) {
        return this.data[this.belongNamedEnum.getField(name)[0]]
    }
}

class NE {
    constructor(name) {
        this.name = name
        this.fi = new Map()
        this.cs = []
    }
    count() {
        return this.cs.length
    }
    get(i) {
        if (i >= 0 && i < this.cs.length) {
            return cs[i]
        }
        return null
    }
    getField(name) {
        return fi.get(name)
    }
    appendFI(name, info) {
        fi.set(name, info)
    }
    appendC(data) {
        let c = new C(this, this.cs.length, data)
        this.cs.push(c)
    }
}

class P {
    constructor(sground, sgraph) {
        this.sground = sground
        this.sgraph = sgraph
    }
    dump() {
        console.log("I AM DUMPED")
    }
}

class EnumFormatError extends Error {
    constructor(msg, enum_name) {
        super(msg)
        this.name = "EnumFormatError"
        this.enum_name = enum_name
    }
}

const parseC = (l) => {
    let c = new C()
    return c
}

const parseNE = (l) => {
    let ne = new NE()
    return ne
}

const parseSE = (l) => {
    let ne = new NE()
    return ne
}

export default class PB {
    constructor() {
        this.raw_enums = []
        this.raw_structs = []
        this.prefilter = function(s) {
            return true
        }
        this.rules = []
    }

    append_enum(arg) {
        this.raw_enums.push(arg)
    }
    
    append_struct(arg) {
        this.raw_structs.push(arg)
    }

    set_prefilter(sq) {
        this.prefilter = sq
    }

    append_rule(rq, i, anno) {
        this.rules.push([rq, i, anno])
    }

    build() {
        const l = console.log
        l("[BUILD] BEGIN")
        l(`this.raw_enums.length = ${this.raw_enums.length}`)
        let sground = new Object()
        for (let i = 0; i < this.raw_enums.length; i++) {
            l(`[${i}]`)
            l(this.raw_enums[i])
            let ne = parseNE(this.raw_enums[i])
            sground[ne.name] = ne
        }
        l(`this.raw_structs.length = ${this.raw_structs.length}`)
        for (let i = 0; i < this.raw_structs.length; i++) {
            l(`[${i}]`)
            l(this.raw_structs[i])
            let se = parseSE(this.raw_structs[i])
            sground[se.name] = se
        }
        let sgraph = new Map()
        let p = new P(sground, sgraph)
        l("[BUILD] END")
        return p
    }
}
