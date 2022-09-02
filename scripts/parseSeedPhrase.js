const { parseSeedPhrase } = require('near-seed-phrase')

const args = require('minimist')(process.argv.slice(2))
const seed = args.seed ?? args._[0]
console.log(parseSeedPhrase(seed))
