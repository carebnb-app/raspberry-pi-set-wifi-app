import * as config from '../../../config'
import fs from 'fs'

export const write = (properties) => {
  const fileContent = JSON.stringify(properties)
  console.log(`Saving properties on file with: ${fileContent}`)
  fs.writeFile(config.CUSTOM_PROPERTIES_FILE, fileContent, (err, result) => {
    if(err){
      console.error('Error saving properties file')
    }
  })
}

export const read = () => {
  try{
    const fileContent = fs.readFileSync(config.CUSTOM_PROPERTIES_FILE)
    console.log(`Loaded properties from file with: ${fileContent}`)
    return JSON.parse(fileContent)
  } catch {
    console.error('Error loading properties file')
    return {}
  }
}
