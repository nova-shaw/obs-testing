

const log = console.log;

const bc = new BroadcastChannel('chan');

const msgOutput = document.querySelector('#msgOutput');

const btnMsg = document.querySelector('#btnMsg');
btnMsg.addEventListener('click', e => {
  bc.postMessage(`Resources! ${new Date().getTime()}`);
})

bc.addEventListener("message", (event) => {
  msgOutput.textContent = event.data;
});

/* MOVED TO controlpanel.js

const obs = new OBSWebSocket();

// const sock = new WebSocket('ws://127.0.0.1:4455/huwspZ8H7vTp0CYL');
// const sock = new WebSocket('ws://127.0.0.1:4455/', 'huwspZ8H7vTp0CYL');
// log(sock);

await obs.connect('ws://127.0.0.1:4455', 'huwspZ8H7vTp0CYL');
log(obs);

obs.on('CurrentProgramSceneChanged', data => {
  console.log('Scene changed to:', data.sceneName);
});

const obsSceneButtonContainer = document.querySelector('#obs-scene-buttons');
obsSceneButtonContainer.addEventListener('click', async e => {
  const btn = e.target.closest('button');
  // log(btn);
  const sceneId = btn.dataset.scene;
  // log(sceneId);
  await obs.call('SetCurrentProgramScene', { sceneName: sceneId });
})
*/