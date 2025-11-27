function displayData(data, container) {
  console.log("Container is", container);

  container.innerHTML = "";
  data.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.body}}</p>
    `;
    container.appendChild(listItem);
  });
}

async function fetchData() {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";
  const listElement = document.getElementById("data-list");
  console.log("listELement is", listElement);

  try {
    const response = await fetch(apiUrl);

    console.log("response is", response);
    if (!response.ok) {
      throw new Error("HTTP Error", response.status);
    }

    const data = await response.json();
    console.log("data is", data);

    displayData(data, listElement);
  } catch (error) {
    console.error("Fetch error", error);
    listElement.innerHTML = `<li>Error occured</li>`;
  }
}

fetchData();
