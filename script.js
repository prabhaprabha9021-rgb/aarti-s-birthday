let audioContext;
let analyser;
let microphone;
let javascriptNode;

function startMicDetection() {
    // Browser se mic ki permission mangna
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = function() {
                let array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;

                for (let i = 0; i < array.length; i++) {
                    values += array[i];
                }

                let average = values / array.length;

                // Agar awaaz (foonk) 60 se upar jati hai
                if (average > 60) { 
                    console.log("Blow detected!");
                    blowCandles(); // Ye function Page 3 par le jayega
                    stopMic(stream);
                }
            };
        })
        .catch(function(err) {
            console.log("Mic access denied: " + err);
            // Agar user mana kar de, toh button dikha do fallback ke liye
            document.getElementById('blow-btn').classList.remove('hidden');
        });
}

function stopMic(stream) {
    stream.getTracks().forEach(track => track.stop());
    javascriptNode.disconnect();
}
