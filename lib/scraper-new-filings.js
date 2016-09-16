'use strict';

require('dotenv').config();
var config = require("./config.js");

var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var mysql = require("mysql");
var db = require("./database.js");
var utils = require("./utils.js");
var trim = require("trim");


var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

var Slack = require('node-slack');
var slack = new Slack(process.env.SLACK_WEBHOOKS_URL);

console.log("GO");
db.handleDisconnect();

getFilings();

function getFilings(){

  db.handleDisconnect();

  request(config.urlNewFilings, function (error, response, html) {

    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      var parsedResults = [];

      var thisFiling = {};
      var newFilings = [];

      var companyName = '';

      $('tr.rt').each(function(i, element){

        var thisRow = $(this);

        // Crudely check if this row is company name or filings
        // If this is a company name grab the company profile URL
        if(thisRow.children('td[colspan=5]').text() !== ''){

          thisFiling.CompanyName = thisRow.children('td[colspan=5]').text();
          thisFiling.CompanyName = trim(thisFiling.CompanyName);

          // Set for the actual filing rows below because of bad table setup
          companyName = thisFiling.CompanyName

        }
        else{
          thisFiling.CompanyName = companyName;

          thisFiling.FilingDate = thisRow.children('td:nth-child(2)').text();
          thisFiling.FilingDate = trim(thisFiling.FilingDate);

          thisFiling.FilingTime = thisRow.children('td:nth-child(3)').text();
          thisFiling.FilingTime = trim(thisFiling.FilingTime);

          thisFiling.DocumentType = thisRow.children('td:nth-child(4)').children('form').children('p').children('a').text();

          // Get details of the doc type from ASP form action
          var thisDocDetailsString = thisRow.children('td:nth-child(4)').children('form').attr('action');
          var thisDocDetailsObj = utils.parseQuery(thisDocDetailsString);

          thisFiling.issuerNo = thisDocDetailsObj.issuerNo,
          thisFiling.docID = thisDocDetailsObj.docId,
          thisFiling.docClass = thisDocDetailsObj.docClass,
          thisFiling.projectNo = thisDocDetailsObj.projectNo

          newFilings.push(thisFiling);

        }

      });

      console.log("newFilings %o", newFilings);
      // sendSummaryMail(newFilings);
      // db.addFiling(thisFiling);

    }

  });


}
