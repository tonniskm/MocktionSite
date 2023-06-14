var express = require('express');
var router = express.Router();
const PDFParser = require("pdf2json");

/* GET home page. */
router.get('/', function(req, res, next) {
  let pdfParser = new PDFParser(this, 1);
  //   pdfParser.loadPDF(`PDF.pdf`);
  //   pdfParser.on("pdfParser_dataReady", (pdfData) => {
  //       res.status(200).send(pdfParser.getRawTextContent())
  //   })
  res.status(200).send('hello2')
});

module.exports = router;
