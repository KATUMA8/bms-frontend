CREATE DATABASE  IF NOT EXISTS `project_system_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project_system_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: project_system_db
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `client_postalcode` varchar(8) NOT NULL COMMENT '顧客郵便番号',
  `client_address` varchar(100) NOT NULL COMMENT '顧客住所',
  `client_phone` varchar(20) NOT NULL COMMENT '顧客電話番号',
  `client_kana` varchar(100) NOT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) NOT NULL,
  `company_postalcode` varchar(8) NOT NULL COMMENT '業者郵便番号',
  `company_address` varchar(100) NOT NULL COMMENT '業者住所',
  `company_phone` varchar(20) NOT NULL COMMENT '業者電話番号',
  `company_kana` varchar(100) NOT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'株式会社サンプル','1040061','東京都中央区銀座','0300000000','カブシキガイシャサンプル'),(2,'(有)サンプルテクニカル','3320004','埼玉県川口市領家','0480000000','ユウゲンカイシャサンプルテクニカル'),(3,'サンプルファシリティーズ株式会社','1020081','東京都千代田区四番町','0300000000','サンプルファシリティーズカブヂキガイシャ'),(5,'株式会社テストバイテスト','3520021','埼玉県新座市あたご','0480000000','カブシキガイシャテストバイテスト'),(51,'テスト業者','1120005','東京都文京区水道','03000000000','テストギョウシャ');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `doc_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `client_id` int NOT NULL,
  `doc_file_path` varchar(255) NOT NULL,
  `doc_title` varchar(30) NOT NULL,
  `doc_remarks` varchar(100) DEFAULT NULL,
  `doc_type` varchar(50) DEFAULT NULL,
  `doc_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doc_id`),
  KEY `fk_documents_projects` (`project_id`),
  KEY `fk_documents_clients` (`client_id`),
  CONSTRAINT `fk_documents_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_documents_projects` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL COMMENT 'どこの発注業者から受けた外注か（FK）',
  `client_id` int NOT NULL COMMENT 'エンドの顧客（クライアント）はどこか（FK）',
  `registration_date` date NOT NULL DEFAULT (curdate()),
  `project_name` varchar(100) NOT NULL COMMENT '案件名（例：空調機点検）',
  `contract_type` varchar(10) NOT NULL DEFAULT '定期' COMMENT '契約種別（定期/臨時）',
  `status` varchar(20) NOT NULL DEFAULT '未判定' COMMENT 'ステータス',
  `project_remarks` varchar(200) DEFAULT NULL COMMENT '特記事項',
  `project_staffname` varchar(30) DEFAULT '未設定' COMMENT '担当者名',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `fk_projects_companies_idx` (`company_id`),
  KEY `fk_projects_clients_idx` (`client_id`),
  CONSTRAINT `fk_projects_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_projects_companies` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_histories`
--

DROP TABLE IF EXISTS `quote_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote_histories` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `quote_id` int NOT NULL,
  `quote_date` date DEFAULT NULL,
  `quote_filepath` varchar(255) DEFAULT NULL,
  `quote_status` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `judge_user` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `fk_quote_histories_quotes_idx` (`quote_id`),
  CONSTRAINT `fk_quote_histories_quotes` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`quote_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_histories`
--

LOCK TABLES `quote_histories` WRITE;
/*!40000 ALTER TABLE `quote_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotes`
--

DROP TABLE IF EXISTS `quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotes` (
  `quote_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `quote_date` date NOT NULL,
  `quote_filepath` varchar(200) NOT NULL,
  `quote_status` varchar(50) NOT NULL DEFAULT '未判定',
  `judge_user` varchar(100) DEFAULT NULL,
  `deadline_date` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`quote_id`),
  KEY `fk_quotes_projects` (`project_id`),
  CONSTRAINT `fk_quotes_projects` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotes`
--

LOCK TABLES `quotes` WRITE;
/*!40000 ALTER TABLE `quotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL COMMENT 'ログインID',
  `password` varchar(100) NOT NULL COMMENT 'パスワード',
  `name` varchar(50) NOT NULL COMMENT '担当者個人の氏名（例：山田太郎）',
  `role_flag` int NOT NULL COMMENT '1:受注業者(自社) / 2:発注業者(元請け)',
  `company_id` int DEFAULT NULL COMMENT '発注業者の場合のみ会社IDを入れる（受注業者はNULL）',
  PRIMARY KEY (`user_id`),
  KEY `fk_users_companies_idx` (`company_id`),
  CONSTRAINT `fk_users_companies` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$08$GvAhQyv1ZKUOLHDOntmOGOqiJCQsERG/28.xD0YqwrBaoQC3Sb/4m','管理者',1,NULL),(2,'ks_narita','$2a$08$MAt9jzZeFlnSAAawxpL5EeFwcLgCIW9G.kBvGaflVePZxrZgcCZZC','成田一郎',2,1),(3,'st_suzuki','$2a$08$jaQySAhpYWHwXNop/y7FuuFjtVZ1OSaCE3Tx96JdA78IAqMetf7yq','鈴木花子',2,2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'project_system_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-28 14:06:59
