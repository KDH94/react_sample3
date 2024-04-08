import './Navbar.css';
import { Modal, Button, Offcanvas } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../assets/home_icon.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile_icon.svg";
import { ReactComponent as SearchIcon } from "../assets/search_icon.svg";
import { ReactComponent as WriteIcon } from "../assets/write_icon.svg";
import { ReactComponent as LoginIcon } from "../assets/login_icon.svg";
import { ReactComponent as LogoutIcon } from "../assets/logout_icon.svg";
import Menu from "../components/Menu";

function Navbar() {
    const [showModalWrite, setShowModalWrite] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [noSearchResults, setNoSearchResults] = useState(false);
    const [userId, setUserId] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const openModalWrite = () => setShowModalWrite(true);
    const closeModalWrite = () => setShowModalWrite(false);
    const handleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sessionUserId = sessionStorage.getItem("userId");
        if (sessionUserId !== null || sessionUserId !== 'undefined') {
            setUserId(sessionUserId);
        }
    }, []);

    // 검색어가 변경될 때마다 검색을 수행하고 검색 결과를 업데이트합니다.
    useEffect(() => {
        // 검색 로직 수행
        async function performSearch() {
            try {
                // 검색 결과를 받아옵니다.
                const response = await fetch(`http://localhost:4000/searchBoardTitle.dox?keyword=${searchKeyword}`);
                const jsonData = await response.json();
                setSearchResults(jsonData);

                // 검색 결과가 없는 경우 메시지를 표시합니다.
                setNoSearchResults(jsonData.length === 0);
            } catch (error) {
                console.log("에러!:", error);
            }
        }

        // 검색어가 비어있지 않은 경우에만 검색을 수행합니다.
        if (searchKeyword.trim() !== "") {
            performSearch();
        }
    }, [searchKeyword]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 3) {
            // 4개 이상의 파일이 선택된 경우
            alert('최대 3개까지 파일을 업로드할 수 있습니다!');
            // 파일 선택을 초기화
            e.target.value = null;
            // 선택된 파일과 미리보기를 초기화
            setSelectedFiles([]);
            setPreviewImages([]);
            return;
        }

        const selectedFilesUrls = files.map(file => URL.createObjectURL(file)); // 선택한 파일들의 미리보기 생성

        setSelectedFiles(files);
        setPreviewImages(selectedFilesUrls);
    };

    const submitWrite = async () => {
        const title = document.querySelector("#title").value;
        const content = document.querySelector("#content").value;

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', selectedFiles);

            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

            selectedFiles.forEach(file => {
                const fileName = `${timestamp}_${file.name}`; // 저장되는 순간의 시간(YYMMDDHHmmss)을 파일 이름과 같이 저장
                formData.append('fileName', fileName);
                formData.append('fileOrgName', file.name); // 원본 파일명은 같이 저장
            });

            const response = await fetch(`http://localhost:4000/snsWriteBoard.dox?userId=${userId}`, {
                method: 'POST',
                body: formData,
            });

            const jsonData = await response.json();
            console.log("formData===>>>", formData);
            alert(jsonData.message);
            navigate('/'); // 작성 후에 홈 화면으로 이동
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onLogout = () => {
        if (window.confirm("정말 로그아웃할까요?")) {
            sessionStorage.clear(); // 세션 전부 제거
            window.location.href = "/login";
        } else {
            return;
        }
    }

    return (
        <>
            <div className="nav-container">
                <nav className='nav flex-column'>
                    <ul className='link-navbar'>
                        <li className={location.pathname === "/" ? "nav-item active" : "nav-item"}>
                            <Link to={"/"} className="nav-link"><HomeIcon width="20" height="20" /> 홈</Link>
                        </li>
                        <li className={location.pathname === "/profile" ? "nav-item active" : "nav-item"}>
                            {sessionStorage.getItem("userId") != null &&
                                <Link to={"/profile"} className="nav-link"><ProfileIcon width="20" height="20" /> 프로필</Link>}
                        </li>
                        <li className="nav-item">
                            <Link to="#" className="nav-link" onClick={handleOffcanvas}><SearchIcon width="20" height="20" /> 검색</Link>
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
                            {sessionStorage.getItem("userId") != null &&
                                <Link className="nav-link" onClick={openModalWrite}>
                                    <WriteIcon width="20" height="20" /> 글 작성
                                </Link>}
                        </li>
                    </ul>
                </nav>
            </div>

            {/* 게시글 검색 */}
            <Offcanvas show={showOffcanvas} onHide={handleOffcanvas} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><strong>검색</strong></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        className="form-control mb-3"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    {noSearchResults && <strong>검색된 결과가 없습니다!</strong>}
                    {/* 검색 결과 출력 */}
                    {searchResults.map(item => (
                        <div key={item.boardNo}>
                            <Menu title={item.title} content={item.content} boardNo={item.boardNo} />
                        </div>
                    ))}
                </Offcanvas.Body>
            </Offcanvas>

            {/* 게시글 작성 */}
            <Modal show={showModalWrite} onHide={closeModalWrite}>
                <Modal.Header closeButton>
                    <Modal.Title>글 작성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input id="title" type="text" placeholder="제목 작성" />
                    <textarea id="content" placeholder="내용 작성" />
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
                    {previewImages.map((image, index) => (
                        <img key={index} src={image} alt={`Uploaded ${index}`} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                    ))}
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
