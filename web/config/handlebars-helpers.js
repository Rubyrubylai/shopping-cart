module.exports = {
  Date: (a) => {
    if (a) {
      return a.toISOString().slice(0, 10)
    }
  },

  ifEquals: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    }
    else {
      return options.inverse(this)
    }
  },

  DateTime: (a) => {
    if (a) {
      return a.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    }
  },

  ifEqualsOr: (a, b, c, options) => {
    if (a === b || c) {
      return options.fn(this)
    }
    else {
      return options.inverse(this)
    }
  }
}