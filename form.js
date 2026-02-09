// ===== ELEMENTS =====
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const status = document.getElementById("status");

const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const subjectField = document.getElementById("subject");
const messageField = document.getElementById("message");
const termsCheckbox = document.getElementById("terms");
const charCount = document.getElementById("charCount");

// ===== SETS =====
const invalidFields = new Set();
const touchedFields = new Set();

const blockedEmailDomains = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "fakeinbox.com"
]);

// ===== EVENTS =====
[nameField, emailField, phoneField, messageField].forEach(field => {
  field.addEventListener("input", handleLiveValidation);
  field.addEventListener("focus", highlight);
  field.addEventListener("blur", unhighlight);
});

subjectField.addEventListener("change", handleLiveValidation);
termsCheckbox.addEventListener("change", handleLiveValidation);
messageField.addEventListener("input", updateCharCount);

form.addEventListener("submit", handleSubmit);
form.addEventListener("reset", handleReset);
window.addEventListener("keydown", detectCapsLock);

// ===== HANDLERS =====
function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  if (!validateForm()) return;

  status.style.color = "#ffd86b";
  status.textContent = "Form submitted successfully ✔️";
  form.reset();
  invalidFields.clear();
  touchedFields.clear();
  submitBtn.disabled = true;
  updateCharCount();
}

function handleReset() {
  clearErrors();
  invalidFields.clear();
  touchedFields.clear();
  status.textContent = "Form reset";
  status.style.color = "#ccc";
  submitBtn.disabled = true;
  updateCharCount();
}

function handleLiveValidation(e) {
  touchedFields.add(e.target.id);
  validateForm(false);
  toggleSubmit();
}

// ===== VALIDATION =====
function validateForm(showStatus = true) {
  invalidFields.clear();

  validateName();
  validateEmail();
  validatePhone();
  validateSubject();
  validateMessage();
  validateTerms();

  if (invalidFields.size > 0) {
    if (showStatus) showFirstError();
    return false;
  }
  return true;
}

function validateName() {
  if (!/^[a-zA-Z\s]{3,}$/.test(nameField.value.trim())) {
    invalidate(nameField, "Invalid name");
  }
}

function validateEmail() {
  const email = emailField.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    invalidate(emailField, "Invalid email");
    return;
  }
  const domain = email.split("@")[1];
  if (blockedEmailDomains.has(domain)) {
    invalidate(emailField, "Disposable email not allowed");
  }
}

function validatePhone() {
  if (!/^[0-9]{10}$/.test(phoneField.value)) {
    invalidate(phoneField, "Phone must be 10 digits");
  }
}

function validateSubject() {
  if (!subjectField.value) {
    invalidate(subjectField, "Select a subject");
  }
}

function validateMessage() {
  if (messageField.value.length < 5) {
    invalidate(messageField, "Message too short");
  }
}

function validateTerms() {
  if (!termsCheckbox.checked) {
    invalidate(termsCheckbox, "Accept terms");
  }
}

// ===== SET HELPERS =====
function invalidate(field, message) {
  invalidFields.add({ field, message });
  field.parentElement?.classList.add("invalid");
}

function showFirstError() {
  const first = [...invalidFields][0];
  status.textContent = first.message;
  status.style.color = "#ffb3b3";
}

function toggleSubmit() {
  submitBtn.disabled = invalidFields.size > 0;
}

// ===== UTILITIES =====
function updateCharCount() {
  charCount.textContent = `${messageField.value.length} / 500`;
}

function detectCapsLock(e) {
  if (e.getModifierState && e.getModifierState("CapsLock")) {
    status.textContent = "Caps Lock is ON";
    status.style.color = "#ffb3b3";
  }
}

function highlight(e) {
  e.target.style.borderColor = "#ffd86b";
}

function unhighlight(e) {
  e.target.style.borderColor = "";
}

function clearErrors() {
  document
    .querySelectorAll(".input-group")
    .forEach(g => g.classList.remove("invalid"));
  status.textContent = "";
}
