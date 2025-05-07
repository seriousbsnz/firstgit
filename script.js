let scene, camera, renderer, raycaster, mouse;
const houses = [];
const messages = [
  {
    image: 'https://via.placeholder.com/400x300?text=Happy+Mother\'s+Day',
    text: 'You are the heart of our home. We love you endlessly!'
  },
  {
    image: 'https://via.placeholder.com/400x300?text=Thanks+Mom',
    text: 'Thank you for every hug, word of encouragement, and act of love.'
  },
  {
    image: 'https://via.placeholder.com/400x300?text=We+Love+You',
    text: 'Forever grateful for the warmth you bring into our lives.'
  }
];

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#a7d4e9');

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 100),
    new THREE.MeshLambertMaterial({ color: 0x888888 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  for (let i = 0; i < messages.length; i++) {
    const pos = new THREE.Vector3(i % 2 === 0 ? -3 : 3, 0, -i * 10 - 5);
    loadHouseModel(i, pos);
  }

  window.addEventListener('click', onMouseClick, false);
  window.addEventListener('keydown', onKeyDown, false);

  animate();
}

function loadHouseModel(index, position) {
  const loader = new THREE.GLTFLoader();
  loader.load(
    'models/house.glb',
    function (gltf) {
      const house = gltf.scene;
      house.scale.set(0.5, 0.5, 0.5); // adjust based on model size
      house.position.copy(position);
      house.userData.index = index;
      scene.add(house);
      houses.push(house);
    },
    undefined,
    function (error) {
      console.error('Error loading model:', error);
    }
  );
}

function onKeyDown(e) {
  const speed = 0.5;
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      camera.position.z -= speed;
      break;
    case 's':
    case 'ArrowDown':
      camera.position.z += speed;
      break;
    case 'a':
    case 'ArrowLeft':
      camera.position.x -= speed;
      break;
    case 'd':
    case 'ArrowRight':
      camera.position.x += speed;
      break;
  }
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let object = intersects[0].object;
    while (object && object.parent) {
      if (object.userData.index !== undefined) {
        showOverlay(messages[object.userData.index]);
        return;
      }
      object = object.parent;
    }
  }
}

function showOverlay(data) {
  document.getElementById('photo').src = data.image;
  document.getElementById('message').textContent = data.text;
  document.getElementById('overlay').style.display = 'block';
}

function closeOverlay() {
  document.getElementById('overlay').style.display = 'none';
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
