const debugController = require('debug')('controller')
const WebSocket = require('ws')
const Checker = require('./checker')

const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')

let controller = obj => {
  let checkers = obj.checkers.map(opt => new Checker(opt))

  ws.on('message', data => {
    try {
      let tickers = JSON.parse(data)
      debugController('Tickers received from Binance:', tickers.length)
      checkers.forEach(checker => {
        checker.check(tickers)
      })
    } catch (error) {
      console.log('Error trying to parse JSON data!!!')
    }
  })

  return ws
}

module.exports = controller
