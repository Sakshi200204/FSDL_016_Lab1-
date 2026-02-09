document.getElementById("myForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (name && email && message) {
    document.getElementById("result").textContent =
      "Form submitted successfully!";
    
    // Clear form
    this.reset();
  }
});
