var express = require('express');
var router = express.Router();
// const PDFParser = require("pdf2json");
const PDFParser = require('pdf-parse');
const pdfUrl = 'https://g.espncdn.com/s/ffldraftkit/22/NFLDK2022_CS_NonPPR300.pdf';
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {

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

router.get('/:year',function(req,res,next){
  res.status(200).send(req.params)
})

module.exports = router;
