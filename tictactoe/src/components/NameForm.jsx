import React, { useContext } from "react";
import RandomButton from "./RandomButton";
import PrivateButton from "./PrivateButton";
import CreateGame from "./CreateGame";
import { AppContext } from "../AppContext";

function NameForm(){
    const { name, setName } = useContext(AppContext)
    const handleChange = (event) => setName(event.target.value);
    return (
        <div>
            <div className="form-container">
                <h3 id="form-text">Select your username</h3>
                <input type="text" id="username" value={name} name="Username" onChange={handleChange} placeholder="Name" />
            </div>
            <div>
                <RandomButton />
                <PrivateButton />
                <CreateGame />
            </div>
        </div>
        );
}

export default NameForm;