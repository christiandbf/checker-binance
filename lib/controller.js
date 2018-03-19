const binance = require('node-binance-api')
const Queue = require('./queue')
const Checker = require('./checker')

let controller = obj => {
  let queue = new Queue()

  binance.websockets.prevDay(false, (error, response) => {
    error
      ? console.log('Error trying to get the data from Binance!!!')
      : queue.push([response])
  })

  let checkers = obj.checkers.map((obj) => new Checker(obj))

  queue.on('data', function () {
    let data = this.shift()
    checkers.forEach(checker => {
      checker.check(data)
    })
    this.release()
  })
}

module.exports = controller
