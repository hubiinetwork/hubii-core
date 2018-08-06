const trezorHanlder = require('./trezor')

const handlers = {
  trezor: trezorHanlder
}
const walletTypes = Object.keys(handlers)

const protocolNames = walletTypes.map(type => {
  return handlers[type].PROTOCOL_NAME
})

module.exports = {
  handlers: handlers,
  walletTypes: walletTypes,
  protocolNames: protocolNames
}