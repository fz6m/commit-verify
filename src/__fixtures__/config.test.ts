import { join } from 'path'
import { DEFAULT_CONFIG } from '../interface'
import { getConfig } from '../service'

const CONFIG_PATHS = {
  js: join(__dirname, './js-config'),
  json: join(__dirname, './json-config'),
}
const CONFIG_FILE = {
  js: join(__dirname, './js-config/cv.config.js'),
  json: join(__dirname, './json-config/.cvrc.json'),
}

test('find config: js', async () => {
  const js = await getConfig({ from: CONFIG_PATHS.js })
  expect(js.config).toEqual({ ...DEFAULT_CONFIG, format: /^1/ })
  expect(js.configPath).toEqual(CONFIG_FILE.js)
})

test('find config: json', async () => {
  const json = await getConfig({ from: CONFIG_PATHS.json })
  expect(json.config).toEqual({ ...DEFAULT_CONFIG, emoji: true })
  expect(json.configPath).toEqual(CONFIG_FILE.json)
})
