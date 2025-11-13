//Para este trabajo se utilizó la guía de Daniel Shiffman (Nature Of Code), concretamente P5.VECTOR, ejemplo 1.10 "Accelerating Toward the Mouse" (https://editor.p5js.org/natureofcode/sketches/gYJHm1EFL) 
//También se utilizó IA en la parte de la fórmula matemática de la cuerda, y para explicar el código final con la intención de comprender a fondo lo que se había realizado. 

//variables
let bgColor, yoyoColor, cuerdaColor;
let yoyoPos, yoyoVel, yoyoAcc; //posición, velocidad, aceleración
let topSpeed = 20
let radio = 100; //tamaño aproximado del yoyo
let rotacion = 0; //para que gire el yoyo
let floatingTexts = [];
let num_floating_texts = 20;
let text_content = "it's yo-yo time!";

//YOYO. hice muchas elipses para que en vez de ser el yoyo literal, sea como si el yoyo fuese transparente y se viera la cuerda enrollada sobre el juguete
function yoyo(x, y, tamaño) {
 push();
 translate(x, y);
 rotate(rotacion);
 translate(-200, -200);
 ellipse(200, 200, 200, 200);
 ellipse(195, 195, 200, 200);
 ellipse(205, 210, 200, 200);
 ellipse(210, 190, 200, 200);
 pop();
}

function setup() {
 createCanvas(windowWidth, windowHeight);
 bgColor = color(random(255), random(255), random(255));
 yoyoColor = color(random(255), random(255), random(255));
 cuerdaColor = color(random(255), random(255), random(255));

 yoyoPos = createVector(width / 2, height / 2);
 yoyoVel = createVector(0, 0);
 yoyoAcc = createVector(0, 0);

  //for de los textos
 for (let i = 0; i < num_floating_texts; i++) {
  floatingTexts.push(new FloatingText());
 }
}

//FÍSICAS DEL YOYO (P5.vector)
//base
function updateYoyo() {
 let mouse = createVector(mouseX, mouseY);

 //dirección (que busque el puntero)
 let dir = p5.Vector.sub(mouse, yoyoPos);

 //normalizar dirección
 dir.normalize();

 //escalar (controlar aceleración)
 dir.mult(0.5);

 //aplicar la física anterior
 yoyoAcc = dir;
 yoyoVel.add(yoyoAcc);
 yoyoVel.limit(topSpeed);
 yoyoPos.add(yoyoVel);

 //rebote del yoyo en los bordes del lienzo
 if (yoyoPos.x > width - radio) {
  yoyoPos.x = width - radio;
  yoyoVel.x *= -0.8; // rebote con amortiguación
 } else if (yoyoPos.x < radio) {
  yoyoPos.x = radio;
  yoyoVel.x *= -0.8;
 }

 if (yoyoPos.y > height - radio) {
  yoyoPos.y = height - radio;
  yoyoVel.y *= -0.8;
 } else if (yoyoPos.y < radio) {
  yoyoPos.y = radio;
  yoyoVel.y *= -0.8;
 }
}

function draw() {
 background(bgColor);
 stroke(yoyoColor);
 noFill();
 strokeWeight(7);

//texto

 for (let i = 0; i < floatingTexts.length; i++) {
  floatingTexts[i].move();
  floatingTexts[i].show();
 }

  updateYoyo();
 //hace que la rotación dependa de la velocidad
  rotacion += yoyoVel.mag() * 0.05;

 //cuerda
 //para explicar a magda: la cuerda se hace con 3 puntos: en la parte superior del yoyo para que parezca que se desenrolla la cuerda desde ahí(inicio), en el medio como si fuera una mano/dedo manipulando la cuerda para hacer trucos con el yoyo(medio) donde el puntero actúa como mano imaginaria, y fuera del lienzo como si fuera la mano sosteniendo el final de la cuerda(final)
 stroke(cuerdaColor);

 //inicio. P=PUNTO. P1 es el punto superior del yoyo,  y la fórmula matemática (radio etc.) es para que siga la rotación del yoyo
 let p1_x = yoyoPos.x + (radio * sin(rotacion));
 let p1_y = yoyoPos.y - (radio * cos(rotacion));

 //medio. P2 es el ratón, por eso usamos mouse
 let p2_x = mouseX;
 let p2_y = mouseY;

 //final. P3 es el anclaje fuera del lienzo, p3_x es que se vea desde la mitad del lienzo
 let p3_x = width / 2;
 let p3_y = -100; //estático para que siempre salga del mismo lado

 //dibujo de las dos líneas
 line(p1_x, p1_y, p2_x, p2_y); //del yoyo al ratón
 line(p2_x, p2_y, p3_x, p3_y); //del ratón al anclaje superior

  // DIBUJAR EL YOYO (al final para que esté encima de la cuerda)
  stroke(yoyoColor);
 yoyo(yoyoPos.x, yoyoPos.y, 150);
}

//class del texto, movimiento y dibujo del mismo
class FloatingText {
 constructor() {
  this.x = random(width, width * 1.5);
  this.y = random(height);
  this.speed = random(0.8, 1.8);
  this.color = color(random(255), random(255), random(255), 200);
  this.size = random(20, 40);
 }
  show() {
  push();
  fill(this.color);
  noStroke();
  textSize(this.size);
  textAlign(LEFT, CENTER);
  text(text_content, this.x, this.y);
  pop();
 }

 move() {
  this.x = this.x - this.speed;

  //para que cuando se salga de la pantalla se resetee
  if (this.x < -200) {
   this.x = width + 200;
   this.y = random(height);
   this.speed = random(0.8, 1.8);
  }
 }
}