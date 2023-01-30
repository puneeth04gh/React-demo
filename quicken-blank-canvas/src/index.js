import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from './styles.js';
import TextField from '@mui/material/TextField';


const sizeEnum = {
    small: [800, 480],
    medium: [1024, 576],
    large: [1280, 720],
    'absolute unit': [1920, 1080],
};
// Declaring width and height outside function so that it can be used globally
let width;
let height;

const turtle = {
    x: 360,
    y: 200,
    angle: 0,
    penDown: true,
    penColor: '#000000',
    lineWidth: 2
};
const moveArray = ['shiftLeft', 'shiftRight', 'shiftUp', 'shiftDown', 'shiftAngle'];

// Setting global variable for turtle pointer change 
let setTurtlePointer;

function ReactRoot(){
    // Creating length variable to take input from the user to draw the line with the required length
    // https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
    const [lineLength, setLength] = useState(60);
    const handleChange = (event) => {
        setLength(event.target.value);
    };
    const [size, setSize] = useState('small');

    // turtle position
    const [x, setX] = useState(turtle.x);
    const [y, setY] = useState(turtle.y);
    const [angle, setAngle] = useState(turtle.angle);

    // setInterval(() => {
    //     setX(turtle.x);
    //     setY(turtle.y);
    //     setAngle(turtle.angle);
    // }, 50);
    // Setting the turtle pointer if and only the poistion changes
    setTurtlePointer = function () {
        console.log("inside setturtle");
        setX(turtle.x);
        setY(turtle.y);
        setAngle(turtle.angle);
    };

    console.log('turtle X:', turtle.x, ' Y:', turtle.y, ' angle:', turtle.angle );
    //Setting the width and height based on the canvas size selection
    width = sizeEnum[size][0];
    height = sizeEnum[size][1];
    return (
        <div style={styles.root}>
            <div style={styles.header}>
                <h1 style={styles.ellipseText}>
                    Internship Whitespace
                </h1>
                <div style={styles.stack}>
                    <h4>
                        Canvas Size:
                    </h4>
                    <div style={styles.row}>
                        {Object.keys(sizeEnum).map((key) =>
                            <button
                                key={key}
                                onClick={() => {turtle.x = 360; turtle.y = 200; setSize(key)}} // Setting turtle pointer to default value if the canvas size is changed
                                style={{
                                    ...styles.button,
                                    backgroundColor: key === size && '#C9C7C5',
                                    cursor: key !== size && 'pointer',
                                }}
                            >
                                {key}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div style={styles.column}>
                <button
                    onClick={clearCanvas}
                    style={styles.button}
                >
                    Reset Canvas
                </button>
                <div style={{...styles.canvasWrapper, width: width + 2, height: height + 2 }}>
                    <div
                        style={{
                            ...styles.turtle,
                            left: x,
                            top: y,
                            transform: `rotate(${angle}DEG)`,
                        }}
                    />
                    <canvas
                        id="myDrawing"
                        width={width}
                        height={height}
                    />
                </div>
                <h4 style={{ margin: 0 }}>
                    TURTLE FUNCTIONS
                </h4>

                <div style={{ ...styles.row, ...styles.spacer}}>
                    {moveArray.map((key) =>
                        <button
                            key={key}
                            onClick={() => turtle[key]()}
                            style={styles.button}
                        >
                            {key}
                        </button>
                    )}
                </div>
                <div style={{ ...styles.row, ...styles.spacer}}>
                    <button
                        onClick={handleUndo}
                        style={styles.button}
                    >
                        Undo
                    </button>
                    <button
                        onClick={handleRedo}
                        style={styles.button}
                    >
                        Redo
                    </button>
                </div>

                {/* Input length field declaration using material UI - https://mui.com/material-ui/api/text-field/ */}
                <div style={{ ...styles.spacer}}>
                    <TextField
                        id="line-length"
                        label="Length"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        value={lineLength}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ ...styles.row, maxWidth: width - 48 }}>
                    <button
                        onClick={() => turtle.hexagon(lineLength)}
                        style={styles.blueButton}
                    >
                        Hexagon
                    </button>
                    <button
                        onClick={() => turtle.drawStar(lineLength)}
                        style={styles.blueButton}
                    >
                        Star1
                    </button>
                    {/*
                    // ================================================================================
                    //                      Maybe things should go here?
                    // ================================================================================
                    */}
                    <button
                        onClick={() => turtle.square(lineLength)}
                        style={styles.blueButton}
                    >
                        Square
                    </button>
                    <button
                        onClick={() => turtle.drawStarII(lineLength)}
                        style={styles.blueButton}
                    >
                        Star2
                    </button>
                </div>
            </div>
        </div>
    );
}
// react insertion
const wrapper = document.getElementById("react-entry");
wrapper ? ReactDOM.render(<ReactRoot />, wrapper) : false;




// =====================================================================================
//                                  GRAPHICS
// =====================================================================================

//          Undo Redo for Turtle pointer
// =======================================================
let historyStep = 0;
// let historyTurtle = [{turtle}];
let historyTurtle = [
    {
      x: 360,
      y: 200,
      angle: 0
    },
  ];
//const state = historyTurtle[0];
function handleUndo () {
    console.log('history = '+ historyTurtle);
    if (historyStep === 0) {
      return;
    }
    historyStep -= 1;
    const previous = historyTurtle[historyStep];
    turtle.x = previous.x;
    turtle.y = previous.y;
    turtle.angle = previous.angle;
    setTurtlePointer(); // Calling the function to set the turtle pointer
}

