const api = require('binance')
const ws = new api.BinanceWS(true)
const Queue = require('./queue')
const Checker = require('./checker')

let controller = obj => {
  let queue = new Queue()
  ws.onAllTickers(data => queue.push(data))

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
