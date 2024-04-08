import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './View.css'

export default function View() {
    const { boardNo } = useParams();
    const [userId, setUserId] = useState("");
    const [writerId, setWriterId] = useState("");
    const [board, setBoard] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        const sessionUserId = sessionStorage.getItem("userId");
        if (sessionUserId !== null || sessionUserId !== 'undefined') {
            setUserId(sessionUserId);
        }
    }, []);

    useEffect(() => {
        async function fetchBoardView() {
            try {
                const response = await fetch(`http://localhost:4000/snsBoardView.dox?boardNo=${boardNo}`);
                const jsonData = await response.json();
                setWriterId(jsonData.userId);
                setBoard(jsonData);
            } catch (error) {
                console.log("boardView error:", error);
            }
        }
        fetchBoardView();
    }, [boardNo])

    const onUpdatePost = () => {
        setIsUpdate(true);
    }

    const onCancelPost = () => {
        setIsUpdate(false);
    }

    const onUpdatePostOk = async () => {

    }

    const onDeletePost = async () => {

    }

    return (
        <div className="view-container">
            <div className="post">
                <div className="post-header">
                    <p className="username">{board.userId}</p>
                    <p className="posted-time">{board.cdate}</p>
                </div>
                <div className="post-content">
                    {!isUpdate ? <h2 className="post-title">{board.title}</h2> : <input className="view-input" placeholder="제목 작성" />}
                    {!isUpdate ? <p className="content-text">{board.content}</p> : <textarea className="view-input" placeholder="내용 작성"></textarea>}
                </div>
                {!isUpdate && userId === writerId ?
                    <div>
                        <button className="another-btn" onClick={onDeletePost}>삭제</button>
                        <button className="update-btn" onClick={onUpdatePost}>수정</button>
                    </div>
                    :
                    <div>
                        <button className="another-btn" onClick={onCancelPost}>취소</button>
                        <button className="update-btn" onClick={onUpdatePostOk}>확인</button>
                    </div>}
            </div>
        </div>
    )

}