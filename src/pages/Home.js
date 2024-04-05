import Menu from '../components/Menu';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Home.css';

function Home() {
    let [boardList, setBoardList] = useState([]);

    useEffect(() => {
        async function fetchBoardList() {
            try {
                const res = await fetch(`http://localhost:4000/snsBoardList.dox`);
                const jsonData = await res.json();
                setBoardList(jsonData);
            } catch (error) {
                console.log("에러!:", error);
            }
        }
        fetchBoardList();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center my-5">게시판</h1>
            <div className="row">
                {boardList.map(item => (
                    <div className="col-sm-6 col-md-5 col-lg-4" key={item.boardNo}>
                        <Menu title={item.title} content={item.content} boardNo={item.boardNo} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;