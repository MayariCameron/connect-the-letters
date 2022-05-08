import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { boardDefault, generateWordSet, wordArray, points } from "./Words";
import React, { useState, createContext, useEffect } from "react";
import GameOver from "./components/GameOver";

export const AppContext = createContext();
export var horizontal = true;
export var correctPointList = [];
var validWords = false;
var connect = false;

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letter: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [correctWord, setCorrectWord] = useState("");
  const [gameOver, setGameOver] = useState({
    gameOver: false, guessedWord: false,
  });

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }, []);

  const onSelectSquare = (att, lett) => {
    if (currAttempt.attempt === att && currAttempt.letter === lett) {
      horizontal = !horizontal;
      setCurrAttempt({
        attempt: att, letter: lett
      });
    } else {
      setCurrAttempt({
        attempt: att, letter: lett
      });
    }
  };

  // can delete enter eventually
  const onEnter = () => {
    if (currAttempt.letter !== 7) return;
 
    let currWord = "";
    for (let i = 0; i < 7; i++) {
      currWord += board[currAttempt.attempt][i];
    }
    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
    } else {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
    }
 
  };


  const onDelete = () => {
    const newBoard = [...board];
    if(horizontal){
      // if we delete a blank space, we delete the previous square
      if(newBoard[currAttempt.attempt][currAttempt.letter] === ""){
        if(currAttempt.letter === 0){
          if(currAttempt.attempt > 0){
            newBoard[currAttempt.attempt-1][7] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: currAttempt.attempt - 1, letter: 7});
          } else {
            newBoard[currAttempt.attempt][currAttempt.letter] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: 0, letter: 0});
          }
        } 
        else {
          newBoard[currAttempt.attempt][currAttempt.letter-1] = "";
          setBoard(newBoard);
          setCurrAttempt({ ...currAttempt, letter: currAttempt.letter - 1 });
        }
      } 
      // else delete current space
      else {
        if(currAttempt.letter === 0){
          if(currAttempt.attempt > 0){
            newBoard[currAttempt.attempt][currAttempt.letter] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: currAttempt.attempt - 1, letter: 7});
          } else {
            newBoard[currAttempt.attempt][currAttempt.letter] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: 0, letter: 0});
          }
        } 
        else {
          newBoard[currAttempt.attempt][currAttempt.letter] = "";
          setBoard(newBoard);
          setCurrAttempt({ ...currAttempt, letter: currAttempt.letter - 1 });
        }
      }
    } else { 
      // if we delete a blank space, we delete the previous square
      if(newBoard[currAttempt.attempt][currAttempt.letter] === ""){
        if(currAttempt.attempt === 0){
          if(currAttempt.letter > 0){
            newBoard[7][currAttempt.letter-1] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: 7, letter: currAttempt.letter-1});
          } else {
            newBoard[currAttempt.attempt][currAttempt.letter] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: 0, letter: 0});
          }
        } 
        else {
          newBoard[currAttempt.attempt-1][currAttempt.letter] = "";
          setBoard(newBoard);
          setCurrAttempt({ attempt: currAttempt.attempt -1 , letter: currAttempt.letter });
        }
      } 
      // else delete current space
      else {
        if(currAttempt.attempt === 0){
          if(currAttempt.letter > 0){
            newBoard[currAttempt.attempt][currAttempt.letter] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: 7, letter: currAttempt.letter - 1});
          } else {
            newBoard[currAttempt.attempt][currAttempt.letter] = "";
            setBoard(newBoard);
            setCurrAttempt({ attempt: 0, letter: 0});
          }
        } 
        else {
          newBoard[currAttempt.attempt][currAttempt.letter] = "";
          setBoard(newBoard);
          setCurrAttempt({ attempt: currAttempt.attempt -1 , letter: currAttempt.letter  });
        }
      }
    }
    wordCheck();
    checkConnect();
    if(validWords && connect){
      setGameOver({ gameOver: true, guessedWord: true });
    }
  };
 
  const onSelectLetter = (key) => {
    if(horizontal){
        if (currAttempt.letter > 7){
          const newBoard = [...board];
          newBoard[currAttempt.attempt + 1][0] = key;
          setBoard(newBoard);
          setCurrAttempt({
            attempt: currAttempt.attempt + 1,
            letter: 1,
          });
        } 
        else {
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter] = key;
        setBoard(newBoard);
        setCurrAttempt({
          attempt: currAttempt.attempt,
          letter: currAttempt.letter + 1,
        });
      }
    } else {
      if (currAttempt.attempt > 7){
        const newBoard = [...board];
        newBoard[0][currAttempt.letter + 1] = key;
        setBoard(newBoard);
        setCurrAttempt({
          attempt: 1,
          letter: currAttempt.letter + 1,
        });
      } 
      else {
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter] = key;
        setBoard(newBoard);
        setCurrAttempt({
          attempt: currAttempt.attempt + 1,
          letter: currAttempt.letter,
        });
      }
    }
    wordCheck();
    checkConnect();
    if(validWords && connect){
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }
  };
  
  // maybe make the same format as other functions
  var wordCheck = () => {
    var previousLetter = "";
    var currentLetter = "";
    
    var word = "";
    var wordList = [];
    var pointString = "";
    var pairsList = [];

    // parse horizontally
    for (let i = 0; i < 8; i++) {
      previousLetter = "";
      currentLetter = "";
      for (let j = 0; j < 8; j++){
        currentLetter = board[i][j];
        var num1 = i.toString();
        var num2 = j.toString();
        num2 = ",".concat(num2);
        var point =num1.concat(num2);
        if(previousLetter !== "" && currentLetter === ""){
          if(word.length > 1){
            word.concat(currentLetter);
            pointString.concat(point);
            pairsList.push(pointString);
            pointString = "";
            wordList.push(word);
            word = "";
          }
        } else if (j === 0) {
          word.concat(currentLetter);
          pointString.concat(point);
        } else if (j === 7) {
          word.concat(currentLetter);
          pointString.concat(point);
          pairsList.push(pointString);
          pointString = "";
          wordList.push(word);
          word = "";
        } else if (previousLetter !== "" && currentLetter !== ""){
          word.concat(currentLetter);
          pointString.concat(point);
        } else if (previousLetter === "" && currentLetter !== ""){
          word.concat(currentLetter);
          pointString.concat(point);
        } else if (previousLetter === "" && currentLetter === ""){
          word.concat(currentLetter);
          pointString.concat(point);
        } 
        previousLetter = board[i][j]
      }
    }

    previousLetter = "";
    currentLetter = "";
     word = "";
     wordList = [];
     pointString = "";
    // parse vertically
    for (let i = 0; i < 8; i++) {
      previousLetter = "";
      currentLetter = "";
      for (let j = 0; j < 8; j++){
        currentLetter = board[j][i];
        num1 = i.toString();
        num1 = ",".concat(num1);
        num2 = j.toString();
        point = num2.concat(num1);
        if(previousLetter !== "" && currentLetter === ""){
          if(word.length > 1){
            pairsList.push(pointString);
            pointString = "";
            wordList.push(word);
            word = "";
          }
        } else if (i === 0) {
          pointString.concat(point);
          word.concat(currentLetter);
        } else if (i === 7) {
          word.concat(currentLetter);
          pointString.concat(point);
          pairsList.push(pointString);
          pointString = "";
          wordList.push(word);
          word = "";
        } else if (previousLetter !== "" && currentLetter !== ""){
          pointString.concat(point);
          word.concat(currentLetter);
        } else if (previousLetter === "" && currentLetter !== ""){
          pointString.concat(point);
          word.concat(currentLetter);
        } else if (previousLetter === "" && currentLetter === ""){
          word.concat(currentLetter);
        } 
        previousLetter = board[j][i]
      }
    }
    var bool = true;
    correctPointList = [];

    for(let i = 0; i < wordList.length; i++){
      bool = bool && (checkBank(wordList[i]));
      if(checkBank(wordList[i])){
        correctPointList.push(pairsList[i]);
      }
    }
    if (wordList.length > 0){
      validWords = bool;
    } else {
      validWords = false;
    }
  }

  function checkBank(word){
    return (wordArray.indexOf(word) >= 0);
  }
 
  function checkConnect(){
    
    var start = points[0];
    var bools = [];
    for (let i = 1; i < points.length; i++) {
      var newBoard = formatBoard(board, points[i]);
      if(findShortestPath(start, newBoard) !== false){
        bools.push(true);
      } else {
        bools.push(false);
      }
    }

    connect = !bools.includes(false);
    setCurrAttempt({
      attempt: currAttempt.attempt, letter: currAttempt.letter
    });
  }

  function formatBoard(board, goal){
    var newBoard = [];
    var x = goal[0];
    var y = goal[1];
    for (let i = 0; i < 8; i++) {
      var row = []
      for (let j = 0; j < 8; j++){
        if(x === i && y === j) {
          row.push('Goal');
        } else if(board[i][j] !== ''){
          row.push('Valid');
        } else if (board[i][j] === '') {
          row.push('Obstacle');
        }
        
      }
      newBoard.push(row);
    }

    return newBoard;
  }

  // Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
