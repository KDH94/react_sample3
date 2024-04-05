import React, { useState, useEffect } from "react";
import './View.css'

export default function View(props) {
    let [board, setBoard] = useState({ boardNo: 0, userId: "", title: "", content: "", cdate: "" });
    useEffect(() => {
        async function fetchBoardView() {
            try {
                const response = await fetch(`http://localhost:4000/snsBoardView?boardNo=${props.boardNo}`);
                const jsonData = response.json();
                setBoard(jsonData);
            } catch (error) {
                console.log("boardView error:", error);
            }
        }
        fetchBoardView();
    }, [])

    return (
        <div className="instagram-style-post">
            <div className="post-header">
                <span className="username">{board.userId}</span>
                <span className="timestamp">{board.cdate}</span>
            </div>
            <div className="post-content">
                <h3 className="post-title">{board.title}</h3>
                <p className="post-text">{board.content}</p>
            </div>
        </div>
    )

}