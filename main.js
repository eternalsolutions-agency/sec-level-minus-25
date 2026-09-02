import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
scene.background = new THREE.Color(0x081018);
scene.fog = new THREE.FogExp2(0x101923, 0.018);
const camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.1, 160);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.35 : 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
game.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x8aa9c5, 0x111515, 1.05));
const alarmLight = new THREE.PointLight(0xff382e, 20, 18);
alarmLight.position.set(0, 3.6, -19);
scene.add(alarmLight);

const floorMat = new THREE.MeshStandardMaterial({ color: 0x17201c, roughness: 0.72, metalness: 0.32 });
const wallMat = new THREE.MeshStandardMaterial({ color: 0x1b2522, roughness: 0.68, metalness: 0.38 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x07100d, roughness: 0.6, metalness: 0.55 });
const greenMat = new THREE.MeshStandardMaterial({ color: 0x174f31, emissive: 0x0b7a3c, emissiveIntensity: 1.8, roughness: 0.35 });
const concreteMat = new THREE.MeshStandardMaterial({ color: 0x30383c, roughness: .92, metalness: .05 });
const wetRoadMat = new THREE.MeshStandardMaterial({ color: 0x11171b, roughness: .25, metalness: .3 });
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x233c42, roughness: .18, metalness: .15, transparent: true, opacity: .62 });

function box(w, h, d, x, y, z, mat = wallMat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z); mesh.receiveShadow = true; mesh.castShadow = true; scene.add(mesh); return mesh;
}

// Livello 0: esterno della sede di copertura S.E.C.
box(34, .3, 42, 0, -.14, 41, wetRoadMat);
box(24, .24, 7, 0, .02, 22.8, concreteMat);
box(12, .32, 2.8, 0, .08, 19.6, concreteMat);
box(11.5, 12, 1.2, -9.2, 6, 19.3, concreteMat);
box(11.5, 12, 1.2, 9.2, 6, 19.3, concreteMat);
box(7, 4.5, 1.2, 0, 9.75, 19.3, concreteMat);
for (const x of [-12.2, -8.8, 8.8, 12.2]) {
  for (const y of [3.2, 7.4, 10.5]) box(2.15, 1.45, .12, x, y, 18.65, glassMat);
}
const entranceDoorLeft = box(2.25, 4.1, .18, -1.18, 2.12, 19.1, glassMat);
const entranceDoorRight = box(2.25, 4.1, .18, 1.18, 2.12, 19.1, glassMat);
const canopy = box(7.5, .28, 3.8, 0, 5.05, 20.1, darkMat);
for (const x of [-4.6, 4.6]) {
  const lamp = new THREE.PointLight(0xc9e8ff, 22, 14); lamp.position.set(x, 4.8, 23); scene.add(lamp);
  box(.12, 4.5, .12, x, 2.25, 25.5, darkMat); box(.8, .12, .45, x, 4.55, 25.3, greenMat);
}
const signCanvas = document.createElement('canvas'); signCanvas.width = 768; signCanvas.height = 192;
const signContext = signCanvas.getContext('2d'); signContext.fillStyle = '#08110e'; signContext.fillRect(0, 0, 768, 192);
signContext.strokeStyle = '#45ff9d'; signContext.lineWidth = 5; signContext.strokeRect(6, 6, 756, 180);
signContext.fillStyle = '#dfffee'; signContext.font = 'bold 82px sans-serif'; signContext.textAlign = 'center'; signContext.fillText('S.E.C.', 384, 102);
signContext.fillStyle = '#6a9a82'; signContext.font = '24px sans-serif'; signContext.fillText('SYSTEMS & ENVIRONMENTAL CONTROL', 384, 148);
const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.7, 1.42), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) }));
sign.position.set(0, 7.25, 18.65); scene.add(sign);
for (let z = 26; z < 60; z += 9) {
  box(.12, .02, 3.8, 0, .04, z, new THREE.MeshBasicMaterial({ color: 0xb5a84c }));
}
const rainCount = isTouch ? 450 : 900;
const rainPositions = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount; i++) { rainPositions[i * 3] = Math.random() * 34 - 17; rainPositions[i * 3 + 1] = Math.random() * 18; rainPositions[i * 3 + 2] = Math.random() * 42 + 19; }
const rainGeometry = new THREE.BufferGeometry(); rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
const rain = new THREE.Points(rainGeometry, new THREE.PointsMaterial({ color: 0xb8dbef, size: .045, transparent: true, opacity: .7 })); scene.add(rain);

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
const fallbackParts = [body, armor, visor, gun];
player.position.set(0, 0, 48); scene.add(player);

