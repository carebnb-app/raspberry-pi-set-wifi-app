require('@babel/register')({
  extends: './.babelrc',
  ignore: [/node_modules/]
})

require('@babel/polyfill')
require('./server')
require('./services')
