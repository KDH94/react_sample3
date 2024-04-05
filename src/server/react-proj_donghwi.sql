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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 test.tbl_sns_board:~6 rows (대략적) 내보내기
INSERT INTO `tbl_sns_board` (`boardNo`, `userId`, `title`, `content`, `cdatetime`) VALUES
	(1, 'user1', '첫 번째 게시글', '첫 번째 게시글입니다.', '2024-04-05 10:46:53'),
	(2, 'user1', '두 번째 게시글', '두 번째 게시글입니다.', '2024-04-05 10:46:54'),
	(3, 'user1', '세 번째 게시글', '세 번째 게시글입니다.', '2024-04-05 10:46:54'),
	(4, 'user2', '네 번째 게시글', '네 번째 게시글입니다.', '2024-04-05 10:46:54'),
	(5, 'user2', '다섯 번째 게시글', '다섯 번째 게시글입니다.', '2024-04-05 10:46:55'),
	(6, 'user3', '여섯 번째 게시글', '여섯 번째 게시글입니다.', '2024-04-05 10:46:56');

-- 테이블 test.tbl_sns_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_sns_user` (
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userPwd` varchar(50) DEFAULT NULL,
  `userName` varchar(50) DEFAULT NULL,
  `follower` int DEFAULT NULL,
  `following` int DEFAULT NULL,
  `profile` varchar(50) DEFAULT NULL,
  `profileImage` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 test.tbl_sns_user:~3 rows (대략적) 내보내기
INSERT INTO `tbl_sns_user` (`userId`, `userPwd`, `userName`, `follower`, `following`, `profile`, `profileImage`) VALUES
	('qwe1', '1234', '친칠라', 100, 150, '안녕하세요 친칠라입니다.', 'https://img.segye.com/content/image/2017/07/22/20170722505000.jpg'),
	('qwe2', '1234', '웜뱃', 200, 300, '반갑습니다 웜뱃입니다.', 'https://res.heraldm.com/content/image/2019/04/15/20190415000612_0.jpg'),
	('qwe3', '1234', '쿼카', 300, 500, '안녕하세요 쿼카입니다.', 'https://blog.kakaocdn.net/dn/5BYdt/btr1UROpB8p/5mAjFV90ko75aalWCxr6D1/img.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
