import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import socket from "../socket"
import { AppContext } from "../AppContext";

function CreateGame(){
    const [isDisplaying, setIsDisplaying] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [created, setCreated] = useState(false);
    const [code, setCode] = useState("");
    const { name, setRoom } = useContext(AppContext);

    const toggleDisplaying = () => setIsDisplaying(!isDisplaying);

    const handleGenerate = () => {
        let newCode = crypto.randomUUID();
        setCode(newCode);
        setCreated(true);
    }

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
            <button id="private" onClick={toggleDisplaying}>Create Game</button>
            {isDisplaying && 
            <div className="form-container">
                <h3 id="form-text">Generate Game Code</h3>
                <button className="random" onClick={handleGenerate}>Generate</button>
                {created && <h3 id="form-text" style={{fontSize: "15px"}}>Code: {code}</h3>}
                <NavLink id="random" to={name && code ? "/game" : "/"} style={{ textDecoration: "none", color:"white"}} onClick={handleClick}>Join Game</NavLink>
                {(!name && clicked && <h3 style={{fontFamily: "Roboto"}}>Name cannot be empty</h3>) || (!code && clicked && <h3 style={{fontFamily: "Roboto"}}>Code needs to be generated</h3>)}
            </div>}
        </div>
    );
}

export default CreateGame;