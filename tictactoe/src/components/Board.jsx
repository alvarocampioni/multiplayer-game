import React, { useContext, useState, useEffect } from "react";
import socket from "../socket"
import { NavLink } from "react-router-dom";
import { AppContext } from "../AppContext";

function Board(){
    const { room, setRoom, name, id } = useContext(AppContext);
    const [matrix, setMatrix] = useState([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [oppName, setOppName] = useState("");
    const [oppSymbol, setOppSymbol] = useState("");
    const [isTurn, setIsTurn] = useState(false);
    const [mySymbol, setMySymbol] = useState("");
    const [isWinner, setIsWinner] = useState(false);
    const [isTie, setIsTie] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [opponentLeft, setOpponentLeft] = useState(false);
    const [closed, setClosed] = useState(false);
    const [played, setPlayed] = useState(false);
    const [timeEnd, setTimeEnd] = useState(false);
    const [countTime, setCountTime] = useState(10);
    const [amount, setAmount] = useState(0);
    const [clickedAgain, setClickedAgain] = useState(false);

    let playerObj;
    useEffect(() => {
        socket.on("find", (e) => {
            const foundRoom = e.players;
            setRoom(foundRoom.player1.room);

            if (foundRoom.player1.id === id) {
                playerObj = foundRoom.player1;
                setOppName(foundRoom.player2.name);
                setOppSymbol(foundRoom.player2.symbol);
                setMySymbol(foundRoom.player1.symbol);
                setIsTurn(foundRoom.player1.isTurn);
            } else {
                playerObj = foundRoom.player2;
                setOppName(foundRoom.player1.name);
                setOppSymbol(foundRoom.player1.symbol);
                setMySymbol(foundRoom.player2.symbol);
                setIsTurn(foundRoom.player2.isTurn);
            }
            setIsPlaying(true);
        });
        return () => socket.off("find");
    }, [isPlaying])

    useEffect(() => {
        socket.on("closed", () => {
            setClosed(true);
        });
        return () => socket.off("closed");
    },[])

    const restartStates = () => {
        setGameEnded(false);
        setIsWinner(false);
        setIsTie(false);
        setTimeEnd(false);
        setCountTime(10);
        setPlayed(false);
        setIsTurn(!playerObj.isTurn);
        setAmount(0);
        setClickedAgain(false);
        setMatrix([
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]);
    }

    useEffect(() => {
        socket.on("again", (amount) => {
            let pressed = amount.amount;
            setAmount(pressed);
            if(pressed === 2){
                setTimeout(() => {
                    restartStates();
                }, 2000);
            }
        });
        return () => socket.off("again");
    },[])

    
    useEffect(() => {
        socket.on("time-end", () => {
            if (isTurn) {
                setIsWinner(false);
            } else {
                setIsWinner(true);
            }
            setIsTurn(false);
            setGameEnded(true);
            setPlayed(true);
            setTimeEnd(true);
            setCountTime(0);
        });
        return () => socket.off("time-end");
    }, [isTurn]);

    useEffect(() => {
        socket.on("play", (e) => {
            if(!isTurn) setPlayed(false);
            setMatrix(e.matrix);
            if (e.result === mySymbol) {
                setGameEnded(true);
                setIsWinner(true);
                setIsTurn(false);
            } else if (e.result === oppSymbol) {
                setGameEnded(true);
                setIsWinner(false);
                setIsTurn(false);
            } else if (e.result === "tie") {
                setGameEnded(true);
                setIsTie(true);
                setIsTurn(false);
            } else {
                setIsTurn(!isTurn);
            }
            setCountTime(10);
        });
        return () => socket.off("play");
    }, [isTurn, played])

    useEffect(() =>{
        socket.on("opponent-left", () => {
            if (!gameEnded) {
                setIsWinner(true);
                setGameEnded(true);
                setIsTurn(false);
            }
            setOpponentLeft(true);
        });
        return () => socket.off("opponent-left");
    }, [gameEnded])

    useEffect(() => {
        if(!isPlaying || gameEnded) return;
        const timerInterval = setInterval(() => {
          setCountTime(prevCountTime => {
            if(prevCountTime === 1) return 0;
            return prevCountTime - 1;
          });
        }, 1000);
        return () => clearInterval(timerInterval); 
      }, [isPlaying, gameEnded, isTurn, played]);

      useEffect(() => {
        if (countTime <= 0 && !gameEnded) {
            socket.emit("time-end", { room });
        }
    }, [countTime, gameEnded]);
    
    const handleBack = () => {
        setRoom("");
        socket.emit("leave-queue", {room: room});
    }

    const handleExit = () => {
        setRoom("");
        socket.emit("exit-room", {room: room});
    }

    const handleClick = (row, col) => {
        if (!matrix[row][col] && isTurn) {
            setPlayed(true);
            socket.emit("play", {matrix: matrix, row: row, col: col, symbol: mySymbol, room: room});
        }
    };

    const handlePlayAgain = () => {
        setClickedAgain(true);
        socket.emit("again", {room: room});
    }

    return (
        <div>
            {!isPlaying && (
                <div>
                    <div className="loading-container">
                        {!closed && <div className="loading">
                            Looking for an opponent...
                            <h1 style={{fontSize:"20px"}}>Game Code: {room}</h1>
                            </div>}
                        {closed && <div className="loading">This server is full ! Use another code</div>}
                    </div>
                    <div className="back-container">
                        <NavLink to="/" className={"back"} style={{ textDecoration: "none", color:"black"}} onClick={handleBack}>Back</NavLink>
                    </div>
                </div>
            )}
            
            {isPlaying && (
                <div>
                    <div className="game-header">
                        <div className="player">
                            <h2 className="player-name" style={{ color: "#007bff" }}>{name}</h2>
                            <h3 className="player-symbol" style={{ color: "#007bff" }}>Playing as: {mySymbol}</h3>
                        </div>
                        <div className="versus">
                            <h2>VS</h2>
                        </div>
                        <div className="player">
                            <h2 className="player-name" style={{ color: "#ff5733" }}>{oppName}</h2>
                            <h3 className="player-symbol" style={{ color: "#ff5733" }}>Playing as: {oppSymbol}</h3>
                        </div>
                    </div>
                    <div className="exit-container">
                        <NavLink to="/" className={"exit"} style={{ textDecoration: "none", color:"black"}} onClick={handleExit}>Exit</NavLink>
                        <div className="again-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                        {gameEnded && !opponentLeft && 
                            <button 
                                className="again" 
                                onClick={handlePlayAgain} 
                                disabled={clickedAgain}
                            >
                                Play Again
                            </button>
                        }
                        {amount === 1 && gameEnded &&  !opponentLeft &&
                            <h3 style={{
                                color: '#333', 
                                fontSize: '18px', 
                                fontWeight: 'normal', 
                                marginTop: '10px'
                            }}>
                                {amount}/2
                            </h3>
                        }
                        {amount === 2 && gameEnded &&  !opponentLeft &&
                            <h3 style={{
                                color: '#ff5733', 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                marginTop: '10px'
                            }}>
                                Starting Rematch...
                            </h3>
                        }
                    </div>
                    </div>
                    <div className="turn-indicator">
                        {opponentLeft && <h2 style={{ 
                            color: "#ff5733", 
                            fontWeight: "bold", 
                            textAlign: "center", 
                            fontSize: "30px" 
                            }}>Opponent Left the Match !
                            </h2>}
                            {timeEnd && <h2 style={{ 
                            color: "black", 
                            fontWeight: "bold", 
                            textAlign: "center", 
                            fontSize: "30px" 
                            }}>{isWinner ? "Opponent's " : "Your "} Time Ended !</h2>}
                        <h2 
                            style={{ 
                            color: isTurn ? "#007bff" : !gameEnded ? "#ff5733" : isWinner ? "#007bff" : isTie ? "black" : "#ff5733", 
                            fontWeight: "bold", 
                            textAlign: "center", 
                            fontSize: "30px" 
                            }}
                        >
                            {isTurn ? "Your Turn !" : gameEnded ? "" : "Opponent's Turn !"}
                            {gameEnded ? isTie ? "Tied !" : isWinner ? "You won !" : "Opponent won !" : "" }
                        </h2>
                    </div>
                    <div className="board">
                        {matrix.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleClick(rowIndex, colIndex)}
                                    style={{backgroundColor: cell === mySymbol ? "#007bff" : !cell ? "" : "#ff5733" }}
                                >
                                    {cell}
                                </button>
                            ))
                        )}
                    </div>
                    { isPlaying &&
                    <div className="timer-container">
                        <div className="timer" style={{backgroundColor: isTurn ? "#007bff" : "#ff5733"}}>Time: {countTime}sec</div>
                    </div>
                    }
                </div>
            )}
        </div>
    );
}

export default Board;