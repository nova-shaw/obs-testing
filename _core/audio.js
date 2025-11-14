/*
Adapted in part from:
https://howto.im/q/how-to-play-multiple-audio-files-simultaneously-in-javascript
*/

const log = console.log;


/*
alarm.mp3          -> alarm.mp3
Applause.mp3       -> applause.mp3
Bells.mp3          -> bellsjingle.mp3 // (not included, was for some special xmas thing ages ago apparently)
Chime.mp3          -> chime.mp3
Drumroll.mp3       -> drumroll.mp3
Fog Horn.mp3       -> wrong.mp3
kids_cheering.mp3  -> kidscheer.mp3
Poll.wav           -> poll.mp3
Trumpet.mp3        -> trumpet.mp3
WompWompWomp.wav   -> wompwomp.mp3
*/

// Digit1 or Numpad1 ?
const soundboardSounds = [
  { key: 'Digit1', number: 1, icon: '⭐️', title: 'Chime',        file: 'chime.mp3' },
  { key: 'Digit2', number: 2, icon: '❓', title: 'Poll',         file: 'poll.mp3' },
  { key: 'Digit3', number: 3, icon: '🥁', title: 'Drumroll',     file: 'drumroll.mp3' },
  { key: 'Digit4', number: 4, icon: '🎺', title: 'Trumpet',      file: 'trumpet.mp3' },
  { key: 'Digit5', number: 5, icon: '👏', title: 'Applause',     file: 'applause.mp3' },
  { key: 'Digit6', number: 6, icon: '❌',  title: 'Wrong Buzzer', file: 'wrong.mp3' }, // was 'fog horn'
  { key: 'Digit7', number: 7, icon: '😅', title: 'Womp-womp',    file: 'wompwomp.mp3' },
  { key: 'Digit8', number: 8, icon: '🎉', title: 'Kids Cheer',   file: 'kidscheer.mp3' },
  { key: 'Digit9', number: 9, icon: '⏰', title: 'Alarm',        file: 'alarm.mp3' }
];

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioNode = null;
// const bufferList = {};
const bufferList = [];

function buildSoundboard(data) {
  const frag = document.createDocumentFragment();

  const dataReversed = data.reverse();
  dataReversed.forEach( async item => {

    frag.appendChild(buildSoundboardButton(item));

    const soundID = item.file.replace('.mp3', '');

    try {
      const response = await fetch(`../obs-testing-media/soundboard/${item.file}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      bufferList.push({ key: item.key, buffer: audioBuffer, playing: false });

      /*
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      */
      // sourceNode.start(0);
      // bufferList[soundID] = { key: item.key, node: sourceNode };
      // bufferList.push({ key: item.key, node: sourceNode, playing: false });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  });

  log(bufferList)

  return frag;
}

function buildSoundboardButton(data) {
  const btn = document.createElement('button');
  btn.classList.add('btn-sound');
  btn.title = data.title;

  const labelIcon = document.createElement('span');
  labelIcon.classList.add('label');
  labelIcon.textContent = data.icon;

  const labelShortcut = document.createElement('span');
  labelShortcut.classList.add('keyboardshortcut');
  labelShortcut.textContent = data.number;

  btn.appendChild(labelIcon);
  btn.appendChild(labelShortcut);
  return btn;
}


const soundboardElement = document.querySelector('#soundboard')
soundboardElement.appendChild(buildSoundboard(soundboardSounds));


window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  // log(event.key);
  // log(event.code);

  // const keyFound = soundboardSounds.find(s => s.key === event.code);
  // const keyFound = bufferList.find(s => s.key === event.code);
  // if (!keyFound) return;

  playAudioBuffer(event.code);

  // const playFile = keyFound.file;
  // log(playFile);
  // if (audioNode && audioNode.playing)
  // keyFound.node.start(0);

})

const playingNodes = [];

function playAudioBuffer(keyCode) {
  const keyFound = bufferList.find(s => s.key === keyCode);
  if (!keyFound) return;


  // log(keyFound.playing);
  const wasPlaying = keyFound.playing;

  // playingNodes.forEach(n => n.stop());
  playingNodes.forEach(n => n.stop());

  if(!wasPlaying) {

    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = keyFound.buffer;
    sourceNode.connect(audioContext.destination);

    keyFound.playing = true;
    playingNodes.push(sourceNode);

    sourceNode.addEventListener('ended', e => {
      keyFound.playing = false;
      // log(bufferList);
    });

    sourceNode.start(0);

    // playingNodes.push({ key: keyFound.key, node: sourceNode });
  }
  // const index = playingNodes.push(sourceNode);

  /*
  if (!audioNode) audioNode = audioContext.createBufferSource();
  audioNode.buffer = keyFound.buffer;
  audioNode.connect(audioContext.destination);

  audioNode.start(0);
  */
  // log(sourceNode.buffer.duration);
  // log(audioNode);

  /*
  if (keyFound.playing === true) {
    sourceNode.stop();
    keyFound.playing = false;

  } else {
    sourceNode.start(0);
    keyFound.playing = true;
  }
  */

  // log(audioContext.isPlaying);
  // audioNode


}

// audioContext.addEventListener('ended', e => log(e));
