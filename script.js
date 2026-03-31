let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function getProfile() {
  const username = document.getElementById("username").value;
  if (!username) return;

  fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "error") {
        alert("User not found");
        return;
      }

      document.getElementById("profile").classList.remove("hidden");
      document.getElementById("name").textContent = username;
      document.getElementById("avatar").src = `https://leetcode.com/${username}/avatar.png`;
      document.getElementById("solved").textContent = data.totalSolved;
      document.getElementById("easy").textContent = data.easySolved;
      document.getElementById("medium").textContent = data.mediumSolved;
      document.getElementById("hard").textContent = data.hardSolved;
      document.getElementById("acceptance").textContent = data.acceptanceRate + "%";
      document.getElementById("ranking").textContent = data.ranking;

      showCharts(data);
    });
}

function showCharts(data) {
  const ctx = document.getElementById("difficultyChart").getContext("2d");
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [{
        data: [data.easySolved, data.mediumSolved, data.hardSolved],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }]
    }
  });

  const ctx2 = document.getElementById("submissionChart").getContext("2d");
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Submissions (mock)',
        data: [5, 10, 8, 7, 12, 20, 15],
        borderColor: '#3b82f6',
        fill: false,
        tension: 0.4
      }]
    }
  });
}

function saveFavorite() {
  const username = document.getElementById("username").value;
  if (username && !favorites.includes(username)) {
    favorites.push(username);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

function renderFavorites() {
  const ul = document.getElementById("fav-list");
  ul.innerHTML = "";
  favorites.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    li.style.cursor = "pointer";
    li.onclick = () => {
      document.getElementById("username").value = user;
      getProfile();
    };
    ul.appendChild(li);
  });
}

document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("light");
};

renderFavorites();
