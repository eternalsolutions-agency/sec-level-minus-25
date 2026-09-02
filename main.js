import * as THREE from 'three';

const game = document.querySelector('#game');
const intro = document.querySelector('#intro');
const characterSelect = document.querySelector('#characterSelect');
const hud = document.querySelector('#hud');
const end = document.querySelector('#end');
const objective = document.querySelector('#objective');
const ammoEl = document.querySelector('#ammo');
const healthText = document.querySelector('#healthText');
const healthBar = document.querySelector('#healthBar');
const message = document.querySelector('#message');
const isTouch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
if (isTouch) document.body.classList.add('touch-device');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020605);
scene.fog = new THREE.FogExp2(0x06100c, 0.027);
const camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.1, 160);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.35 : 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
game.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x3b7961, 0x050606, 0.7));
const alarmLight = new THREE.PointLight(0xff382e, 20, 18);
alarmLight.position.set(0, 3.6, -19);
scene.add(alarmLight);

const floorMat = new THREE.MeshStandardMaterial({ color: 0x17201c, roughness: 0.72, metalness: 0.32 });
const wallMat = new THREE.MeshStandardMaterial({ color: 0x1b2522, roughness: 0.68, metalness: 0.38 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x07100d, roughness: 0.6, metalness: 0.55 });
const greenMat = new THREE.MeshStandardMaterial({ color: 0x174f31, emissive: 0x0b7a3c, emissiveIntensity: 1.8, roughness: 0.35 });

function box(w, h, d, x, y, z, mat = wallMat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z); mesh.receiveShadow = true; mesh.castShadow = true; scene.add(mesh); return mesh;
}

box(12, .3, 90, 0, -.15, -24, floorMat);
box(.35, 7, 90, -6, 3.5, -24); box(.35, 7, 90, 6, 3.5, -24);
box(12, .25, 90, 0, 7, -24, darkMat);
for (let z = 14; z > -69; z -= 8) {
  box(12, .18, .25, 0, 6.65, z, darkMat);
  const strip = box(5.2, .06, .16, 0, 6.52, z, greenMat);
  strip.material = greenMat;
  const light = new THREE.PointLight(0x42ff9a, 3.2, 10);
  light.position.set(0, 6.35, z); scene.add(light);
}
for (let z = 9; z > -68; z -= 13) {
  box(.14, 2.4, 5, -5.75, 2.6, z, darkMat);
  box(.14, 2.4, 5, 5.75, 2.6, z - 5, darkMat);
}
box(10, 5.5, .5, 0, 2.75, -69, darkMat);
const doorGlow = box(3.8, 4.4, .18, 0, 2.2, -68.7, greenMat);

const player = new THREE.Group();
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x273a35, roughness: .65 });
const armorMaterial = new THREE.MeshStandardMaterial({ color: 0x15201d, metalness: .5 });
const body = new THREE.Mesh(new THREE.CapsuleGeometry(.48, 1.15, 6, 10), bodyMaterial);
body.position.y = 1.35; body.castShadow = true; player.add(body);
const armor = new THREE.Mesh(new THREE.BoxGeometry(1.12, .85, .58), armorMaterial);
armor.position.set(0, 1.7, .02); armor.castShadow = true; player.add(armor);
const visor = new THREE.Mesh(new THREE.BoxGeometry(.65, .18, .5), greenMat); visor.position.set(0, 2.18, -.31); player.add(visor);
const gun = new THREE.Mesh(new THREE.BoxGeometry(.18, .18, 1.15), darkMat); gun.position.set(.48, 1.58, -.6); player.add(gun);
player.position.set(0, 0, 12); scene.add(player);

const enemies = [];
function spawnEnemy(x, z, scale = 1) {
  const group = new THREE.Group();
  const flesh = new THREE.MeshStandardMaterial({ color: 0x355427, emissive: 0x0b2107, roughness: .9 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.72 * scale, 2), flesh); core.position.y = .85 * scale; core.castShadow = true; group.add(core);
  for (let i = 0; i < 5; i++) {
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(.08, .17, 1.2 * scale, 6), flesh);
    limb.position.set(Math.sin(i * 1.25) * .48, .35, Math.cos(i * 1.25) * .48);
    limb.rotation.z = Math.sin(i * 2) * .7; limb.rotation.x = Math.cos(i) * .8; group.add(limb);
  }
  const eye = new THREE.Mesh(new THREE.SphereGeometry(.15 * scale, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff392f })); eye.position.set(0, 1, -.66 * scale); group.add(eye);
  group.position.set(x, 0, z); group.userData = { hp: 2, phase: Math.random() * 9 }; scene.add(group); enemies.push(group);
}
spawnEnemy(-2.8, -8); spawnEnemy(2.4, -23, 1.15); spawnEnemy(-1.3, -40, .92); spawnEnemy(2.8, -55, 1.25);

