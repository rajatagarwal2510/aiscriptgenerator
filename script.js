// Function to update Mood Label
function updateMoodLabel(value) {
    const moods = ["🧘 Calm", "😐 Neutral", "🔥 Bold", "🤣 Playful"];
    document.getElementById("moodValue").textContent = moods[value - 1];
}

// Function to Send Data to Flask API
async function generateScript(event) {
    event.preventDefault();  // ❌ Form reload hone se roke

    const data = {
        characterStyle: document.getElementById("characterStyle").value,
        voiceType: document.getElementById("voiceType").value,
        topic: document.getElementById("topic").value,
        language: document.getElementById("language").value,
        tone: document.getElementById("tone").value,
        mood: document.getElementById("mood").value,
        contentType: document.getElementById("contentType").value,
        audience: document.getElementById("audience").value,
        length: document.getElementById("length").value,
        creativity: document.getElementById("creativity").value
    };
    
    }
    async function convertToAudio() {
        const scriptText = document.getElementById("outputBox").innerText.trim();
    
        if (!scriptText) {
            alert("No script available for conversion.");
            return;
        }
    
        try {
            let res = await fetch('/text_to_speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: scriptText })
            });
    
            let result = await res.json();
    
            if (res.ok && result.audio_url) {
                document.getElementById("audioPlayer").src = result.audio_url;
                document.getElementById("audioPlayer").style.display = "block";
                document.getElementById("audioPlayer").play();
            } else {
                alert("Error: " + (result.error || "Unknown error"));
            }
        } catch (err) {
            alert("Something went wrong: " + err);
        }
    }
    
    

    document.getElementById("outputBox").innerHTML = "⏳ Generating script... please wait...";

    try {
        let res = await fetch('/generate_script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        let result = await res.json();
        if (result.script) {
            typeWriterEffect(result.script, 0);
        } else {
            document.getElementById("outputBox").innerHTML = "❌ Error: " + result.error;
        }
    } catch (err) {
        document.getElementById("outputBox").innerHTML = "⚠️ Something went wrong: " + err;
    }
}

// Function to Create Typewriter Effect
function typeWriterEffect(text, i) {
    const box = document.getElementById("outputBox");
    box.innerHTML = "";
    const typing = setInterval(() => {
        if (i < text.length) {
            box.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 20);
}

