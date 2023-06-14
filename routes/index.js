var express = require('express');
var router = express.Router();
// const PDFParser = require("pdf2json");
const PDFParser = require('pdf-parse');
const pdfUrl = 'https://g.espncdn.com/s/ffldraftkit/22/NFLDK2022_CS_NonPPR300.pdf';
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  // let pdfParser = new PDFParser(this, 1);
  //   pdfParser.loadPDF(`PDF.pdf`);
    // pdfParser.on("pdfParser_dataReady", (pdfData) => {
    //     // res.status(200).send(pdfParser.getRawTextContent())
    //     // res.status(200).send('hi')
    // })
  // res.status(200).send('hello3')
  request({ url: pdfUrl, encoding: null }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const options = {};
      PDFParser(body, options)
        .then(function(data) {
            res.status(200).send(data)
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  });
});

module.exports = router;
