module.exports = {
  Date: (a) => {
    if (a) {
      return a.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })
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
    return a.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  }
}