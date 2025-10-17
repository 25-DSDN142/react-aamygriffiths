// ----= Faces =----
let particles = [];
let imgHappy;
let imgSad;

function prepareInteraction() {
  
  imgHappy = loadImage('/images/Happy.png');
  imgSad = loadImage('/images/Sad.png');

}

function drawInteraction(faces, hands) {
  // Show webcam feed
  image(video, 0, 0, width, height);

  // Loop through detected faces
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // Face features
    let lipsWidth = face.lips.width;
    let lipsHeight = face.lips.height;

    // Emotion estimation
    let smileRatio = lipsWidth / lipsHeight;   // big ratio → smiling
    let emotion = "neutral";

    if (smileRatio > 3.0) {
      emotion = "happy";
    } 
    else if (smileRatio < 2.5) { // easier to detect sad
      emotion = "sad";
    }

    // Draw emotion label
    fill(255);
    textSize(18);
    textAlign(CENTER);
    text(`Emotion: ${emotion}`, face.faceOval.centerX, face.faceOval.centerY - 100);

    // Show happy/sad images
    let imgSize = 250;
    if (emotion === "happy") {
      image(imgHappy, 75, 675, imgSize, imgSize);
    }
    else if (emotion === "sad") {
      image(imgSad, 75, 675, imgSize, imgSize);
    }

    // Run visual effects
    visualizeEmotion(emotion);

    // Optional debug keypoints
    if (showKeypoints) {
      drawPoints(face.leftEye);
      drawPoints(face.rightEye);
      drawPoints(face.leftEyebrow);
      drawPoints(face.rightEyebrow);
      drawPoints(face.lips);
    }
  }

  // Update and draw all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
}

//  Emotion Visual Effects
function visualizeEmotion(emotion) {
  if (emotion === "happy") {
    // 🎉 Confetti
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle(random(width), random(height / 2), "confetti"));
    }
  } 
  else if (emotion === "sad") {
    // 🌧️ Rain
    for (let i = 0; i < 15; i++) { // increase number for stronger effect
      particles.push(new Particle(random(width), random(-20, 0), "rain"));
    }
  }
  // Neutral → nothing added
}

//  Particle Class
class Particle {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.life = 255;
    this.type = type;
    this.size = random(5, 12);

    if (type === "rain") {
      this.vel = createVector(0, random(4, 7));
      this.col = color(100, 150, 255);
    } 
    else if (type === "confetti") {
      this.vel = p5.Vector.random2D().mult(random(1, 3));
      this.col = color(random(255), random(255), random(255));
    }
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 4;
  }

  display() {
    noStroke();
    fill(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.life);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

// Draw helper for debugging keypoints
function drawPoints(feature) {
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 4);
  }
}
