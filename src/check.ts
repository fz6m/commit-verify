import { EEmojiPos } from './interface'
import type { IConfig } from './interface'
import lodash, { isRegExp } from 'lodash'
import emojiRegex from 'emoji-regex'
import fs from 'fs'
import chalk from 'chalk'

interface IMockOpts {
  notWrite?: boolean
}

interface ICheckOpts extends IMockOpts {
  msgPath?: string
  options: Required<IConfig>
}

export const check = async (opts: ICheckOpts) => {
  const { msgPath, options, notWrite } = opts

  if (
    !msgPath ||
    !fs.existsSync(msgPath) ||
    fs.statSync(msgPath).isDirectory()
  ) {
    console.error(
      chalk.red(`Not found commit msg file path, please check '$1' is passed.`),
    )
    return process.exit(1)
  }

  const msg = fs.readFileSync(msgPath, 'utf-8').trim()
  let newMsg = msg
  const { format, emojiList, emoji, emojiPos, transformer } = options
  const hasFormat = isRegExp(format)

  // check format
  if (hasFormat) {
    const allow = format.test(msg)
    if (!allow) {
      console.error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
          `invalid commit message format.`,
        )}\n\n` +
          chalk.red(
            `  Please enter the correct format of the commit msg. Examples:\n\n`,
          ) +
          `    ${chalk.green(
            `feat(bundler-webpack): add 'comments' option`,
          )}\n` +
          `    ${chalk.green(
            `fix(core): handle events on blur (close #28)`,
          )}\n`,
      )
      return process.exit(1)
    }
  }

  // add emoji
  // if not format, unable to find add emoji position
  if (hasFormat && emoji) {
    const emojiReg = emojiRegex()
    if (!Array.from(msg.matchAll(emojiReg)).length) {
      const addEmoji = lodash.sample(emojiList)

      if (emojiPos === EEmojiPos.start) {
        const colonIdx = msg.indexOf(':')
        const prefix = msg.slice(0, colonIdx)
        const tail = msg.slice(colonIdx)
        newMsg = `${prefix}${addEmoji}${tail}`
      }
      if (emojiPos === EEmojiPos.end) {
        newMsg = `${msg} ${addEmoji}`
      }

      console.log(chalk.blue(`Auto added emoji (${addEmoji}) to commit msg.`))
    }
  }

  // transform
  if (transformer) {
    newMsg = transformer(newMsg)
  }

  // rewrite
  if (!notWrite && newMsg !== msg) {
    fs.writeFileSync(msgPath, newMsg, 'utf-8')
  }

  return newMsg
}
