class Checker {
  constructor (obj) {
    this._tickers = null
    this._name = obj.name
    this._condition = obj.condition
    this._update = obj.update
    this._do = obj.do
  }

  check (tickers) {
    if (!this._tickers) {
      this._tickers = tickers
    } else {
      let filteredTickers = []
      let tickersToSave = []
      tickers.forEach((currentTicker) => {
        let lastTicker = this._tickers.find((ticker) => currentTicker.symbol === ticker.symbol)
        if (lastTicker === undefined) {
          tickersToSave.push(currentTicker)
        } else {
          if (this._condition(lastTicker, currentTicker)) { filteredTickers.push({ 'lastTicker': lastTicker, 'currentTicker': currentTicker}) }
          tickersToSave.push(this._update(lastTicker, currentTicker))
        }
      })
      this._tickers.forEach((lastTicker) => {
        if (tickersToSave.find((tickerToSave) => tickersToSave.symbol === lastTicker.symbol) === undefined) { tickersToSave.push(lastTicker) }
      })
      this._tickers = tickersToSave
      if (filteredTickers.length > 0) { this._do({name: this._name, filteredTickers}) }
    }
  }
}

module.exports = Checker
