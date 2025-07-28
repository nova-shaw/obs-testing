const log = console.log;


/**
 * OBS Websockets
 * -> using obs-websocket.js library (imported in HTML on page load)
 * 
 * The only docs I've been able to find are here:
 * https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md
 * 
 * */
const obsScenes = [
  'scene-camera1',
  'scene-camera1-pip-media',
  'scene-media',
  'scene-media-pip-camera1',
  'scene-camera2',
  'scene-camera1-keyed',
  'scene-camera1-keyed-pip-media'
];

obsScenes.forEach(sceneName => {
  // log(`obs-${sceneName}`);
  const btn = document.querySelector(`#obs-${sceneName}`);
  if (btn) {
    btn.dataset.scene = sceneName;
  }
})

// const obsSceneButtonContainer = document.querySelector('#obs-scene-buttons');
// obsSceneButtonContainer.addEventListener('click', e => {
//   const button = e.target.closest('button');
//   log(button.dataset.scene);
// });

const obsSceneButtonContainer = document.querySelector('#obs-scene-buttons');



const obs = new OBSWebSocket();

await obs.connect('ws://127.0.0.1:4455', 'huwspZ8H7vTp0CYL');
log(obs);

obs.on('ConnectionOpened', () => {
  log('ConnectionOpened');
  obs.send('GetSceneList').then(data => {
    log(data.scenes);
  })
});

obs.on('CurrentProgramSceneChanged', data => {
  // console.log('Scene changed to:', data.sceneName);
  obsSceneButtonContainer.querySelectorAll('button').forEach( b => { b.classList.remove('active'); });
  const btn = obsSceneButtonContainer.querySelector(`button#obs-${data.sceneName}`);
  if (btn) btn.classList.add('active');
});

obsSceneButtonContainer.addEventListener('click', async e => {
  const btn = e.target.closest('button');
  // log(btn);
  const sceneId = btn.dataset.scene;
  // log(sceneId);
  await obs.call('SetCurrentProgramScene', { sceneName: sceneId });

  const settings = await obs.call('GetVideoSettings');
  log(settings);
})
