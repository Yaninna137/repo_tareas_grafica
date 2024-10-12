let colorPicker;
let brushSize = 5;
let downloadButton;
let clearButton;
let undoStack = [];
let redoStack = [];

function setup() {
  createCanvas(800, 500);
  background(255);
  
  // Crear un selector de color
  colorPicker = createColorPicker('#000000');
  colorPicker.position(10, 10);
  
  // Crear un slider para el tamaño del pincel
  let sizeSlider = createSlider(1, 50, brushSize);
  sizeSlider.position(10, 40);
  sizeSlider.input(() => {
    brushSize = sizeSlider.value();
  });
  
  // Crear un botón de descarga
  downloadButton = createButton('Descargar dibujo');
  downloadButton.position(10, 70);
  downloadButton.mousePressed(downloadDrawing);
  
  // Crear un botón de borrar
  clearButton = createButton('Borrar todo');
  clearButton.position(10, 100);
  clearButton.mousePressed(clearCanvas);
  
  // Centrar la pizarra
  let canvasDiv = createDiv('');
  canvasDiv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  canvasDiv.child(canvas);
  
  // Registrar teclas para Ctrl+Z (deshacer) y Ctrl+Y (rehacer)
  document.addEventListener('keydown', handleUndoRedo);
}

function draw() {
  // Si el ratón está presionado, dibujar y guardar el estado actual
  if (mouseIsPressed) {
    stroke(colorPicker.color());
    strokeWeight(brushSize);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

// Función para descargar el dibujo
function downloadDrawing() {
  saveCanvas('mi_dibujo', 'png');
}

// Manejar combinación de teclas Ctrl+Z y Ctrl+Y
function handleUndoRedo(event) {
  if (event.ctrlKey && event.key === 'z') {
    undo();
  } else if (event.ctrlKey && event.key === 'y') {
    redo();
  }
}

// Función para deshacer el último trazo (Ctrl + Z)
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(get()); // Guardar el estado actual para rehacer
    let lastState = undoStack.pop(); // Sacar el último estado de la pila
    image(lastState, 0, 0); // Restaurar el último estado
  }
}

// Función para rehacer el último trazo (Ctrl + Y)
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(get()); // Guardar el estado actual para deshacer
    let lastState = redoStack.pop(); // Sacar el último estado de la pila de rehacer
    image(lastState, 0, 0); // Restaurar el estado
  }
}

// Guardar el estado actual del lienzo antes de cada trazo
function mousePressed() {
  undoStack.push(get());
  redoStack = []; // Limpiar el stack de rehacer cuando se realiza un nuevo trazo
}

// Función para borrar el lienzo
function clearCanvas() {
  background(255); // Limpia el lienzo
  undoStack = []; // Limpiar el stack de deshacer
  redoStack = []; // Limpiar el stack de rehacer
}
