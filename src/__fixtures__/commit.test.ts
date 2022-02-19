import { check } from '../check'
import { join } from 'path'
import { DEFAULT_CONFIG } from '../interface'
import { readFile } from 'fs/promises'

const COMMIT_FILES = {
  normal: join(__dirname, '../__fixtures__/commits/normal.txt'),
  invalid: join(__dirname, '../__fixtures__/commits/invalid.txt'),
  notFound: join(__dirname, '../__fixtures__/commits'),
  emoji: join(__dirname, '../__fixtures__/commits/emoji.txt'),
  hasEmoji: join(__dirname, '../__fixtures__/commits/has-emoji.txt'),
}

const mockProcess = async (output: string, method: (...args: any[]) => any) => {
  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((() => {}) as any)
  const mockStdout = jest
    .spyOn(console, 'error')
    .mockImplementation((content) => {
      return content?.includes?.(output)
    })
  await method()
  expect(mockExit).toHaveBeenCalledWith(1)
  expect(mockStdout).toHaveReturnedWith(true)
  mockExit.mockRestore()
  mockStdout.mockRestore()
}

const checkFile = async (path: string, content: string) => {
  const c = (await readFile(path, 'utf-8')).trim()
  expect(content === c).toEqual(true)
}

test('correct commit', async () => {
  await check({ msgPath: COMMIT_FILES.normal, options: DEFAULT_CONFIG })
})

test('invalid commit', async () => {
  await mockProcess(`invalid commit`, () =>
    check({ msgPath: COMMIT_FILES.invalid, options: DEFAULT_CONFIG }),
  )
})

test('not found commit', async () => {
  await mockProcess(`Not found commit`, () =>
    check({ msgPath: COMMIT_FILES.notFound, options: DEFAULT_CONFIG }),
  )
})

test('add emoji: do nothing', async () => {
  await check({ msgPath: COMMIT_FILES.emoji, options: DEFAULT_CONFIG })
  await checkFile(COMMIT_FILES.emoji, `feat(scope): some`)
})

const emojiCheck = async (opts: {
  msgPath: string
  expectContent: string
  opts?: any
}) => {
  // check
  const newMsg = await check({
    msgPath: opts.msgPath,
    options: {
      ...DEFAULT_CONFIG,
      emoji: true,
      emojiList: ['🌸'],
      ...opts.opts,
    },
    notWrite: true,
  })
  expect(newMsg).toEqual(opts.expectContent)
}

test('add emoji: start', async () => {
  await emojiCheck({
    msgPath: COMMIT_FILES.emoji,
    expectContent: `feat(scope)🌸: some`,
  })
})

test('add emoji: end', async () => {
  await emojiCheck({
    msgPath: COMMIT_FILES.emoji,
    expectContent: `feat(scope): some 🌸`,
    opts: { emojiPos: 'end' },
  })
})

test('add emoji: has emoji', async () => {
  await emojiCheck({
    msgPath: COMMIT_FILES.hasEmoji,
    expectContent: `feat(scope): some 😊`,
  })
})

test('add emoji: none', async () => {
  await emojiCheck({
    msgPath: COMMIT_FILES.emoji,
    expectContent: `feat(scope): some`,
    opts: { emojiPos: 'ss' },
  })

  await emojiCheck({
    msgPath: COMMIT_FILES.emoji,
    expectContent: `feat(scope)🚀: some`,
    opts: { emojiList: ['🚀'] },
  })

  await emojiCheck({
    msgPath: COMMIT_FILES.emoji,
    expectContent: `feat(scope): some`,
    opts: { emojiList: ['🚀'], emoji: false },
  })
})

test('commit transformer', async () => {
  await emojiCheck({
    msgPath: COMMIT_FILES.emoji,
    expectContent: `feat: some`,
    opts: {
      emoji: false,
      transformer: (c: string) => c.replace('(scope)', ''),
    },
  })
})

test('not format', async () => {
  await emojiCheck({
    msgPath: COMMIT_FILES.invalid,
    expectContent: `sss`,
    opts: {
      format: false,
    },
  })
})
