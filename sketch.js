let sliderA, sliderB;
let labelA, labelB;

let angle = 0;
let A; // Amplitude X - will be set relative to width
let B; // Amplitude Y - will be set relative to height
let points = []; // Store points to draw the curve
let maxPoints = 500; // How many points to keep
let isPaused = false; // Pause state

function setup() {
  createCanvas(windowWidth, windowHeight).parent('main'); // Use window dimensions
  colorMode(HSB, 360, 100, 100, 100); // Use HSB color mode

  // Setup sliders (assuming they exist in HTML)
  sliderA = select('#sliderA');
  sliderB = select('#sliderB');
  labelA = select('#labelA');
  labelB = select('#labelB');

  // Check if sliders were found before accessing properties
  if (sliderA && sliderB && labelA && labelB) {
    // Initial labels update
    labelA.html(sliderA.value());
    labelB.html(sliderB.value());

    // Update labels when sliders change
    sliderA.input(() => labelA.html(sliderA.value()));
    sliderB.input(() => labelB.html(sliderB.value()));
  } else {
    console.error("Slider or label elements not found in the HTML.");
    // Provide default values or handle the error appropriately
    sliderA = { value: () => 3 }; // Mock slider if not found
    sliderB = { value: () => 2 }; // Mock slider if not found
  }

  setAmplitudes(); // Set initial amplitudes
  resetSketch(); // Initialize points and angle
  background(10); // Dark background
}

function setAmplitudes() {
  // Set amplitudes relative to canvas size, leaving some margin
  A = width / 2.5;
  B = height / 2.5;
}

function resetSketch() {
  points = []; // Clear points
  angle = 0;   // Reset angle
  background(10); // Clear background immediately
}

function draw() {
  background(10, 10); // Slightly transparent background for trails

  let a = sliderA.value(); // Frequency a from slider
  let b = sliderB.value(); // Frequency b from slider

  // Map mouse position to phase shifts (phi1, phi2)
  let phi1 = map(mouseX, 0, width, 0, TWO_PI);
  let phi2 = map(mouseY, 0, height, 0, TWO_PI);

  // Calculate current point using Lissajous equations
  let x = A * sin(a * angle + phi1);
  let y = B * cos(b * angle + phi2);

  let currentPoint = createVector(x, y);

  if (!isPaused) {
    // Add the new point - color is determined during drawing now
    points.push({ pos: currentPoint }); // Store only position

    // Limit the number of points stored
    if (points.length > maxPoints) {
      points.splice(0, 1); // Remove the oldest point
    }

    // Increment angle only if not paused
    angle += 0.02;
  }

  // Draw the curve segment by segment with gradient color
  translate(width / 2, height / 2); // Center the origin
  noFill();
  strokeWeight(2); // Set stroke weight once

  // Iterate through points to draw segments
  for (let i = 0; i < points.length - 1; i++) {
    // Calculate hue based on the position in the points array (0 to points.length-1)
    // This maps the oldest point (index 0) to hue 0 and the newest (index points.length-1) to hue 360
    let hue = map(i, 0, points.length - 1, 0, 360);
    stroke(hue, 90, 90); // Set segment color

    // Draw line segment between point i and point i+1
    line(points[i].pos.x, points[i].pos.y, points[i + 1].pos.x, points[i + 1].pos.y);
  }
}

function keyPressed() {
  if (key === 'p' || key === 'P') {
    isPaused = !isPaused; // Toggle pause state
  }
  if (key === 'r' || key === 'R') {
    resetSketch(); // Reset the sketch
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setAmplitudes(); // Recalculate amplitudes based on new size
  background(10); // Clear background on resize
  // Optionally reset the sketch on resize: resetSketch();
}
