/******************
 *	Script Canvas BG
 *	Script created to run the Portfolio Website
 *	Created by John Tilley
 *	http://www.johntilley.com/
 *
 *	Methods:
 *			ready
 *		Rendering Methods
 *			renderingLoop
 *			calculations
 *			rendering
 *			movePoints
 *			updateAll
 *			drawAll
 *		Main Methods
 *			refreshCanvas
 *			resetVariables
 *			createFirstRow
 *			createNewRow
 */

// Settings
var initspacing = 100; // The desired spacing for the points
var movementAmount = 30; // How far the points can move from their starting point
var threshold = 20; // The distance a point can be generated off it's zero point
var growSpeed = 0.15; // How quickly a point moves away from it's starting point
var shrinkSpeed = 0.01; // How quickly a point moves back towards it's starting point
var pointSize = 3; // The base size for the point circles

var randomTriangles = true; // Determines if the grid looks chaotic or orderly
var drawTriangles = true; // Determines if the lines are drawn
var randomPointSize = false; // Detmines if the circle sizes are random or uniform
var drawPoints = true; // Determines if the circles are drawn

// Functional variables
var canvas;
var maincanvas;
var ctx;

// Used to apply the canvas to the right div and control the canvas size
var containerPanel;

// The init spacing is used to work out how many points will fit on a row, then spacing
// is used to store the ideal spacing between points so that they all fit up to each side
// of the canvas
var spacing = initspacing;

// Captures move event data
var mouseOnCanvas = false;
var mouseMoveData;

// Holds all the points, lines and triangle data such as coordinates
var points = new Array();
var lines = new Array();
var triangles = new Array();

// Track the number of points and rows
var numberofpoints = 0;
var row = 0;

// Variables for the rendering loop and maintaining frame rate
var renderLoop;
var framerate = 60;
var frametime = 1000 / framerate;
var framesample = 0;

// The distance off screen to render the canvas image. There's no point rendering the part of the image
// that won't be seen
var constraintThreshold = 20;

// Variable for holding a timeout. The timeout is run when the window stops being resized. If we don't do
// this then the resize funtion will constantly trigger
var resizeRun;

/******************
 *	ready (init)
 ******************/
$(document).ready(init);

/******************
 *	init
 ******************/
function init() {
    // This is the real canvas that is shown to the user
    $("#site_bg").append('<canvas id="jtCanvas" width="600" height="400"></canvas>');
    maincanvas = $("#jtCanvas");
    ctxmain = maincanvas.get(0).getContext("2d");

    // This is a virtual canvas where we do all the drawing. When it's ready the
    // drawing is transferred to the main canvas. This allows buffering.
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    wrapperPanel = $("#wrapper");
    containerPanel = $("#site_bg");
    canvas.width = maincanvas.width();
    canvas.height = maincanvas.height();

    // Start the loop
    renderingLoop();

    // Apply events
    wrapperPanel.on("mouseout", mouseOutEvent);
    wrapperPanel.on("mousemove", mouseMoveEvent);

    $(window).resize(resizeCanvas);
    resizeCanvas(); // Makes sure the canvas stretches around the full page and then starts the drawing
}

/*********************************************************************************************************
 *	Initialisation Functions
 *********************************************************************************************************/
/******************
 *	resizeCanvas
 ******************/
function resizeCanvas() {
    maincanvas.attr("width", containerPanel.get(0).offsetWidth);
    maincanvas.attr("height", containerPanel.get(0).offsetHeight);
    canvas.width = maincanvas.width();
    canvas.height = maincanvas.height();

    clearTimeout(resizeRun);
    resizeRun = setTimeout(refreshCanvas, 200);
}

/******************
 *	refreshCanvas
 ******************/
function refreshCanvas() {
    resetVariables();
    createFirstRow();
    var repeatrows = maincanvas.height() / spacing;
    for (var i = 0; i < repeatrows; i++) {
        createNewRow();
    }
}

/******************
 *	resetVariables
 ******************/
function resetVariables() {
    // Reset Variables
    points = new Array();
    lines = new Array();
    triangles = new Array();
    row = 0;
}

