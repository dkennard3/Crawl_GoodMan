// import { test, expect } from '@jest/globals'
const { normalizeURL, getURLSFromHTML } = require('./crawl')
const fs = require('node:fs')


let url = 'https://blog.boot.dev'
test('remove http', () => {
  expect(normalizeURL(url).includes('http://')).toBe(false)
})

let baseURL = 'https://blog.boot.dev'

test('length of a_tag URLs array equals count of a_tags in HTML body', () => {
  let count = 21
  fs.readFile('/home/dkennard/crawlGoodMan/sampleHTML.txt', (err, data) => {
    if (err) throw err  

    expect(getURLSFromHTML(data.toString('utf8'), baseURL).length).toBe(count)
  })
})

