// Render all entries from localStorage
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

    // Show entries in reverse order (latest first)
    entries.slice().reverse().forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
            <div class="date">${entry.date}</div>
            <div class="mood">Mood: ${moodEmojis[entry.mood] || entry.mood} (${entry.mood})</div>
            <div class="sleep">Sleep: ${entry.sleep} hrs</div>
            <div class="journal">${entry.journal}</div>
            <button class="delete-btn" data-index="${entries.length - 1 - index}">Delete</button>
        `;
        list.appendChild(div);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            let entries = JSON.parse(localStorage.getItem("entries")) || [];
            const idx = parseInt(this.dataset.index);
            entries.splice(idx, 1);
            localStorage.setItem("entries", JSON.stringify(entries));
            renderEntries();
            updateCharts();
        });
    });
}

// Placeholder function to update charts (implement later)
function updateCharts() {
    // You can use Chart.js or any other library here to visualize mood/sleep data
    console.log("Chart update placeholder");
}

// Form submission handler to save new entry
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

    updateCharts();

    // Clear form fields
    document.getElementById("mood").value = "";
    document.getElementById("sleep").value = "";
    document.getElementById("journal").value = "";

    renderEntries();
});

// Delete All Entries button handler
document.getElementById("deleteAllBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all entries?")) {
        localStorage.removeItem("entries");
        renderEntries();
        updateCharts();
    }
});

// Initialize on page load
window.onload = function () {
    renderEntries();
    updateCharts();
};
