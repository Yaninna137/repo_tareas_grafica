let colorPicker;
let brushSize = 5;
let downloadButton;
let sizeSlider;
let zoomSlider;
let zoomFactor = 1;
let offsetX = 0, offsetY = 0;
let canvasGraphics; // Para manejar el dibujo
let moveSpeed = 10; // Velocidad de desplazamiento con las teclas
let initialOffsetX, initialOffsetY; // Para guardar los desplazamientos originales

function setup() {
  // Crear el canvas y el objeto gráfico para manejar el dibujo
  let canvas = createCanvas(800, 500);
  canvas.parent('canvas-container');
  canvasGraphics = createGraphics(800, 500);
  canvasGraphics.background(255); // Fondo blanco

  // Guardar los valores iniciales de desplazamiento
  initialOffsetX = offsetX;
  initialOffsetY = offsetY;

  // Crear un selector de color
  colorPicker = createColorPicker('#000000');
  colorPicker.position(10, 10);
  
  // Crear un slider para el tamaño del pincel
  sizeSlider = createSlider(1, 50, brushSize);
  sizeSlider.position(10, 40);
  sizeSlider.input(() => {
    brushSize = sizeSlider.value();
  });

  // Crear un botón de descarga
  downloadButton = createButton('Descargar dibujo');
  downloadButton.position(10, 70);
  downloadButton.mousePressed(downloadDrawing);

  // Crear una barra de zoom en la parte inferior de la pizarra
  zoomSlider = createSlider(0, 100, 0); // Zoom de 0 a 100
  zoomSlider.position(10, height + 90); // Debajo del canvas
  zoomSlider.style('width', '200px');
  zoomSlider.input(() => {
    zoomFactor = 1 + zoomSlider.value() / 100; // Zoom empieza en 1 y aumenta hasta 2
    if (zoomFactor === 1) {
      // Restaurar la posición original si el zoom es 0
      offsetX = initialOffsetX;
      offsetY = initialOffsetY;
    }
  });
}

function draw() {
  // Limpiar el canvas pero no el objeto gráfico
  background(255);

  // Aplicar zoom y desplazamiento
  push();
  translate(offsetX, offsetY); // Desplazamiento
  scale(zoomFactor); // Zoom

  // Dibujar el contenido anterior del gráfico
  image(canvasGraphics, 0, 0);

  // Si el ratón está presionado, dibujar
  if (mouseIsPressed && isMouseInsideCanvas()) {
    canvasGraphics.stroke(colorPicker.color());
    canvasGraphics.strokeWeight(brushSize / zoomFactor); // Ajustar el grosor del pincel según el zoom
    canvasGraphics.line(
      (mouseX - offsetX) / zoomFactor, (mouseY - offsetY) / zoomFactor, 
      (pmouseX - offsetX) / zoomFactor, (pmouseY - offsetY) / zoomFactor
    );
  }

  pop(); // Restaurar las transformaciones

  // Limitar el desplazamiento al área visible
  limitMovement();
}

// Verificar si el ratón está dentro del área del canvas
function isMouseInsideCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

// Función para descargar el dibujo
function downloadDrawing() {
  saveCanvas(canvasGraphics, 'mi_dibujo', 'png');
}

// Función para manejar el desplazamiento con teclas
function keyPressed() {
  if (zoomFactor > 1) { // Solo permitir desplazamiento si hay zoom
    if (key === 'a') {
      offsetX += moveSpeed;
    } else if (key === 'd') {
      offsetX -= moveSpeed;
    } else if (key === 'w') {
      offsetY += moveSpeed;
    } else if (key === 's') {
      offsetY -= moveSpeed;
    }
  }
}

// Limitar el desplazamiento al área visible del canvas
function limitMovement() {
  let canvasWidth = width * zoomFactor;
  let canvasHeight = height * zoomFactor;

  // Limitar desplazamiento horizontal
  offsetX = constrain(offsetX, -(canvasWidth - width), 0);
  
  // Limitar desplazamiento vertical
  offsetY = constrain(offsetY, -(canvasHeight - height), 0);
}
