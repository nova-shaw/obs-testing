const log = console.log;

const camera1Name = 'src-camera1-ishiguro';
const camera1KeyFilterName = 'Colour Key';
let keyingEnabled = false;

const obsBC = new BroadcastChannel('obsBC');

const msgOutput = document.querySelector('#msgOutput');
obsBC.addEventListener('message', e => {
  msgOutput.textContent = e.data;
  log(e.data);
  if (e.data.key === 'scene') {
    obsWS.call('SetCurrentProgramScene', {
      sceneName: e.data.val
    });
  }
});

const sceneButtonContainer = document.querySelector('#obs-scene-buttons');


///////////////////////////////////////////////////////////////
/**
 * OBS Websockets
 * -> using obs-websocket.js library (imported in HTML on page load)
 *
 * The only docs I've been able to find are here:
 * https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md
 *
 * */

const obsWS = new OBSWebSocket();
let obsSettings;

// const connection = await obsWS.connect('ws://127.0.0.1:4455', 'huwspZ8H7vTp0CYL');
const connection = await obsWS.connect('ws://127.0.0.1:4455', 'huwspZ8H7vTp0CYL')
  .then(
    (connectionDetails) => {
      log(connectionDetails);
      obsWS.call('GetSceneList').then(data => {
        sceneButtonsInit(data.scenes, data.currentProgramSceneName);
      });
      obsWS.call('GetVideoSettings').then(data => {
        obsSettings = data;
        log(obsSettings);
      });
      obsWS.call('GetSourceFilter', {
        sourceName: camera1Name,
        filterName: camera1KeyFilterName
        }).then(data => {
          // log('GetSourceFilter', data);
          keyingEnabled = data.filterEnabled;
          document.body.classList.toggle('keyingOn', keyingEnabled);
          // log('green screen enabled', keyingEnabled);
        });
      obsWS.call('GetHotkeyList').then(data => {
        log('GetHotkeyList', data);
      });
    },
    (error) => {
      console.error('OBS not running?', error)
      // log(error);
    });







obsWS.on('ConnectionOpened', () => {
  log('ConnectionOpened');
  obsWS.send('GetSceneList').then(data => {
    log(data.scenes);
    log(data);
  })
});


obsWS.on('SourceFilterEnableStateChanged', data => {
  // log('SourceFilterEnableStateChanged', data);
  if (data.sourceName === camera1Name && data.filterName === camera1KeyFilterName) {
    keyingEnabled = data.filterEnabled;
    document.body.classList.toggle('keyingOn', keyingEnabled);
  }
});

obsWS.on('SceneTransitionStarted', data => {
  log('SceneTransitionStarted', data);
})

// obsWS.on('SceneNameChanged', data => {
//   log('Scene changed to:', data.sceneName);
// });

obsWS.on('CurrentProgramSceneChanged', data => {
  // console.log('Scene changed to:', data.sceneName);
  sceneButtonContainer.querySelectorAll('button').forEach( b => { b.classList.remove('active', 'transitioning'); });
  const btn = sceneButtonContainer.querySelector(`button#obs-${data.sceneName}`);
  if (!btn) return;
  // if (btn) btn.classList.replace('transitioning', 'active');
  btn.classList.add('active');
  // btn.classList.remove('transitioning');
});




///////////////////////////////////////////////////////////////
// Page elements and events

const listOfOBSScenes = [ // not used anywhere, just for reference
  'scene-camera1',
  'scene-camera1-pip-media',
  'scene-media',
  'scene-media-pip-camera1',
  'scene-camera2',
  'scene-camera1-keyed',
  'scene-camera1-keyed-pip-media'
];

function sceneButtonsInit(allScenes, currentScene) {
  allScenes.forEach( item => {
    const foundButton = sceneButtonContainer.querySelector(`button#obs-${item.sceneName}`);
    if (foundButton) {
      foundButton.classList.add('exists');
      foundButton.classList.toggle('active', item.sceneName === currentScene);
      foundButton.dataset.scene = item.sceneName;
    }
  });
}

sceneButtonContainer.addEventListener('click', sceneButtonsClick);

function sceneButtonsClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  btn.classList.add('transitioning');
  obsWS.call('SetCurrentProgramScene', {
    sceneName: btn.dataset.scene
  });
}

const btnToggleKeying = document.querySelector('#btn-toggle-keying');
btnToggleKeying.addEventListener('click', toggleColorKey);
function toggleColorKey(e) {
  keyingEnabled = !keyingEnabled;
  // document.body.classList.toggle('keyingOn', keyingEnabled);
  obsWS.call('SetSourceFilterEnabled', {
    sourceName: camera1Name,
    filterName: camera1KeyFilterName,
    filterEnabled: keyingEnabled
  });
}

///////////////////////////////////////////////////////////////
// Keypress

const readout = document.querySelector('#key-readout');
window.addEventListener('keydown', e => {
  readout.textContent = e.code;
});

///////////////////////////////////////////////////////////////
// User Agent

const uareadout = document.querySelector('#useragent-readout');
const {userAgent} = navigator;
// uareadout.textContent = navigator.userAgent;
uareadout.textContent = userAgent;
