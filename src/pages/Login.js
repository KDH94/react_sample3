import './Login.css';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login({ onLogin }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [userPwd, setUserPwd] = useState("");

    const onSubmit = async () => {
        const response = await fetch(`http://localhost:4000/snsUserLogin.dox?userId=${userId}&userPwd=${userPwd}`);
        const jsonData = await response.json();
        console.log("jsonData==>", jsonData);
        if (jsonData.result === "success") {
            onLogin(jsonData.userId); // 사용자 Id 전달
            //세션에 사용자 정보 저장
            sessionStorage.setItem('userId', jsonData.userId);
            console.log("userId==>", sessionStorage);
            window.location.href = "http://localhost:3000";
        } else {
            alert("로그인 실패!");
        }
    }

    return (
        <Form className='login-container'>
            <fieldset className='text-center login-box'>
                <legend>로그인</legend>
                <input type="text" value={userId} placeholder="아이디 입력" onChange={(e) => setUserId(e.target.value)} autoComplete="userId" />
                <br />
                <input type="password" value={userPwd} placeholder="패스워드 입력" onChange={(e) => setUserPwd(e.target.value)} autoComplete="current-password" />
                <div>
                    <button type='submit' className='login-btn' onClick={onSubmit}>로그인</button>
                </div>
            </fieldset>
        </Form>
    )
}

export default Login;