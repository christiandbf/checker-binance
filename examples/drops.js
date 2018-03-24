const debug = require('debug')('test')
const controller = require('../index')

const PERCENTAGE = 0.05
const TIME = 180000

controller({
  'checkers': [
    {
      'name': 'drops',
      'condition': (lastTicker, currentTicker) => currentTicker.c <= (lastTicker.c * (1 - PERCENTAGE)),
      'update': (lastTicker, currentTicker) => {
        if (currentTicker.E - lastTicker.E > TIME) {
          return currentTicker
        } else if (currentTicker.c <= (lastTicker.c * (1 - PERCENTAGE))) {
          return currentTicker
        } else if (currentTicker.c > lastTicker.c) {
          return currentTicker
        } else {
          return lastTicker
        }
      },
      'do': data => {
        data.filteredTickers.forEach((ticker) => {
          debug('New data checked')
          console.log(
            'Symbol:', ticker.lastTicker.s + ' - ' + ticker.currentTicker.s,
            'Last close:', ticker.lastTicker.c,
            'Current close', ticker.currentTicker.c,
            'Last Time:', (new Date(ticker.lastTicker.E)).toLocaleString(),
            'Current Time:', (new Date(ticker.currentTicker.E)).toLocaleString()
          )
        })
      }
    }
  ]
})
