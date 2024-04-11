-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.36 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- test 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `test`;

-- 테이블 test.tbl_sns_board 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_sns_board` (
  `boardNo` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`boardNo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 test.tbl_sns_board:~9 rows (대략적) 내보내기
INSERT INTO `tbl_sns_board` (`boardNo`, `userId`, `title`, `content`, `cdatetime`) VALUES
	(1, 'qwe1', '처음 써본다', '반갑다', '2024-04-05 10:46:53'),
	(2, 'qwe1', '유저가 나밖에 없냐?', '띠용?', '2024-04-05 10:46:54'),
	(3, 'qwe1', '심심해', '관심을 줘...', '2024-04-05 10:46:55'),
	(4, 'qwe2', '어 형이야', '형은 2번째로 가입했어', '2024-04-05 10:46:56'),
	(5, 'qwe2', '똥글 싸지르기', '뿌직', '2024-04-05 10:46:57'),
	(6, 'qwe3', '처음이에용', '근데 여기 이상한 곳인 듯', '2024-04-05 10:46:58'),
	(16, 'qwe4', 'hello everyone', 'Actually, I am not foreigner', '2024-04-08 16:11:58'),
	(17, 'qwe1', '이미지 잘 올라가나', '올라가야 할 텐데', '2024-04-09 09:39:59'),
	(18, 'qwe1', '여러 개 올려버리기~', '3장이 한계네', '2024-04-09 14:10:15');

-- 테이블 test.tbl_sns_images 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_sns_images` (
  `fileNo` int NOT NULL AUTO_INCREMENT,
  `boardNo` int DEFAULT NULL,
  `filePath` varchar(255) NOT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `fileOrgName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fileNo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 test.tbl_sns_images:~4 rows (대략적) 내보내기
INSERT INTO `tbl_sns_images` (`fileNo`, `boardNo`, `filePath`, `fileName`, `fileOrgName`) VALUES
	(3, 17, 'img/', '240409093956_lesser.jpeg', 'lesser.jpeg'),
	(4, 18, 'img/', '240409141010_lesser.jpeg', 'lesser.jpeg'),
	(5, 18, 'img/', '240409141010_marushe.jpg', 'marushe.jpg'),
	(6, 18, 'img/', '240409141010_bunny.jpg', 'bunny.jpg');

-- 테이블 test.tbl_sns_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_sns_user` (
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userPwd` varchar(50) DEFAULT NULL,
  `userName` varchar(50) DEFAULT NULL,
  `follower` int DEFAULT '0',
  `following` int DEFAULT '0',
  `profile` varchar(50) DEFAULT NULL,
  `profileImage` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 test.tbl_sns_user:~4 rows (대략적) 내보내기
INSERT INTO `tbl_sns_user` (`userId`, `userPwd`, `userName`, `follower`, `following`, `profile`, `profileImage`) VALUES
	('qwe1', '1234', '친칠라', 100, 150, '안녕하세요 친칠라입니다.', 'https://img.segye.com/content/image/2017/07/22/20170722505000.jpg'),
	('qwe2', '1234', '웜뱃', 200, 300, '반갑습니다 웜뱃입니다.', 'https://res.heraldm.com/content/image/2019/04/15/20190415000612_0.jpg'),
	('qwe3', '1234', '쿼카', 300, 500, '안녕하세요 쿼카입니다.', 'https://blog.kakaocdn.net/dn/5BYdt/btr1UROpB8p/5mAjFV90ko75aalWCxr6D1/img.jpg'),
	('qwe4', '1234', '레서판다', 500, 1000, '난 렛서다', 'https://flexible.img.hani.co.kr/flexible/normal/970/728/imgdb/original/2024/0308/20240308501536.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
