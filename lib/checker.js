const debug = require('debug')('checker')

class Checker {
  constructor (obj) {
    debug('Creating checker')
    this._tickers = null
    this._name = obj.name
    this._condition = obj.condition
    this._update = obj.update
    this._do = obj.do
  }

  check (tickers) {
    debug('New tickers')
    if (!this._tickers) {
      this._tickers = tickers
      debug('Saving first tickers:', tickers.length)
      return
    }

    let filteredTickers = []
    let tickersToSave = []

    tickers.forEach((currentTicker) => {
      let indexLast = this._tickers.findIndex((lastTicker) => lastTicker.s === currentTicker.s)
      if (indexLast !== -1) {
        let lastTicker = this._tickers[indexLast]
        if (this._condition(lastTicker, currentTicker)) { filteredTickers.push({ 'lastTicker': lastTicker, 'currentTicker': currentTicker }) }
        tickersToSave.push(this._update(lastTicker, currentTicker))
      } else {
        tickersToSave.push(currentTicker)
      }
    })

    this._tickers.forEach((lastTicker) => {
      if (!tickersToSave.find(ticker => ticker.s === lastTicker.s)) tickersToSave.push(lastTicker)
    })

    this._tickers = tickersToSave
    debug('Checking finished - Tickers received:', tickers.length, 'Last tickers:', this._tickers.length, 'Filtered tickers:', filteredTickers.length)
    if (filteredTickers.length > 0) { this._do({ name: this._name, filteredTickers }) }
  }
}

module.exports = Checker
