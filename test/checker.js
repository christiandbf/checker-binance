const Checker = require('../lib/checker')
const fs = require('fs')
const assert = require('assert')

let tickersOne = JSON.parse(fs.readFileSync('./test/tickers/1.json'))
let tickersTwo = JSON.parse(fs.readFileSync('./test/tickers/2.json'))
let tickersThree = JSON.parse(fs.readFileSync('./test/tickers/3.json'))
let tickersFour = JSON.parse(fs.readFileSync('./test/tickers/4.json'))

describe('Checker', function () {
  it('Checking condition, update and do methods', function () {
    let checker = new Checker(
      {
        'name': 'test',
        'condition': (lastTicker, currentTicker) => {
          assert(lastTicker.symbol === currentTicker.symbol)
          return lastTicker.currentClose === currentTicker.currentClose
        },
        'update': (lastTicker, currentTicker) => {
          assert(lastTicker.symbol === currentTicker.symbol)
          return currentTicker
        },
        'do': (data) => {
          data.filteredTickers.forEach((tickers) => {
            assert(tickers.lastTicker.symbol === tickers.currentTicker.symbol)
            assert(tickers.lastTicker.currentClose === tickers.currentTicker.currentClose)
          })
        }
      }
    )
    checker.check(tickersOne)
    checker.check(tickersTwo)
    checker.check(tickersThree)
    checker.check(tickersFour)
  })
  it('Adding new markets to check', function () {
    let checker = new Checker(
      {
        'name': 'test',
        'condition': (lastTicker, currentTicker) => {
          assert(lastTicker.symbol === currentTicker.symbol)
          return true
        },
        'update': (lastTicker, currentTicker) => {
          assert(lastTicker.symbol === currentTicker.symbol)
          return currentTicker
        },
        'do': (data) => {
          data.filteredTickers.forEach((tickers) => {
            assert(tickers.lastTicker.symbol === tickers.currentTicker.symbol)
          })
        }
      }
    )
    checker.check([
      {
        'symbol': 'btc-usd'
      },
      {
        'symbol': 'eth-usd'
      }
    ])
    checker.check([
      {
        'symbol': 'usd-btc'
      },
      {
        'symbol': 'eth-usd'
      }
    ])
    checker.check([
      {
        'symbol': 'btc-usd'
      },
      {
        'symbol': 'usd-btc'
      }
    ])
    checker.check([
      {
        'symbol': 'eth-usd'
      },
      {
        'symbol': 'ltc-usd'
      }
    ])
  })
})
