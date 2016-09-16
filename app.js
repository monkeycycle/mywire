require('dotenv').config();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mysql = require("mysql");

var express = require('express');
var app = express();
var router = express.Router();

var  utils = require('./lib/utils.js');
var  db = require('./lib/database.js');
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

var Slack = require('node-slack');
var slack = new Slack(process.env.SLACK_WEBHOOKS_URL);




var port = process.env.PORT || 8080;

var db_config = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_INSTANCE
};

var dbConnection;

var urlBase = 'http://sedar.com';
var urlNewFilings = 'http://sedar.com/new_docs/all_new_pc_filings_en.htm';

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a dumb bot. I need a basic command.');
})

// Filings route
app.get('/filings', function (req, res) {
  getFilings();
  res.send('Checking for new filings.');
})





function getFilings(){

  handleDisconnect();

  slack.send({
      text: 'Filing bot checking in.',
      channel: '#filings',
      username: 'filings-bot',
      icon_emoji: 'file_cabinet',
      unfurl_links: true,
      link_names: 1
  });

  request(urlNewFilings, function (error, response, html) {

    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      var parsedResults = [];

      var thisCompanyName = '';
      var thisCompanyURL = '';
      var companyProfileDetails = {};
      var thisFilingDate = '';
      var thisFilingTime = '';
      var thisDocumentType = '';
      var thisDocumentDetails = {};
      var thisFilingDetail = {};


      var newFilings = [];


      $('tr.rt').each(function(i, element){

        var thisRow = $(this);

        // Crudely check if this row is company name or filings
        // If this is a company name grab the company profile URL
        if(thisRow.children('td[colspan=5]').text() !== ''){

          thisCompanyName = thisRow.children('td[colspan=5]').text();
          thisCompanyURLEl =  thisRow.children('td[colspan=5]').children('p').children('a');
          thisCompanyURL = thisCompanyURLEl.attr('href');

        }
        else{

          thisFilingDate = thisRow.children('td:nth-child(2)').text();
          thisFilingTime = thisRow.children('td:nth-child(3)').text();
          thisDocumentType = thisRow.children('td:nth-child(4)').children('form').children('p').children('a').text();

          // Get details of the doc type from ASP form action
          thisDocDetailsString = thisRow.children('td:nth-child(4)').children('form').attr('action');
          var thisDocDetailsObj = parseQuery(thisDocDetailsString);

          var filingDetails = {
            issuerNo: thisDocDetailsObj.issuerNo,
            filingDate: thisFilingDate,
            filingTime: thisFilingTime,
            filingDetail: thisDocumentType,
            filingID: thisDocDetailsObj.docId,
            filingDocClass: thisDocDetailsObj.docClass,
            projectNo: thisDocDetailsObj.projectNo
          }

          addFiling_DB(thisCompanyName, filingDetails);

          filingDetails.companyName = thisCompanyName;

          newFilings.push(filingDetails);

        }

      });

      sendSummaryMail(newFilings);

    }

  });

}


function getCompanyDetails(url){

  var companyProfileUrl = urlBase + url;

  request(companyProfileUrl, function (error, response, html) {

    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      var thisIndustryClassification = $('tr:nth-child(9)').children('td:nth-child(2)').text();
      var thisCUSIP = $('tr:nth-child(10)').children('td:nth-child(2)').text();

      var thisStockExchange = $('tr:nth-child(6)').children('td:nth-child(4)').text();
      var thisStockSymbol = $('tr:nth-child(7)').children('td:nth-child(4)').text();

      var profileDetails = {};

        profileDetails.IndustryClassification = thisIndustryClassification;
        profileDetails.CUSIP = thisCUSIP;
        profileDetails.StockExchange = thisStockExchange;
        profileDetails.StockSymbol = thisStockSymbol;

      return profileDetails;

    }

  });

}



function handleDisconnect() {
    console.log('1. connecting to db:');
    dbConnection = mysql.createConnection(db_config);

    dbConnection.connect(function(err) {
        if (err) {
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000);
        }
    });

    dbConnection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_dbConnection_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}



function addFiling_DB(companyname, data){

  dbConnection.query('INSERT IGNORE INTO filing SET ?', data, function(err,res){
    if(err) throw err;

    if(res.affectedRows === 1){

      var companynameClean = companyname.trim();

      var newFilingMessage = '*' + companynameClean + '* ' + "\n" + data.filingDetail;
      var newFilingLink = urlBase + '/GetFile.do?lang=EN' + '&docClass=' + data.filingDocClass + '&issuerNo=' + data.issuerNo + '&issuerType=03' + '&projectNo=' + data.projectNo + '&docId=' + data.filingID;

      // console.log(newFilingMessage);

      newFilingMessage += "\n" + newFilingLink + "\n";

      slack.send({
          text: newFilingMessage,
          channel: '#filings',
          username: 'filings-bot',
          icon_emoji: ':file_cabinet:'
      });

    }



  });

}


function sendSummaryMail(data){

  var arrayLength = data.length;
  var messageBody = '';

  for (var i = 0; i < arrayLength; i++) {

    var thisMessageContent = '';

      var thisFiling = data[i];

      var companynameClean = thisFiling.companyname; // .trim();

      var newFilingMessage = '*' + companynameClean + '* ' + "\n" + thisFiling.filingDetail;
      var newFilingLink = urlBase + '/GetFile.do?lang=EN' + '&docClass=' + thisFiling.filingDocClass + '&issuerNo=' + thisFiling.issuerNo + '&issuerType=03' + '&projectNo=' + thisFiling.projectNo + '&docId=' + thisFiling.filingID;
      newFilingMessage += "\n" + newFilingLink + "\n\r\n\r";

      messageBody += newFilingMessage;

  }

  sendgrid.send({
    to:       'mpereira@globeandmail.com',
    from:     'filingbot@bot.com',
    subject:  'New filings',
    text:     messageBody
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });

}

function parseQuery(qstr) {
  var query = {};
  var a = qstr.substr(1).split('&');
  for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

function writeDataJSON(file,data){

  var outputFilename = file;

  fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });

}


// Spin up the server
app.listen(port, function() {
    console.log('running on port', app.get('port'))
})
