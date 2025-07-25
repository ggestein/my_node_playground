import {Player} from "./my_module.js"

const test_func = (name) => {
    let player = new Player(name)
    player.sayHello("Yes")

    let toy0 = player.giveToy(100)
    console.log("toy0.total_price() = ", toy0.total_price())
    let toy1 = player.giveToy(150)
    console.log("toy1.total_price() = ", toy1.total_price())
}

test_func("John")
test_func("Tom")
