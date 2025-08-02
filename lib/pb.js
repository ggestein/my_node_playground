const TYPE_I2S = new Map()
TYPE_I2S.set(0, "num")
TYPE_I2S.set(1, "str")
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
        const fii = this.belongNamedEnum.getFieldIdx(name)
        if (fii === undefined) {
            throw new Error(` ===== No field [${name}] in [${this.belongNamedEnum.name}]`)
        }
        return this.data[fii]
    }
    e() {
        return this.belongNamedEnum
    }
    i() {
        return this.idx
    }
    ks() {
        return this.belongNamedEnum.allkeys()
    }
    x() {
        let r = {}
        const aks = this.belongNamedEnum.allkeys()
        for (let i = 0; i < aks.length; i++) {
            let k = aks[i]
            let v = this.g(k)
            if (v instanceof C) {
                v = v.x()
            }
            r[k] = v
        }
        return r
    }
    toString() {
        return `<[${this.idx}]${this.belongNamedEnum.name}>`
    }
}

class SNE {
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
    getFieldIdx(name) {
        return this.fi.get(name)[0]
    }
    allkeys() {
        let r = []
        for (let [k, v] of this.fi) {
            r.push(k)
        }
        return r
    }
    appendFI(name, info) {
        this.fi.set(name, info)
    }
    appendC(data) {
        let c = new C(this, this.cs.length, data)
        this.cs.push(c)
    }
    parse(x) {
        for (let i = 0; i < this.cs.length; i++) {
            let pass = true
            for (let k in x) {
                if (this.cs[i].g(k) !== x[k]) {
                    pass = false
                }
            }
            if (pass) {
                return i
            }
        }
        return null
    }
}

class DNE {
    constructor(name) {
        this.name = name
        this.fid = []
        this.fi = new Map()
    }
    count() {
        if (this.mc === undefined) {
            let r = 1
            for (let i = 0; i < this.fid.length; i++) {
                const fv = this.fid[i][1]
                if (fv instanceof DNE || fv instanceof SNE) {
                    r = r * fv.count()
                } else {
                    r = r * (fv[1] - fv[0] + 1)
                }
            }
            this.ms = r
        }
        return this.ms
    }
    get(id) {
        if (id < 0 || id >= this.count()) {
            return null
        }
        let d = []
        let idx = id
        for (let i = 0; i < this.fid.length; i++) {
            const fv = this.fid[i][1]
            let c = null
            if (fv instanceof DNE || fv instanceof SNE) {
                c = fv.count()
            } else {
                c = fv[1] - fv[0] + 1
            }
            const m = idx % c
            idx = (idx - m) / c
            if (fv instanceof DNE || fv instanceof SNE) {
                d.push(fv.get(m))
            } else {
                d.push(fv[0] + m)
            }
        }
        return new C(this, id, d)
    }
    allkeys() {
        let r = []
        for (let [k, v] of this.fi) {
            r.push(k)
        }
        return r
    }
    parse(x) {
        let r = 0
        for (let i = this.fid.length - 1; i >= 0; i--) {
            const fv = this.fid[i]
            const fvv = fv[1]
            let c = null
            if (fvv instanceof DNE || fvv instanceof SNE) {
                c = fvv.count()
            } else {
                c = fvv[1] - fvv[0] + 1
            }
            const xk = fv[2]
            const xv = x[xk]
            if (xv === undefined) {
                return null
            }
            let m = null
            if (fvv instanceof DNE || fvv instanceof SNE) {
                m = fvv.parse(xv)
                if (m === null) {
                    return null
                }
            } else {
                m = xv - fvv[0]
                if (m >= c || m < 0) {
                    return null
                }
            }
            r = r * c + m
        }
        return r
    }
    appendFI(name, info) {
        const idx = this.fid.length
        this.fid.push(info)
        this.fi.set(name, idx)
    }
    getFieldIdx(name) {
        return this.fi.get(name)
    }
}

class PG {
    constructor(p, sid, move_cb) {
        this.p = p
        this.sid = sid
        this.hist = []
        this.hid = 0
        this.mcb = move_cb
    }

    cur_sid() {
        if (this.hid !== 0) {
            return this.hist[this.hist.length - this.hid]
        }
        return this.sid
    }

