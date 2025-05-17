let isAffirmationMode = false;

const quoteWrapperEl = document.getElementById("quote");
const quoteTextEl = document.getElementById("quoteText");
const authorEl = document.getElementById("author");
const authorProfileEl = document.getElementById("authorProfile");
const userQuoteEl = document.getElementById("userQuote");
const quoteBtn = document.getElementById("buttonWrapper");
const affirmationWrapper = document.getElementById("affirmationWrapper");
const badgeEl = document.getElementById("affirmationCountBadge");

// ✅ 카운트 함수
function countAffirmation(message) {
  const key = message.replace(/"/g, "").trim();
  let counts = JSON.parse(localStorage.getItem("affirmationCounts")) || {};
  counts[key] = (counts[key] || 0) + 1;
  localStorage.setItem("affirmationCounts", JSON.stringify(counts));

  const count = counts[key];
  if (isAffirmationMode && badgeEl) {
    badgeEl.textContent = count;
    badgeEl.style.display = count > 0 ? "inline" : "none";
  }
}

// ✅ 명언 또는 확언 불러오기
async function fetchQuote() {
  const quoteFile = isAffirmationMode ? "affirmations.json" : "motivation_quotes.json";

  try {
    quoteTextEl.classList.remove("quote-visible");
    authorEl.classList.remove("quote-visible");
    authorProfileEl.classList.remove("quote-visible");
    badgeEl.style.display = "none";
    userQuoteEl.textContent = "";
    userQuoteEl.classList.remove("visible");

    setTimeout(async () => {
      const res = await fetch(quoteFile);
      const data = await res.json();
      const random = data[Math.floor(Math.random() * data.length)];

      quoteTextEl.textContent = `"${random.message}"`;

      if (isAffirmationMode) {
        authorEl.textContent = "";
        authorProfileEl.textContent = "";
        countAffirmation(random.message); // ✅ 확언 모드일 때 카운트
      } else {
        authorEl.textContent = `- ${random.author}`;
        authorProfileEl.textContent = random.authorProfile;
        badgeEl.style.display = "none"; // 명언 모드일 땐 badge 숨기기
      }

      quoteTextEl.classList.add("quote-visible");
      authorEl.classList.add("quote-visible");
      authorProfileEl.classList.add("quote-visible");
    }, 100);
  } catch (err) {
    quoteTextEl.textContent = "문장을 불러오지 못했습니다.";
    authorEl.textContent = "";
    authorProfileEl.textContent = "";
    badgeEl.style.display = "none";
  }
}

// ✅ 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("new-quote").addEventListener("click", fetchQuote);
  fetchQuote();
  quoteBtn.classList.add("fade-in");
});

// ✅ 모드 전환
document.getElementById("modeSwitch").addEventListener("change", (e) => {
  isAffirmationMode = e.target.checked;

  quoteBtn.classList.toggle("fade-in", !isAffirmationMode);
  quoteBtn.classList.toggle("fade-out", isAffirmationMode);
  affirmationWrapper.classList.toggle("fade-in", isAffirmationMode);
  affirmationWrapper.classList.toggle("fade-out", !isAffirmationMode);

  fetchQuote();
});

// ✅ 확언 전송
document.getElementById("affirmationSubmit").addEventListener("click", () => {
  const input = document.getElementById("affirmationInput").value.trim();
  if (!input) return;

  userQuoteEl.textContent = `"${input}"`;
  userQuoteEl.className = "user-quote-text visible";

  authorEl.textContent = "";
  authorProfileEl.textContent = "";
  document.getElementById("affirmationInput").value = "";

  setTimeout(() => {
    userQuoteEl.className = "user-quote-text";
    userQuoteEl.textContent = "";
    fetchQuote(); // 다음 확언으로
  }, 1500);
});
