document.getElementById("main").onclick = function () {
  chrome.tabs.create({ url: "../html/main.html" });
};

function getTreeNodes() {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    const TreeNodes = bookmarkTreeNodes;
    getNode(TreeNodes);
  });
}

function time(date) {
  const timestamp = date;
  let datetime = new Date(timestamp);

  return `${datetime.getFullYear()}年${
    datetime.getMonth() + 1
  }月${datetime.getDate()}日`;
}

function getNode(bookmarkTreeNodes) {
  const fragment = document.createDocumentFragment();
  const template = document.getElementById("template");
  for (let i = 0; i < bookmarkTreeNodes.length; i++) {
    const node = bookmarkTreeNodes[i];
    const clone = template.content.cloneNode(true);

    if (node.children) {
      if (node.dateGroupModified) {
        clone.querySelector(".time").textContent = time(node.dateGroupModified);
        clone.querySelector(".title").textContent = node.title;
        clone.querySelector(".title").id = node.id;
        clone.querySelector(".title").onclick = function () {
          chrome.tabs.create({
            url: `../html/main.html?id=${this.id}&title=${this.textContent}`,
          });
        };
      }

      getNode(node.children);
    }
    fragment.appendChild(clone);
  }
  document.querySelector("ul").appendChild(fragment);
}
getTreeNodes();
