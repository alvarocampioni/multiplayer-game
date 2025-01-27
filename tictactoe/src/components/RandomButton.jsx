import React, { useContext, useState } from "react";
import socket from "../socket"
import { NavLink } from "react-router-dom";
import { AppContext } from "../AppContext";

function RandomButton(){
    const [clicked, setClicked] = useState(false);
    const { name, setRoom } = useContext(AppContext);

    const handleClick = () => {
        if(name && !clicked){
            let newRoom = crypto.randomUUID();
            setClicked(true);
            setRoom(newRoom);
            console.log(newRoom);
            socket.emit("find", {name: name, room: newRoom, random: true});
        }
    }

    return (
        <div>
            <NavLink id="random" to={name ? "/game" : "/"} style={{ textDecoration: "none", color:"white"}} onClick={handleClick}>Join Random Game</NavLink>
        </div>
    );
}

export default RandomButton;