import "./styles.css";
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, sendEmailVerification,
  sendPasswordResetEmail, updateProfile, signOut, onAuthStateChanged
} from "firebase/auth";

const $ = (id) => document.getElementById(id);
let mode = "login";
let language = "en";
const translations = {
  en: { eyebrow:"ONE PLATFORM · MANY POSSIBILITIES", heroTitle:"Your digital world,<br><em>in one place.</em>", heroText:"A connected home for your community, learning, entertainment and creativity.", getStarted:"Get started", explore:"Explore platform ↓", secureLine:"Built with account security and privacy in mind", platformEyebrow:"THE PLATFORM", platformTitle:"A foundation that can grow.", platformText:"The first release establishes the secure account and platform foundation. Additional systems will be released in tested phases." },
  ne: { eyebrow:"एउटै प्लेटफर्म · अनेक सम्भावना", heroTitle:"तपाईंको डिजिटल संसार,<br><em>एउटै ठाउँमा।</em>", heroText:"समुदाय, शिक्षा, मनोरञ्जन र सिर्जनात्मक कामका लागि साझा डिजिटल स्थान।", getStarted:"सुरु गर्नुहोस्", explore:"प्लेटफर्म हेर्नुहोस् ↓", secureLine:"खाता सुरक्षा र गोपनीयतालाई ध्यानमा राखेर निर्माण गरिएको", platformEyebrow:"प्लेटफर्म", platformTitle:"विस्तार गर्न मिल्ने आधार।", platformText:"पहिलो संस्करणले सुरक्षित खाता र प्लेटफर्मको आधार तयार गर्छ। बाँकी प्रणाली परीक्षण गरिएका चरणमा थपिनेछन्।" }
};

function message(text, kind="info") {
  const el = $("authMessage");
  el.textContent = text;
  el.dataset.kind = kind;
}
function setMode(next) {
  mode = next;
  $("loginTab").classList.toggle("active", mode === "login");
  $("registerTab").classList.toggle("active", mode === "register");
  $("nameWrap").classList.toggle("hidden", mode !== "register");
  $("authSubmit").textContent = mode === "login" ? "Sign in" : "Create account";
  $("password").autocomplete = mode === "login" ? "current-password" : "new-password";
  $("resetBtn").classList.toggle("hidden", mode !== "login");
  message("");
}
$("loginTab").addEventListener("click", () => setMode("login"));
$("registerTab").addEventListener("click", () => setMode("register"));
$("getStarted").addEventListener("click", () => $("account").scrollIntoView({behavior:"smooth"}));
$("signInTop").addEventListener("click", () => $("account").scrollIntoView({behavior:"smooth"}));
$("authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = $("email").value.trim();
  const password = $("password").value;
  const name = $("fullName").value.trim();
  const submit = $("authSubmit");
  submit.disabled = true;
  try {
    if (mode === "register") {
      if (name.length < 2) throw new Error("Please enter your full name.");
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await sendEmailVerification(result.user);
      message("Account created. Please verify your email using the link we sent.", "success");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      message("Signed in successfully.", "success");
    }
  } catch (error) {
    message(readableError(error), "error");
  } finally { submit.disabled = false; }
});
$("googleBtn").addEventListener("click", async () => {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch (error) { message(readableError(error), "error"); }
});
$("resetBtn").addEventListener("click", async () => {
  const email = $("email").value.trim();
  if (!email) return message("Enter your email address first.", "error");
  try { await sendPasswordResetEmail(auth, email); message("If the account exists, a password reset email has been sent.", "success"); }
  catch (error) { message(readableError(error), "error"); }
});
$("verifyBtn").addEventListener("click", async () => {
  if (!auth.currentUser) return;
  try { await sendEmailVerification(auth.currentUser); $("verifyHint").textContent = "Verification email sent. Check your inbox."; }
  catch (error) { $("verifyHint").textContent = readableError(error); }
});
$("signOutBtn").addEventListener("click", () => signOut(auth));
function readableError(error) {
  const map = {
    "auth/email-already-in-use":"This email is already registered.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/weak-password":"Use a password with at least 8 characters.",
    "auth/invalid-credential":"Email or password is incorrect.",
    "auth/popup-closed-by-user":"Google sign-in was closed.",
    "auth/unauthorized-domain":"This domain is not authorized in Firebase Authentication."
  };
  return map[error.code] || "Something went wrong. Check your connection and Firebase setup, then try again.";
}
onAuthStateChanged(auth, async (user) => {
  $("dashboard").classList.toggle("hidden", !user);
  $("account").classList.toggle("hidden", !!user);
  if (!user) return;
  const token = await user.getIdTokenResult(true);
  const role = token.claims.role || "normal_user";
  $("welcomeName").textContent = `Welcome, ${user.displayName || "User"}`;
  $("accountEmail").textContent = user.email || "";
  $("accountRole").textContent = role.replaceAll("_"," ").replace(/\b\w/g, c => c.toUpperCase());
  $("emailStatus").textContent = user.emailVerified ? "Verified" : "Not verified";
  $("verifyHint").textContent = user.emailVerified ? "Your email address is verified." : "Verify your email to complete setup.";
  $("verifyBtn").classList.toggle("hidden", user.emailVerified);
});
$("themeBtn").addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  $("themeBtn").textContent = document.documentElement.classList.contains("light") ? "☾" : "☼";
});
$("languageBtn").addEventListener("click", () => {
  language = language === "en" ? "ne" : "en";
  $("languageBtn").textContent = language === "en" ? "नेपाली" : "English";
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[language][key]) el.innerHTML = translations[language][key];
  });
});
$("year").textContent = new Date().getFullYear();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