/******************
 *	createFirstRow
 ******************/
function createFirstRow() {
    // Work out roughly how many points will fit across the screen
    numberofpoints = parseInt(maincanvas.width() / initspacing);
    spacing = maincanvas.width() / numberofpoints;
    numberofpoints++;

    // Create a new row in the main array
    points[row] = new Array();
    for (var i = 0; i < numberofpoints; i++) {
        var point = new Point(
            ctx,
            i * spacing + randomNumber(-threshold / 4, threshold / 4),
            row * spacing + randomNumber(-threshold / 4, threshold / 4),
            randomPointSize,
            pointSize
        );
        points[row].push(point);

        // Connect this point to the previous point
        if (i > 0) {
            line = new Connection(ctx, row, i - 1, row, i);
            lines.push(line);
        }
    }
}

/******************
 *	createNewRow
 ******************/
function createNewRow() {
    // Add a new row
    row++;
    points[row] = new Array();
    var joinTo = 0;
    for (var i = 0; i < numberofpoints; i++) {
        var point = new Point(
            ctx,
            i * spacing + randomNumber(-threshold, threshold),
            row * spacing + randomNumber(-threshold, threshold),
            randomPointSize,
            pointSize
        );
        points[row].push(point);

        // Join new point to the one above it
        //line = new Connection(ctx, points[row][i], points[row-1][i], true);
        line = new Connection(ctx, row, i, row - 1, i);
        lines.push(line);

        // Connect point to the previous one
        if (i > 0) {
            //line = new Connection(ctx, points[row][i - 1], points[row][i], true);
            line = new Connection(ctx, row, i - 1, row, i);
            lines.push(line);
        }

        // When adding trianges:
        // We know that each square has a diagonal line through it creating two triangles.
        // We also know each point is linked to the points before and after and above it.
        // Therefore whenever we make a diagonal line we can create the triangles that accomply it

        // If the previous point is not joined to the one above current point, join current point to it
        if (joinTo < i) {
            //line = new Connection(ctx, points[row][i], points[row-1][joinTo], true);
            line = new Connection(ctx, row, i, row - 1, joinTo);
            lines.push(line);

            // Make Triangle for this Diagonal
            triangle = new Triangle(ctx, row, i, row, i - 1, row - 1, joinTo, "#CCCC33");
            triangles.push(triangle);
            // Make the other Triangle for this Diagonal
            triangle = new Triangle(ctx, row, i, row - 1, i, row - 1, joinTo, "#330000");
            triangles.push(triangle);
            joinTo++;
        } else {
            if (i > 0) {
                // Make Triangle for the previous Diagonal
                triangle = new Triangle(ctx, row, i, row - 1, i, row, i - 1, "#33CC33");
                triangles.push(triangle);
            }
        }

        // if randomTriangles is true then we'll randomly decide which direction
        // the diagonal line is drawn otherwise we'll draw a diagonal based on
        // whether the row and point is odd or even to have an alternating pattern
        if (
            (randomTriangles && randomNumber(1, 2) < 2) ||
            (!randomTriangles && ((row % 2 == 0 && i % 2 == 0) || (row % 2 != 0 && i % 2 != 0)))
        ) {
            joinTo = i + 1;
            if (joinTo < numberofpoints) {
                //line = new Connection(ctx, points[row][i], points[row-1][joinTo], true);
                line = new Connection(ctx, row, i, row - 1, joinTo);
                lines.push(line);

                // Make Triangle for this Diagonal
                triangle = new Triangle(ctx, row, i, row - 1, i, row - 1, joinTo);
                triangles.push(triangle);
            }
        }
    }
}

/*********************************************************************************************************
 *	Rendering Functions
 *********************************************************************************************************/
/******************
 *	renderingLoop
 ******************/
