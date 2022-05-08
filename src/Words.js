import wordBank from "./new-word-bank.txt";
const rowLength = 8;

function generateRandomLetters() {

  var matrix = [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""]
  ];

  

  var characters = 'ABCDEFGHIKLMNOPRSTUWY';

  for (let i = 0; i < rowLength; i++) {

    for (let j = 0; j < rowLength; j++){

      if (Math.random() < 0.20) {
        matrix[i][j] = characters.charAt(Math.floor(Math.random() * characters.length));
      }

      if (i > 0 && matrix[i-1][j] !== ""){
        matrix[i][j] = '';
      }

      if (j > 0 && matrix[i][j-1] !== ""){
        matrix[i][j] = '';
      }

      if (i > 0 && j > 0 && matrix[i-1][j-1] !== ""){
        matrix[i][j] = '';
      }

    }

  }

  return matrix;

};

export const boardDefault = generateRandomLetters();
export var points = [];

function getRandomLetters() {
  var letterPoints = [];
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < rowLength; j++){
      if (boardDefault[i][j] !== ""){
        points.push([i,j]);
        var num1 = i.toString();
        var num2 = j.toString();
        var pair = num1.concat(num2);
        letterPoints.push(pair);
      }
    }
  }
    
  return letterPoints;

};

export const defaultLetters = getRandomLetters();

export const generateWordSet = async () => {
  let wordSet;
  let todaysWord;
  await fetch(wordBank)
    .then((response) => response.text())
    .then((result) => {
      const wordArr = result.split("\n");
      todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];
      wordSet = new Set(wordArr);
    });
  return { wordSet, todaysWord };
}; 



