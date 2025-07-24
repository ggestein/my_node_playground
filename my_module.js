export class Player {
    constructor(name) {
        this.name = name
    }
    sayHello(hint) {
        console.log(`${hint}, Hello, I am ${this.name}`)
    }
}
