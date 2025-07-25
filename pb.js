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
    g(name) {
        const fi = this.belongNamedEnum.getField(name)
        if (fi === undefined) {
            throw new Error(` ===== No field [${name}] in [${this.belongNamedEnum.name}]`)
        }
        return this.data[fi[0]]
    }
    e() {
        return this.belongNamedEnum
    }
    i() {
        return this.idx
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
        throw new Error(` ===== Index [${i}] over range for [${this.name}](0 ~ ${this.cs.length})`)
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
    constructor(ctx, sground, sgraph) {
        this.ctx = ctx
        this.sground = sground
        this.sgraph = sgraph
    }

    total_situation_count() {
        return this.sground.__main__.length
    }

    get_situation(id) {
        if (id < 0 && id >= this.sground.__main__.length) {
            return null
        }
        return this.sground.__main__[id]
    }

    query_situation(fn) {
        let sl = []
        try {
            const m = this.sground.__main__
            for (let i = 0; i < m.length; i++) {
                const cs = m[i]
                if (fn(this.ctx, m[i])) {
                    sl.push(i)
                }
            }
        } catch (err) {
            return [false, err]
        }
        return [true, sl]
    }

    get_valid_input(id) {
        const m = this.sgraph[id]
        if (m === undefined) {
            return null
        }
        let r = []
        for (let [k, v] in m) {
            r.push(k)
        }
        return r
    }
    get_move_target(id, input) {
        const m = this.sgraph[id]
        if (m === undefined) {
            return null
        }
        const t = m.get(input)
        if (t === undefined) {
            return null
        }
        return t
    }
    dump() {
        const l = console.log
        l("===================================")
        let ms = null
        for (let k in this.sground) {
            if (k == "__main__") {
                ms = this.sground[k]
                continue
            }
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
        l("==== MAIN ====")
        for (let i = 0; i < ms.length; i++) {
            l(`[${ms[i].belongNamedEnum.name}:${ms[i].idx}]`)
        }
        l("==== GRAPH ====")
        for (let [k0, v0] of this.sgraph) {
            l(`[${k0}]`)
            for (let [k1, v1] of v0) {
                l(` - ${k1} -> ${v1}`)
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
            let seg = k.split("~")
            let fr = null
            let to = null
            if (seg.length == 2) {
                fr = +seg[0]
                to = +seg[1]
            } else {
                seg = k.split(";")
                if (seg.length == 2) {
                    fr = +seg[0]
                    to = fr + (+seg[1]) - 1
                }
            }
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
                c = t[1] - t[0] + 1
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

class CTX {
    constructor(sground) {
        this.sg = sground
    }

    get_enum(name) {
        return this.sg[name]
    }

    eq(v0, v1) {
        if (v0 instanceof C && v1 instanceof C) {
            return v0.belongNamedEnum === v1.belongNamedEnum && v0.idx == v1.idx
        }
        return v0 === v1
    }
}

export default class PB {
    constructor() {
        this.main = null
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

    set_main(m) {
        this.main = m
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
        let sground = new Object()
        for (let i = 0; i < this.raw_enums.length; i++) {
            let ne = parseNE(this.raw_enums[i])
            sground[ne.name] = ne
        }
        for (let i = 0; i < this.raw_structs.length; i++) {
            let se = parseSE(sground, this.raw_structs[i])
            sground[se.name] = se
        }
        const ctx = new CTX(sground)
        const mne = sground[this.main]
        let sl = []
        for (let i = 0; i < mne.count(); i++) {
            const cc = mne.get(i)
            if (this.prefilter(ctx, mne.get(i))) {
                sl.push(cc)
            }
        }
        sground.__main__ = sl
        let sgraph = new Map()
        for (let i0 = 0; i0 < sl.length; i0++) {
            let adj = new Map()
            for (let i1 = 0; i1 < sl.length; i1++) {
                if (i0 == i1) {
                    continue;
                }
                const s0 = sl[i0]
                const s1 = sl[i1]
                for (let ir = 0; ir < this.rules.length; ir++) {
                    if (this.rules[ir][0](ctx, s0, s1)) {
                        adj.set(i0, [this.rules[ir][1], i1])
                    }
                }
            }
            sgraph.set(i0, adj)
        }
        let p = new P(ctx, sground, sgraph)
        l("[BUILD] END")
        return p
    }
}
