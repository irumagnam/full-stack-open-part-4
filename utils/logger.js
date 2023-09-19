const isEnabled = process.env.NODE_ENV !== 'test'

const info = (...params) => {
  isEnabled && console.log(...params)
}

const error = (...params) => {
  isEnabled && console.error(...params)
}

module.exports = {
  info, error
}