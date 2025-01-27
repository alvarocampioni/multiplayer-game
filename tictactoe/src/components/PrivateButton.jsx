import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import socket from "../socket"
import { AppContext } from "../AppContext";

function PrivateButton(){
    const [isDisplaying, setIsDisplaying] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [code, setCode] = useState("");
    const { name, setRoom } = useContext(AppContext);

    const toggleDisplaying = () => setIsDisplaying(!isDisplaying);

    const handleChange = (event) => setCode(event.target.value);

    const handleClick = () => {
        setClicked(true);
        if(name && code){
            let newRoom = code;
            setRoom(newRoom);
            socket.emit("find", {name: name, room: newRoom, random: false});
        }
    };

    return (
        <div>
            <button id="private" onClick={toggleDisplaying}>Join Game with Code</button>
            {isDisplaying && 
            <div className="form-container">
                <h3 id="form-text">Insert game code</h3>
                <input type="text" id="username" onChange={handleChange} placeholder="Code" />
                <NavLink id="random" to={name && code ? "/game" : "/"} style={{ textDecoration: "none", color:"white"}} onClick={handleClick}>Join Game</NavLink>
                {(!name && clicked && <h3 style={{fontFamily: "Roboto"}}>Name cannot be empty</h3>) || (!code && clicked && <h3 style={{fontFamily: "Roboto"}}>Code cannot be empty</h3>)}
            </div>}
        </div>
    );
}

export default PrivateButton;