function renderingLoop() {
    starttimer = new Date();

    ctx.clearRect(0, 0, maincanvas.width(), maincanvas.height());
    ctxmain.clearRect(0, 0, maincanvas.width(), maincanvas.height());

    // Calculate positions
    movePoints();
    updateAll();
    // Render the drawing
    drawAll();

    ctxmain.drawImage(canvas, 0, 0);

    endtimer = new Date();
    var timer = endtimer - starttimer;

    // Maintain the correct framerate
    var frametimeout = frametime - timer;
    if (frametimeout < 10) {
        frametimeout = 10;
    }
    renderLoop = setTimeout(renderingLoop, frametimeout);
}

/******************
 *	movePoints
 ******************/
function movePoints() {
    topconstraint = Math.abs(window.scrollY) - constraintThreshold;
    bottomconstraint = topconstraint + window.innerHeight + constraintThreshold * 2;

    if (mouseOnCanvas) {
        var mouseVector = new FastVector(mouseMoveData.pageX, mouseMoveData.pageY);

        // move the triangles, but only check collision if on screen
        for (i = 0; i < triangles.length; i++) {
            if (
                (triangles[i].p1.y > topconstraint && triangles[i].p1.y < bottomconstraint) ||
                (triangles[i].p2.y > topconstraint && triangles[i].p2.y < bottomconstraint) ||
                (triangles[i].p3.y > topconstraint && triangles[i].p3.y < bottomconstraint)
            ) {
                if (triangles[i].pointInTriangle(mouseVector)) {
                    triangles[i].movePoints(mouseVector, movementAmount, growSpeed, shrinkSpeed);
                }
            }
        }
    }

    // move the points (circles) back to their starting points
    for (i = 0; i < points.length; i++) {
        for (j = 0; j < points[i].length; j++) {
            points[i][j].move(null, null, growSpeed, shrinkSpeed);
        }
    }
}

/******************
 *	updateAll
 ******************/
function updateAll() {
    topconstraint = Math.abs(window.scrollY) - constraintThreshold;
    bottomconstraint = topconstraint + window.innerHeight + constraintThreshold * 2;

    // update the triangles
    for (i = 0; i < triangles.length; i++) {
        if (
            (triangles[i].p1.y > topconstraint && triangles[i].p1.y < bottomconstraint) ||
            (triangles[i].p2.y > topconstraint && triangles[i].p2.y < bottomconstraint) ||
            (triangles[i].p3.y > topconstraint && triangles[i].p3.y < bottomconstraint)
        ) {
            triangles[i].update();
        }
    }

    // update the lines
    for (i = 0; i < lines.length; i++) {
        if (
            (lines[i].p1.y > topconstraint && lines[i].p1.y < bottomconstraint) ||
            (lines[i].p2.y > topconstraint && lines[i].p2.y < bottomconstraint)
        ) {
            lines[i].update();
        }
    }
}

/******************
 *	drawAll
 ******************/
function drawAll() {
    topconstraint = Math.abs(window.scrollY) - constraintThreshold;
    bottomconstraint = topconstraint + window.innerHeight + constraintThreshold * 2;

    // draw the lines
    if (drawTriangles) {
        for (i = 0; i < lines.length; i++) {
            if (
                (lines[i].p1.y > topconstraint && lines[i].p1.y < bottomconstraint) ||
                (lines[i].p2.y > topconstraint && lines[i].p2.y < bottomconstraint)
            ) {
                lines[i].draw();
            }
        }
    }

    // draw the points (circles)
    if (drawPoints) {
        for (i = 0; i < points.length; i++) {
            for (j = 0; j < points[i].length; j++) {
                if (points[i][j].p.y > topconstraint && points[i][j].p.y < bottomconstraint) {
                    points[i][j].draw();
                }
            }
        }
    }
}

/*********************************************************************************************************
 *	Event Functions
 *********************************************************************************************************/
/******************
 *	mouseLeaveEvent
 ******************/
function mouseOutEvent(e) {
    mouseMoveData = e;
    mouseOnCanvas = false;
}

/******************
 *	mouseMoveEvent
 ******************/
function mouseMoveEvent(e) {
    mouseMoveData = e;
    mouseOnCanvas = true;
}

/*********************************************************************************************************
 *	Support Functions
 *********************************************************************************************************/
/******************
 *	randomNumber
 ******************/
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/******************
 *	randomColor
 ******************/
function randomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
