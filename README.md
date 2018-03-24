# checker-binance

Check if a market on Binance accomplishes a given condition.

## Install  

```npm install checker-binance --save```

## Getting started

The module uses the [Web Socket Stream API](https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md) to fetch the data of all markets, pushed every second. The stream used is "All Market Tickers Stream".

This module exposes a function which receives an object. In this object, you define a set of checker objects in an array property called "checkers".

The properties of a checker object are the following:

* "name": This name is to identify the condition used to check in the data received in "do" method.
* "condition": Condition to check against the tickers - You receive two tickers (last and current) to check.
* "update": Function to decide which ticker must be the last - You receive two tickers (last and current) to decide.
* "do": You receive here the tickers which accomplish the condition.

To check if the markets accomplish a condition the module uses two tickers, "lastTicker" and "currentTicker". The lastTicker is taken in a previous time than currentTicker.

Below you will find an example to find drops of 5% in a time less than 3 minutes (180000ms).

```javascript
const controller = require('checker-binance')

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
```  

The properties of the tickers received in the functions condition, update and do are the following:

```javascript
{
  "e": "24hrTicker",  // Event type
  "E": 123456789,     // Event time
  "s": "BNBBTC",      // Symbol
  "p": "0.0015",      // Price change
  "P": "250.00",      // Price change percent
  "w": "0.0018",      // Weighted average price
  "x": "0.0009",      // Previous day's close price
  "c": "0.0025",      // Current day's close price
  "Q": "10",          // Close trade's quantity
  "b": "0.0024",      // Best bid price
  "B": "10",          // Bid bid quantity
  "a": "0.0026",      // Best ask price
  "A": "100",         // Best ask quantity
  "o": "0.0010",      // Open price
  "h": "0.0025",      // High price
  "l": "0.0010",      // Low price
  "v": "10000",       // Total traded base asset volume
  "q": "18",          // Total traded quote asset volume
  "O": 0,             // Statistics open time
  "C": 86400000,      // Statistics close time
  "F": 0,             // First trade ID
  "L": 18150,         // Last trade Id
  "n": 18151          // Total number of trades
}
```

The object received in the do method is the following:

```javascript
{
  "name": "drops",
  "filteredTickers": [
    {
      "lastTicker": {
        "e": "24hrTicker",
        "E": 1521851881867,
        "s": "NEBLBNB",
        "p": "0.16218000",
        "P": "17.413",
        "w": "0.99093673",
        "x": "0.92601000",
        "c": "1.09355000",
        "Q": "0.82000000",
        "b": "1.05665000",
        "B": "20.41000000",
        "a": "1.09355000",
        "A": "151.90000000",
        "o": "0.93137000",
        "h": "1.17752000",
        "l": "0.66454000",
        "v": "41141.54000000",
        "q": "40768.66305240",
        "O": 1521765481863,
        "C": 1521851881863,
        "F": 166088,
        "L": 169998,
        "n": 3911
      },
      "currentTicker": {
        "e": "24hrTicker",
        "E": 1521851883999,
        "s": "NEBLBNB",
        "p": "0.12529000",
        "P": "13.452",
        "w": "0.99095091",
        "x": "0.92601000",
        "c": "1.05666000",
        "Q": "3.27000000",
        "b": "1.05666000",
        "B": "29.23000000",
        "a": "1.09352000",
        "A": "5.43000000",
        "o": "0.93137000",
        "h": "1.17752000",
        "l": "0.66454000",
        "v": "41149.58000000",
        "q": "40777.21390110",
        "O": 1521765483995,
        "C": 1521851883995,
        "F": 166088,
        "L": 170001,
        "n": 3914
      }
    }
  ]
}
```
