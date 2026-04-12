async function fetchBackendInfo() {
  try {
    const response = await fetch(`/info?ts=${Date.now()}`, {
      cache: "no-store"
    });

    const data = await response.json();

    document.getElementById("backend-info").innerHTML = `
      Application Name : ${data.appName}<br>
      Docker Container : ${data.containerName}<br>
      Process ID (PID) : ${data.pid}<br>
      Served At        : ${new Date(data.timestamp).toLocaleString()}
    `;
  } catch (err) {
    document.getElementById("backend-info").innerText =
      "Failed to load backend information.";
  }
}

// Call the function to fetch data when the script loads
fetchBackendInfo();