var findShortestPath = function(startCoordinates, grid) {
  var distanceFromTop = startCoordinates[0];
  var distanceFromLeft = startCoordinates[1];

  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  var location = {
    distanceFromTop: distanceFromTop,
    distanceFromLeft: distanceFromLeft,
    path: [],
    status: 'Start'
  };

  // Initialize the queue with the start location already inside
  var queue = [location];

  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    // Take the first location off the queue
    var currentLocation = queue.shift();

    // Explore North
    var newLocation = exploreInDirection(currentLocation, 'North', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Explore East
    newLocation = exploreInDirection(currentLocation, 'East', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Explore South
    newLocation = exploreInDirection(currentLocation, 'South', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Explore West
    newLocation = exploreInDirection(currentLocation, 'West', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }
  }

  // No valid path found
  return false;

};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
var locationStatus = function(location, grid) {
  var gridSize = grid.length;
  var dft = location.distanceFromTop;
  var dfl = location.distanceFromLeft;

  if (location.distanceFromLeft < 0 ||
      location.distanceFromLeft >= gridSize ||
      location.distanceFromTop < 0 ||
      location.distanceFromTop >= gridSize) {

    // location is not on the grid--return false
    return 'Invalid';
  } else if (grid[dft][dfl] === 'Goal') {
    return 'Goal';
  } else if (grid[dft][dfl] !== 'Empty') {
    // location is either an obstacle or has been visited
    return 'Blocked';
  } else {
    return 'Valid';
  }
};


// Explores the grid from the given location in the given
// direction
var exploreInDirection = function(currentLocation, direction, grid) {
  var newPath = currentLocation.path.slice();
  newPath.push(direction);

  var dft = currentLocation.distanceFromTop;
  var dfl = currentLocation.distanceFromLeft;

  if (direction === 'North') {
    dft -= 1;
  } else if (direction === 'East') {
    dfl += 1;
  } else if (direction === 'South') {
    dft += 1;
  } else if (direction === 'West') {
    dfl -= 1;
  }

  var newLocation = {
    distanceFromTop: dft,
    distanceFromLeft: dfl,
    path: newPath,
    status: 'Unknown'
  };
  newLocation.status = locationStatus(newLocation, grid);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === 'Valid') {
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
  }

  return newLocation;
};

  return (
    <div className="App">
      <nav>
        <h1>Connect the Letters</h1>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          correctWord,
          onSelectLetter,
          onDelete,
          onEnter,
          onSelectSquare,
          wordCheck,
          gameOver,
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;