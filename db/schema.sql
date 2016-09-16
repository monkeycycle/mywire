# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.7.14)
# Database: sedar-filing-notifications
# Generation Time: 2016-09-16 03:35:45 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table company
# ------------------------------------------------------------

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `issuerNo` float NOT NULL,
  `name` text,
  `industryClassification` text,
  `CUSIP` int(11) DEFAULT NULL,
  `stockExchange` text,
  `stockSymbol` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Unique` (`issuerNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table document_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `document_types`;

CREATE TABLE `document_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `document_types` WRITE;
/*!40000 ALTER TABLE `document_types` DISABLE KEYS */;

INSERT INTO `document_types` (`id`, `name`)
VALUES
	(1,'All '),
	(2,'Annual Information Form '),
	(3,'Annual Report '),
	(4,'Code of Conduct '),
	(5,'Directors\' Circular '),
	(6,'Disclosure Document '),
	(7,'Disclosure For Oil and Gas Activities NI 51-101 '),
	(8,'Documents Affecting Rights of Securityholders '),
	(9,'Early Warning Report '),
	(10,'Exemptive Relief Applications '),
	(11,'Financial Statements '),
	(12,'Financial Statements - XBRL '),
	(13,'Fund Facts / Fund Summary '),
	(14,'Issuer Bid Circular '),
	(15,'Listing Application '),
	(16,'Management Report of Fund Performance '),
	(17,'Management\'s Discussion &amp; Analysis '),
	(18,'Marketing Materials '),
	(19,'Material Change Report '),
	(20,'Material Contracts '),
	(21,'News Releases '),
	(22,'NI 44-101 Notice '),
	(23,'Notice Form 45-102F1 '),
	(24,'Notice of Principal Regulator '),
	(25,'Notice of Securities Granted to Insiders NI 55-101 '),
	(26,'Notice of the Meeting and Record Date '),
	(27,'Notice of Use of Proceeds '),
	(28,'Offering Document '),
	(29,'Offering Material '),
	(30,'Offering Memorandum '),
	(31,'Other Distribution Materials '),
	(32,'OTC Issuer filings '),
	(33,'Prospectus '),
	(34,'Proxy Circular '),
	(35,'Proxy Solicitation by Third Parties '),
	(36,'Report of Exempt Distribution '),
	(37,'Reports under NI 81-107 '),
	(38,'Statement of Executive Compensation '),
	(39,'Take-over Bid Circular '),
	(40,'Technical Report - NI 43-101 '),
	(41,'Other ');

/*!40000 ALTER TABLE `document_types` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table filing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `filing`;

CREATE TABLE `filing` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CompanyName` text,
  `issuerNo` float DEFAULT NULL,
  `filingDate` text,
  `filingTime` text,
  `filingDetail` text,
  `filingID` int(11) DEFAULT NULL,
  `filingDocClass` int(11) DEFAULT NULL,
  `projectNo` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqFilingID` (`filingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table industry
# ------------------------------------------------------------

DROP TABLE IF EXISTS `industry`;

CREATE TABLE `industry` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `industry` WRITE;
/*!40000 ALTER TABLE `industry` DISABLE KEYS */;

INSERT INTO `industry` (`id`, `name`)
VALUES
	(1,'All'),
	(2,'Agricultural industries '),
	(3,'Communications and media - All'),
	(4,'Broadcasting '),
	(5,'Cable and entertainment '),
	(6,'Publishing and printing '),
	(7,'Conglomerates '),
	(8,'Consumer products - All'),
	(9,'Autos and parts '),
	(10,'Biotechnology/pharmaceuticals '),
	(11,'Breweries and beverages '),
	(12,'Distilleries '),
	(13,'Food processing '),
	(14,'Household goods '),
	(15,'Packaging products '),
	(16,'Tobacco '),
	(17,'Derivative product '),
	(18,'Film production '),
	(19,'Finance company '),
	(20,'Financial services - All'),
	(21,'Banks and trusts '),
	(22,'Financial management companies '),
	(23,'Insurance '),
	(24,'Investment companies and funds '),
	(25,'Trust'),
	(26,'Gold and precious metals '),
	(27,'Hospitality '),
	(28,'Industrial products - All'),
	(29,'Autos and parts '),
	(30,'Building materials '),
	(31,'Business services '),
	(32,'Chemicals and fertilizers '),
	(33,'Fabricating and engineering '),
	(34,'Steel '),
	(35,'Technology '),
	(36,'Technology - hardware '),
	(37,'Technology - software '),
	(38,'Transportation equipment '),
	(39,'Junior industrial '),
	(40,'Junior natural resource - All'),
	(41,'Mining '),
	(42,'Oil and gas '),
	(43,'Merchandising - All'),
	(44,'Clothing stores '),
	(45,'Department stores '),
	(46,'Food stores '),
	(47,'Hospitality '),
	(48,'Speciality stores '),
	(49,'Wholesale distributors '),
	(50,'Metals and minerals - All'),
	(51,'Integrated mines '),
	(52,'Metal mines '),
	(53,'Mining '),
	(54,'Non-base metal mining '),
	(55,'Miscellaneous '),
	(56,'Oil and gas - All'),
	(57,'Integrated oils '),
	(58,'Oil and gas producers '),
	(59,'Oil and gas services '),
	(60,'Paper and forest products '),
	(61,'Pipelines '),
	(62,'Real estate '),
	(63,'Real estate project '),
	(64,'Scholarship plan '),
	(65,'Transportation and environmental services '),
	(66,'Utilities - All'),
	(67,'Gas/electrical utilities '),
	(68,'Telephone utilities '),
	(69,'Other ');

/*!40000 ALTER TABLE `industry` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
