var request = require('request')

var basicOptions = {
  url: 'http://www.evans.co.uk',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
  },
  followRedirect: false
}

let dualRunFirstRequest = 0
let dualRunHtmlResponse = 0
const maxLoop = 0
let currentLoop = 0

console.log('============ SEND REQUEST TO =============>')
console.log('URL : ', basicOptions.url)
console.log('Headers :', basicOptions.headers)

requestNoRedirect(basicOptions)

function requestNoRedirect(options) {
  request(options, function (error, response, body) {
    // console.log('=============== Errors ==============\n')
    // console.log(error)
    // console.log('=============== response ==============\n')
    // console.log(response)
    // console.log(response.headers)
    // console.log(response.statusCode)
    // console.log('=============== body ==============\n')
    // console.log(body)

    if (response.statusCode === 301 || response.statusCode === 302) {
      console.log('\n <============== AKAMAI RESPONSE REDIRECT ==============\n')
      console.log(response.headers)
      console.log('========================================================\n')
      if (response.headers['set-cookie'][5].includes('dual-run=monty;')) dualRunFirstRequest++

      // Setting new header
      const newOptions = {
        url: response.headers.location,
        headers: {
          ...response.headers,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        },
        followRedirect: true
      }

      newOptions.headers.cookie = newOptions.headers['set-cookie']
      delete(newOptions.headers['set-cookie'])

      console.log('============ SEND REQUEST FROM REDIREDCT TO =============>')
      console.log('URL : ', response.headers.location)
      console.log('Headers and cookies :', newOptions.headers)

      requestNoRedirect(newOptions)
    } else {
      console.log('\n <=============== FULL HTML RESPONSE ==============\n')
      console.log(response.headers)
      console.log('\n========================================================\n')
      return

      // if (response.headers['set-cookie'][8].includes('dual-run=monty;')) dualRunHtmlResponse++
      // if (currentLoop < maxLoop) {
      //   currentLoop++
      //   requestNoRedirect(basicOptions)
      // } else {
      //   // RESULTS
      //   console.log('FIRST REQUEST DUAL RUN MONTY : ', dualRunFirstRequest)
      //   console.log('FIRST REQUEST DUAL RUN LEGACY : ', (maxLoop - dualRunFirstRequest))
      //
      //   console.log('============================')
      //
      //   console.log('HTML RESPONSE DUAL RUN MONTY : ', dualRunHtmlResponse)
      //   console.log('HTML RESPONSE DUAL RUN LEGACY : ', (maxLoop - dualRunHtmlResponse))
      // }
    }
  })
}