    cur_sdata() {
        const csid = this.cur_sid()
        return this.p.get_situation(csid)
    }
    get_context() {
        return this.p.ctx
    }

    move(input) {
        const psid = this.cur_sid()
        const ts = this.p.get_move_target(psid, input)
        if (ts === undefined || ts === null) {
            if (this.mcb !== undefined && this.mcb !== null) {
                this.mcb(input, this.p.get_situation(psid)[1], undefined)
            }
            return false
        }
        this.hist.splice(this.hist.length - this.hid, this.hid, psid)
        this.sid = ts
        this.hid = 0
        if (this.mcb !== undefined && this.mcb !== null) {
            this.mcb(input, this.p.get_situation(psid)[1], this.p.get_situation(ts)[1])
        }
        return true
    }
    rewind() {
        const psid = this.cur_sid()
        const nhd = this.hid + 1
        if (nhd > this.hist.length) {
            return false
        }
        this.hid = nhd
        const nsid = this.cur_sid()
        if (this.mcb !== undefined && this.mcb !== null) {
            this.mcb(undefined, this.p.get_situation(nsid)[1], this.p.get_situation(psid)[1])
        }
        return true
    }
    check_win() {
        return this.p.check_win(this.cur_sid())
    }
}

class P {
    constructor(ctx, sground, moves, win_check) {
        this.ctx = ctx
        this.sground = sground
        this.moves = moves
        this.sgraph = new Map()
        this.win_check = win_check
    }
    get_situation(id) {
        const [mne, pf] = this.sground.__main__
        let c = null
        try {
            c = mne.get(id)
        } catch (err) {
            return [false, err]
        }
        if (c === null) {
            return [false, new Error(`Id [${id}] out of range`)]
        }
        const r = c.x()
        let pfr = pf(this.ctx, r)
        if (pfr) {
            return [true, r]
        }
        return [false, new Error("Valid but excluded by prefilter")]
    }

    parse_situation_id(s) {
        const [mne, pf] = this.sground.__main__
        let pfr = pf(this.ctx, s)
        if (!pfr) {
            return [false, new Error("Valid but excluded by prefilter")]
        }
        try {
            const id = mne.parse(s)
            return [true, id]
        } catch (err) {
            return [false, err]
        }
    }

    get_valid_input(id) {
        let m = this.sgraph.get(id)
        let sr = null
        let s = null
        if (m === undefined) {
            [sr, s] = this.get_situation(id)
            if (!sr) {
                return null
            }
            m = new Map()
            this.sgraph.set(id, m)
        }
        let r = []
        for (let [k, v] of this.moves) {
            if (this.get_move_target(id, k) !== null) {
                r.push(k)
            }
        }
        return r
    }
    get_move_target(id, input) {
        let m = this.sgraph.get(id)
        let sr = null
        let s = null
        if (m === undefined) {
            [sr, s] = this.get_situation(id)
            if (!sr) {
                return null
            }
            m = new Map()
            this.sgraph.set(id, m)
        }
        let mr = m.get(input)
        if (mr === false) {
            return null
        } else if (mr !== undefined) {
            return mr
        }
        const v = this.moves.get(input)
        if (v === undefined) {
            return null
        }
        if (s == null) {
            [sr, s] = this.get_situation(id)
            if (!sr) {
                return null
            }
        }
        let nx = undefined
        let nid = undefined
        const pf = this.sground.__main__[1]
        nx = v(this.ctx, s)
        if (nx === undefined && nx === null) {
            return null
        }
        nid = this.sground.__main__[0].parse(nx)
        if (nid === undefined) {
            nx = undefined
            return null
        }
        let pfr = pf(this.ctx, nx)
        if (!pfr) {
            nx = undefined
            nid = undefined
            return null
        }
        if (nx === undefined) {
            m.set(input, false)
            return null
        }
        m.set(input, nid)
        return nid
    }
    check_win(id) {
        if (this.win_check === null) {
            return false
        }
        let [sr, s] = this.get_situation(id)
        if (!sr) {
            return false
        }

        return this.win_check(this.ctx, s)
    }
    start(sid, move_cb) {
        return new PG(this, sid, move_cb)
    }
}

class EnumFormatError extends Error {
    constructor(msg, enum_name) {
        super(msg)
        this.name = "EnumFormatError"
        this.enum_name = enum_name
    }
}

