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
  const pdfUrl2 = 'https://g.espncdn.com/s/ffldraftkit/'+req.params.year+'/NFLDK20'+req.params.year+'_CS_NonPPR300.pdf';
  if (parseInt(req.params.year) >= 23){
  //  pdfUrl2 = 'https://g.espncdn.com/s/ffldraftkit/'+req.params.year.toString()+'/NFL'+req.params.year.toString()+'_CS_Non300.pdf';
   pdfUrl2 = 'https://g.espncdn.com/s/ffldraftkit/'+'23'+'/NFL'+'23'+'_CS_Non300.pdf';
  }
  console.log('here')
  if (parseInt(req.params.year) >= 23){res.send(23)}else{res.send('nop2e')}
  // request({ url: pdfUrl2, encoding: null }, function(error, response, body) {
  //   if (!error && response.statusCode === 200) {
  //     const options = {};
  //     PDFParser(body, options)
  //       .then(function(data) {
  //           res.status(200).send(data)
  //       })
  //       .catch(function(error) {
  //         console.error(error);
  //       });
  //   }
  // });
})

module.exports = router;
