let isAffirmationMode = false;

document.getElementById("modeSwitch").addEventListener("change", (e) => {
  isAffirmationMode = e.target.checked;
  console.log("현재 모드:", isAffirmationMode ? "확언" : "동기부여");
});

document.addEventListener("DOMContentLoaded", () => {
  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");
  const authorProfileEl = document.getElementById("authorProfile");
  const button = document.getElementById("new-quote");
  const copyAlert = document.getElementById("copy-alert");

  async function fetchQuote() {
    try {
      quoteEl.classList.remove("quote-visible");
      authorEl.classList.remove("quote-visible");
      authorProfileEl.classList.remove("quote-visible");

      setTimeout(async () => {
        const res = await fetch("motivation_quotes.json");
        const data = await res.json();
        const random = data[Math.floor(Math.random() * data.length)];

        quoteEl.innerHTML = `"${random.message}"`;
        authorEl.textContent = `- ${random.author}`;
        authorProfileEl.textContent = random.authorProfile;

        quoteEl.classList.add("quote-visible");
        authorEl.classList.add("quote-visible");
        authorProfileEl.classList.add("quote-visible");
      }, 100);
    } catch (err) {
      quoteEl.textContent = "명언을 불러오지 못했습니다.";
      authorEl.textContent = "";
      authorProfileEl.textContent = "";
    }
  }

  button.addEventListener("click", fetchQuote);
  fetchQuote();
});
