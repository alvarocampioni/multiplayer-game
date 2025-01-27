import React, { useContext, useEffect, useState } from "react";
import socket from "../socket";
import { AppContext } from "../AppContext";

function DisplayHeader(){
    const [users, setUsers] = useState(0);
    const { setId } = useContext(AppContext);

    useEffect(() => {
        socket.on("setId", () => {
            setId(socket.id);
        })
    })

    useEffect(() => {
        socket.emit("getUsers");
        socket.on("users", (data) => {
            setUsers(data.users);
        });

        return () => {
            socket.off("users");
        }
    });
    

    return (
    <div>
        <h1 id="title">Tic-Tac-Toe</h1>
        <h3 id="sub">Multiplayer</h3>
        <div style={{
    textAlign: "center",
    padding: "8px",
    fontFamily: "'Roboto', sans-serif",
    color: "#333",
}}>
    <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "500",
        margin: 0,
    }}>
        Online Users: <span style={{ color: "#10b981" }}>{users}</span>
    </h3>
</div>


    </div>);
}

export default DisplayHeader;