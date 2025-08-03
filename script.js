// Save entry to localStorage
document.getElementById("trackerForm").addEventListener("submit", function (e) {
    e.preventDefault();  // prevent form from refreshing the page

    const mood = document.getElementById("mood").value;
    const sleep = document.getElementById("sleep").value;
    const journal = document.getElementById("journal").value;

    if (!mood || !sleep || !journal) {
        alert("Please fill in all fields.");
        return;
    }

    const entry = {
        date: new Date().toLocaleDateString(),
        mood,
        sleep: parseFloat(sleep),
        journal
    };

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));

    updateCharts();

    // Clear form fields
    document.getElementById("mood").value = "";
    document.getElementById("sleep").value = "";
    document.getElementById("journal").value = "";

// RENDER FUNCTION — outside any event listener
function renderEntries() {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    const list = document.getElementById("entryList");
    list.innerHTML = "";

    const moodEmojis = {
        "Happy": "😊",
        "Sad": "😢",
        "Anxious": "😰",
        "Excited": "😄",
        "Tired": "😴"
    };

    entries.slice().reverse().forEach(entry => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
            <div class="date">${entry.date}</div>
            <div class="mood">Mood: ${moodEmojis[entry.mood] || entry.mood} (${entry.mood})</div>
            <div class="sleep">Sleep: ${entry.sleep} hrs</div>
            <div class="journal">${entry.journal}</div>
        `;
        list.appendChild(div);
    });
}

// FORM SUBMIT HANDLER
document.getElementById("trackerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const mood = document.getElementById("mood").value;
    const sleep = document.getElementById("sleep").value;
    const journal = document.getElementById("journal").value;

    if (!mood || !sleep || !journal) {
        alert("Please fill in all fields.");
        return;
    }

    const entry = {
        date: new Date().toLocaleDateString(),
        mood,
        sleep: parseFloat(sleep),
        journal
    };

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));

    updateCharts(); // optional

    // Clear form
    document.getElementById("mood").value = "";
    document.getElementById("sleep").value = "";
    document.getElementById("journal").value = "";

    renderEntries();  // show updated entries immediately
});

// ON PAGE LOAD
window.onload = function () {
    renderEntries();
};
