import './Profile.css'
import Post from '../components/Menu';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

function Profile() {
    const [userInfo, setUserInfo] = useState({ userName: "", follower: 0, following: 0, posts: 0, profile: "", profileImage: "" });
    const [boardList, setBoardList] = useState([]);
    const [showModalUpdate, setShowModalUpdate] = useState(false);

    const openModalUpdate = () => setShowModalUpdate(true);
    const closeModalUpdate = async () => {
        setShowModalUpdate(false);
        try {
            const response = await fetch(`http://localhost:4000/snsUserInfo.dox?userId=${sessionStorage.getItem("userId")}`);
            const jsonData = await response.json();
            setUserInfo(jsonData);
        } catch (error) {
            console.log("에러!:", error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setUserInfo(prevUserInfo => ({ ...prevUserInfo, [name]: value }));
    }

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch(`http://localhost:4000/snsUserInfo.dox?userId=${sessionStorage.getItem("userId")}`);
                const jsonData = await response.json();
                console.log("유저프로필==>", jsonData);
                setUserInfo(jsonData);
            } catch (error) {
                console.log("에러!:", error);
            }
        }
        async function fetchUserBoardList() {
            try {
                const response = await fetch(`http://localhost:4000/snsUserBoardList.dox?userId=${sessionStorage.getItem("userId")}`);
                const jsonData = await response.json();
                setBoardList(jsonData);
            } catch (error) {
                console.log("에러!:", error);
            }
        }
        fetchUserInfo();
        fetchUserBoardList();
    }, []);

    const submitEdit = async () => {
        const map = {};
        map.userId = (sessionStorage.getItem("userId"));
        map.userName = userInfo.userName;
        map.profile = userInfo.profile;
        map.profileImage = userInfo.profileImage;
        try {
            const response = await fetch(`http://localhost:4000/snsUserEdit.dox`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(map)
            });
            await response.json();
            //alert(jsonData.result);
            setShowModalUpdate(false); // 모달창 끄기
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const inputRef = useRef(null);
    const handleInputClick = () => {
        // input 요소를 선택하고 내용을 전체 선택
        if (inputRef.current) {
          inputRef.current.select();
        }
      };

    return (
        <>
            <div className="container">
                <div className="profile">
                    <div className="profile-header">
                        <div className="profile-image">
                            <img src={userInfo.profileImage} alt="프로필 이미지" onClick={openModalUpdate} />
                        </div>
                        <div className="profile-info">
                            <h2>{userInfo.userName}</h2>
                            <p>{userInfo.profile}</p>
                            <div className="profile-stats">
                                <div>
                                    <strong>{userInfo.posts}</strong>
                                    <span>게시물</span>
                                </div>
                                <div>
                                    <strong>{userInfo.follower}</strong>
                                    <span>팔로워</span>
                                </div>
                                <div>
                                    <strong>{userInfo.following}</strong>
                                    <span>팔로잉</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-posts">
                        <h3>내가 작성한 게시글</h3>
                        <div className="posts-list">
                            {boardList.length > 0 && boardList.map(post => (
                                <Post key={post.boardNo} title={post.title} content={post.content} boardNo={post.boardNo} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 프로필 업데이트 */}
            <Modal show={showModalUpdate} onHide={closeModalUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>프로필 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="userName">이름:</label>
                    <input type="text" id="userName" name="userName" value={userInfo.userName} onChange={handleChange} />
                    <label htmlFor="profile">프로필:</label>
                    <textarea id="profile" name="profile" value={userInfo.profile} onChange={handleChange} />
                    <label htmlFor="profile">프로필 이미지:</label>
                    <input type="text" ref={inputRef} id="profileImage" name="profileImage" value={userInfo.profileImage} onChange={handleChange} onClick={handleInputClick} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModalUpdate}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={submitEdit}>
                        수정
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Profile;