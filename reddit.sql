-- MySQL dump 10.13  Distrib 5.5.47, for debian-linux-gnu (x86_64)
--
-- Host: 0.0.0.0    Database: reddit
-- ------------------------------------------------------
-- Server version	5.5.47-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(10000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `posts` (`userId`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'This is some text','2016-04-29 16:10:39','2016-04-29 16:10:39',1,1,NULL),(2,'This is some text2','2016-04-29 16:11:18','2016-04-29 16:11:18',NULL,NULL,NULL),(3,'This is some text2','2016-04-29 16:16:53','2016-04-29 16:16:53',1,1,NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subredditId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `subredditId` (`subredditId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`subredditId`) REFERENCES `subreddits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'hi reddit!','https://www.reddit.com',1,'2016-04-28 19:53:41','2016-04-28 19:53:41',NULL),(2,'hi reddit!','https://www.reddit.com',3,'2016-04-28 20:17:20','2016-04-28 20:17:20',NULL),(3,'This is the end','www.google.com',1,'2016-04-29 14:35:03','2016-04-29 14:35:03',1),(4,'yes, this is it','www.yahoo.com',1,'2016-05-02 20:25:19','2016-05-02 20:25:19',1),(5,'Create a post','www.tralala.com',1,'2016-05-02 20:25:59','2016-05-02 20:25:59',1),(6,'New post 25','www.boom.com',1,'2016-05-02 20:27:01','2016-05-02 20:27:01',1),(7,'Hello bra','www.braaa.com',1,'2016-05-02 20:27:15','2016-05-02 20:27:15',1),(8,'Bravo everybody','www.brabva.com',1,'2016-05-02 20:27:35','2016-05-02 20:27:35',1),(9,'Brrrrr','www.brrrrr.com',1,'2016-05-02 20:27:50','2016-05-02 20:27:50',1),(10,'Drop this db','www.dropsql.com',1,'2016-05-02 20:29:07','2016-05-02 20:29:07',1),(11,'Mysql is awesome','www.mysql.com',1,'2016-05-02 20:29:23','2016-05-02 20:29:23',1),(12,'Another post','www.adidas.com',1,'2016-05-02 20:30:05','2016-05-02 20:30:05',1),(13,'Bybye','www.bye.com',1,'2016-05-02 20:30:18','2016-05-02 20:30:18',1),(14,'Brandon','www.brandon.com',1,'2016-05-02 20:30:29','2016-05-02 20:30:29',1),(15,'Krke','www.Krke.com',1,'2016-05-02 20:30:38','2016-05-02 20:30:38',1),(16,'Break it','www.brk-it.com',1,'2016-05-02 20:31:08','2016-05-02 20:31:08',1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subreddits`
--

DROP TABLE IF EXISTS `subreddits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subreddits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subreddits`
--

LOCK TABLES `subreddits` WRITE;
/*!40000 ALTER TABLE `subreddits` DISABLE KEYS */;
INSERT INTO `subreddits` VALUES (1,'The world is doomed','Awesome optimistic post','0000-00-00 00:00:00','2016-04-28 22:27:34'),(2,'The world is doomed 2','Awesome optimistic post','0000-00-00 00:00:00','2016-04-28 22:29:35'),(3,'The world is doomed 3','Awesome optimistic post','0000-00-00 00:00:00','2016-04-28 22:29:59'),(4,'The world is doomed 4',NULL,'0000-00-00 00:00:00','2016-04-28 22:32:55'),(5,'The world is doomed 5',NULL,'0000-00-00 00:00:00','2016-04-28 22:33:49'),(6,'The world is doomed 6',NULL,'0000-00-00 00:00:00','2016-04-28 22:34:39'),(7,'The world is doomed 7',NULL,'0000-00-00 00:00:00','2016-04-28 22:35:39'),(8,'The world is doomed 8',NULL,'0000-00-00 00:00:00','2016-04-28 22:58:01');
/*!40000 ALTER TABLE `subreddits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hello23','$2a$10$J9ln0pqnqQRW3uHTYVq4OOPJ6FzunXGWmKogyzkXMWgkshz9YyBSe','2016-04-28 19:53:41','2016-04-28 19:53:41'),(3,'hello232','$2a$10$5i1AyVRO3GzZQ7C2LjoXGuTquRRBnchqSz5f3ufRW0x3UMr3Wj/Je','2016-04-28 20:17:20','2016-04-28 20:17:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-02 20:39:45
