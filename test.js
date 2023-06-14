const fs = require('fs');
const request = require('request');
const PDFParser = require('pdf-parse');

const pdfUrl = 'https://g.espncdn.com/s/ffldraftkit/22/NFLDK2022_CS_NonPPR300.pdf';

async function test(){
    request({ url: pdfUrl, encoding: null }, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    const options = {};
    PDFParser(body, options)
      .then(function(data) {
        console.log(data.text);
        return 5
      })
      .catch(function(error) {
        console.error(error);
      });
  }
});

}
// console.log(test())
test()