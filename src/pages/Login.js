import './Login.css';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [userPwd, setUserPwd] = useState("");

    const onSubmit = async () => {
        const response = await fetch(`http://localhost:4000/snsUserLogin.dox`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ // 필요한 정보 json string 컨버팅 해서 넣기
                    userId: userId,
                    userPwd: userPwd
                }),
                // body : JSON.stringify(map) // map에 있는거 통째로 보낼 때
            });
        const jsonData = await response.json();
        if (jsonData.result === "success") {
            sessionStorage.setItem('userId', jsonData.map.userId);
            navigate("/");
        } else {
            alert("로그인 실패!");
            sessionStorage.clear();
        }
    }

    const onJoin = () => {
        navigate('/join');
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
                    <br />
                    <button type='button' className='join-btn' onClick={onJoin}>회원가입</button>
                </div>

            </fieldset>
        </Form>
    )
}

export default Login;