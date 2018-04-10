const bugfixes = require('bugfixes')
const AccountModel = require('bugfixes-account-models')
const Logs = require('bugfixes-account-logging')

const bugfunctions = bugfixes.functions

exports.handler = function (event, context, callback) {
  let eventBody = JSON.parse(event.body)

  let account = new AccountModel()
  account.name = eventBody.name
  account.email = eventBody.email
  account.cellphone = eventBody.cellphone
  account.countryCode = eventBody.countryCode

  let log = new Logs()
  log.action = 'Create Account'
  log.content = {
    apiKey: event.requestContext.identity.apiKey,
    name: eventBody.name,
    email: eventBody.email
  }

  account.save((error, result) => {
    if (error) {
      bugfixes.error('Create Error', error)

      log.content.error = error
      log.send()

      callback(error)
    }

    log.send()

    callback(null, bugfunctions.lambdaResult(100, result))
  })
}
