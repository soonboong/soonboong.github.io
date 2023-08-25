let series = [];
let title;
let index;
let uiHidden = false;
let baseURL;

const counterElement = document.getElementById("counter");
const episodeElement = document.getElementById("episode");
const contentElement = document.getElementById("content");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const fileInput = document.getElementById("file");
const toggleButton = document.getElementById("toggle");
const UIs = Array.from(document.getElementsByClassName("ui-container"));

const setUi = () => {
  counterElement.innerText = `${index + 1}/${series.length}`;
  episodeElement.innerText = `${series[index].ep}화`;
  contentElement.setAttribute("src", baseURL + series[index].link);
};

const prev = () => {
  if (index) {
    index -= 1;
    setUi();
  }
};

const next = () => {
  if (index < series.length - 1) {
    index += 1;
    setUi();
  }
};

const toggleUi = () => {
  uiHidden = !uiHidden;
  UIs.map((x) => (x.hidden = uiHidden));
};

const readJSON = (event) => {
  file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = (event) => {
      json = JSON.parse(event.target.result);
      title = json.title;
      series = json.series;
      baseURL = json.baseURL;
      if (baseURL[baseURL.length - 1] !== "/") {
        baseURL += "/";
      }
      if (!confirm(`BaseURL: ${baseURL}\n올바른지 확인해주세요`)) {
        return 0;
      }
      index = 0;
      counterElement.removeAttribute("hidden");
      episodeElement.removeAttribute("hidden");
      contentElement.removeAttribute("hidden");
      prevButton.removeAttribute("hidden");
      nextButton.removeAttribute("hidden");
      setUi();
    };
    reader.readAsText(file);
  }
};

fileInput.addEventListener("change", readJSON);
prevButton.addEventListener("click", prev);
nextButton.addEventListener("click", next);
toggleButton.addEventListener("click", toggleUi);
