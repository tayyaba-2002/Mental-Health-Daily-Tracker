// Save entry to localStorage
document.getElementById("saveBtn").addEventListener("click", function () {
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

    renderEntries();
    updateCharts();
    document.getElementById("mood").value = "";
    document.getElementById("sleep").value = "";
    document.getElementById("journal").value = "";
});

// Render past entries
function renderEntries() {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    const list = document.getElementById("entryList");
    list.innerHTML = "";

    entries.reverse().forEach(entry => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
            <strong>${entry.date}</strong><br>
            Mood: ${entry.mood} | Sleep: ${entry.sleep} hrs<br>
            <em>${entry.journal}</em>
            <hr>
        `;
        list.appendChild(div);
    });
}

// Setup charts
let moodChart, sleepChart;

function updateCharts() {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];

    const labels = entries.map(e => e.date);
    const sleepData = entries.map(e => e.sleep);
    const moodMapping = { Happy: 5, Okay: 3, Sad: 1 };
    const moodData = entries.map(e => moodMapping[e.mood] || 0);

    // Mood Line Chart
    const moodCtx = document.getElementById("moodChart").getContext("2d");
    if (moodChart) moodChart.destroy();
    moodChart = new Chart(moodCtx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Mood (1-5)",
                data: moodData,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true
            }]
        },
        options: {
            scales: { y: { min: 0, max: 5 } }
        }
    });

    // Sleep Bar Chart
    const sleepCtx = document.getElementById("sleepChart").getContext("2d");
    if (sleepChart) sleepChart.destroy();
    sleepChart = new Chart(sleepCtx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Hours Slept",
                data: sleepData,
                backgroundColor: "#2196F3"
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

// On load
renderEntries();
updateCharts();
