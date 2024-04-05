import './Navbar.css';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../assets/home_icon.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile_icon.svg";
import { ReactComponent as SearchIcon } from "../assets/search_icon.svg";
import { ReactComponent as WriteIcon } from "../assets/write_icon.svg";
import { ReactComponent as LoginIcon } from "../assets/login_icon.svg";
import { ReactComponent as LogoutIcon } from "../assets/logout_icon.svg";

function Navbar() {
    const [showModalWrite, setShowModalWrite] = useState(false);
    const [userId, setUserId] = useState("");

    const openModalWrite = () => setShowModalWrite(true);
    const closeModalWrite = () => setShowModalWrite(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sessionUserId = sessionStorage.getItem("userId");
        if(sessionUserId != null || sessionUserId != undefined) {
            setUserId(sessionUserId);
        }
    }, []);

    const submitWrite = async () => {
        const title = document.querySelector("#title").value;
        const content = document.querySelector("#content").value;

        try {
            const response = await fetch(`/snsWriteBoard.dox?userId=${userId}&title=${title}&content=${content}`);
            const jsonData = await response.json();
            console.log(jsonData);
            navigate('/'); // 작성 후에 홈 화면으로 이동
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onLogout = () => {
        if(window.confirm("정말 로그아웃할까요?")) {
            sessionStorage.clear(); // 세션 전부 제거
            window.location.href="http://localhost:3000/login";
        } else {
            return;
        }
    }
    console.log("세션에 뭐 담겼냐", sessionStorage);
    console.log("유저아이디에 뭐 담겼냐", userId);
    return (
        <>
            <nav className='nav flex-column'>
                <ul className='link-navbar'>
                    <li className={location.pathname === "/" ? "nav-item active" : "nav-item"}>
                        <Link to={"/"} className="nav-link"><HomeIcon width="20" height="20" /> 홈</Link>
                    </li>
                    <li className={location.pathname === "/profile" ? "nav-item active" : "nav-item"}>
                        {sessionStorage.getItem("userId") != null && <Link to={"/profile"} className="nav-link"><ProfileIcon width="20" height="20" /> 프로필</Link>}
                    </li>
                    <li className={location.pathname === "/search" ? "nav-item active" : "nav-item"}>
                        <Link to={"/search"} className="nav-link"><SearchIcon width="20" height="20" /> 검색</Link>
                    </li>
                    <li className={location.pathname === "/login" ? "nav-item active" : "nav-item"}>
                        {sessionStorage.getItem("userId") == null ? 
                        <Link to={"/login"} className="nav-link">
                            <LoginIcon width="20" height="20" /> 로그인
                        </Link> :
                        <Link className="nav-link" onClick={onLogout}>
                            <LogoutIcon width="20" height="20" /> 로그아웃
                        </Link>}
                    </li>
                    <li className="nav-item">
                        {sessionStorage.getItem("userId") != null && <Link className="nav-link" onClick={openModalWrite}>
                            <WriteIcon width="20" height="20" /> 글 작성
                        </Link>}
                    </li>
                </ul>
            </nav>

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
