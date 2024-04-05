import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './View.css'

export default function View(props) {
    const {boardNo} = useParams();
    const [board, setBoard] = useState({});
    useEffect(() => {
        async function fetchBoardView() {
            try {
                const response = await fetch(`http://localhost:4000/snsBoardView.dox?boardNo=${boardNo}`);
                const jsonData = await response.json();
                jsonData.postImage = 
                console.log(jsonData);
                setBoard(jsonData);
            } catch (error) {
                console.log("boardView error:", error);
            }
        }
        fetchBoardView();
    }, [])

    return (
        <div className="view-container">
            <div className="post">
                <div className="post-header">
                    <p className="username">{board.userId}</p>
                    <p className="posted-time">{board.cdate}</p>
                </div>
                <div className="post-content">
                    <h2 className="post-title">{board.title}</h2>
                    <p className="content-text">{board.content}</p>
                </div>
            </div>
        </div>
    )

}