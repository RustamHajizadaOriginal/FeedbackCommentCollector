// -- COUNTER COMPONENT ---
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const inputHandler = () => {
  //   console.log("test");
  // Determine max. number of characters
  const maxNrChars = 150;

  // determin number of characters currently typed
  const nrCharsTyped = textareaEl.value.length;

  // Calculate number of characters left (max. - currently typed)
  const charsLeft = maxNrChars - nrCharsTyped;
  // console.log(charsLeft);

  // Show number of characters left
  counterEl.textContent = charsLeft;
};

textareaEl.addEventListener("input", inputHandler);
