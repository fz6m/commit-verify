export enum EEmojiPos {
  start = 'start',
  end = 'end',
}

export interface IConfig {
  /**
   * whether auto add emoji to commit msg
   * @default false
   */
  emoji?: boolean
  /**
   * will add random emoji list
   * @default ['🍓', '🍉', '🍇', '🍒', '🍡', '🍩', '🍰', '🍭', '🌸', '🌈']
   */
  emojiList?: string[]
  /**
   * will add emoji position in commit msg
   * @enum start 'feat(scope): some' => 'feat(scope)🍓: some'
   * @enum end 'feat(scope): some' => 'feat(scope): some 🍓'
   * @default start
   */
  emojiPos?: EEmojiPos
  /**
   * allow commit msg format
   */
  format?: RegExp | false
  /**
   * custom commit msg transoform on format regex check after
   */
  transformer?: (commitMsg: string) => string
}

export const DEFAULT_CONFIG_NAME = 'cv'
export const DEFAULT_CONFIG: Required<IConfig> = {
  emoji: false,
  emojiList: ['🍓', '🍉', '🍇', '🍒', '🍡', '🍩', '🍰', '🍭', '🌸', '🌈'],
  emojiPos: EEmojiPos.start,
  /**
   * Merge: for github
   * Revert: for github
   * Version Packages: for changesets
   */
  format:
    /^(((feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release|deps?|merge|examples?|revert)(\(.+\))?:)|(Merge|Revert|Version)) .{1,50}$/i,
  transformer: (c) => c,
}
