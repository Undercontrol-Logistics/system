async function dieselFetch(method = "GET", body = null, userId = null) {
  let url = "https://diesel.api.undercontrol.tech/diesel/index.php";
  if (method === "GET" && userId !== null) {
    url += `?userId=${userId}`;
  }

  try {
    const options = {
      method: method,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      // Check for error status codes
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow for the caller to handle
  }
}

export default dieselFetch;
