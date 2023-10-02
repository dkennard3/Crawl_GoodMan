const { error } = require('node:console')
const { argv } = require('node:process')
const { crawlPage } = require('./crawl')
const { printReport } = require('./report')

function main() {
  if (argv.length != 3) {
    throw error('usage: node main.js BASE_URL')
  }

  let pages = {} 

  crawlPage(argv[2], argv[2], pages)
  .then(pageCounts => {
    printReport(pageCounts)
  })
  .catch(error => {
    console.error('main() encountered error: ', error)
  })

}

main()
