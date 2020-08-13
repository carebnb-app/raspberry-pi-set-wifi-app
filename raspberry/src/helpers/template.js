import handlebars from 'handlebars'

import fs from 'fs'

export default function (file, template) {
  const _template = handlebars.compile(fs.readFileSync(file).toString())

  return _template(template)
}
