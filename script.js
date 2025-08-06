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

   // Colors for moods
const moodColors = {
    "Happy": "#d4edda",     // light green
    "Sad": "#f8d7da",       // light red
    "Anxious": "#fff3cd",   // light yellow
    "Excited": "#cce5ff",   // light blue
    "Tired": "#e2e3e5"      // light gray
};

// Show entries in reverse order (latest first) with styled and colored cards
entries.slice().reverse().forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.style.backgroundColor = moodColors[entry.mood] || "#ffffff";  // default white
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.margin = "8px 0";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

    div.innerHTML = `
        <div class="date" style="font-weight:bold; margin-bottom:6px;">${entry.date}</div>
        <div class="mood" style="font-size: 1.2em;">Mood: ${moodEmojis[entry.mood] || entry.mood} (${entry.mood})</div>
        <div class="sleep">Sleep: ${entry.sleep} hrs</div>
        <div class="journal" style="margin-top:6px; white-space: pre-wrap;">${entry.journal}</div>
        <button class="delete-btn" data-index="${entries.length - 1 - index}" style="margin-top:10px;">Delete</button>
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

let moodChartInstance = null;
let sleepChartInstance = null;

function updateCharts() {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    if (!entries.length) {
        if (moodChartInstance) {
            moodChartInstance.destroy();
            moodChartInstance = null;
        }
        if (sleepChartInstance) {
            sleepChartInstance.destroy();
            sleepChartInstance = null;
        }
        return;
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Filter entries in last 7 days
    const recentEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo && entryDate <= today;
    });

    // Count moods for last 7 days
    const moodCounts = {};
    recentEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    const moods = Object.keys(moodCounts);
    const moodValues = moods.map(mood => moodCounts[mood]);

    // Average sleep per day for last 7 days
    const sleepSums = {};
    const sleepCounts = {};
    recentEntries.forEach(entry => {
        sleepSums[entry.date] = (sleepSums[entry.date] || 0) + entry.sleep;
        sleepCounts[entry.date] = (sleepCounts[entry.date] || 0) + 1;
    });

    const sleepDates = Object.keys(sleepSums).sort((a,b) => new Date(a) - new Date(b));
    const avgSleep = sleepDates.map(date => (sleepSums[date] / sleepCounts[date]).toFixed(2));

    // Destroy old charts if any
    if (moodChartInstance) moodChartInstance.destroy();
    if (sleepChartInstance) sleepChartInstance.destroy();

    // Create mood chart (bar)
    const moodCtx = document.getElementById('moodChart').getContext('2d');
    moodChartInstance = new Chart(moodCtx, {
        type: 'bar',
        data: {
            labels: moods,
            datasets: [{
                label: 'Mood Count (Last 7 Days)',
                data: moodValues,
                backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196f3', '#9c27b0'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, stepSize: 1, precision: 0 }
            }
        }
    });

    // Create sleep chart (line)
    const sleepCtx = document.getElementById('sleepChart').getContext('2d');
    sleepChartInstance = new Chart(sleepCtx, {
        type: 'line',
        data: {
            labels: sleepDates,
            datasets: [{
                label: 'Average Sleep Hours (Last 7 Days)',
                data: avgSleep,
                fill: false,
                borderColor: '#2196f3',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 12 }
            }
        }
    });
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration) {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(function (error) {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Initialize on page load
window.onload = function () {
    renderEntries();
    updateCharts();
};