function handleRedo () {
    if (historyStep === historyTurtle.length - 1) {
      return;
    }
    historyStep += 1;
    const next = historyTurtle[historyStep];
    turtle.x = next.x;
    turtle.y = next.y;
    turtle.angle = next.angle;
    setTurtlePointer(); // Calling the function to set the turtle pointer
}

function handleDragEnd (turX, turY, turAngle) {
    historyTurtle = historyTurtle.slice(0, historyStep + 1);
    const pos = {
        x: turX,
        y: turY,
        angle: turAngle
      };
    historyTurtle = historyTurtle.concat([pos]);
    historyStep += 1;
}

// canvas preparation
const canvas = document.getElementById('myDrawing');

if (canvas && canvas.getContext) { // does the browser support 'canvas'?
    turtle.ct = canvas.getContext("2d"); // get drawing context
} else {
    alert('You need a browser which supports the HTML5 canvas!');
}

function clearCanvas () {
    if (canvas && canvas.getContext) {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        turtle.x = 360;
        turtle.y = 200;
    }
}


//      Turtle functions
// =======================================================
turtle.logPenStatus = function () {
    console.log('x=' + this.x + "; y=" + this.y + '; angle = ' + this.angle + '; penDown = ' + this.penDown);
};

// reposition turtle
//Changes made to the conditions below to have the turtle pointer to be inside the canvas
turtle.shiftLeft = function (length=50) {
    //console.log('turle = ' + turtle.x);
    if(turtle.x - length  > 0 && turtle.x + length < width && turtle.y - length > 0 && turtle.y + length < height)
        turtle.x -= length;
    else
        turtle.x = 360;
    handleDragEnd(turtle.x, turtle.y, turtle.angle); // Calling function to save the state of the turtle pointer movement
    setTurtlePointer(); // Calling the function to set the turtle pointer
};
turtle.shiftRight = function (length=50) {
    if(turtle.x + length < width && turtle.x - length  > 0 && turtle.y - length > 0 && turtle.y + length < height)
        turtle.x += length;
    else
        turtle.x = 360;
    handleDragEnd(turtle.x, turtle.y, turtle.angle); // Calling function to save the state of the turtle pointer movement
    setTurtlePointer(); // Calling the function to set the turtle pointer
};
turtle.shiftUp = function (length=50) {
    if(turtle.y - length > 0 && turtle.x - length  > 0 && turtle.x + length < width && turtle.y + length < height)
        turtle.y -= length;
    else
        turtle.y = 200;
    handleDragEnd(turtle.x, turtle.y, turtle.angle); // Calling function to save the state of the turtle pointer movement
    setTurtlePointer(); // Calling the function to set the turtle pointer
};
turtle.shiftDown = function (length=50) {
    if(turtle.y + length < height && turtle.x - length  > 0 && turtle.x + length < width && turtle.y - length > 0)
        turtle.y += length;
    else
        turtle.y = 200;
    handleDragEnd(turtle.x, turtle.y, turtle.angle); // Calling function to save the state of the turtle pointer movement
    setTurtlePointer(); // Calling the function to set the turtle pointer
};
// Creating function to turn the turtle pointer
turtle.shiftAngle = function (angle=72) {
    turtle.angle += angle;
    handleDragEnd(turtle.x, turtle.y, turtle.angle);
    setTurtlePointer(); // Calling the function to set the turtle pointer
};


// draw in a direction
//This function draws the line with the specific length provided
turtle.forward = function (length) {
    // this.logPenStatus();
    var x0 = this.x,
        y0 = this.y;
    const angleInRadians = (this.angle * Math.PI) / 180;
    this.x += length * Math.sin(angleInRadians);
    this.y += length * Math.cos(angleInRadians);
    if (this.ct) {
        if (this.penDown) {
            //this.logPenStatus();
            this.ct.beginPath();
            this.ct.lineWidth = this.lineWidth;
            this.ct.strokeStyle = this.penColor;
            this.ct.moveTo(x0, y0);
            this.ct.lineTo(this.x, this.y);
            this.ct.stroke();
        }
    } else {
        this.ct.moveTo(this.x, this.y);
    }
    return this;
};
//This function inturn calls the forward function and passes the negative length to it
turtle.backward = function (length) {
    this.forward(-length);
    return this;
};

// turning
//The two functions below turns the context line to a specific angle
turtle.left = function (angle) {
    this.angle += angle;
    return this;
};
turtle.right = function (angle) {
    this.left(-angle);
    return this;
};


// ===============================================================
//                      Pattern Functions
// ===============================================================

turtle.hexagon = function (length) {
    console.log('length', length);
    var i;
    for (i = 1; i <= 6; i++) {
        turtle.forward(length);
        turtle.left(60);
    }
};

turtle.drawStar = function (length) {
    var i;
    for (i = 0; i < 18; i++) {
        turtle.left(100);
        turtle.forward(length);
    }
};



//  Oh Wow Look at this space
// =======================================================

// function to create square
turtle.square = function (length) {
    console.log('length', length);
    var i;
    for (i = 1; i <= 4; i++) {
        turtle.forward(length);
        turtle.left(90);

    }
};
//function to create star
turtle.drawStarII = function (length) {
    var i;
    for (i = 0; i < 10; i++) {
        turtle.left(144);
        turtle.forward(length);
    }
};








