// ----_---GLOBAL CONSTANTS---_----
const MAX_CHARS = 150;
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");

// -- COUNTER COMPONENT ---
const inputHandler = () => {
  //   console.log("test");
  // Determine max. number of characters
  const maxNrChars = MAX_CHARS;

  // determin number of characters currently typed
  const nrCharsTyped = textareaEl.value.length;

  // Calculate number of characters left (max. - currently typed)
  const charsLeft = maxNrChars - nrCharsTyped;
  // console.log(charsLeft);

  // Show number of characters left
  counterEl.textContent = charsLeft;
};
textareaEl.addEventListener("input", inputHandler);

// -- FORM COMPONENT --
const showVisualIndicator = (textCheck) => {
  const className = textCheck === "valid" ? "form--valid" : "form--invalid";

  // show valid indicator
  formEl.classList.add(className);
  setTimeout(() => {
    // removed valid indicator
    formEl.classList.remove(className);
  }, 3000);
};
const submitHandler = (event) => {
  // prevent default browser action(submiting form data to 'action' - address and refreshing page)
  event.preventDefault();
  // console.log(1);

  // Get text from textarea
  const text = textareaEl.value;
  // console.log(text);
  // validation text (e.g.check if #hashtag is present and text is long enough)
  if (text.includes("#") && text.length >= 6) {
    showVisualIndicator("valid");
  } else {
    showVisualIndicator("invalid");

    // focus textarea
    textareaEl.focus();
    // stop this function execution
    return;
  }
  // We have text, now extract other info from the text.
  const hashtag = text.split(" ").find((word) => word.includes("#"));
  // console.log(text.split(" ").find((word) => word.includes("#")));
  const company = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;

  // New feedback ite, HTML
  const feedbackItemHTML = `
      <li class="feedback">
        <button class="upvote">
          <i class="fa-solid fa-caret-up upvote__icon"></i>
          <span class="upvote__count">${upvoteCount}</span>
         </button>
        <section class="feedback__badge">
          <p class="feedback__letter">${badgeLetter}</p>
        </section>
        <div class="feedback__content">
          <p class="feedback__company">${company}</p>
          <p class="feedback__text">${text}</p>
         </div>
          <p class="feedback__date">${daysAgo === 0 ? "New" : `${daysAgo}d`}</p>
      </li>
   `;

  // insert new feedback item in list
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
  // clear textare
  textareaEl.value = "";
  // blur submit button
  submitBtnEl.blur();
  // reset counter
  counterEl.textContent = MAX_CHARS;
};
formEl.addEventListener("submit", submitHandler);

// --- FEEDBACK LIST COMPONENT ----
fetch("https://bytegrad.com/course-assets/js/1/api/feedbacks")
  .then((response) => response.json())
  .then((data) => {
    // remove spinner
    spinnerEl.remove();
    //  Iterate over each element in feedbacks array and render it in list
    data.feedbacks.forEach((feedbackItem) => {
      // New feedback ite, HTML
      const feedbackItemHTML = `
  <li class="feedback">
    <button class="upvote">
      <i class="fa-solid fa-caret-up upvote__icon"></i>
      <span class="upvote__count">${data.feedbacks[7].upvoteCount}</span>
     </button>
    <section class="feedback__badge">
      <p class="feedback__letter">${data.feedbacks[7].badgeLetter}</p>
    </section>
    <div class="feedback__content">
      <p class="feedback__company">${data.feedbacks[7].company}</p>
      <p class="feedback__text">${data.feedbacks[7].text}</p>
     </div>
      <p class="feedback__date">${
        data.feedbacks[7].daysAgo === 0
          ? "New"
          : `${data.feedbacks[7].daysAgo}d`
      }</p>
  </li>
`;
      feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
    });
  });
