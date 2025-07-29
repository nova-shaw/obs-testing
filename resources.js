

const log = console.log;

const bc = new BroadcastChannel('chan');
const obsBC = new BroadcastChannel('obsBC');


// Change scene in OBS via Broadcast Channel to controlpanel.html
const sceneButtonContainer = document.querySelector('#obs-scene-buttons');

sceneButtonContainer.addEventListener('click', sceneButtonsClick);

function sceneButtonsClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  obsBC.postMessage( { key: 'scene', val: btn.dataset.scene } );
}




const msgOutput = document.querySelector('#msgOutput');

const btnMsg = document.querySelector('#btnMsg');
btnMsg.addEventListener('click', e => {
  bc.postMessage(`Resources! ${new Date().getTime()}`);
})

bc.addEventListener("message", (event) => {
  msgOutput.textContent = event.data;
});
