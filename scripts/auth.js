import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit-btn");
const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");
const statusText = document.getElementById("status");

let isLogin = true;

// Switch between login and signup
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  submitBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleLink.textContent = isLogin ? "Sign up" : "Login";
});

// Handle login or signup
submitBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
      statusText.textContent = "✅ Logged in successfully!";
      statusText.style.color = "#10b981";
      // Redirect to dashboard
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
      statusText.textContent = "🎉 Account created!";
      statusText.style.color = "#10b981";
    }
  } catch (error) {
    statusText.textContent = error.message;
    statusText.style.color = "#ef4444";
  }
});
