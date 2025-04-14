/**
 * audio.js
 * 
 * This file controls all the audio assets. It was created
 * in 2021 as a side-project in a Pacman game. Use it however you like.
 * 
 * Author: Mr. Brash 🐿️ <matthew.brash@ocsb.ca>
 */

let context;
let bufferLoader;
let gainNode;
let audioPaused = false;
let vol;
let muted;
let audioAssets = [
  '../media/arcade_music.mp3',
  '../media/arcade_music2.mp3',
  '../media/music_loop.mp3',
  '../media/music_loop2.mp3'
]

const MUSIC1 = 0;
const MUSIC2 = 1;
const MUSIC3 = 2;
const MUSIC4 = 3;

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  let request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  let loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i) {
    this.loadBuffer(this.urlList[i], i);
  }
}

/**
 * Load the sounds into memory
 */
function initSounds() {
  console.log("Loading Sounds");
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  gainNode = context.createGain();

  bufferLoader = new BufferLoader(
    context,
    audioAssets,
    finishedLoadingAudio
    );

  bufferLoader.load();
  gainNode.connect(context.destination);
}

function finishedLoadingAudio(bufferList) {
  if (!mute.muted) {
    gainNode.gain.value = document.getElementById("volume").value/100;
    // How do you stop a loop?
    playSound(MUSIC1, true);
  }
}

function playPause() {
  if (audioPaused) {
    context.resume();
  } else {
    context.suspend();
  }
  audioPaused = !audioPaused;

}

function playSound(buffer, loop = false) {
  let audioBuffer;
  
  if (typeof buffer === 'number') {
    audioBuffer = bufferLoader.bufferList[buffer];
  } else {
    audioBuffer = buffer;
  }

  if (!audioPaused) {
    let source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    source.loop = loop;
    source.start(0);
    return source;
  }
  
}

function mute() {
  if (!muted) {
    vol = gainNode.gain.value;
    gainNode.gain.value = 0;
    document.getElementById("mute").src = "../images/Mute.png";
  } else {
    gainNode.gain.value = vol;
    document.getElementById("mute").src = "../images/Volume.png";
  }
  
  muted = !muted;
  document.getElementById("volume").disabled = muted;

}

// Set the volume of the sounds as fraction of 100
function volume(value) {
  gainNode.gain.value = value*value;
}
