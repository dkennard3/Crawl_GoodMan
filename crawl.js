const { URL } = require('node:url')
const { JSDOM } = require('jsdom')

function normalizeURL(url) {
  let newURL = `${url.hostname}${url.pathname}`
  if (newURL.endsWith('/')) {
    newURL = newURL.toString().slice(0, newURL.length-1)
  } 

  return newURL
}

//let htmlBody = fs.readFile('./sampleHTML.html', 'utf8')
function getURLSFromHTML(htmlBody, baseURL) {
  let urls = []
  const dom = new JSDOM(htmlBody)
  const a_tags = dom.window.document.querySelectorAll('a')
  a_tags.forEach((a) => {
    let aString = a.toString()  // same as a.href
    if (aString.endsWith('/') && aString.length > 1) {
      aString = aString.slice(0, aString.length-1)
    }
    if (aString.startsWith('/') && aString.length > 1)  {
      urls.push(`https://${baseURL.hostname}${aString}`)
    } 
    // else if (aString.startsWith('http')) {
    //   urls.push(aString)
    // }
  })
  return urls
}

async function crawlPage(baseURL, currentURL, pages) {
  let baseDomain = new URL(baseURL)
  let currentDomain = new URL(currentURL)
  let currentNormal = normalizeURL(currentDomain)

  if (baseDomain.hostname !== currentDomain.hostname) return pages  

  if (pages[currentNormal] !== undefined) {
    pages[currentNormal] += 1
    return pages
  }

  pages[currentNormal] = baseDomain.href === currentDomain.href ? 0 : 1

  let response = await fetch(currentDomain.toString(), {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/html' 
    }
  })
  const contents = await response.text()
  try {
    if (!response.headers.get('content-type').includes('text/html')) {
      throw 'Content-Type is NOT text/html! Aborting'
    } 
    else if (response.status >= 400) {
      throw `GET Request failed -- Error ${response.status}: ${response.statusText}`
    } 
  } 
  catch (error) {
    console.error(`Found error: `, error)
  }
    
  let scrapedURLs = getURLSFromHTML(contents, currentDomain)
  scrapedURLs.forEach((url) => {
    if (url !== '') {
      return crawlPage(baseURL, url, pages)
    }
  })

  return pages
  
}

module.exports = {
  normalizeURL,
  getURLSFromHTML,
  crawlPage
}
