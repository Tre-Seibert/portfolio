// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 0;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Append the renderer canvas to the body
document.body.appendChild(renderer.domElement);

// Set the renderer canvas as the background of the body
document.body.style.overflow = 'hidden'; // Hide the default body content
document.body.style.margin = '0'; // Remove default margin
document.body.style.padding = '0'; // Remove default padding
document.body.style.background = 'black'; // Set background color to black
document.body.style.position = 'fixed'; // Fix body position

// Create a star field
const starFieldGeometry = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < 10000; i++) {
  positions.push(
    (Math.random() - 0.5) * 2000, // Spread stars randomly within a larger range
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}
starFieldGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const starFieldMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 3, vertexColors: THREE.NoColors }); // Disable color interpolation
const starField = new THREE.Points(starFieldGeometry, starFieldMaterial);
scene.add(starField);

// Initial speed and duration for fast movement
let speed = 50;
let fastDuration = 5; // in seconds
let slowSpeed = 10;
let fastMode = true; // Initially in fast mode

// Timer for controlling speed transition
let timer = 0;

// Flag to indicate whether screen dimming animation has started
let dimmingStarted = false;

// Interval for dimming animation
let dimmingInterval;

// Function to handle spacebar press
function onKeyDown(event) {
  if (event.code === 'Space') {
    fastMode = true; // Activate fast mode
  }
}

// Function to handle spacebar release
function onKeyUp(event) {
  if (event.code === 'Space') {
    fastMode = false; // Deactivate fast mode
  }
}

// Add event listeners for spacebar press and release
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Animate the star field
function animateStars() {
  const positions = starFieldGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    // Move stars towards the camera
    positions[i + 2] -= Math.random() * (fastMode ? speed : slowSpeed);
    if (positions[i + 2] < -1000) positions[i + 2] = 1000; // Loop stars within a range
  }
  starFieldGeometry.attributes.position.needsUpdate = true; // Update positions to reflect changes
  
  // Update timer
  if (fastMode) {
    timer += 1 / 60; // Assuming 60 fps
    // Transition to slow speed after fastDuration
    if (timer >= fastDuration) {
      fastMode = false; // Turn off fast mode
      timer = 0; // Reset timer for consistent slow speed
      if (!dimmingStarted) {
        dimScreen(); // Start the dimming animation if not started already
        dimmingStarted = true;
      }
    }
  }
}

// Function to gradually increase opacity of the overlay
function dimScreen() {
  let opacity = 0;
  const finalOpacity = 0.5; // Adjust the final opacity value here
  dimmingInterval = setInterval(() => {
    opacity += 0.01; // Adjust the rate of opacity increase
    overlay.style.opacity = opacity.toString();
    if (opacity >= finalOpacity) {
      clearInterval(dimmingInterval); // Stop increasing opacity when it reaches 1
    }
  }, 50); // Adjust the interval for smooth transition
}

// Create an overlay element
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'black';
overlay.style.opacity = '0'; // Start with transparent overlay
document.body.appendChild(overlay);

// Animate function
function animate() {
  requestAnimationFrame(animate);
  animateStars();
  renderer.render(scene, camera);
}

animate();
