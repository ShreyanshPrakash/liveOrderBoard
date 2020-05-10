const LiveBoard = require('./src/liveBoard');


const model = {
    userId: 1,
    orderQuantity: 35,
    pricePerKg: 300,
    orderType: 'SELL'
}

const modelTwo = {
    userId: 1,
    orderQuantity: 35,
    pricePerKg: 3000,
    orderType: 'SELL'
}

const modelThree = {
    userId: 1,
    orderQuantity: 20,
    pricePerKg: 3000,
    orderType: 'BUY'
}

const modelFour = {
    userId: 1,
    orderQuantity: 350,
    pricePerKg: 3000,
    orderType: 'BUY'
}

const modelFive = {
    userId: 1,
    orderQuantity: 1000,
    pricePerKg: 3000,
    orderType: 'SELL'
}

const summaryPattern = '[orderQuantity] kg for $[pricePerKg] order [orderList]'

let liveBoard = new LiveBoard([], summaryPattern);

console.log( liveBoard );

liveBoard.registerItem( model );
liveBoard.registerItem( modelTwo );
liveBoard.registerItem( modelThree );
liveBoard.registerItem( modelFour );
let data = liveBoard.registerItem( model );
console.log(
    liveBoard.getItemSummary()
)

// run node test.js