function startExperience() {
    // Page 1 chhupao aur Page 2 dikhao
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';

    // MUSIC PLAY LINE:
    var song = document.getElementById('mySong');
    song.play().catch(error => console.log("Music play failed:", error));
    
    // Mic detection shuru karo
    startMicDetection();
}

function startMicDetection() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            for (let i = 0; i < array.length; i++) {
                values += array[i];
            }
            let average = values / array.length;

            // Agar user zor se foonk maare (volume > 50)
            if (average > 50) { 
                showFinalSurprise();
                // Mic band karo taaki battery bache
                stream.getTracks().forEach(track => track.stop());
                scriptProcessor.disconnect();
            }
        };
    })
    .catch(err => {
        console.error("Mic error:", err);
        alert("Please allow Microphone access to blow the candles!");
    });
}

function showFinalSurprise() {
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page3').style.display = 'block';
}