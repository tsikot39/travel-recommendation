// URL to the JSON file
const apiURL = "travel_recommendation_api.json";

// Function to fetch data
async function fetchTravelData() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(data); // Log the data to the console
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to display data
function displayData(filteredData) {
  const recommendationsDiv = document.getElementById("recommendations");
  recommendationsDiv.innerHTML = ""; // Clear previous results

  if (filteredData.length === 0) {
    recommendationsDiv.textContent = "No recommendations found.";
    return;
  }

  // Display each item in filteredData
  filteredData.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "recommendation";

    const itemImage = document.createElement("img");
    itemImage.src = item.imageUrl;
    itemImage.alt = item.name;

    const itemName = document.createElement("h3");
    itemName.textContent = item.name;

    const itemDescription = document.createElement("p");
    itemDescription.textContent = item.description;

    itemDiv.appendChild(itemImage);
    itemDiv.appendChild(itemName);
    itemDiv.appendChild(itemDescription);

    recommendationsDiv.appendChild(itemDiv);
  });
}

// Function to perform search
async function performSearch() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const data = await fetchTravelData();

  let filteredData = [];
  if (searchInput.includes("beach")) {
    filteredData = data.beaches.slice(0, 2); // Get at least 2 recommendations
  } else if (searchInput.includes("temple")) {
    filteredData = data.temples.slice(0, 2); // Get at least 2 recommendations
  } else if (searchInput.includes("country")) {
    data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        filteredData.push({
          name: city.name,
          description: city.description,
          imageUrl: city.imageUrl,
        });
      });
    });
    filteredData = filteredData.slice(0, 2); // Get at least 2 recommendations
  } else {
    data.countries.forEach((country) => {
      if (country.name.toLowerCase().includes(searchInput)) {
        country.cities.forEach((city) => {
          filteredData.push({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
          });
        });
      } else {
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(searchInput)) {
            filteredData.push({
              name: city.name,
              description: city.description,
              imageUrl: city.imageUrl,
            });
          }
        });
      }
    });
    filteredData = filteredData
      .concat(
        data.temples.filter((temple) =>
          temple.name.toLowerCase().includes(searchInput)
        )
      )
      .concat(
        data.beaches.filter((beach) =>
          beach.name.toLowerCase().includes(searchInput)
        )
      )
      .slice(0, 2); // Get at least 2 recommendations
  }

  displayData(filteredData);
}

// Function to reset search input and results
function reset() {
  document.getElementById("search-input").value = "";
  fetchTravelData().then(displayData);
}

// Function to clear search results
function clearResults() {
  document.getElementById("search-input").value = "";
  document.getElementById("recommendations").innerHTML = "";
}

// Initial fetch and display
fetchTravelData().then(displayData);
