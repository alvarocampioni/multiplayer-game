import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import DisplayHeader from './components/Header';
import NameForm from './components/NameForm';
import Board from './components/board';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={
          <div>
            <DisplayHeader />
            <NameForm />
          </div>} />
        <Route exact path="/game" element={<Board />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
