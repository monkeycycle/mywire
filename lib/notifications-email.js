
module.exports = {

  sendSummaryMail: function(data) {

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

};
