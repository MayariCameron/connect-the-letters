import React, { useContext, useEffect } from "react";
import { defaultLetters } from "../Words";
import { AppContext, horizontal, correctPointList } from "../App";

function Letter({ letterPos, attemptVal}) {
  const { board, currAttempt, onSelectSquare } =
    useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const num1 = attemptVal.toString();
  const num2 = letterPos.toString();
  const num2Alt = ",".concat(num2);
  const point =num1.concat(num2);
  const pointAlt = num1.concat(num2Alt);

    // Will need to add correct word boolean
    // If point is in correctPointList toggle correct word boolean
    var letterState;
    var fixed = (defaultLetters.indexOf(point) >= 0);
    var highlighted;
    if (horizontal) {
        highlighted = (currAttempt.attempt === attemptVal && currAttempt.letter !== letterPos);
    } else {
        highlighted = (currAttempt.attempt !== attemptVal && currAttempt.letter === letterPos);
    }
    var selected = (currAttempt.attempt === attemptVal && currAttempt.letter === letterPos);
    var corrected;
    if (correctPointList.length > 0){
        corrected = true;
    } else {
        corrected = false;
    }
    for (let i = 0; i < correctPointList.length; i++){
        corrected = corrected && (correctPointList[i].indexOf(pointAlt) >= 0)
    }
    function getState() {
        if (fixed && !highlighted && !selected){
            letterState = "fix";
        } else if (fixed && highlighted) {
            letterState = "fixhighlight";
        } else if (fixed && selected) {
            letterState = "fixselect";
        } else if (fixed && selected) {
            letterState = "fixselect";
        } else if (corrected && !highlighted && !selected) {
            letterState = "correct";
        } else if (corrected && selected) {
            letterState = "correctselect";
        } else if (corrected && highlighted) {
            letterState = "correcthighlight";
        } else if (!fixed && highlighted) {
            letterState = "highlight";
        } else if (!fixed && selected) {
            letterState = "select";
        } 
    }
    getState()
    const selectSquare = () => {
        onSelectSquare(attemptVal, letterPos);
      };

  useEffect(() => {
    
  }, [currAttempt.attempt]);

  return (
    <div className="letter" id={letterState} onClick={selectSquare}>
      {letter}
    </div>
  );
}

export default Letter;