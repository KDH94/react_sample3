import './Navbar.css';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../assets/home_icon.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile_icon.svg";
import { ReactComponent as SearchIcon } from "../assets/search_icon.svg";
import { ReactComponent as WriteIcon } from "../assets/write_icon.svg";
import { ReactComponent as LoginIcon } from "../assets/login_icon.svg";

function Navbar() {
    const [showModalWrite, setShowModalWrite] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [userId, setUserId] = useState("");
    const [userPwd, setUserPwd] = useState("");

    const openModalWrite = () => setShowModalWrite(true);
    const closeModalWrite = () => setShowModalWrite(false);
    const openModalLogin = () => setShowModalLogin(true);
    const closeModalLogin = () => setShowModalLogin(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const tempUserId = sessionStorage.getItem("userId");
        setUserId(tempUserId);
        console.log("userId==>", sessionStorage);
    }, []);

    const submitLogin = async () => {
        try {
            const response = await fetch(`http://localhost:4000/snsUserLogin.dox?userId=${userId}&userPwd=${userPwd}`);
            const jsonData = await response.json();
            console.log("jsonData==>", jsonData);
            if (jsonData.result === "success") {
                sessionStorage.setItem('userId', jsonData.userId);
                console.log("userId==>", sessionStorage);
                window.location.href = "http://localhost:3000";
            } else {
                alert("로그인 실패!");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const submitWrite = async () => {
        const title = document.querySelector('#title').value;
        const content = document.querySelector('#content').value;
        setUserId();

        try {
            const response = await fetch(`/snsWriteBoard.dox?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });

            const data = await response.json();
            console.log(data); // 서버에서 받은 응답을 확인

            // 작성 후에 다른 동작을 수행하거나 페이지를 리디렉션할 수 있음
            navigate('/'); // 작성 후에 홈 화면으로 이동
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <nav className='nav flex-column'>
                <ul className='link-navbar'>
                    <li className={location.pathname === "/" ? "nav-item active" : "nav-item"}>
                        <Link to="/" className="nav-link"><HomeIcon width="20" height="20" /> 홈</Link>
                    </li>
                    <li className={location.pathname === "/profile" ? "nav-item active" : "nav-item"}>
                        <Link to="/profile" className="nav-link"><ProfileIcon width="20" height="20" /> 프로필</Link>
                    </li>
                    <li className={location.pathname === "/search" ? "nav-item active" : "nav-item"}>
                        <Link to="/search" className="nav-link"><SearchIcon width="20" height="20" /> 검색</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" onClick={openModalLogin}>
                            <LoginIcon width="20" height="20" /> 로그인
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" onClick={openModalWrite}>
                            <WriteIcon width="20" height="20" /> 글 작성
                        </Link>
                    </li>
                </ul>
            </nav>
            {/* 로그인 모달창 */}
            <Modal show={showModalLogin} onHide={closeModalLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>로그인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <input type="text" value={userId} placeholder="아이디 입력" onChange={(e) => setUserId(e.target.value)} autoComplete="userId" />
                        <br />
                        <input type="password" value={userPwd} placeholder="패스워드 입력" onChange={(e) => setUserPwd(e.target.value)} autoComplete="current-password" />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModalLogin}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={submitLogin}>
                        로그인
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* 글 작성 모달창 */}
            <Modal show={showModalWrite} onHide={closeModalWrite}>
                <Modal.Header closeButton>
                    <Modal.Title>글 작성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input id="title" type="text" placeholder="제목 작성" />
                    <textarea id="content" placeholder="내용 작성" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModalWrite}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={submitWrite}>
                        작성
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Navbar;
