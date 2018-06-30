let container;
let camera, scene, renderer;
let uniforms, material, mesh, textures;
let currentImage;


let mouseX = 0, mouseY = 0,
    lat = 0, lon = 0, phy = 0, theta = 0;

let width = window.innerWidth;
let height = window.innerHeight;

let startTime = Date.now();

init();
animate();

function loadImages() {
  let imageList = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
  textures = [];

  imageList.forEach((image, index) => {
    textures.push(new THREE.TextureLoader().load('image/' + image));

    let span = document.createElement('span');
    span.innerHTML = 'Image ' + index;
    span.onclick = changeImageTo.bind(this, index);
    document.getElementsByClassName('images')[0].appendChild(span);
  })
}

function init() {
  container = document.getElementById('container');
  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
  currentImage = 0;
  loadImages();
  uniforms = {
    time:       { type: 'f',  value: 1.0 },
    coeff:      { type: 'f',  value: 0.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
    u_mouse:    { type: 'v2', value: new THREE.Vector2(100, 100) },
    texture:    { type: 't',  value: textures[currentImage]}
  };
  material = new THREE.ShaderMaterial({
    uniforms, 
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });
  mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);
  renderer = new THREE.WebGLRenderer();
  container.appendChild(renderer.domElement);
  uniforms.resolution.value.x = width;
  uniforms.resolution.value.y = height;

  renderer.setSize(width, height);

  document.onclick = (e) => {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = height - e.pageY;

    TweenMax.to(uniforms.coeff, 2.1, {
      value: 0.07
    });

    TweenMax.to(uniforms.coeff, 8.5, {
      value: 0.0,
      delay: 2.3,
      easy: Power2.easeIn
    });
  };
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  let elapsedMillisecond = Date.now() - startTime;
  let elapsedSeconds = elapsedMillisecond / 1000.;
  uniforms.time.value = 60. * elapsedSeconds;
  renderer.render(scene, camera);
}

function changeImageTo(imageIndex) {
  uniforms.texture.value = textures[imageIndex];
}