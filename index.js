const repl = require('repl')
const vm = require('vm')

module.exports = function makeRepl({historyFile = null, prompt = '> ', evalAsync = true, recoverErrors = true, context = {}} = {}) {
  const replOptions = {
    prompt,
    eval: (cmd, context, filename, callback) => {
      try {
        const result = vm.runInContext(cmd, context, {
          displayErrors: false
        })

        if (evalAsync && result && result.then) {
          result.then(x => callback(null, x)).catch(e => callback(e))
        } else {
          callback(null, result)
        }
      } catch (e) {
        if (recoverErrors && isRecoverableError(e)) {
          return callback(new repl.Recoverable(e))
        }

        callback(e)
      }
    }
  }

  const r = repl.start(replOptions)

  for (const expose of Object.keys(context)) {
    r.context[expose] = context[expose]
  }

  if (historyFile) {
    require('repl.history')(r, historyFile)
  }
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message)
  }
  return false
}
