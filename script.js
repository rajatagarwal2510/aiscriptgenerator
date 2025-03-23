document.getElementById("generateBtn").addEventListener("click", function () {
    const topic = document.getElementById("topic").value;
    const language = document.getElementById("language").value;
    const tone = document.getElementById("tone").value;
    const moodValue = document.getElementById("mood").value;
    const moodEmoji = ["🧘 Calm", "😐 Neutral", "🔥 Bold", "🤣 Playful"][moodValue - 1];
    document.getElementById("moodValue").innerText = moodEmoji;
    const contentType = document.getElementById("contentType").value;
    const audience = document.getElementById("audience").value;
    const length = document.getElementById("length").value;
    const characterStyle = document.getElementById("characterStyle").value;
    const voiceType = document.getElementById("voiceType").value;
    const creativity = document.getElementById("creativity").value;

    document.getElementById("outputBox").innerText = "✨ Generating script... Please wait...";

    fetch("/generate_script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            topic,
            language,
            tone,
            mood: moodEmoji,
            contentType,
            audience,
            length,
            characterStyle,
            voiceType,
            creativity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.script) {
            document.getElementById("outputBox").innerText = data.script;
        } else {
            document.getElementById("outputBox").innerText = "❌ Error: " + (data.error || "No script generated.");
        }
    })
    .catch(error => {
        document.getElementById("outputBox").innerText = "❌ Request failed: " + error;
    });
});


document.getElementById("convertAudioBtn").addEventListener("click", function () {
    const scriptText = document.getElementById("outputBox").innerText;

    if (!scriptText || scriptText.startsWith("❌")) {
        alert("Please generate a script first!");
        return;
    }

    fetch("/text_to_speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scriptText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.audio_url) {
            const audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = data.audio_url;
            audioPlayer.style.display = "block";
            audioPlayer.play();
        } else {
            alert("Audio conversion failed: " + data.error);
        }
    })
    .catch(error => alert("Error converting to audio: " + error));
});
