-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: afterlifedb
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `helldevice`
--

DROP TABLE IF EXISTS `helldevice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helldevice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `floor` int NOT NULL COMMENT '所在层数，1-18',
  `create_time` datetime NOT NULL,
  `status` int NOT NULL COMMENT '状态，0表示正常，1表示损坏',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helldevice`
--

LOCK TABLES `helldevice` WRITE;
/*!40000 ALTER TABLE `helldevice` DISABLE KEYS */;
INSERT INTO `helldevice` VALUES (2,'剪刀',2,'2023-05-06 15:11:55',0),(3,'铁树',3,'2023-05-06 15:12:06',1),(4,'孽镜',4,'2023-05-06 15:12:24',0),(5,'蒸笼',5,'2023-05-06 15:12:33',0),(6,'铜柱',6,'2023-05-06 15:12:47',0),(7,'刀山',7,'2023-05-06 15:12:55',0),(8,'冰山',8,'2023-05-06 15:13:16',0),(9,'油锅',9,'2023-05-06 15:13:24',0),(10,'牛坑',10,'2023-05-06 15:13:45',0),(11,'石压',11,'2023-05-06 15:13:52',0),(12,'舂臼',12,'2023-05-06 15:14:03',0),(13,'血池',13,'2023-05-06 15:14:11',0),(14,'枉死牢',14,'2023-05-06 15:14:24',0),(15,'磔刑',15,'2023-05-06 15:14:38',0),(16,'火山',16,'2023-05-06 15:14:47',0),(17,'石磨',17,'2023-05-06 15:14:55',0),(18,'刀锯',18,'2023-05-06 15:15:04',0),(19,'铁钳',1,'2023-05-15 14:38:00',0);
/*!40000 ALTER TABLE `helldevice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helllog`
--

DROP TABLE IF EXISTS `helllog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helllog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) NOT NULL,
  `floor` int NOT NULL COMMENT '所在层数，1-18',
  `device` int NOT NULL COMMENT '受刑设备id',
  `time` varchar(100) NOT NULL,
  `reason` text NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helllog`
--

LOCK TABLES `helllog` WRITE;
/*!40000 ALTER TABLE `helllog` DISABLE KEYS */;
INSERT INTO `helllog` VALUES (1,'2',5,5,'20年','打入地狱理由是每天不停造谣诽谤，满大街乱传瞎话，不要以为重塑人身就完事儿了，蒸笼地狱的判官恭喜她从蒸笼地狱解放了，然后在她欢呼雀跃的时候发配她去第一层的拔舌地狱，让小鬼儿抠她舌头','2023-05-14 13:06:51');
/*!40000 ALTER TABLE `helllog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `judgement`
--

DROP TABLE IF EXISTS `judgement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `judgement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(32) NOT NULL,
  `lifebook_id` int NOT NULL COMMENT '生死簿id',
  `reaper_id` int NOT NULL COMMENT '勾魂使者id',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `record` text NOT NULL COMMENT '记录',
  `create_time` datetime NOT NULL,
  `judge_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `judgement`
--

LOCK TABLES `judgement` WRITE;
/*!40000 ALTER TABLE `judgement` DISABLE KEYS */;
INSERT INTO `judgement` VALUES (1,'TRCEA9461D0AD518C2',2,2,'孔平案审判','<p>恩将恩报，仇将仇报，分毫不错。重湘口里发落，判官在傍用笔填注：何州何县何乡，姓甚名谁，几时生，几时死，细细开载。将人犯逐一唤过，发出投胎出世：“@韩信，你尽忠报国，替汉家夺下大半江山，可惜衔冤而死。发你在樵乡曹蒿家托生，姓曹，名操，表字孟德。先为汉相，后为魏王，坐镇许都，享有汉家山河之半。那时威权盖世，任从你谋报前世之仇。当身不得称帝，明你无叛汉之心；子受汉禅，追尊你为武帝，偿十大功劳也。”又唤过汉祖<span style=\"color: rgb(0, 102, 204);\">@刘邦</span>发落：“你来生仍投入汉家，立为献帝，一生被曹操欺侮，胆战魂惊，坐卧不安，度日如年。因前世君负其臣，来生臣欺其君以相报。”唤吕后发落：“你在伏家投胎，后日仍做献帝之后，被曹操千磨百难，将红罗勒死宫中，以报长乐宫杀信之仇。</p>','2023-05-14 13:06:51',1);
/*!40000 ALTER TABLE `judgement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lifebook`
--

DROP TABLE IF EXISTS `lifebook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lifebook` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `uuid` varchar(32) NOT NULL,
  `year` varchar(24) NOT NULL COMMENT '生辰八字',
  `status` int NOT NULL COMMENT '状态，0表示未出生，1在世，2在地府生活，3轮回中，4受刑中',
  `birthday` datetime NOT NULL COMMENT '出生日期',
  `deathday` datetime NOT NULL COMMENT '死亡日期',
  `gender` int NOT NULL COMMENT '性别，0表示男，1表示女',
  `birthplace` varchar(500) NOT NULL,
  `deathplace` varchar(500) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `money` int NOT NULL DEFAULT '0',
  `yinmoney` int NOT NULL DEFAULT '0',
  `child` int NOT NULL DEFAULT '0',
  `longevity` int NOT NULL DEFAULT '0',
  `type` int NOT NULL COMMENT '死亡类型，0表示自然死亡，1表示意外死亡',
  `reason` text,
  `marriage` text NOT NULL COMMENT '婚配情况描述',
  `event` text NOT NULL COMMENT '人生大事描述',
  `attribute` text NOT NULL COMMENT '人物属性描述',
  `description` text NOT NULL COMMENT '人生描述',
  `characterinfo` text NOT NULL COMMENT '人物描述',
  `yin` int NOT NULL DEFAULT '0',
  `yang` int NOT NULL DEFAULT '0',
  `reward` text NOT NULL COMMENT '奖赏情况',
  `afterlife` text NOT NULL COMMENT '死后情况',
  `reincarnation` text NOT NULL COMMENT '轮回情况',
  `create_time` datetime NOT NULL,
  `reaperid` int DEFAULT NULL,
  `judgeid` int DEFAULT NULL,
  `punishment` text COMMENT '受刑情况',
  `reincarnationid` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lifebook`
--

LOCK TABLES `lifebook` WRITE;
/*!40000 ALTER TABLE `lifebook` DISABLE KEYS */;
INSERT INTO `lifebook` VALUES (1,'陆佳昊','9725C2CAC566D7DE','癸未乙卯庚寅甲申',3,'2003-03-18 15:25:23','2029-06-01 11:09:39',0,'安徽省合肥市巢湖市庙岗乡','陕西省渭南市大荔县朝邑镇','/public/photo/photo.jpeg',1000000,300,2,26,0,'寿终','与2026年冬得有缘人，结为夫妻','26年结婚，28有一子，29年有一女，68年去世','好人','乐善好施，是个好人','身高一米七，体重120，喜欢看电影',500,286,'无','进入饿鬼道轮回','进入饿鬼道轮回','2023-05-04 12:07:51',1,NULL,'在3层地狱受铁树处刑，共10年',5),(2,'孔平','414C8E52F09200D0','庚辰己丑壬午丁未',4,'2001-01-19 14:57:25','2023-05-14 13:06:13',0,'安徽省合肥市巢湖市庙岗乡','陕西省渭南市大荔县朝邑镇','/public/photo/photo.jpeg',1000000,1700,1,65,0,'寿终','与2026年冬得有缘人，结为夫妻','26年结婚，28有一子，29年有一女，68年去世','好人','乐善好施，是个好人','身高一米七，体重120，喜欢看电影',500,200,'无','判处5地狱受刑20年','轮回盘','2023-05-04 12:09:08',1,NULL,'在5层地狱受蒸笼处刑，共20年',NULL),(6,'崔芳','BF8A057445B01F31','丙戌甲午庚申戊寅',3,'2000-02-13 12:23:01','2023-05-16 17:12:05',0,'青海省果洛藏族自治州甘德县江千乡','山西省临汾市侯马市凤城乡','/public/photo/photo.jpeg',500,450,1,23,1,'车祸','无妻子','23年死于车祸','睡醒','普普通通的一个人','还行',100,115,'奖励一个棒棒糖','进入阿修罗道轮回','进入阿修罗道轮回','2023-05-09 10:43:31',NULL,NULL,'在4层地狱受孽镜处刑，共5年',6),(7,'孟超','CF5D08DA003CF296','辛酉庚寅乙卯己卯',3,'1981-02-06 05:03:00','2023-05-24 10:35:35',0,'湖北省襄阳市宜城市小河镇','广东省中山市中山市小榄镇','/public/photo/photo-1683870981263.png',50000,21000,1,42,1,'车祸被撞到柱子上','22岁取得一妻子，25岁得一子','18岁高考得利考入清华大学，26岁取得重大科研突破','技术宅，科学家，成功人士','初从文,三年不中;后习武,校场发一矢,中鼓吏,逐之出;遂学医,有所成。自撰一良方,服之,卒。从小学就表现出极高的智商，学习一直名列前茅，是学校重点培养的学生，到高中进入重点班学习，多次获得年级第一，至高考超长发挥进入清华大学，在学校中努力钻研，在22岁与女朋友结婚，在25岁得到一个儿子，至26岁取得重大科研突破，是一个成功人士，到2024年6月，因为一场车祸撞到柱子上离开人世','身高1米75，体重最重80公斤，性格内向老实，喜欢钻研，智商极高',600,500,'奖下辈子财富500000，罚左臂残疾','进入畜生道轮回','进入畜生道轮回','2023-05-12 11:09:46',7,NULL,NULL,7),(8,'郝运昊','7976582440B3DFC9','庚午壬午癸酉癸丑',1,'1990-07-07 02:02:02','2025-05-29 08:09:06',0,'江苏省苏州市苏州工业园区娄葑街道','四川省阿坝藏族羌族自治州红原县阿木乡','/public/def/photo.jpeg',20000000,10000,0,35,0,'寿终','22岁娶得一妻子，无子无女','25岁创立某某科技公司，29岁公司上市','商业人士，富豪','这辈子过得潇潇洒洒无拘无束，','性格狠辣，做事干净利索，有远见，很有商业头脑，平时不注意生活作息',19,200,'奖励一个棒棒糖打入轮回','直接打入轮回畜生道','暂无','2023-05-13 12:43:38',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lifebook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `isparent` int NOT NULL COMMENT '是否为父模块，0表示否，1表示是',
  `parentid` int DEFAULT NULL COMMENT '父模块id',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'生死簿','el-icon-s-order','/lifebook',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(2,'数据管理','','/lifebook/data',0,1,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(3,'数据同步','','/lifebook/dataAdd',0,1,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(4,'勾魂管理','el-icon-s-finance','/reaper',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(5,'勾魂使者','','/reaper/reaper',0,4,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(6,'勾魂数据','','/reaper/enchantData',0,4,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(7,'阎王殿审判','el-icon-video-camera-solid','/trial',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(8,'十殿','','/trial/flowpath',0,7,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(9,'审判记录','','/trial/data',0,7,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(10,'数据同步','','/trial/add',0,7,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(11,'十八层地狱','el-icon-s-goods','/hell',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(12,'设备管理','','/hell/device',0,11,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(13,'作业流程','','/hell/flowpath',0,11,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(14,'地狱数据','','/hell/data',0,11,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(15,'六道轮回','el-icon-s-promotion','/samsara',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(16,'轮回盘','','/samsara/selection',0,15,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(17,'轮回记录','','/samsara/data',0,15,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(18,'冥币管理','el-icon-s-check','/money',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(19,'汇款','','/money/remittance',0,18,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(20,'汇款管理','','/money/admin',0,18,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(21,'角色权限','el-icon-menu','/role',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(22,'角色管理','','/role/role',0,21,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(23,'权限设置','','/role/authority',0,21,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(24,'管理员','el-icon-s-custom','/admin',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(25,'管理员管理','','/admin/admin',0,24,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(26,'管理员添加','','/admin/add',0,24,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(27,'系统设置','el-icon-s-tools','/system',1,0,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(28,'系统设置','','/system/system',0,27,'2023-05-09 14:05:33','2023-05-09 14:05:33'),(29,'信息修改','','/system/setInfo',0,27,'2023-05-09 14:05:33','2023-05-09 14:05:33');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reaper`
--

DROP TABLE IF EXISTS `reaper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reaper` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `uuid` varchar(32) NOT NULL,
  `gender` int NOT NULL COMMENT '性别，0表示男，1表示女',
  `photo` varchar(255) DEFAULT NULL,
  `description` text NOT NULL COMMENT '描述',
  `create_time` datetime NOT NULL,
  `role` int NOT NULL COMMENT '角色',
  `status` int NOT NULL COMMENT '状态，0在职，1休息，2离职',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reaper`
--

LOCK TABLES `reaper` WRITE;
/*!40000 ALTER TABLE `reaper` DISABLE KEYS */;
INSERT INTO `reaper` VALUES (2,'龙勇','DF2519616A65BDAC',0,'/public/enchant/enchant-1683253461136.png','正直勇敢，有担当，很厉害','2023-05-05 10:24:21',2,0),(4,'宋杨','E11640A775CCF8D2',0,'/public/enchant/enchant-1683962548728.png','生菜威猛，性格稳定，武力值极高，有正义感','2023-05-13 15:22:28',2,0),(7,'勾魂使者阿三','abc123',0,'/public/def/photo.jpeg','这是一个很厉害的勾魂使者，是管理员','2023-05-17 14:29:13',4,0);
/*!40000 ALTER TABLE `reaper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reincarnationlog`
--

DROP TABLE IF EXISTS `reincarnationlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reincarnationlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aid` varchar(32) NOT NULL,
  `uid` varchar(32) NOT NULL,
  `type` varchar(32) NOT NULL COMMENT '结果',
  `reason` text NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reincarnationlog`
--

LOCK TABLES `reincarnationlog` WRITE;
/*!40000 ALTER TABLE `reincarnationlog` DISABLE KEYS */;
INSERT INTO `reincarnationlog` VALUES (1,'1','1','人间道','身心善良，乐善好施所以是人道','2023-05-08 08:58:30'),(2,'1','6','阿修罗道','轮回理由','2023-05-16 13:43:41'),(3,'6','7','畜生道','一身行恶，二口行恶，三意行恶，四从贪而起诸恶，五从嗔起诸恶行，六从痴起诸恶行，七毁骂众生，八恼害众生，九施不净物，十行於邪淫','2023-05-24 10:38:27');
/*!40000 ALTER TABLE `reincarnationlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remittance`
--

DROP TABLE IF EXISTS `remittance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remittance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `relationship` varchar(32) NOT NULL,
  `uid` varchar(32) NOT NULL,
  `money` int NOT NULL COMMENT '金额',
  `reason` text NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remittance`
--

LOCK TABLES `remittance` WRITE;
/*!40000 ALTER TABLE `remittance` DISABLE KEYS */;
INSERT INTO `remittance` VALUES (1,'朋友','414C8E52F09200D0',1000,'生日快乐','2023-05-08 15:09:45'),(6,'系统','BF8A057445B01F31',250,'管理员汇款','2023-05-16 14:41:12'),(7,'系统','CF5D08DA003CF296',1000,'管理员汇款','2023-05-16 16:55:30'),(8,'系统','9725C2CAC566D7DE',100,'管理员汇款','2023-05-17 10:24:17');
/*!40000 ALTER TABLE `remittance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `module` varchar(255) NOT NULL COMMENT '模块id，使用逗号分隔,all表示所有模块',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'最高管理员','拥有所有权限','all','2023-04-28 15:29:19','2023-04-28 15:29:19'),(2,'勾魂使者','拥有勾魂相关权限','1,2,3,4,5,6,7,8,9,11,13,15,17,27,29','2023-05-06 11:03:41','2023-05-06 11:03:41'),(3,'审判长','拥有审判相关权限','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,27,29','2023-05-06 11:03:41','2023-05-06 11:03:41'),(4,'管理员','普通管理员只有数据查看和管理权限','1,2,3,4,5,7,8,9,11,12,13,14,15,16,17,18,19,20,27,28,29','2023-05-08 17:03:50','2023-05-08 17:03:50'),(6,'授权管理','负责前台获取授权的账号','1,2,3,7,8,11,13,15,16,27,29','2023-05-17 16:54:46','2023-05-17 16:54:46');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `value` varchar(32) NOT NULL,
  `create_time` datetime NOT NULL,
  `remark` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,'remittance','0','2023-05-17 15:46:33','汇款开关'),(2,'woodenfish','1','2023-05-24 10:40:38','敲木鱼加功德开关');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  `role` int NOT NULL COMMENT '用户角色id',
  `status` int NOT NULL COMMENT '用户状态，0表示正常，1表示禁用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','e50de14051afd6aacd8d1560f2f08579','最高管理员','2023-04-28 15:29:19','2023-05-17 15:32:26',1,0),(2,'123456','e50de14051afd6aacd8d1560f2f08579','普通管理员','2023-05-09 09:13:11','2023-05-09 09:13:11',4,0),(6,'25802580','e50de14051afd6aacd8d1560f2f08579','审判长','2023-05-17 14:06:12','2023-05-18 10:52:33',3,0),(7,'abc123','e50de14051afd6aacd8d1560f2f08579','勾魂使者阿三','2023-05-17 14:28:49','2023-05-17 14:28:49',2,0),(8,'000000','e50de14051afd6aacd8d1560f2f08579','测试','2023-05-17 16:55:09','2023-05-18 10:51:37',6,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'afterlifedb'
--

--
-- Dumping routines for database 'afterlifedb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-24 16:38:46
