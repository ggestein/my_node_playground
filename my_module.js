class Toy {
    constructor(player, price) {
        this.belongPlayer = player
        this.price = price
    }
    total_price(r = 1) {
        let ir = 1
        if (this.belongPlayer.name == "John") {
            ir = 2
        }
        return this.price * r * ir
    }
}

export class Player {
    constructor(name) {
        this.name = name
    }
    sayHello(hint) {
        console.log(`${hint}, Hello, I am ${this.name}`)
    }
    giveToy(price) {
        return new Toy(this, price)
    }
}
