// GETパラメーターで送られてきたフォルダ名とIDを取得する
const url = new URL(window.location.href);
const params = url.searchParams;
const title = params.get("title");
// フォルダ別のブックマーク一覧を表示する
if (params.get("id")) {
  const id = params.get("id");
  document.querySelector("h1").textContent = title;
  chrome.bookmarks.getChildren(id, function (subTree) {
    getNode(subTree);
  });
} else {
  function getTreeNodes(numberOfItems) {
    chrome.bookmarks.getRecent(numberOfItems, function (bookmarkTreeNodes) {
      const TreeNodes = bookmarkTreeNodes;
      getNode(TreeNodes);
    });
  }
  getTreeNodes(10000);
}
//ブックマークが作成された時間の表示
function time(date) {
  const timestamp = date;
  let datetime = new Date(timestamp);

  return `${datetime.getFullYear()}年${
    datetime.getMonth() + 1
  }月${datetime.getDate()}日`;
}
//ブックマーク一覧取得して表示する
function getNode(bookmarkTreeNodes) {
  const fragment = document.createDocumentFragment();
  const template = document.getElementById("template");

  bookmarkTreeNodes.forEach(function (node) {
    const clone = template.content.cloneNode(true);
    clone.querySelector("a").href = node.url;
    clone.querySelector("a").textContent = node.title;
    clone.querySelector(".time").textContent = time(node.dateAdded);
    clone.querySelector(".remove").id = node.id;
    clone.querySelector(".remove").title = node.title;
    //ブックマークを削除する
    clone.querySelector(".remove").onclick = function () {
      const result = confirm(`${this.title}を削除してもよろしいですか？`);
      if (result) {
        chrome.bookmarks.remove(this.id);
        this.parentNode.remove();
      }
    };

    fragment.appendChild(clone);
  });
  document.querySelector("ul").appendChild(fragment);
}