let jackModel = null, jackMixer = null, currentJackAction = null;
const jackActions = {};
function setFallbackVisible(visible) { fallbackParts.forEach(part => { part.visible = visible; }); }
function playJackAction(name) {
  const next = jackActions[name] || jackActions.Idle_Gun || jackActions.Idle;
  if (!next || next === currentJackAction) return;
  next.reset().fadeIn(.16).play();
  if (currentJackAction) currentJackAction.fadeOut(.16);
  currentJackAction = next;
}
new GLTFLoader().load('./assets/models/jack-soldier.gltf', gltf => {
  jackModel = gltf.scene;
  jackModel.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
  const initialBox = new THREE.Box3().setFromObject(jackModel);
  const initialHeight = initialBox.getSize(new THREE.Vector3()).y || 1;
  jackModel.scale.setScalar(2.72 / initialHeight);
  jackModel.updateMatrixWorld(true);
  const adjustedBox = new THREE.Box3().setFromObject(jackModel);
  jackModel.position.y = -adjustedBox.min.y;
  jackModel.rotation.y = Math.PI;
  jackModel.visible = selectedKey === 'tank' && playing;
  player.add(jackModel);
  jackMixer = new THREE.AnimationMixer(jackModel);
  gltf.animations.forEach(clip => { jackActions[clip.name] = jackMixer.clipAction(clip); });
  playJackAction('Idle_Gun');
  if (selectedKey === 'tank' && playing) setFallbackVisible(false);
  document.querySelector('#modelStatus').classList.remove('show');
}, undefined, error => {
  console.error('Impossibile caricare Jack 3D', error);
  document.querySelector('#modelStatus').textContent = 'MODELLO 3D NON DISPONIBILE';
});

const enemies = [];
function spawnEnemy(x, z, scale = 1) {
  const group = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({ color: 0x241d1a, roughness: 1 });
  const infected = new THREE.MeshStandardMaterial({ color: 0x355b27, emissive: 0x173b13, emissiveIntensity: .7, roughness: .85 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(.52 * scale, 16, 10), fur); body.scale.set(1, .65, 1.55); body.position.y = .43 * scale; body.castShadow = true; group.add(body);
  const head = new THREE.Mesh(new THREE.ConeGeometry(.35 * scale, .78 * scale, 12), infected); head.rotation.x = Math.PI / 2; head.position.set(0, .48 * scale, .86 * scale); group.add(head);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(.16 * scale, 10, 6), infected); ear.scale.y = .35; ear.position.set(side * .27 * scale, .72 * scale, .56 * scale); group.add(ear);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.055 * scale, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff382e })); eye.position.set(side * .18 * scale, .57 * scale, 1.15 * scale); group.add(eye);
  }
  const tailCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .38 * scale, -.7 * scale), new THREE.Vector3(.35 * scale, .22 * scale, -1.25 * scale), new THREE.Vector3(-.25 * scale, .16 * scale, -1.85 * scale)]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 12, .045 * scale, 6, false), infected));
  const legs = [];
  for (const xSide of [-1, 1]) for (const zSide of [-.35, .45]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.045, .07, .34 * scale, 6), fur); leg.position.set(xSide * .35 * scale, .18 * scale, zSide * scale); leg.rotation.z = xSide * .65; group.add(leg); legs.push(leg);
  }
  group.position.set(x, 0, z); group.userData = { hp: 2, phase: Math.random() * 9, legs, speed: 1.8 + Math.random() * .8 }; scene.add(group); enemies.push(group);
}
spawnEnemy(-2.8, 7, .78); spawnEnemy(2.4, -5, .92); spawnEnemy(-1.3, -18, .72); spawnEnemy(2.8, -31, 1.05); spawnEnemy(-3.5, -44, .82); spawnEnemy(1.6, -56, 1.12);

