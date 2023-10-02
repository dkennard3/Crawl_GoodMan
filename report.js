function printReport(pages) {
  console.log('Beginning report...')

  let report = Object.keys(pages).map(key => ({
    key: key, 
    value: pages[key]
  }))

  report.sort((a,b) => {return b.value - a.value})

  report.forEach(item => {
    console.log(`${item.key} has --> ${item.value} link(s)`)
  })

}

module.exports = {
  printReport
}
