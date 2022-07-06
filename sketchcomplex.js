const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let drawing = [];
let state = -1;


let time = 0;
let path = [];
NUM_CIRCLES = 5;

function mousePressed(){
  drawing = [];
  x=[];
  time = 0;
  path = [];

  state = USER;  
}

function mouseReleased(){
  state = FOURIER;
  for(let i=0; i<drawing.length; i++){
    const c = new Complex(drawing[i].x, drawing[i].y);
    x.push(c)
    // y.push(drawing[i].y);
    // x.push(drawing[i].x);
  }
  fourierX = dft(x);

  fourierX.sort((a,b) => b.amp-a.amp);
}

function setup() {
  createCanvas(800, 600);
  // state = 
  // const skip = 10;
  // for(let i=0; i<drawing.length; i+= skip){
  //   const c = new Complex(drawing[i].x, drawing[i].y);
  //   x.push(c);
  // }
  // fourierX = dft(x);

  // console.log(fourierX.sort((a,b) => b.amp-a.amp));
}

function epicycles(x, y, rotation, fourier){
  for(let i = 0; i<fourier.length; i++){
    let prevx = x;
    let prevy = y;
   
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);
    
    stroke(255, 100);
    noFill();
    ellipse(prevx,prevy,radius*2);

    stroke(255);
    line(prevx,prevy,x,y);
  }
  return createVector(x,y);
}

function draw() {
  background(0);

  if(state == USER){
    let point = createVector(mouseX - width/2, mouseY - height/2);
    drawing.push(point);
    stroke(255);
    noFill();
    beginShape();
    for(let v of drawing){
      vertex(v.x + width/2, v.y + height/2);
    }
    endShape();
    
  } else if (state == FOURIER){
    let x = 0;
    let y = 0;
  
    let v = epicycles(width/2,height/2, 0, fourierX);
    path.unshift(v);
      
    beginShape();
    noFill();
    for(let i = 0; i<path.length; i++){
      vertex(path[i].x,path[i].y);
    }
    endShape();
  
    const dt = TWO_PI / fourierX.length;
    time += dt;
  
    if(time > TWO_PI){
      time=0;
      path = [];
    }
  }
}


