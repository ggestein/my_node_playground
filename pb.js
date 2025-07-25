const TYPE_I2S = new Map()
TYPE_I2S.set(0, "num")
TYPE_I2S.set(1, "str")
TYPE_I2S.set(2, "bol")
TYPE_I2S.set(3, "ref")
TYPE_I2S.set(4, "rge")
const TYPE_S2I = new Map()
for (const [k, v] of TYPE_I2S) {
    TYPE_S2I.set(v, k)
}

class C {
    constructor(bne, idx, data) {
        this.belongNamedEnum = bne
        this.idx = idx
        this.data = data
    }
    get(name) {
        const fi = this.belongNamedEnum.getField(name)
        return this.data[fi[0]]
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
            return this.cs[i]
        }
        return null
    }
    getField(name) {
        return this.fi.get(name)
    }
    appendFI(name, info) {
        this.fi.set(name, info)
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
        const l = console.log
        l("===================================")
        for (let k in this.sground) {
            l(`[${k}]`)
            const v = this.sground[k]
            const count = v.count()
            l(`count: ${count}`)
            for (let i = 0; i < count; i++) {
                const c = v.get(i)
                l(` - [${c.idx}](${c.belongNamedEnum.name})`)
                for (let [fik, fiv] of c.belongNamedEnum.fi) {
                    let tn = TYPE_I2S.get(fiv[1])
                    let cv = c.get(fik)
                    if (cv instanceof C) {
                        cv = `[${cv.belongNamedEnum.name}:${cv.idx}]`
                    }
                    if (tn == "rge") {
                        tn = `rge: ${fiv[2]} ~ ${fiv[3]}`
                    } else if (tn == "ref") {
                        tn = `ref -> [${fiv[2].name}]`
                    }
                    l(`   ${fik}: ${cv}(${tn})`)
                }
            }
        }
    }
}

class EnumFormatError extends Error {
    constructor(msg, enum_name) {
        super(msg)
        this.name = "EnumFormatError"
        this.enum_name = enum_name
    }
}

const parseNE = (l) => {
    let h = l[0]
    let name = h[0]
    let ne = new NE(name)
    let tl = l[1]
    for (let i = 1; i < h.length; i++) {
        const fp = i - 1
        ne.appendFI(h[i], [fp, TYPE_S2I.get(tl[fp])])
    }
    for (let i = 2; i < l.length; i++) {
        let d = []
        for (let j = 1; j < l[i].length; j++) {
            d.push(l[i][j])
        }
        ne.appendC(d)
    }
    return ne
}

const parseSE = (sground, l) => {
    let ne = new NE(l[0])
    let rfs = []
    for (let i = 1; i < l.length; i++) {
        const fin = l[i][0]
        const k = l[i][1]
        const tne = sground[k]
        const fp = i - 1
        if (tne !== undefined) {
            rfs.push(tne)
            ne.appendFI(fin, [fp, TYPE_S2I.get("ref"), tne])
        } else {
            const seg = k.split("~")
            const fr = +seg[0]
            const to = +seg[1]
            rfs.push([fr, to])
            ne.appendFI(fin, [fp, TYPE_S2I.get("rge"), fr, to])
        }
    }
    let cns = []
    for (let i = 0; i < rfs.length; i++) {
        cns.push(0)
    }
    while (true) {
        const d = []
        for (let i = 0; i < rfs.length; i++) {
            const t = rfs[i]
            if (t instanceof NE) {
                d.push(t.get(cns[i]))
            } else {
                d.push(t[0] + cns[i])
            }
        }
        ne.appendC(d)
        let end = true
        for (let i = 0; i < rfs.length; i++) {
            const nx = cns[i] + 1
            const t = rfs[i]
            let c = 0
            if (t instanceof NE) {
                c = t.count()
            } else {
                c = t[1] - t[0]
            }
            if (nx >= c) {
                cns[i] = 0
            } else {
                cns[i] = nx
                end = false
                break
            }
        }
        if (end) {
            break
        }
    }
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
            let se = parseSE(sground, this.raw_structs[i])
            sground[se.name] = se
        }
        let sgraph = new Map()
        let p = new P(sground, sgraph)
        l("[BUILD] END")
        return p
    }
}
