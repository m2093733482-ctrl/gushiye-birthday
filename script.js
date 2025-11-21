// 本地存储键名
const STORAGE_KEY = "gushiye_birthday_stars_v1";

const starField = document.getElementById("star-field");
const wishInput = document.getElementById("wish-input");
const sendBtn = document.getElementById("send-btn");
const toggleBtn = document.getElementById("toggle-card");
const card = document.getElementById("wish-card");
const pop = document.getElementById("message-pop");
const popText = document.getElementById("message-text");

let stars = [];

function loadStars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return;
    stars = saved;
    stars.forEach((s, index) => {
      createStarElement(s.x, s.y, s.message, index);
    });
  } catch (e) {
    console.warn("加载星星失败", e);
  }
}

function saveStars() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stars));
  } catch (e) {
    console.warn("保存星星失败", e);
  }
}

function createStarElement(x, y, message, index) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = x + "%";
  star.style.top = y + "%";
  star.dataset.index = index.toString();
  star.addEventListener("click", () => {
    showMessage(message || "（这颗星没有留下字。）");
  });
  starField.appendChild(star);
}

function addStar(message) {
  const x = 10 + Math.random() * 80; // 留一点边距
  const y = 8 + Math.random() * 75;

  const data = { x, y, message: message.trim() };
  stars.push(data);
  const index = stars.length - 1;
  createStarElement(x, y, data.message, index);
  saveStars();
}

function showMessage(text) {
  popText.textContent = text;
  pop.classList.add("show");
  clearTimeout(showMessage._timer);
  showMessage._timer = setTimeout(() => {
    pop.classList.remove("show");
  }, 4200);
}

// 发送按钮
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const value = (wishInput.value || "").trim();
    if (!value) {
      showMessage("先写点什么，再送给他，好不好。");
      return;
    }
    addStar(value);
    wishInput.value = "";
    showMessage("这一句，他已经收到了。");
  });
}

// 收起 / 展开
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const collapsed = card.classList.toggle("collapsed");
    toggleBtn.textContent = collapsed ? "展开" : "收起";
  });
}

// 初始化
loadStars();
