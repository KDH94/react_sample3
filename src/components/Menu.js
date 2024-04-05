import './Menu.css'
import React from "react";
import { Link } from 'react-router-dom';

function Menu(props) {
    return (
        <div className='menu'>
            <Link to={`/view?boardNo=${props.boardNo}`}>
                <div className='menu-title'>{props.title}</div>
                <div className='menu-content'>{props.content}</div>
            </Link>
        </div>
    )
}

export default Menu;