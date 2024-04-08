// Join.js
import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import './Join.css';

export default function Join() {
    const navigate = useNavigate ();
    const [formData, setFormData] = useState({
        userId: '',
        userPwd: '',
        userName: '',
        profile: '',
        profileImage: ''
    });
    const [userIdCheckResult, setUserIdCheckResult] = useState('');

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 아이디 중복 체크 요청 보내기
        if (name === 'userId' && value.trim() !== '') { // 빈 값 체크 추가
            try {
                const response = await fetch(`http://localhost:4000/snsUserIdCheck.dox?userId=${value}`);
                const jsonData = await response.json();
                setUserIdCheckResult({ message: jsonData.result, color: jsonData.result.includes("중복") ? 'red' : 'blue' });
            } catch (error) {
                console.error("Error:", error);
            }
        } else { // 빈 값이면 중복 결과 표시 지우기
            setUserIdCheckResult({ message: '', color: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/snsUserJoin.dox', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const jsonData = await response.json();
            alert(jsonData.result);
            navigate('/'); // 홈으로 이동
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="join-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="userId">아이디:</label>
                <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} required placeholder='아이디 입력' />
                <div style={{ color: userIdCheckResult.color, fontWeight: 'bold' }}>{userIdCheckResult.message}</div> {/* 아이디 중복 결과 표시 */}
                <div>　</div>
                <label htmlFor="userPwd">비밀번호:</label>
                <input type="password" id="userPwd" name="userPwd" value={formData.userPwd} onChange={handleChange} required placeholder='패스워드 입력' />
                <div>　</div>
                <label htmlFor="userName">이름:</label>
                <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder='이름 입력' />
                <div>　</div>
                <label htmlFor="profile">프로필:</label>
                <textarea id="profile" name="profile" value={formData.profile} onChange={handleChange} placeholder='자기소개 텍스트 입력' />
                <div>　</div>
                <label htmlFor="profileImage">프로필 이미지:</label>
                <input type="text" id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder='이미지 주소 입력 ex) https://img.com' />
                <div>　</div>
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
}
