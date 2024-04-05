// Join.js
import React, { useState } from 'react';
import './Join.css';

export default function Join() {
    const [formData, setFormData] = useState({
        userId: '',
        userPwd: '',
        userName: '',
        profile: '',
        profileImage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기서 formData를 서버로 보내거나 다른 처리를 수행합니다.
        console.log('회원가입 정보:', formData);
        // 예시: 회원가입 정보를 서버로 전송하는 함수 호출
    };

    return (
        <div className="join-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="userId">아이디:</label>
                <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} required placeholder='아이디 입력'/>
                <div>　</div>
                <label htmlFor="userPwd">비밀번호:</label>
                <input type="password" id="userPwd" name="userPwd" value={formData.userPwd} onChange={handleChange} required placeholder='패스워드 입력'/>
                <div>　</div>
                <label htmlFor="userName">이름:</label>
                <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder='이름 입력'/>
                <div>　</div>
                <label htmlFor="profile">프로필:</label>
                <textarea id="profile" name="profile" value={formData.profile} onChange={handleChange} placeholder='자기소개 텍스트 입력'/>
                <div>　</div>
                <label htmlFor="profileImage">프로필 이미지:</label>
                <input type="text" id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder='이미지 주소 입력 ex) https://img.com'/>
                <div>　</div>
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
}
