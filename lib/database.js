// var exports = module.exports = {};
// require('dotenv').config();
// var mysql = require("mysql");

module.exports = {

  handleDisconnect: function() {

      var db_config = {
          host: process.env.DB_SERVER,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_INSTANCE
      }

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
  },

  addFiling: function(data){



    dbConnection.query('INSERT IGNORE INTO filing SET ?', data, function(err,res){
      if(err) throw err;

      if(res.affectedRows === 1){

        console.log("\n\nAdded a row");
        console.log("data %o", data);

        // var companynameClean = companyname.trim();
        //
        // var newFilingMessage = '*' + companynameClean + '* ' + "\n" + data.filingDetail;
        // var newFilingLink = urlBase + '/GetFile.do?lang=EN' + '&docClass=' + data.filingDocClass + '&issuerNo=' + data.issuerNo + '&issuerType=03' + '&projectNo=' + data.projectNo + '&docId=' + data.filingID;
        //
        // // console.log(newFilingMessage);
        //
        // newFilingMessage += "\n" + newFilingLink + "\n";
        //
        // slack.send({
        //     text: newFilingMessage,
        //     channel: '#filings',
        //     username: 'filings-bot',
        //     icon_emoji: ':file_cabinet:'
        // });

      }



    });

  }


};
