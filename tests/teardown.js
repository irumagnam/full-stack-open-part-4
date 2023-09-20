module.exports = async () => {

  if (process.env.NODE_ENV === 'test') {
    const instance = global.__MONGOINSTANCE
    await instance.stop()
  }

  process.exit(0)
}