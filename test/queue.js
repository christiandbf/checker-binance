const Queue = require('../lib/queue')

describe('Queue', function () {
  it('Push method', function (done) {
    let queue = new Queue()
    let isEventEmitted = false
    queue.on('data', () => {
      done()
      isEventEmitted = true
    })
    queue.push('test')
    setTimeout(() => {
      if (!isEventEmitted) { done(new Error('Data Event not Emitted')) }
    }, 50)
  })
  it('Shift method', function (done) {
    let queue = new Queue()
    let dataToSave = 'test'
    queue.on('data', function () {
      this.shift() === dataToSave
        ? done() : done(new Error('Data saved is not the same to the shift method'))
    })
    queue.push(dataToSave)
  })
  it('Release method', function (done) {
    let queue = new Queue()
    let count = 0
    let number = 10
    queue.on('data', function () {
      count++
      this.shift()
      if (count === number) { done() }
      setTimeout(() => this.release(), 100)
    })
    for (let index = 0; index < number; index++) {
      queue.push(index)
    }
  })
})
