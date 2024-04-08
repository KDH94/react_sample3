const express = require('express');
var cors = require('cors')
const mysql = require('mysql');
const path = require('path');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
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

app.get('/boardList', function (req, res) {

  res.render('boardList', { session: req.session });
});

app.get('/boardView/:boardNo', function (req, res) {
  let map = req.params;
  res.render('boardView', { boardNo: map.boardNo });
});

app.get('/boardAdd', function (req, res) {
  res.render('boardAdd', {});
});

app.get('/boardEdit/:boardNo', function (req, res) {
  let map = req.params;
  res.render('boardEdit', { boardNo: map.boardNo });
});

app.get('/userLogin', function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("세션 종료 중 에러 발생:", err);
    } else {
      console.log("세션 종료 성공");
    }
  });
  res.render('userLogin', {});
});

app.get('/boardList.dox', (req, res) => {
  var map = req.query;
  connection.query(`SELECT B.*, DATE_FORMAT(CDATETIME, '%Y-%m-%d %p %h:%i') AS cdate FROM TBL_BOARD B`, (error, results, fields) => {
    if (error) throw error;
    //console.log(req.session);
    res.send(results);
  });
});

app.get('/boardView.dox', (req, res) => {
  var map = req.query;
  connection.query("SELECT B.*, DATE_FORMAT(CDATETIME, '%y년 %c월 %e일 %H시 %i분 %s초') AS cdate FROM TBL_BOARD B WHERE BOARDNO = ?", [map.boardNo], (error, results, fields) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

app.get('/boardRemove.dox', (req, res) => {
  var map = req.query;
  connection.query("DELETE FROM TBL_BOARD WHERE BOARDNO = ?", [map.boardNo], (error, results, fields) => {
    if (error) {
      console.error('Error deleting board into database: ' + error.stack);
      res.status(500).send('Error deleting board into database');
      res.send({ result: "게시글 삭제 실패!" });
      return;
    }
    res.send({ result: "게시글 삭제 성공!" });
  });
});

app.get('/boardAdd.dox', (req, res) => {
  var map = req.query;
  console.log("session userId ==> ", req.session.userId);
  connection.query("INSERT INTO TBL_BOARD VALUES (NULL, ?, ?, ?, NOW())", [map.title, map.contents, req.session.userId], (error, results, fields) => {
    if (error) {
      console.error('Error inserting board into database: ' + error.stack);
      res.status(500).send('Error inserting board into database');
      res.send({ result: "게시글 작성 실패!" });
      return;
    }
    res.send({ result: "게시글 작성 성공!" });
  });
});

app.get('/boardEdit.dox', (req, res) => {
  var map = req.query;
  connection.query("UPDATE TBL_BOARD SET TITLE = ?, CONTENTS = ? WHERE BOARDNO = ?", [map.title, map.contents, map.boardNo], (error, results, fields) => {
    if (error) {
      console.error('Error updating board into database: ' + error.stack);
      res.status(500).send('Error updating board into database');
      res.send({ result: "게시글 수정 실패!" });
      return;
    }
    res.send({ result: "게시글 수정 성공!" });
  });
});

app.get('/userLogin.dox', (req, res) => {
  var map = req.query;
  connection.query("SELECT * FROM TBL_USER WHERE USERID = ? AND USERPWD = ?", [map.userId, map.userPwd], (error, results, fields) => {
    if (error || results.length == 0) {
      console.error('로그인 실패: ' + error.stack);
      res.send({ result: "fail" });
      return;
    } else {
      req.session.userId = results[0].userId;
      req.session.userName = results[0].userName;
      console.log(req.session);
      res.send({ result: "success" });
    }
  });
});

app.get('/userIdCheck.dox', (req, res) => {
  var map = req.query;
  connection.query("SELECT * FROM TBL_USER WHERE USERID = ?", [map.userId], (error, results, fields) => {
    if (error) throw error;
    if (results.length == 0) {
      res.send({ result: "사용 가능한 아이디" });
      return;
    } else {
      res.send({ result: "중복된 아이디" });
    }
  });
});
// -------------------------------------------------------------------------
app.get('/snsUserInfo.dox', (req, res) => { // 유저 정보 출력
  var map = req.query;
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
  var map = req.query;
  connection.query("SELECT * FROM TBL_SNS_BOARD", (error, results, fields) => {
    if (error) throw error;

    if (results.length == 0) {
      res.send({ result: "게시글 없음" });
    } else {
      res.send(results);
    }
  });
});

app.get('/snsBoardView.dox', (req, res) => { // 지정한 게시글 출력
  var map = req.query;
  connection.query("SELECT B.*, DATE_FORMAT(CDATETIME, '%y년 %c월 %e일 %H시 %i분 %s초') AS cdate FROM TBL_SNS_BOARD B WHERE BOARDNO = ?", [map.boardNo], (error, results, fields) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

app.get('/snsUserBoardList.dox', (req, res) => { // 해당 유저가 작성한 게시글 목록 출력
  var map = req.query;
  connection.query("SELECT * FROM TBL_SNS_BOARD WHERE USERID = ?", [map.userId], (error, results, fields) => {
    if (error) throw error;

    if (results.length == 0) {
      res.send({ result: "게시글 없음" });
    } else {
      res.send(results);
    }
  });
});

app.post('/snsWriteBoard.dox', (req, res) => { // 게시글 작성
  const map = req.body;

  console.log("map==>>>>", req.body);
  // 게시글 정보 삽입
  connection.query("INSERT INTO TBL_SNS_BOARD VALUES (NULL, ?, ?, ?, NOW())", [map.userId, map.title, map.content], (error, results, fields) => {
    if (error) throw error;

    // 게시글 작성 성공 시
    const boardNo = results.insertId; // 새로 생성된 게시글의 번호 가져오기

    // 이미지 파일 정보 삽입
    const fileName = req.body.fileName; // 파일명
    const fileOrgName = req.body.fileOrgName; // 원본 파일명
    const filePaths = req.files.map(file => file.path); // 이미지 파일 경로들
    if (filePaths.length > 0) {
      // 각 이미지 파일에 대해 반복하여 삽입
      filePaths.forEach((filePath, index) => {
        // 각 이미지 파일에 대한 파일명 및 원본 파일명 가져오기
        const fileIdx = index < fileName.length ? index : fileName.length - 1;
        const fileNameForDB = fileName[fileIdx];
        const fileOrgNameForDB = fileOrgName[fileIdx];
        // TBL_SNS_IMAGES 테이블에 이미지 파일 정보 삽입
        connection.query("INSERT INTO TBL_SNS_IMAGES (boardNo, filePath, fileName, fileOrgName) VALUES (?, ?, ?, ?)", [boardNo, filePath, fileNameForDB, fileOrgNameForDB], (error, results, fields) => {
          if (error) throw error;
          console.log("이미지 파일이 성공적으로 삽입되었습니다.");
        });
      });
    }

    // 클라이언트에게 응답 전송
    res.send({ message: "게시글 작성 및 이미지 업로드가 완료되었습니다." });
  });
});


app.post('/snsUserLogin.dox', (req, res) => { // 유저 로그인
  var map = req.body;
  connection.query("SELECT * FROM TBL_SNS_USER WHERE USERID = ? AND USERPWD = ?", [map.userId, map.userPwd], (error, results, fields) => {
    if (error || results.length == 0) {
      console.log("로그인 실패");
      res.send({ result: "fail" });
      return;
    } else {
      console.log("로그인 성공");
      res.send({ result: "success", map: results[0] });
    }
  });
});

app.post('/snsUserJoin.dox', (req, res) => { // 유저 회원가입
  var map = req.body;
  connection.query("INSERT INTO TBL_SNS_USER (userId, userPwd, userName, profile, profileImage) VALUES (?, ?, ?, ?, ?)", [map.userId, map.userPwd, map.userName, map.profile, map.profileImage], (error, results, fields) => {
    if (error) throw error;

    res.send(results[0]);

  });
});

app.get('/searchBoardTitle.dox', (req, res) => { // 게시글 검색
  var map = req.query;
  connection.query("SELECT * FROM TBL_SNS_BOARD WHERE title LIKE ?", [`%${map.keyword}%`], (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

app.listen(4000, () => {
  console.log('서버가 실행 중입니다.');
});