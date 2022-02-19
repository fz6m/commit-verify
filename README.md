# commit-verify

Auto commit message format verify hook

## Usage

```bash
  pnpm add -D commit-verify
```

Add verify command `cv` to husky hook file `.husky/commit-msg` :

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install cv $1
```

## Config

example:

```js
// `cv.config.js` or `.cvrc.json` ...
const { defineConfig } = require('commit-verify')

module.exports = defineConfig({
  // auto add emoji to commit message
  emoji: true,
})
```

### Available configuration

#### emoji

- default: `false`

whether auto add emoji to commit msg

```js
  // pos: start
  feat(scope): msg -> feat(scope)🍉: msg
  // pos: end
  feat(scope): msg -> feat(scope): msg 🍉
```

#### emojiList

- default: `['🍓', '🍉', '🍇', '🍒', '🍡', '🍥', '🍩', '🍰', '🍭', '🌸', '🌈']`

will add random emoji list

#### emojiPos

- default: `start`

- enum: `start` | `end`

will add emoji position in commit msg

#### format

- default: `/^(((feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release|deps?|merge|examples?|revert)(\(.+\))?:)|(Merge|Revert|Version)) .{1,50}$/i`

- type: `RegExp` | `false`

allow commit msg format.

default support:

1. github `Merge` / `Revert`

2. common commit type

3. changesets `Version Packages`

#### transformer

- default: `(v) => v`

custom commit msg transoform on format regex check after

## Command line

Following options are supported for command line use:

- `emoji`

- `emojiPos`

example:

```bash
  npx --no-install cv $1 --emoji --emoji-pos=end
```

## License

MIT
