// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
// Name: Jacqueline Palevich
// Student email: japalevi@ucsc.edu
// 

var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`
  
//Global Vars
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
}

function connectVariablesToGLSL(){
   // Initialize shaders
   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
 a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
 u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const GRASS = 2;
const FLOWER = 3;
const CIRCLE = 4;
  
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segments = 10;

function addActionForHtmlUI(){
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];};
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];};
  document.getElementById('blue').onclick = function() {g_selectedColor = [0.0,0.0,1.0,1.0];};
  
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes();};
  
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;};
  document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE;};
  document.getElementById('grassButton').onclick = function() {g_selectedType = GRASS;};
  document.getElementById('flowerButton').onclick = function() {g_selectedType = FLOWER;};
  
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;};
  document.getElementById('segmentsSlide').addEventListener('mouseup', function() { g_segments = this.value; });
  
  document.getElementById("redSlide").addEventListener("mouseup", function() {g_selectedColor[0] = this.value/100;});
  document.getElementById("greenSlide").addEventListener("mouseup", function() {g_selectedColor[1] = this.value/100;});
  document.getElementById("blueSlide").addEventListener("mouseup", function() {g_selectedColor[2] = this.value/100;});

  document.getElementById("sizeSlide").addEventListener("mouseup", function() {g_selectedSize = this.value;});
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}



var g_shapesList = [];


function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);
  
  let point;
  if (g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  } else if (g_selectedType == GRASS){
    point = new Grass();
  } else if (g_selectedType == FLOWER){
    point = new Flower();
  } else if (g_selectedType == CIRCLE){
    point = new Circle();
  }
  point.segments = g_segments;
  point.position = [x, y];
  point.color =  g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
  return([x,y]);
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

// step 12
document.getElementById('drawingButton').onclick = function() {
  const one = new Circle();
  one.position = [0, 0];
  one.color = [0.1, 0.0, 0.0, 1.0];
  one.size = 70;
  one.segments = 32;
  g_shapesList.push(one);
  
  var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
};
