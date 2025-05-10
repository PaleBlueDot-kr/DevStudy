let isAffirmationMode = false;

const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const authorProfileEl = document.getElementById("authorProfile");
const quoteBtn = document.getElementById("buttonWrapper");
const affirmationWrapper = document.getElementById("affirmationWrapper");

async function fetchQuote() {
  const quoteFile = isAffirmationMode ? "affirmations.json" : "motivation_quotes.json";

  try {
    quoteEl.classList.remove("quote-visible");
    authorEl.classList.remove("quote-visible");
    authorProfileEl.classList.remove("quote-visible");

    setTimeout(async () => {
      const res = await fetch(quoteFile);
      const data = await res.json();
      const random = data[Math.floor(Math.random() * data.length)];

      quoteEl.innerHTML = `"${random.message}"`;

      if (isAffirmationMode) {
        authorEl.textContent = "";
        authorProfileEl.textContent = "";
      } else {
        authorEl.textContent = `- ${random.author}`;
        authorProfileEl.textContent = random.authorProfile;
      }

      quoteEl.classList.add("quote-visible");
      authorEl.classList.add("quote-visible");
      authorProfileEl.classList.add("quote-visible");
    }, 100);
  } catch (err) {
    quoteEl.textContent = "문장을 불러오지 못했습니다.";
    authorEl.textContent = "";
    authorProfileEl.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("new-quote");
  button.addEventListener("click", fetchQuote);
  fetchQuote();
});

document.getElementById("modeSwitch").addEventListener("change", (e) => {
  isAffirmationMode = e.target.checked;

  // 모두 fade-out 처리
  quoteBtn.classList.remove("fade-in");
  quoteBtn.classList.add("fade-out");

  affirmationWrapper.classList.remove("fade-in");
  affirmationWrapper.classList.add("fade-out");

  // 0.2초 후 fade-in
  setTimeout(() => {
    if (isAffirmationMode) {
      affirmationWrapper.classList.remove("fade-out");
      affirmationWrapper.classList.add("fade-in");
      quoteBtn.classList.remove("fade-in");
    } else {
      quoteBtn.classList.remove("fade-out");
      quoteBtn.classList.add("fade-in");
      affirmationWrapper.classList.remove("fade-in");
    }
  }, 200);

  fetchQuote();
});

document.getElementById("affirmationSubmit").addEventListener("click", () => {
  const input = document.getElementById("affirmationInput").value.trim();
  if (input) {
    document.getElementById("quote").textContent = `"${input}"`;
    document.getElementById("author").textContent = "";
    document.getElementById("authorProfile").textContent = "";
    document.getElementById("quote").classList.add("quote-visible");
    document.getElementById("author").classList.add("quote-visible");
    document.getElementById("authorProfile").classList.add("quote-visible");
  }
});
