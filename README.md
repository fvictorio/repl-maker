# repl-maker

Make a customized node REPL with ease.

## The problem

Building a custom REPL is not hard with the [`repl`](https://nodejs.org/api/repl.html)
module, but you need a non-trivial amount of boilerplate to have things you
might expect out of the box.

## This solution

This module exposes a function that creates and starts a
[`REPLServer`](https://nodejs.org/api/repl.html#repl_class_replserver) with some
packed features:

- **Multiline expressions**: You don't have to write every statement in a single
  line.
- **Command history**: You can pass a path to a history file that will save the
  command history between sessions (using
  [`repl.history`](https://www.npmjs.com/package/repl.history)).
- **Promises evaluation**: Avoid doing things like `(async () => { const foo =
  await getFoo(); console.log(foo) })()`: every expression that evaluates to a
  promise will be waited. Just `getFoo()` will work.

## Usage

Install it:

```
npm install repl-maker
```

create your repl:

```javascript
const path = require('path')
const os = require('os')
const makeRepl = require('repl-maker')

const historyFile = path.join(os.homedir(), '.my_repl_history')
const context = {
  answer: 42,
  square: (x) => x*x
}

makeRepl({ historyFile, context })
```

and use it:

```
$ node index.js
> answer
42
> Promise.resolve(3)
3
> square(5)
25
```

## Configuration

The `makeRepl` function accepts an object with these options:

- `prompt` _(string)_ - The prompt of your REPL (default: `> `)
- `context` _(object)_: Every key in this object will be available as a local
  variable (default: `{}`)
- `historyFile` _(string)_ - Path to a file that will save the command history
  (default: `null`, meaning that no history file will be generated)
- `evalAsync` _(boolean)_ - Configures if the REPL waits until promises are resolved
  or not (default: `true`)
- `recoverErrors` _(boolean)_ - Configures if multiline expressions are allowed
  or not (default: `true`)
- `onExit` _(function)_ - A callback that will be executed when the user exits
  the REPL (default: `null`)

It returns a [`REPLServer`](https://nodejs.org/api/repl.html#repl_class_replserver) that you can further
customize.

## Use cases

If you find yourself opening a node REPL and requiring some stuff of your
project to try it out, then this module can help you.

A very straightforward example is an express server with some models. You can
create a minimal `repl.js` file:

```javascript
const makeRepl = require('repl-maker')
const db = require('./models')

makeRepl({
  context: { db }
})
```

and add a npm script `"repl": "node repl.js"`. Then you can start it and
interact with your models:

```
npm run repl
> db.findUser({ id: 1 }).then(user => user.name)
'John Doe'
```
