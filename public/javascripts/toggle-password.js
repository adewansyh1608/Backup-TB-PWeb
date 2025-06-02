function toggleVisibility(inputId, img) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  img.src = isPassword ? "/images/hide.png" : "/images/view.png";
}

function validateForm(event) {
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm_password");

  if (!password || !confirm) return;

  if (password.value !== confirm.value) {
    alert("Password dan Konfirmasi Password tidak sama.");
    event.preventDefault();
  }
}
