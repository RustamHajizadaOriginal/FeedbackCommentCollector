// ----_---GLOBAL CONSTANTS---_----
const MAX_CHARS = 300;
const BASE_API_URL = "https://bytegrad.com/course-assets/js/1/api";
// Get DOM elements
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");
const hashtagListEl = document.querySelector(".hashtags");

// Function to render feedback item
const renderFeedBackItem = (feedbackItem) => {
  const feedbackItemHTML = `
    <li class="feedback">
      <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${feedbackItem.upvoteCount}</span>
       </button>
      <section class="feedback__badge">
        <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
      </section>
      <div class="feedback__content">
        <p class="feedback__company">${feedbackItem.company}</p>
        <p class="feedback__text">${feedbackItem.text}</p>
       </div>
        <p class="feedback__date">${
          feedbackItem.daysAgo === 0 ? "New" : `${feedbackItem.daysAgo}d`
        }</p>
    </li>
 `;
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
};

// -- COUNTER COMPONENT ---
(() => {
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
})();

// -- FORM COMPONENT --
(() => {
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
    //  render feedback item in list
    const feedbackItem = {
      upvoteCount: upvoteCount,
      company: company,
      badgeLetter: badgeLetter,
      daysAgo: daysAgo,
      text: text,
    };
    // render feedback item
    renderFeedBackItem(feedbackItem);
    // send feedback item to server
    fetch(`${BASE_API_URL}/feedbacks`, {
      method: "POST",
      body: JSON.stringify(feedbackItem),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Something went wrong");
          return;
        }
        console.log("Succesfully sumbited");
      })
      .catch((error) => {
        console.log(error);
      });
    // clear textare
    textareaEl.value = "";
    // blur submit button
    submitBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
  };
  formEl.addEventListener("submit", submitHandler);
})();

// --- FEEDBACK LIST COMPONENT ----
(() => {
  const clickHandler = (event) => {
    // get clicked HTML -element
    const clickedEl = event.target;
    // determine if user intended to upvote or expand
    const upvoteIntentionEl = clickedEl.className.includes("upvote");
    // run the appropriate logic for each options
    if (upvoteIntentionEl) {
      // get the closest upvote button
      const upvoteBtnEl = clickedEl.closest(".upvote");
      // disable upvote button (prevent double-click or spam)
      upvoteBtnEl.disabled = true;
      // select the upvout count element within the upvote button
      const upvoteCountEl = upvoteBtnEl.querySelector(".upvote__count");
      // get currently displayed upvote counts as number (+)
      let upvoteCountTextContent = +upvoteCountEl.textContent;

      // increment by 1
      upvoteCountTextContent = upvoteCountTextContent + 1;

      // set updataded upvoteCountTextContent
      upvoteCountEl.textContent = upvoteCountTextContent;
    } else {
      // expand the clicked feedback item
      clickedEl.closest(".feedback").classList.toggle("feedback--expand");
    }
  };
  feedbackListEl.addEventListener("click", clickHandler);

  fetch(`${BASE_API_URL}/feedbacks`)
    .then((response) => response.json())
    .then((data) => {
      // remove spinner
      spinnerEl.remove();
      //  Iterate over each element in feedbacks array and render it in list
      data.feedbacks.forEach((feedbackItem) => {
        renderFeedBackItem(feedbackItem);
      });
    })
    .catch((error) => {
      feedbackListEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
    });
})();

// --- HASHTAG LIST COMPONENT ---
(() => {
  const clickHandler = (event) => {
    // get the clicked element
    const clickedEl = event.target;

    // stop function if click happened in list, but outside buttons
    if (clickedEl.className === "hashtags") return;
    //extract company name
    const companyNameFromHashtag = clickedEl.textContent
      .substring(1)
      .toLowerCase()
      .trim();

    // iterate over each feedback item in the list
    feedbackListEl.childNodes.forEach((childNode) => {
      // stop this iteration if it's a text node(empty)
      if (childNode.nodeType === 3) return;
      // extract company name
      const companyNameFromFeedbackItem = childNode
        .querySelector(".feedback__company")
        .textContent.toLowerCase()
        .trim();
      // remove feedback item from list if company names are not equal
      if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
        childNode.remove();
      }
    });
  };
  hashtagListEl.addEventListener("click", clickHandler);
})();
