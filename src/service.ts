import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { check } from './check'
import { cosmiconfig } from 'cosmiconfig'
import { DEFAULT_CONFIG, DEFAULT_CONFIG_NAME, EEmojiPos } from './interface'
import type { IConfig } from './interface'
import { merge } from 'lodash'

export async function run() {
  const argv = await yargs(hideBin(process.argv)).argv
  const { config } = await getConfig()

  const options: Required<IConfig> = {
    // allow cli import
    emoji: (argv?.emoji as boolean | undefined) ?? config?.emoji,
    emojiPos: (argv?.emojiPos as EEmojiPos | undefined) ?? config?.emojiPos,
    // must via config file
    emojiList: config?.emojiList,
    format: config?.format,
    transformer: config?.transformer,
  }

  await check({
    msgPath: argv._?.[0] as string | undefined,
    options,
  })
}

export async function getConfig(opts: { from?: string } = {}) {
  const explorer = cosmiconfig(DEFAULT_CONFIG_NAME)
  const result = await explorer.search(opts?.from || process.cwd())
  return {
    config: merge({}, DEFAULT_CONFIG, result?.config) as Required<IConfig>,
    configPath: result?.filepath,
  }
}
