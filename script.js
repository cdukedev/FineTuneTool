let filename = "";

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

function setCurrentFile() {
  const fileSelector = document.getElementById("file-selector");
  const selectedFile = fileSelector.value;
  localStorage.setItem("currentFilename", selectedFile);
  alert(`Current file set to '${selectedFile}'.`);
}
async function updateFileList() {
  try {
    const response = await axios.get("http://localhost:3000/files");
    const files = response.data;

    const fileSelector = document.getElementById("file-selector");
    fileSelector.innerHTML = "";

    for (const file of files) {
      const option = document.createElement("option");
      option.value = file;
      option.text = file;
      fileSelector.appendChild(option);
    }
    // Get the current filename from localStorage and set it as the selected value
    let currentFilename = localStorage.getItem("currentFilename");

    // If there's no saved filename in localStorage, set the first file in the list as the default value
    if (!currentFilename && files.length > 0) {
      currentFilename = files[0];
      localStorage.setItem("currentFilename", currentFilename);
    }

    if (currentFilename) {
      fileSelector.value = currentFilename;
    }
  } catch (error) {
    console.error(error);
    alert("Error updating file list.");
  }
  return false;
}

function createFile() {
  filename = document.getElementById("filename").value;
  axios
    .post("http://localhost:3000/create", { filename })
    .then((response) => {
      console.log(response.data);
      alert(`File '${filename}.jsonl' created.`);
    })
    .catch((error) => {
      console.error(error);
      alert("Error creating file.");
    });
  return false;
}

function addLine() {
  // Use the selected file from the dropdown menu
  const fileSelector = document.getElementById("file-selector");
  filename = fileSelector.value;
  const prompt = document.getElementById("prompt").value;
  const completion = document.getElementById("completion").value;
  const data = { filename, prompt, completion };
  axios
    .post("http://localhost:3000/addLine", data)
    .then((response) => {
      console.log(response.data);

      // Save the current selected file before clearing the input fields
      const selectedFile = fileSelector.value;

      // Clear the input fields
      document.getElementById("prompt").value = "";
      document.getElementById("completion").value = "";

      // Set the dropdown menu value back to the saved value
      console.log(selectedFile);
      fileSelector.value = selectedFile;
    })
    .catch((error) => {
      console.error(error);
      alert("Error adding line to file.");
    });
  return false;
}

async function saveFile() {
  try {
    // Get the value of the selected option in the dropdown
    const fileSelector = document.getElementById("file-selector");
    const selectedFilename = fileSelector.value;

    const response = await axios.post("http://localhost:3000/addToCollection", {
      filename: selectedFilename,
    });
    console.log(response.data);
    alert(`File '${selectedFilename}' saved and added to collection.`);
  } catch (error) {
    console.error(error);
    alert("Error saving file to collection.");
  }
}

document.addEventListener("DOMContentLoaded", updateFileList);
