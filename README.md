### mywire:Sedar Filings


A scraper and notification system for public filings.


This is deployed on Heroku with gitlab as a secondary remote for safe keeping.

Much of this README is TKTK.


1. Clone the repo then

	```
	 npm install
	```






**Source:** [sedar.com](sedar.com)

* ASP

Captcha in place to view afiling documents


### Key pages

* [New filings](http://sedar.com/new_docs/all_new_pc_filings_en.htm)

* [Sample company page](http://sedar.com/DisplayProfile.do?lang=EN&issuerType=03&issuerNo=00008032)


* [Company/Industry Group Search](http://sedar.com/FindCompanyDocuments.do)


* [Company profile](http://sedar.com/DisplayProfile.do?lang=EN&issuerType=03&issuerNo=00009941)


* [Company documents](http://sedar.com/DisplayCompanyDocuments.do?lang=EN&issuerNo=00008032)



issuerNo=00026759


### App workflow


##### Populate DB


##### Scheduled scraper


##### Result processing
* retain link to PDF and present in view (notification?)

##### Notification system
* keyword matching
* twitter/Slack/SMS?


#### Record Viewer
* company name
* sector
* date
* type of filing
* keywords (add/editable?)