const parseNE = (sground, l) => {
    let h = l[0]
    let tl = l[1] 
    let name = h[0]
    console.log(` - parseNE: ${name}`)
    let tsne = sground[name]
    if (tsne) {
        if (!(tsne instanceof SNE)) {
            return;
        }
        // field match check
        let matched = true
        for (let [k, v] in tsne.fi) {
            let cn = undefined
            for (let i = 1; i < h.length; i++) {
                const fp = i - 1
                if (k === h[i]) {
                    cn = fp
                    break
                }
            }
            if (cn === undefined) {
                matched = false
                break
            }
            if (TYPE_S2I.get(tl[cn]) !== v[1]) {
                matched = false
                break
            }
        }
        if (!matched) {
            console.log("FAILED TO MATCHED TYPE")
            return
        }
    } else {
        tsne = new SNE(name)
        for (let i = 1; i < h.length; i++) {
            const fp = i - 1
            tsne.appendFI(h[i], [fp, TYPE_S2I.get(tl[fp])])
            console.log(`   ${h[i]}: ${fp}, ${tl[fp]}`)
        }
        sground[name] = tsne
    }
    for (let i = 2; i < l.length; i++) {
        let d = []
        for (let j = 1; j < l[i].length; j++) {
            d.push(l[i][j])
        }
        tsne.appendC(d)
    }
}

const parseSE = (sground, l) => {
    const name = l[0]
    let ne = sground[name]
    if (ne) {
        if (!(ne instanceof DNE)) {
            return
        }
    } else {
        ne = new DNE(l[0])
        sground[name] = ne
    }
    console.log(` - parseSE: ${l[0]}`)
    let rfs = []
    for (let i = 1; i < l.length; i++) {
        const fin = l[i][0]
        const k = l[i][1]
        const tne = sground[k]
        const fp = i - 1
        if (tne !== undefined) {
            rfs.push(tne)
            ne.appendFI(fin, [fp, tne, fin])
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
            ne.appendFI(fin, [fp, [fr, to], fin])
        }
    }
}

class CTX {
    constructor(sground) {
        this.sg = sground
    }

    get_enum(name) {
        return this.sg[name]
    }

    query(x) {
        return this.sg.__main__[0].parse(x)
    }

    eq(v0, v1) {
        const isObj0 = typeof v0 === 'object' && v0 !== null && !Array.isArray(v0)
        const isObj1 = typeof v1 === 'object' && v1 !== null && !Array.isArray(v1)
        if (isObj0 && isObj1) {
            let c0 = v0
            let c1 = v1
            if (c0 instanceof C && c1 instanceof C) {
                const b0 = c0.belongNamedEnum === c1.belongNamedEnum
                const b1 = c0.idx === c1.idx
                const r = b0 && b1
                return r
            }
        }
        return v0 === v1
    }
}

const situation_check_combine = (pf0, pf1) => {
    return (ctx, s) => {
        return pf1(ctx, s, pf0)
    }
}

const situation_map_combine = (m0, m1) => {
    return (ctx, s) => {
        return m1(ctx, s, m0)
    }
}

export default class PB {
    constructor() {
        this.main = null
        this.raw_enums = []
        this.raw_structs = []
        this.prefilter = []
        this.moves = new Map()
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

    append_prefilter(sq) {
        this.prefilter = situation_check_combine(this.prefilter, sq)
    }

    append_move(i, smap) {
        let tl = this.moves.get(i)
        this.moves.set(i, situation_map_combine(tl, smap))
    }

    append_win_check(wc) {
        this.win_check = situation_check_combine(this.win_check, wc)
    }

    build() {
        const l = console.log
        l("[BUILD] BEGIN")
        let sground = new Object()
        for (let i = 0; i < this.raw_enums.length; i++) {
            parseNE(sground, this.raw_enums[i])
        }
        for (let i = 0; i < this.raw_structs.length; i++) {
            parseSE(sground, this.raw_structs[i])
        }
        const ctx = new CTX(sground)
        const mne = sground[this.main]
        sground.__main__ = [mne, this.prefilter]
        let p = new P(ctx, sground, this.moves, this.win_check)
        l("[BUILD] END")
        return p
    }
}