const keys = new Set();
const characters = {
  tank: { name: 'JACK RYDER', deploy: 'SCHIERA JACK RYDER', health: 140, ammo: 10, speed: 5.0, damage: 2, fireRate: 270, body: 0x273a35, armor: 0x15201d, scale: 1.08 },
  maya: { name: 'MAYA REYES', deploy: 'SCHIERA MAYA REYES', health: 100, ammo: 18, speed: 5.7, damage: 1, fireRate: 125, body: 0x245e67, armor: 0x172640, scale: .96 },
  ghost: { name: 'NOAH KANE', deploy: 'SCHIERA NOAH KANE', health: 85, ammo: 12, speed: 7.0, damage: 1, fireRate: 170, body: 0x304b21, armor: 0x281839, scale: .92 },
  chen: { name: 'DR. VICTOR CHEN', deploy: 'SCHIERA VICTOR CHEN', health: 110, ammo: 12, speed: 5.3, damage: 1, fireRate: 180, body: 0x66706b, armor: 0x254641, scale: 1 }
};
let selectedKey = 'tank';
let selectedCharacter = characters[selectedKey];
let playing = false, yaw = 0, pitch = -.15, ammo = selectedCharacter.ammo, health = selectedCharacter.health, lastShot = 0, messageTimer;
const touchMove = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// Audio procedurale: nessun file esterno e nessun costo di licenza.
let audioContext, masterGain, menuGain, gameGain, audioEnabled = true, ambienceTimer;
function createTone(type, frequency, gainValue, destination) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.value = gainValue;
  oscillator.connect(gain).connect(destination); oscillator.start(); return { oscillator, gain };
}
function initAudio() {
  if (audioContext) { audioContext.resume(); return; }
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain(); menuGain = audioContext.createGain(); gameGain = audioContext.createGain();
  masterGain.gain.value = .52; menuGain.gain.value = .8; gameGain.gain.value = 0;
  menuGain.connect(masterGain); gameGain.connect(masterGain); masterGain.connect(audioContext.destination);
  const menuBass = createTone('sine', 48, .045, menuGain);
  const menuAir = createTone('triangle', 96, .014, menuGain);
  const menuLfo = audioContext.createOscillator(), menuLfoGain = audioContext.createGain();
  menuLfo.frequency.value = .08; menuLfoGain.gain.value = 11; menuLfo.connect(menuLfoGain).connect(menuAir.oscillator.frequency); menuLfo.start();
  createTone('sawtooth', 33, .028, gameGain); createTone('sine', 60, .02, gameGain);
}
function switchToGameAudio() {
  initAudio(); const now = audioContext.currentTime;
  menuGain.gain.cancelScheduledValues(now); gameGain.gain.cancelScheduledValues(now);
  menuGain.gain.linearRampToValueAtTime(.08, now + 1.5); gameGain.gain.linearRampToValueAtTime(.9, now + 1.5);
  clearInterval(ambienceTimer); ambienceTimer = setInterval(randomAmbience, 3700);
  setTimeout(() => bunkerAnnouncement('Attenzione. Violazione del contenimento rilevata nel settore biologico sette.'), 1300);
}
function oneShot(frequency, duration, volume, type = 'sine', destination = gameGain) {
  if (!audioContext || !audioEnabled) return;
  const now = audioContext.currentTime, oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
  oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, now); oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency * .45), now + duration);
  gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  oscillator.connect(gain).connect(destination); oscillator.start(now); oscillator.stop(now + duration);
}
function randomAmbience() {
  if (!playing || !audioEnabled) return;
  const roll = Math.random();
  if (roll < .4) oneShot(520 + Math.random() * 220, .18, .035, 'sine');
  else if (roll < .72) oneShot(75 + Math.random() * 40, 1.5, .035, 'sawtooth');
  else if (roll < .9) oneShot(1200, .55, .018, 'square');
  else bunkerAnnouncement('Movimento non identificato nei condotti di ventilazione.');
}
function bunkerAnnouncement(text) {
  if (!audioEnabled || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel(); const voice = new SpeechSynthesisUtterance(text);
  voice.lang = 'it-IT'; voice.rate = .78; voice.pitch = .55; voice.volume = .42; speechSynthesis.speak(voice);
}
function toggleAudio() {
  initAudio(); audioEnabled = !audioEnabled;
  masterGain.gain.setTargetAtTime(audioEnabled ? .52 : 0, audioContext.currentTime, .08);
  document.querySelector('#audioToggle').textContent = audioEnabled ? 'AUDIO ON' : 'AUDIO OFF';
  if (!audioEnabled && 'speechSynthesis' in window) speechSynthesis.cancel();
}

function flash(text) {
  message.textContent = text; message.classList.add('show'); clearTimeout(messageTimer);
  messageTimer = setTimeout(() => message.classList.remove('show'), 900);
}
function reload() { if (ammo < selectedCharacter.ammo) { ammo = selectedCharacter.ammo; ammoEl.textContent = ammo; flash('CARICATORE INSERITO'); } }
function shoot() {
  const now = performance.now(); if (!playing || now - lastShot < selectedCharacter.fireRate) return;
  if (!ammo) { flash('PREMI R PER RICARICARE'); return; }
  lastShot = now; ammo--; ammoEl.textContent = ammo; oneShot(selectedKey === 'tank' ? 78 : 135, .14, .13, 'square');
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hit = raycaster.intersectObjects(enemies, true)[0];
  if (hit) {
    let target = hit.object; while (target.parent && !enemies.includes(target)) target = target.parent;
    if (enemies.includes(target)) {
      target.userData.hp -= selectedCharacter.damage; target.scale.multiplyScalar(.92); flash('BERSAGLIO COLPITO');
      if (target.userData.hp <= 0) {
        scene.remove(target); enemies.splice(enemies.indexOf(target), 1);
        objective.textContent = enemies.length ? `Elimina le anomalie: ${enemies.length}` : 'Raggiungi la porta del settore −2';
        if (!enemies.length) doorGlow.material.emissiveIntensity = 4;
      }
    }
  }
}

document.querySelector('#start').addEventListener('click', () => { initAudio(); intro.classList.add('hidden'); characterSelect.classList.remove('hidden'); });
document.querySelectorAll('.character-card').forEach(card => card.addEventListener('click', () => {
  document.querySelectorAll('.character-card').forEach(item => item.classList.remove('selected'));
  card.classList.add('selected'); selectedKey = card.dataset.character; selectedCharacter = characters[selectedKey];
  document.querySelector('#deployAgent').textContent = selectedCharacter.deploy;
}));
document.querySelector('#deployAgent').addEventListener('click', () => {
  characterSelect.classList.add('hidden'); hud.classList.remove('hidden'); playing = true;
  health = selectedCharacter.health; ammo = selectedCharacter.ammo;
  healthText.textContent = health; healthBar.style.width = '100%'; ammoEl.textContent = ammo;
  document.querySelector('#agentName').textContent = `${selectedCharacter.name} // SETTORE`;
  bodyMaterial.color.setHex(selectedCharacter.body); armorMaterial.color.setHex(selectedCharacter.armor);
  player.scale.setScalar(selectedCharacter.scale);
  switchToGameAudio();
  if (!isTouch) renderer.domElement.requestPointerLock();
});
document.querySelector('#audioToggle').addEventListener('click', e => { e.stopPropagation(); toggleAudio(); });
document.querySelector('#restart').addEventListener('click', () => location.reload());
addEventListener('keydown', e => { keys.add(e.code); if (e.code === 'KeyR') reload(); });
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('mousedown', e => {
  if (isTouch) return;
  if (e.button === 0) shoot();
  if (playing && document.pointerLockElement !== renderer.domElement) renderer.domElement.requestPointerLock();
});
addEventListener('mousemove', e => { if (document.pointerLockElement === renderer.domElement && playing) { yaw -= e.movementX * .0022; pitch = THREE.MathUtils.clamp(pitch - e.movementY * .0015, -.48, .18); } });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

const joystick = document.querySelector('#joystick');
const stick = document.querySelector('#stick');
const lookZone = document.querySelector('#lookZone');
let joystickTouch = null, lookTouch = null, lookX = 0, lookY = 0;
function updateJoystick(touch) {
  const rect = joystick.getBoundingClientRect();
  let x = touch.clientX - (rect.left + rect.width / 2);
  let y = touch.clientY - (rect.top + rect.height / 2);
  const max = rect.width * .34, length = Math.hypot(x, y) || 1;
  if (length > max) { x *= max / length; y *= max / length; }
  touchMove.set(x / max, y / max);
  stick.style.transform = `translate(${x}px, ${y}px)`;
}
joystick.addEventListener('touchstart', e => { const t = e.changedTouches[0]; joystickTouch = t.identifier; updateJoystick(t); e.preventDefault(); }, { passive: false });
joystick.addEventListener('touchmove', e => { const t = [...e.changedTouches].find(v => v.identifier === joystickTouch); if (t) updateJoystick(t); e.preventDefault(); }, { passive: false });
function stopJoystick(e) { if ([...e.changedTouches].some(v => v.identifier === joystickTouch)) { joystickTouch = null; touchMove.set(0, 0); stick.style.transform = ''; } }
joystick.addEventListener('touchend', stopJoystick); joystick.addEventListener('touchcancel', stopJoystick);
lookZone.addEventListener('touchstart', e => { const t = e.changedTouches[0]; lookTouch = t.identifier; lookX = t.clientX; lookY = t.clientY; e.preventDefault(); }, { passive: false });
lookZone.addEventListener('touchmove', e => {
  const t = [...e.changedTouches].find(v => v.identifier === lookTouch); if (!t) return;
  yaw -= (t.clientX - lookX) * .006; pitch = THREE.MathUtils.clamp(pitch - (t.clientY - lookY) * .004, -.48, .18);
  lookX = t.clientX; lookY = t.clientY; e.preventDefault();
}, { passive: false });
function stopLook(e) { if ([...e.changedTouches].some(v => v.identifier === lookTouch)) lookTouch = null; }
lookZone.addEventListener('touchend', stopLook); lookZone.addEventListener('touchcancel', stopLook);
document.querySelector('#fireButton').addEventListener('pointerdown', e => { e.preventDefault(); shoot(); });
document.querySelector('#reloadButton').addEventListener('pointerdown', e => { e.preventDefault(); reload(); });

function update(dt, time) {
  if (!playing) return;
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const move = new THREE.Vector3();
  if (keys.has('KeyW')) move.add(forward); if (keys.has('KeyS')) move.sub(forward);
  if (keys.has('KeyD')) move.add(right); if (keys.has('KeyA')) move.sub(right);
  if (touchMove.lengthSq() > .02) move.add(right.clone().multiplyScalar(touchMove.x)).add(forward.clone().multiplyScalar(-touchMove.y));
  if (move.lengthSq()) { move.normalize().multiplyScalar(dt * selectedCharacter.speed); player.position.add(move); }
  player.position.x = THREE.MathUtils.clamp(player.position.x, -5.05, 5.05);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -66, 15);
  player.rotation.y = yaw;
  const camOffset = new THREE.Vector3(Math.sin(yaw) * 5.2, 3.5 + pitch * 3.5, Math.cos(yaw) * 5.2);
  camera.position.lerp(player.position.clone().add(camOffset), 1 - Math.pow(.001, dt));
  camera.lookAt(player.position.clone().add(new THREE.Vector3(0, 1.5 + pitch * 5, 0)).add(forward.multiplyScalar(7)));
  alarmLight.intensity = 13 + Math.sin(time * 5) * 7;
  for (const enemy of enemies) {
    enemy.position.y = Math.sin(time * 2.4 + enemy.userData.phase) * .08;
    enemy.lookAt(player.position.x, enemy.position.y, player.position.z);
    const distance = enemy.position.distanceTo(player.position);
    if (distance < 16) enemy.position.add(player.position.clone().sub(enemy.position).setY(0).normalize().multiplyScalar(dt * 1.05));
    if (distance < 1.45) {
      health = Math.max(0, health - dt * 14);
      healthText.textContent = Math.ceil(health); healthBar.style.width = `${health / selectedCharacter.health * 100}%`;
      if (!health) { playing = false; flash('SOGGETTO ABBATTUTO — RICARICA LA PAGINA'); }
    }
  }
  if (selectedKey === 'chen' && health > 0 && health < selectedCharacter.health) {
    health = Math.min(selectedCharacter.health, health + dt * 1.5);
    healthText.textContent = Math.ceil(health); healthBar.style.width = `${health / selectedCharacter.health * 100}%`;
  }
  if (!enemies.length && player.position.z < -63) { playing = false; document.exitPointerLock(); hud.classList.add('hidden'); end.classList.remove('hidden'); }
}

renderer.setAnimationLoop(() => { const dt = Math.min(clock.getDelta(), .04); update(dt, clock.elapsedTime); renderer.render(scene, camera); });
