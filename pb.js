export class PB {
    constructor() {
        this.raw_enums = []
        this.raw_structs = []
    }

    append_enum(arg) {
        this.raw_enums.push(arg)
    }
    
    append_struct(arg) {
        this.raw_structs.push(arg)
    }
    build() {
        const l = console.log
        l("[BUILD] BEGIN")
        l(`this.raw_enums.length = ${this.raw_enums.length}`)
        for (let i = 0; i < this.raw_enums.length; i++) {
            l(`[${i}]`)
            l(this.raw_enums[i])
        }
        l(`this.raw_structs.length = ${this.raw_structs.length}`)
        for (let i = 0; i < this.raw_structs.length; i++) {
            l(`[${i}]`)
            l(this.raw_structs[i])
        }
        l("[BUILD] END")
    }
}
