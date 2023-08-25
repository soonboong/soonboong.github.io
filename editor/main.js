const addButton = document.getElementById("add");
const listElement = document.getElementById("list");
const saveButton = document.getElementById("save");
const loadButton = document.getElementById("load");
const fileInput = document.getElementById("file");
const titleInput = document.getElementById("title");
const baseURLInput = document.getElementById("baseURL");

const deleteParent = (event) => {
  if (confirm("정말 지울까요?")) {
    event.target.parentElement.remove();
  }
};

const newListElement = () => {
  const res = document.createElement("div");
  res.className = "list-element";
  const epInput = document.createElement("input");
  const linkInput = document.createElement("input");
  const deleteButton = document.createElement("span");

  epInput.className = "ep-input";
  linkInput.className = "link-input";

  epInput.type = "text";
  linkInput.type = "text";

  deleteButton.innerText = "🗑️";
  deleteButton.addEventListener("click", deleteParent);

  epInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      linkInput.select();
    }
  });

  linkInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const next = event.target.parentElement.nextSibling;

      if (next) {
        next.children[0].select();
      } else {
        addListElement();
        event.target.parentElement.nextSibling.children[0].select();
      }
    }
  });

  res.appendChild(epInput);
  res.appendChild(linkInput);
  res.appendChild(deleteButton);

  return res;
};

const addListElement = () => {
  listElement.appendChild(newListElement());
};

const downloadJSON = () => {
  const links = {};
  if (!titleInput.value) {
    titleInput.select();
    alert("시리즈 제목을 입력해 주세요");
    return 0;
  }
  links.title = titleInput.value.trim();

  links.baseURL = baseURLInput.value.trim();

  if (links.baseURL[links.baseURL.length - 1] !== "/") {
    links.baseURL += "/";
  }

  if (links.baseURL) links.series = [];
  for (const e of listElement.children) {
    const ep = e.children[0].value.trim();
    const link = e.children[1].value.trim();
    if (!ep) {
      e.children[0].select();
      alert("ep의 값을 채워주세요");
      return 0;
    }
    if (!link) {
      e.children[1].select();
      alert("link의 값을 채워주세요");
      return 0;
    }
    links.series.push({
      ep,
      link,
    });
  }

  const linksJSON = JSON.stringify(links);

  const blob = new Blob([linksJSON], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${links.title}.json`;
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const readJSON = () => {
  file = fileInput.files[0];

  if (!file) {
    alert("파일을 선택해 주세요");
    return 0;
  }

  var reader = new FileReader();
  reader.onload = (event) => {
    try {
      const links = JSON.parse(event.target.result);
      titleInput.value = links.title;
      baseURLInput.value = links.baseURL;
      listElement.innerHTML = "";

      for (const episode of links.series) {
        const newElement = newListElement();
        newElement.children[0].value = episode.ep;
        newElement.children[1].value = episode.link;
        listElement.appendChild(newElement);
      }
    } catch {
      alert("올바른 파일을 선택해 주세요");
    }
  };
  reader.readAsText(file);
};

addButton.addEventListener("click", addListElement);
saveButton.addEventListener("click", downloadJSON);
loadButton.addEventListener("click", readJSON);
