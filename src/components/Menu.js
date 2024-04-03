import './Menu.css'
import React from "react";

function Menu(props) {
    return (
        <div className='menu'>
            <div className='menu-title'>{props.title}</div>
            <div className='menu-content'>{props.content}</div>
        </div>
    )
}

export default Menu;