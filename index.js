const bugfixes = require('bugfixes')
const AccountModel = require('bugfixes-account-models')
const Logs = require('bugfixes-account-logging')

const bugfunctions = bugfixes.functions

exports.handler = function (event, context, callback) {
  let eventBody = JSON.parse(event.body)

  let account = new AccountModel()
  account.accoutName = eventBody.name
  account.email = eventBody.email
  account.cellphone = eventBody.cellphone
  account.countryCode = eventBody.country

  let log = new Logs()
  log.action = 'Create Account'
  log.content = {
    apiKey: event.requestContext.identity.apiKey,
    name: event.body.name,
    email: event.body.email
  }
  account.save((error, result) => {
    if (error) {
      log.content.error = error

      log.send()
      bugfunctions.error('Create Error', error)

      return callback(error)
    }

    log.send()

    return callback(null, {
      code: 100,
      message: result
    })
  })
}
