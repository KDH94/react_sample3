import './Profile.css'
import Post from '../components/Menu';
import React, { useState, useEffect } from 'react';

function Profile() {
    let [userInfo, setUserInfo] = useState({ userName: "", follower: 0, following: 0, posts: 0, profile: "", profileImage: "" });
    let [boardList, setBoardList] = useState([]);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch(`http://localhost:4000/snsUserInfo.dox?userId=user1`);
                const jsonData = await response.json();
                //jsonData.posts = 20;
                jsonData.profileImage = 'https://img.segye.com/content/image/2017/07/22/20170722505000.jpg';
                setUserInfo(jsonData);
                //console.log("jsonData => ", jsonData);
            } catch (error) {
                console.log("에러!:", error);
            }
        }
        async function fetchUserBoardList() {
            try {
                const response = await fetch(`http://localhost:4000/snsUserBoardList.dox?userId=user1`);
                const jsonData = await response.json();
                setBoardList(jsonData);
            } catch (error) {
                console.log("에러!:", error);
            }
        }
        fetchUserInfo();
        fetchUserBoardList();
    }, []);
    return (
        <div className="container">
            <div className="profile">
                <div className="profile-header">
                    <div className="profile-image">
                        <img src={userInfo.profileImage} alt="프로필 이미지" />
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
                        {boardList.map(post => (
                            <Post key={post.id} title={post.title} content={post.content} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;