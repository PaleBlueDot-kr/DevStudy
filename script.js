let copiedQuotes = [];
let currentPage = 1;
const quotesPerPage = 6;

document.addEventListener("DOMContentLoaded", () => {
  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");
  const authorProfileEl = document.getElementById("authorProfile");
  const button = document.getElementById("new-quote");
  const quoteArea = document.getElementById("quote-area");
  const copyAlert = document.getElementById("copy-alert");
  const bookmarkBtn = document.getElementById("bookmark-btn");
  const bookmarkPanel = document.getElementById("bookmark-panel");
  const bookmarkList = document.getElementById("bookmark-list");
  const paginationEl = document.getElementById("bookmark-pagination");
  const closeBtn = document.getElementById("close-bookmark");

  // 명언 줄바꿈 처리
  function splitQuote(text) {
    const charCount = text.length;
    if (charCount < 30) return text;
    if (charCount >= 35 && charCount <= 95) {
      const words = text.split(" ");
      const midpoint = Math.floor(words.length / 2);
      return words.slice(0, midpoint).join(" ") + "<br>" + words.slice(midpoint).join(" ");
    }
    return text;
  }

  // 명언 불러오기 (로컬 JSON)
  async function fetchQuote() {
    try {
      quoteEl.classList.remove("quote-visible");
      authorEl.classList.remove("quote-visible");
      authorProfileEl.classList.remove("quote-visible");

      setTimeout(async () => {
        const res = await fetch("./motivation_quotes.json");
        const data = await res.json();
        const random = data[Math.floor(Math.random() * data.length)];

        quoteEl.innerHTML = `"${splitQuote(random.message)}"`;
        authorEl.textContent = `- ${random.author}`;
        authorProfileEl.textContent = `${random.authorProfile}`;

        quoteEl.classList.add("quote-visible");
        authorEl.classList.add("quote-visible");
        authorProfileEl.classList.add("quote-visible");
      }, 100);
    } catch (error) {
      quoteEl.textContent = "명언을 가져오는 데 실패했습니다.";
      authorEl.textContent = "";
      authorProfileEl.textContent = "";
      console.error("API 오류:", error);
    }
  }

  // 텍스트 강조 애니메이션
  function highlightText() {
    quoteEl.classList.add("pulse");
    authorEl.classList.add("pulse");
    authorProfileEl.classList.add("pulse");
    setTimeout(() => {
      quoteEl.classList.remove("pulse");
      authorEl.classList.remove("pulse");
      authorProfileEl.classList.remove("pulse");
    }, 145);
  }

  function saveToLocal() {
    localStorage.setItem("copiedQuotes", JSON.stringify(copiedQuotes));
  }

  function loadFromLocal() {
    const data = localStorage.getItem("copiedQuotes");
    if (data) {
      copiedQuotes = JSON.parse(data);
      updateBookmarkList();
    }
  }

  function updateBookmarkList() {
    bookmarkList.innerHTML = "";
    const start = (currentPage - 1) * quotesPerPage;
    const visible = copiedQuotes.slice(start, start + quotesPerPage);

    visible.forEach((quote, index) => {
      const realIndex = start + index;
      const li = document.createElement("li");
      li.innerHTML = `
        ${quote.replaceAll("\n", "<br>")}
        <div class="actions">
          <button class="copy-btn" data-index="${realIndex}">📑</button>
          <button class="delete-btn" data-index="${realIndex}">🗑️</button>
        </div>
      `;
      bookmarkList.appendChild(li);
    });

    renderPagination();
    attachButtonEvents();
  }

  function renderPagination() {
    paginationEl.innerHTML = "";
    const totalPages = Math.ceil(copiedQuotes.length / quotesPerPage);
    if (totalPages <= 1) return;

    if (currentPage > 1) {
      paginationEl.innerHTML += `<button onclick="goToPage(${currentPage - 1})">이전</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      paginationEl.innerHTML += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    }

    if (currentPage < totalPages) {
      paginationEl.innerHTML += `<button onclick="goToPage(${currentPage + 1})">다음</button>`;
    }
  }

  function attachButtonEvents() {
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-index");
        navigator.clipboard.writeText(copiedQuotes[idx]).then(() => {
          btn.classList.add("clicked");
          setTimeout(() => btn.classList.remove("clicked"), 250);
        });
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-index");
        copiedQuotes.splice(idx, 1);
        saveToLocal();
        if ((currentPage - 1) * quotesPerPage >= copiedQuotes.length) {
          currentPage = Math.max(1, currentPage - 1);
        }
        updateBookmarkList();
      });
    });
  }

  window.goToPage = function (page) {
    currentPage = page;
    updateBookmarkList();
  };

  // 명언 클릭 시 복사
  quoteArea.addEventListener("click", () => {
    const fullQuote = `${quoteEl.textContent}\n${authorEl.textContent}\n${authorProfileEl.textContent}`;
    navigator.clipboard.writeText(fullQuote).then(() => {
      copyAlert.classList.add("show");
      highlightText();
      if (!copiedQuotes.includes(fullQuote)) {
        copiedQuotes.unshift(fullQuote);
        saveToLocal();
        updateBookmarkList();
      }
      setTimeout(() => {
        copyAlert.classList.remove("show");
      }, 1500);
    });
  });

  // 초기 실행
  button.addEventListener("click", fetchQuote);
  bookmarkBtn.addEventListener("click", () => {
    bookmarkPanel.classList.toggle("open");
  });
  closeBtn.addEventListener("click", () => {
    bookmarkPanel.classList.remove("open");
  });

  fetchQuote();
  loadFromLocal();
});
