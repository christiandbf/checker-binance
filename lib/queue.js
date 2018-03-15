const EventEmitter = require('events')

class Queue extends EventEmitter {
  constructor () {
    super()
    this._data = []
    this.isUsed = false
  }

  _emitData () {
    this.isUsed = true
    this.emit('data')
  }

  push (data) {
    this._data.push(data)
    if (!this.isUsed) { this._emitData() }
  }

  shift () {
    return this._data.shift()
  }

  release () {
    this.isUsed = false
    if (this._data.length) { this._emitData() }
  }
}

module.exports = Queue
