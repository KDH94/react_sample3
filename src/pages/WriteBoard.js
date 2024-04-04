import './WriteBoard.css';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function WriteBoard() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async () => {
        const title = document.querySelector('#title').value;
        const content = document.querySelector('#content').value;

        try {
            const response = await fetch('/snsWriteBoard.dox', {
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
        <div className='container'>
            <Button variant="primary" onClick={handleShow}>
                글쓰기
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>글 작성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input id="title" placeholder="제목 작성" /><br/>
                    <textarea id="content" placeholder="글 작성" /><br/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        작성
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}