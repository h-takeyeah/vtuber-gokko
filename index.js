let kuchipaku = false;
const imgElem = document.querySelector("img");
const pElem = document.getElementById("recognized-text");

const recognition = new webkitSpeechRecognition();
recognition.onresult = function (event) {
  pElem.textContent = event.results[0][0].transcript;
};

recognition.start();

function main() {
  const currentImg = imgElem.dataset.current;
  if (kuchipaku && currentImg !== "on") {
    imgElem.src = "./img/kuchipaku.gif";
    imgElem.dataset.current = "on";
  } else {
    if (currentImg !== "off") {
      imgElem.src = "./img/base.gif";
      imgElem.dataset.current = "off";
    }
  }
  setTimeout(main, 100);
}

async function setupMicrophone() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  document.querySelector("audio").srcObject = stream;
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const timeDomain = new Float32Array(analyser.frequencyBinCount);
  const frequency = new Uint8Array(analyser.frequencyBinCount);
  audioCtx.createMediaStreamSource(stream).connect(analyser);

  function loop() {
    analyser.getFloatTimeDomainData(timeDomain);
    analyser.getByteFrequencyData(frequency);

    let score = 0;
    for (let i = 0; i < frequency.length; i++) {
      score = score + frequency[i];
    }

    const avg = score / frequency.length;
    if (avg > 15) {
      kuchipaku = true;
    } else {
      kuchipaku = false;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

main();
setupMicrophone();
