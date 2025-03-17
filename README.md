
# Multiplayer Tic-Tac-Toe Game
A Multiplayer Tic-Tac-Toe Game, play with strangers or in private rooms, friendly and interactive UI.

Play now: [multictactoe.netlify.app](https://multictactoe.netlify.app/)





## Technologies
- JavaScript: Main Backend language, handles the `Game` logic and the `Client-Side`/`Server` logic.

- Socket.io: JavaScript library that enables real-time, bi-directional communication between web clients and servers.

- React.js: JavaScript library responsible for building the user interface with UI components, managing the state of the application, and rendering updates..

# Game Overview
This game offers two modes of play:

- Play with Random Strangers: Quickly find an opponent using an automated matchmaking system.
- Play with Friends: Create a private room, share the room code with friends, and enjoy the game together.

At the end of a match, players can opt for a rematch with the same opponent.

# Server

The Socket.io library is at the core of the server's real-time communication capabilities. By leveraging its powerful event-based system, the server manages several key aspects of the game:


## 1. Instant Communication:
Enables real-time, bidirectional communication between players and the server, ensuring immediate updates and a smooth multiplayer experience.

## 2. Matchmaking:
- Handles pairing players automatically for public games.
- Allows players to create private rooms and join games via unique room-codes.

## 3. Game State Synchronization:
Ensures the game board and player actions are synchronized across all connected clients. When one player makes a move, the updated game state is instantly broadcast to their opponent.

- Turn Management: Tracks and enforces turn order, ensuring fairness and consistency. If a player fails to act within the given time, their turn is canceled and the game ends.
- End-Game Events: Determines winners, ties, or timeouts based on game logic. Notifies both players of the outcome in real time.
- Handles rematch requests efficiently, resetting the game state and ensuring both players are ready before restarting.

## 4. Disconnection Handling:
Detects when a player leaves mid-game and informs the remaining player immediately. This ensures the game can handle unexpected interruptions.

# Run Locally

## Prerequisites
- Node.js
- Git

## Configuring

### 1. Clone the Repository
```
git clone https://github.com/your-username/multiplayer-game.git
cd multiplayer-game
```

### 2. Installing Dependencies
To install all the necessary dependencies, run the following command at the root of the project : `multiplayer-game/tictactoe`
```
npm install
```
This command will download all the dependencies specified in the `package.json` file and compile the project.

### Running
After all dependencies have been installed, execute the command at the root of the project : `multiplayer-game/tictactoe`
```
npm run dev
```
And start the `Server` by executing the command at the `src` of the project : 
```
nodemon server.js
```

The frontend will be running on :
```
http://localhost:3000
```
And you can already start playing !






## Contact
Email: alvarocampioni@usp.br


