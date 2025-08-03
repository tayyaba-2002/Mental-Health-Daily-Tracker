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

    renderEntries();
    updateCharts();

    // Clear form fields
    document.getElementById("mood").value = "";
    document.getElementById("sleep").value = "";
    document.getElementById("journal").value = "";
});
