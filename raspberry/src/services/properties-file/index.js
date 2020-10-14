import * as config from '../../../config'
import fs from 'fs'

export async const write = (properties) => {
  const fileContent = JSON.stringify(properties)
  fs.writeFile(config.CUSTOM_PROPERTIES_FILE, fileContent)
}

export const read = () => {
  try{
    const fileContent = fs.readFileSync(config.CUSTOM_PROPERTIES_FILE)
    return JSON.parse(fileContent)
  } catch {
    return {}
  }
}