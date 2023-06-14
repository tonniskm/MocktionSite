const app = require('express')()
const PDFParser = require("pdf2json");
const PORT = 8080
const express = require('express');
const router = express.Router();

app.listen(PORT,
    ()=>console.log(`hi${PORT}`)
    )


app.get('/yoyo',(req,res)=>{
    res.status(200).send({
        test:1,
        another:4
    })

})

app.get('/hi',(req,res)=>{
    res.status(200).send('Hi Carol!')
})

app.get('/getText',(req,res)=>{
    let pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(`PDF.pdf`);
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
        res.status(200).send(pdfParser.getRawTextContent())
    })

})

router.get('/',(req,res)=>{
    let pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(`PDF.pdf`);
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
        res.status(200).send(pdfParser.getRawTextContent())
    })

})