const keys = new Set();
const characters = {
  tank: { name: 'JACK “TANK” RYDER', shortName: 'JACK RYDER', role: 'ASSALTO', deploy: 'SCHIERA JACK RYDER', health: 140, ammo: 10, speed: 5.0, damage: 2, fireRate: 270, body: 0x273a35, armor: 0x15201d, scale: 1.08, stats: [95, 50, 100, 90, 25], special: 'ARMATURA RINFORZATA', bio: 'Ex forze speciali. È la prima linea della squadra e può assorbire danni che fermerebbero gli altri agenti.' },
  maya: { name: 'MAYA REYES', shortName: 'MAYA REYES', role: 'INGEGNERE', deploy: 'SCHIERA MAYA REYES', health: 100, ammo: 18, speed: 5.7, damage: 1, fireRate: 125, body: 0x245e67, armor: 0x172640, scale: .96, stats: [55, 75, 62, 76, 100], special: 'SCANNER TECNICO', bio: 'Ex ingegnere della S.E.C. Può interpretare sistemi, terminali e accessi che per gli altri agenti restano incomprensibili.' },
  ghost: { name: 'NOAH “GHOST” KANE', shortName: 'NOAH KANE', role: 'RICOGNITORE', deploy: 'SCHIERA NOAH KANE', health: 85, ammo: 12, speed: 7.0, damage: 1, fireRate: 170, body: 0x304b21, armor: 0x281839, scale: .92, stats: [62, 100, 42, 67, 55], special: 'DNA ALTERATO', bio: 'Sopravvissuto agli esperimenti S.E.C. La mutazione gli offre percezioni e velocità fuori dal normale, ma il suo corpo è instabile.' },
  chen: { name: 'DR. VICTOR CHEN', shortName: 'DR. VICTOR CHEN', role: 'BIOLOGO', deploy: 'SCHIERA VICTOR CHEN', health: 110, ammo: 12, speed: 5.3, damage: 1, fireRate: 180, body: 0x66706b, armor: 0x254641, scale: 1, stats: [43, 58, 78, 55, 92], special: 'RIGENERAZIONE CELLULARE', bio: 'Biologo e medico da campo. Conosce gli esperimenti di Crowther e rigenera lentamente i danni subiti durante la missione.' }
};
let selectedKey = 'tank';
let selectedCharacter = characters[selectedKey];
let playing = false, facilityEntered = false, yaw = 0, pitch = -.15, ammo = selectedCharacter.ammo, health = selectedCharacter.health, lastShot = 0, messageTimer;
const touchMove = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// Audio procedurale: nessun file esterno e nessun costo di licenza.
let audioContext, masterGain, menuGain, gameGain, audioEnabled = true, ambienceTimer, announcementTimer, melodyTimer, melodyStep = 0;
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
  masterGain.gain.value = .72; menuGain.gain.value = 1; gameGain.gain.value = 0;
  menuGain.connect(masterGain); gameGain.connect(masterGain); masterGain.connect(audioContext.destination);
  createTone('sine', 43.65, .016, menuGain);
  playMenuPhrase(); melodyTimer = setInterval(playMenuPhrase, 3400);
}
function playMenuPhrase() {
  if (!audioContext || !audioEnabled || playing) return;
  const phrases = [[130.81, 155.56, 196], [116.54, 146.83, 174.61], [103.83, 130.81, 155.56], [98, 123.47, 146.83]];
  const chord = phrases[melodyStep++ % phrases.length];
  chord.forEach((frequency, index) => setTimeout(() => {
    oneShot(frequency, 2.6, index === 0 ? .09 : .045, index === 0 ? 'sine' : 'triangle', menuGain);
    oneShot(frequency * 2, 1.8, .018, 'sine', menuGain);
  }, index * 210));
}
function switchToGameAudio() {
  initAudio(); const now = audioContext.currentTime;
  menuGain.gain.cancelScheduledValues(now); gameGain.gain.cancelScheduledValues(now);
  menuGain.gain.linearRampToValueAtTime(0, now + 1.7); gameGain.gain.linearRampToValueAtTime(1, now + 1.2);
  clearInterval(ambienceTimer); ambienceTimer = setInterval(randomAmbience, 6200);
  setTimeout(() => bunkerAnnouncement('Attenzione. Violazione del contenimento rilevata nel settore biologico sette.'), 1300);
  scheduleAnnouncement();
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
  const pan = Math.random() * 1.8 - .9;
  if (roll < .38) spatialHit(68, .9, .11, pan, 'square'); // porta metallica lontana
  else if (roll < .68) spatialHit(430 + Math.random() * 280, .16, .035, pan, 'sine'); // goccia
  else if (roll < .88) { spatialHit(115, 1.3, .035, pan, 'sawtooth'); setTimeout(() => spatialHit(92, .5, .025, pan, 'square'), 380); }
  else { spatialHit(1500, .7, .018, pan, 'square'); setTimeout(() => spatialHit(1100, .45, .014, pan, 'square'), 620); }
}
function spatialHit(frequency, duration, volume, pan, type) {
  if (!audioContext || !audioEnabled) return;
  const panner = audioContext.createStereoPanner(); panner.pan.value = pan; panner.connect(gameGain);
  oneShot(frequency, duration, volume, type, panner);
}
function scheduleAnnouncement() {
  clearTimeout(announcementTimer);
  announcementTimer = setTimeout(() => {
    if (playing && audioEnabled) bunkerAnnouncement(Math.random() > .5 ? 'Cedimento strutturale rilevato. Il personale superstite raggiunga la superficie.' : 'Presenza organica non identificata nei condotti di ventilazione.');
    scheduleAnnouncement();
  }, 48000 + Math.random() * 42000);
}
function bunkerAnnouncement(text) {
  if (!audioEnabled || !('speechSynthesis' in window)) return;
  spatialHit(880, .14, .07, .65, 'square');
  setTimeout(() => spatialHit(660, .11, .045, .65, 'square'), 190);
  speechSynthesis.cancel(); const voice = new SpeechSynthesisUtterance(text);
  const speakerDirection = new THREE.Vector3(5 - player.position.x, 0, -19 - player.position.z).normalize();
  const facingSpeaker = Math.max(0, new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).dot(speakerDirection));
  voice.lang = 'it-IT'; voice.rate = .72; voice.pitch = .42; voice.volume = .14 + facingSpeaker * .24;
  setTimeout(() => speechSynthesis.speak(voice), 360);
}
function toggleAudio() {
  initAudio(); audioEnabled = !audioEnabled;
  masterGain.gain.setTargetAtTime(audioEnabled ? .72 : 0, audioContext.currentTime, .08);
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
        objective.textContent = enemies.length ? `Elimina i ratti mutati: ${enemies.length}` : 'Raggiungi la porta del settore −2';
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
  const preview = document.querySelector('#fullCharacter'); preview.classList.add('changing');
  setTimeout(() => { preview.className = `full-character ${selectedKey}`; }, 150);
  document.querySelector('#selectedRole').textContent = selectedCharacter.role;
  document.querySelector('#selectedName').textContent = selectedCharacter.name;
  document.querySelector('#selectedBio').textContent = selectedCharacter.bio;
  document.querySelector('#selectedSpecial').textContent = selectedCharacter.special;
  ['statStrength', 'statSpeed', 'statHealth', 'statWeapon', 'statTech'].forEach((id, index) => document.querySelector(`#${id}`).style.width = `${selectedCharacter.stats[index]}%`);
  oneShot(360 + selectedCharacter.stats[1] * 2, .16, .06, 'triangle', menuGain);
}));
document.querySelector('#deployAgent').addEventListener('click', () => {
  characterSelect.classList.add('hidden'); hud.classList.remove('hidden'); playing = true;
  health = selectedCharacter.health; ammo = selectedCharacter.ammo;
  healthText.textContent = health; healthBar.style.width = '100%'; ammoEl.textContent = ammo;
  document.querySelector('#agentName').textContent = `${selectedCharacter.shortName} // SETTORE`;
  bodyMaterial.color.setHex(selectedCharacter.body); armorMaterial.color.setHex(selectedCharacter.armor);
  player.scale.setScalar(selectedCharacter.scale);
  const useJack3D = selectedKey === 'tank' && jackModel;
  setFallbackVisible(!useJack3D);
  if (jackModel) jackModel.visible = selectedKey === 'tank';
  if (selectedKey === 'tank' && !jackModel) document.querySelector('#modelStatus').classList.add('show');
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
  const characterIsMoving = move.lengthSq() > .02;
  if (characterIsMoving) { move.normalize().multiplyScalar(dt * selectedCharacter.speed); player.position.add(move); }
  const exterior = player.position.z > 20;
  player.position.x = THREE.MathUtils.clamp(player.position.x, exterior ? -12 : -5.05, exterior ? 12 : 5.05);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -66, 55);
  const doorOpen = player.position.z < 28;
  entranceDoorLeft.position.x = THREE.MathUtils.lerp(entranceDoorLeft.position.x, doorOpen ? -2.2 : -1.18, 1 - Math.pow(.003, dt));
  entranceDoorRight.position.x = THREE.MathUtils.lerp(entranceDoorRight.position.x, doorOpen ? 2.2 : 1.18, 1 - Math.pow(.003, dt));
  if (!facilityEntered && player.position.z < 18.2) {
    facilityEntered = true;
    document.querySelector('#sectorName').textContent = '−01 / ACCESSO';
    objective.textContent = `Elimina i ratti mutati: ${enemies.length}`;
    flash('ACCESSO ALLA STRUTTURA S.E.C.');
    bunkerAnnouncement('Accesso non autorizzato. Protocollo di sicurezza compromesso.');
  }
  player.rotation.y = yaw;
  if (jackMixer && jackModel?.visible) {
    const isFiring = performance.now() - lastShot < selectedCharacter.fireRate + 80;
    playJackAction(isFiring ? 'Gun_Shoot' : characterIsMoving ? 'Run' : 'Idle_Gun');
    jackMixer.update(dt);
  }
  const camOffset = new THREE.Vector3(Math.sin(yaw) * 5.2, 3.5 + pitch * 3.5, Math.cos(yaw) * 5.2);
  camera.position.lerp(player.position.clone().add(camOffset), 1 - Math.pow(.001, dt));
  camera.lookAt(player.position.clone().add(new THREE.Vector3(0, 1.5 + pitch * 5, 0)).add(forward.multiplyScalar(7)));
  alarmLight.intensity = 13 + Math.sin(time * 5) * 7;
  const rainArray = rain.geometry.attributes.position.array;
  for (let i = 0; i < rainCount; i++) { rainArray[i * 3 + 1] -= dt * 13; if (rainArray[i * 3 + 1] < 0) rainArray[i * 3 + 1] = 18; }
  rain.geometry.attributes.position.needsUpdate = true;
  rain.visible = player.position.z > 17;
  for (const enemy of enemies) {
    enemy.position.y = Math.abs(Math.sin(time * 8 + enemy.userData.phase)) * .07;
    enemy.userData.legs.forEach((leg, index) => { leg.rotation.x = Math.sin(time * 12 + index * Math.PI) * .6; });
    enemy.lookAt(player.position.x, enemy.position.y, player.position.z);
    const distance = enemy.position.distanceTo(player.position);
    if (facilityEntered && distance < 18) enemy.position.add(player.position.clone().sub(enemy.position).setY(0).normalize().multiplyScalar(dt * enemy.userData.speed));
    else enemy.rotation.y += Math.sin(time + enemy.userData.phase) * dt;
    if (facilityEntered && distance < 1.25) {
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
