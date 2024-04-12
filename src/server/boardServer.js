const express = require('express');
var cors = require('cors')
const mysql = require('mysql');
const path = require('path');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs-extra');
const socketio = require('socket.io')
const http = require('http')
app.use(bodyParser.json());
app.use(cors());

// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.')); // .은 경로

// express-session(세션 미들웨어) 설정
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test1234',
  database: 'test'
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'img/'); // 파일이 저장될 경로 설정
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 파일 이름 설정
  }
});
const upload = multer({ storage: storage });

// 파일(이미지) 업로드
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('파일', req.file);
  res.send({ result: "success" });
});

// 이미지 접근 설정
app.use(express.static(path.join(__dirname, '.')));

connection.connect((err) => {
  if (err) {
    console.error('MySQL DB에 연결 중 에러: ' + err.stack);
    return;
  }
  console.log('MySQL DB에 연결됨. id: ' + connection.threadId);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

// -------------------------------------------------------------------------
app.get('/snsUserInfo.dox', (req, res) => { // 유저 정보 출력
  let map = req.query;
  connection.query("SELECT U.*, COUNT(*) AS posts FROM tbl_sns_user U INNER JOIN tbl_sns_board B ON U.userId = B.userId WHERE U.USERID = ?", [map.userId], (error, results, fields) => {
    if (error) throw error;

    if (results.length == 0) {
      res.send({ result: "사용자 없음" });
    } else {
      res.send(results[0]);
    }
  });
});

app.get('/snsBoardList.dox', (req, res) => { // 게시글 목록 출력
  let map = req.query;
  connection.query("SELECT boardNo, b.userId, title, content,	DATE_FORMAT(CDATETIME, '%y년 %c월 %e일 %H시 %i분 %s초') AS cdate, profileImage FROM tbl_sns_board b INNER JOIN tbl_sns_user u ON b.userId = u.userId ORDER BY cDateTime DESC", (error, results, fields) => {
    if (error) throw error;

    if (results.length == 0) {
      res.send({ result: "게시글이 없습니다." });
    } else {
      res.send(results);
    }
  });
});

app.get('/snsImagesView.dox', (req, res) => { // 지정한 게시글의 이미지 리슽트 출력
  let map = req.query;
  connection.query("SELECT * FROM TBL_SNS_IMAGES WHERE BOARDNO = ?", [map.boardNo], (error, results, fields) => {
    if (error) throw error;

    if (results.length == 0) {
      res.send({ result: "fail" });
    } else {
      res.send(results);
    }
  });
});

app.get('/snsBoardView.dox', (req, res) => { // 지정한 게시글 출력
  let map = req.query;
  connection.query("SELECT B.*, DATE_FORMAT(CDATETIME, '%y년 %c월 %e일 %H시 %i분 %s초') AS cdate FROM TBL_SNS_BOARD B WHERE BOARDNO = ?", [map.boardNo], (error, results, fields) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

app.get('/snsUserBoardList.dox', (req, res) => { // 해당 유저가 작성한 게시글 목록 출력
  let map = req.query;
  connection.query("SELECT * FROM TBL_SNS_BOARD WHERE USERID = ?", [map.userId], (error, results, fields) => {
    if (error) throw error;

    if (results.length == 0) {
      res.send({ result: "게시글이 없습니다." });
    } else {
      res.send(results);
    }
  });
});

app.post('/snsWriteBoard.dox', (req, res) => { // 게시글 작성
  const map = req.body;

  console.log("server map===>>>", req.body);
  // 게시글 정보 삽입
  connection.query("INSERT INTO TBL_SNS_BOARD VALUES (NULL, ?, ?, ?, NOW())", [map.userId, map.title, map.content], (error, results, fields) => {
    if (error) throw error;

    // 게시글 작성 성공 시
    const boardNo = results.insertId; // 새로 생성된 게시글의 번호 가져오기

    // 이미지 파일 정보 삽입
    const filePaths = req.body.files; // 이미지 파일 경로들
    for (let i = 0; i < filePaths.length; i++) {
      const fileName = filePaths[i].fileName; // 파일명
      const fileOrgName = filePaths[i].fileOrgName; // 원본 파일명
      connection.query("INSERT INTO TBL_SNS_IMAGES (boardNo, filePath, fileName, fileOrgName) VALUES (?, ?, ?, ?)", [boardNo, "img/", fileName, fileOrgName], (error, results, fields) => {
        if (error) throw error;
        console.log("이미지 파일이 성공적으로 삽입되었습니다.");
      });
    }

    // 클라이언트에게 응답 전송
    res.send({ message: "게시글 작성 및 이미지 업로드가 완료되었습니다." });
  });
});


app.post('/snsUserLogin.dox', (req, res) => { // 유저 로그인 & 회원 탈퇴 시 확인용
  let map = req.body;
  connection.query("SELECT * FROM TBL_SNS_USER WHERE USERID = ? AND USERPWD = ?", [map.userId, map.userPwd], (error, results, fields) => {
    if (error || results.length == 0) {
      res.send({ result: "fail" });
      return;
    } else {
      res.send({ result: "success", map: results[0] });
    }
  });
});

app.post('/snsUserJoin.dox', (req, res) => { // 유저 회원가입
  let map = req.body;
  connection.query("INSERT INTO TBL_SNS_USER (userId, userPwd, userName, profile, profileImage) VALUES (?, ?, ?, ?, ?)",
    [map.userId, map.userPwd, map.userName, map.profile, map.profileImage], (error, results, fields) => {
      if (error) throw error;

      res.send({ result: "회원가입이 완료되었습니다." });
    });
});

app.get('/searchBoardList.dox', (req, res) => { // 게시글 검색
  let map = req.query;
  connection.query("SELECT * FROM TBL_SNS_BOARD WHERE title LIKE ? OR content LIKE ?", [`%${map.keyword}%`, `%${map.keyword}%`], (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get('/snsUserIdCheck.dox', (req, res) => { // 유저 아이디 중복 체크
  let map = req.query;
  connection.query("SELECT * FROM TBL_SNS_USER WHERE USERID = ?", [map.userId], (error, results, fields) => {
    if (error) throw error;
    if (results.length == 0) {
      res.send({ result: "사용 가능한 아이디입니다." });
      return;
    } else {
      res.send({ result: "중복된 아이디입니다." });
    }
  });
});

app.post('/snsUserEdit.dox', (req, res) => { // 유저 프로필 수정 (Pwd 제외)
  let map = req.body;
  connection.query("UPDATE TBL_SNS_USER SET USERNAME = ?, PROFILE = ?, PROFILEIMAGE = ? WHERE USERID = ?", [map.userName, map.profile, map.profileImage, map.userId], (error, results, fields) => {
    if (error) {
      console.error('DB에 넣을 TBL_SNS_USER 테이블 업데이트 중 에러: ' + error.stack);
      res.status(500).send('DB에 넣을 TBL_SNS_USER 테이블 업데이트 쿼리문 에러');
      res.send({ result: "게시글 수정 실패!" });
      return;
    }
    res.send({ result: "게시글 수정 성공!" });
  });
});

app.post('/snsBoardEdit.dox', (req, res) => { // 특정 게시글 수정
  let map = req.body;
  connection.query("UPDATE TBL_SNS_BOARD SET TITLE = ?, CONTENT = ? WHERE BOARDNO = ?", [map.title, map.content, map.boardNo], (error, results, fields) => {
    if (error) {
      console.error('DB에 넣을 TBL_SNS_BOARD 테이블 업데이트 중 에러: ' + error.stack);
      res.status(500).send('DB에 넣을 TBL_SNS_BOARD 테이블 업데이트 쿼리문 에러');
      res.send({ result: "게시글 삭제 실패!" });
      return;
    }
    res.send({ result: "게시글 삭제 성공!" });
  });
});

// app.get('/snsBoardRemove.dox', (req, res) => { // 특정 게시글 삭제
//   let map = req.query;
//   connection.query("DELETE T1, T2 FROM TBL_SNS_BOARD T1 JOIN TBL_SNS_IMAGES T2 ON T1.BOARDNO = T2.BOARDNO WHERE T1.BOARDNO = ?", [map.boardNo], (error, results, fields) => {
//     if (error) {
//       console.error('DB에서 Error deleting board into database: ' + error.stack);
//       res.status(500).send('Error deleting board into database');
//       res.send({ result: "게시글 삭제 실패!" });
//       return;
//     }
//     res.send({ result: "게시글 삭제 성공!" });
//   });
// });


app.get('/snsBoardRemove.dox', (req, res) => {
  let map = req.query;

  // 게시글과 관련된 이미지 파일 경로를 가져오는 쿼리
  connection.query("SELECT fileName FROM TBL_SNS_IMAGES WHERE BOARDNO = ?", [map.boardNo], async (error, results, fields) => {
    if (error) {
      console.error('이미지 파일 경로 조회 중 에러:', error);
      res.status(500).send('이미지 파일 경로 조회 중 에러');
      return;
    }

    // 이미지 파일 삭제
    for (const image of results) {
      const imagePath = 'img/' + image.fileName;
      try {
        await fs.unlink(imagePath);
        console.log(`이미지 파일 ${imagePath}이(가) 삭제되었습니다.`);
      } catch (err) {
        console.error(`이미지 파일 ${imagePath}을(를) 삭제하는 도중 에러가 발생했습니다:`, err);
      }
    }

    // 게시글 및 관련 이미지 정보 삭제 쿼리
    connection.query("DELETE T1, T2 FROM TBL_SNS_BOARD T1 JOIN TBL_SNS_IMAGES T2 ON T1.BOARDNO = T2.BOARDNO WHERE T1.BOARDNO = ?", [map.boardNo], (error, results, fields) => {
      if (error) {
        console.error('DB에서 게시글 및 관련 이미지 정보 삭제 중 에러:', error);
        res.status(500).send('DB에서 게시글 및 관련 이미지 정보 삭제 중 에러');
        return;
      }
      console.log('게시글 및 관련 이미지 정보가 성공적으로 삭제되었습니다.');
      res.send({ result: "게시글 삭제 성공!" });
    });
  });
});

app.post('/snsUserRemove.dox', (req, res) => { // 유저 탈퇴
  let map = req.body;
  connection.query("DELETE FROM TBL_SNS_USER WHERE USERID = ?", [map.userId], (error, results, fields) => {
    if (error || results.length == 0) {
      res.send({ result: "fail" });
      return;
    } else {
      res.send({result: "success", map: results[0]});
    }
  });
});

app.listen(4000, () => {
  console.log('서버가 실행 중입니다.');
});