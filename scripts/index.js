import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIwLKTs6oVcn44HiGH5MupYxBJSrKND9M",
  authDomain: "test-esp32-8e3be.firebaseapp.com",
  databaseURL: "https://test-esp32-8e3be-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-esp32-8e3be",
  storageBucket: "test-esp32-8e3be.firebasestorage.app",
  messagingSenderId: "62571711874",
  appId: "1:62571711874:web:5089d588bc7f265b6a139b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export auth for use in auth.js
export { auth };

// UI Elements
const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");
const timeElement = document.getElementById("time");
const humElement1 = document.getElementById("hum1");
const stateElement1 = document.getElementById("state1");
const btn1On = document.getElementById('btn1On');
const btn1Off = document.getElementById('btn1Off');
const humElement2 = document.getElementById("hum2");
const stateElement2 = document.getElementById("state2");
const btn2On = document.getElementById('btn2On');
const btn2Off = document.getElementById('btn2Off');

// Manage Login/Logout UI
const setupUI = (user) => {
  if (user) {
    // Toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display = 'block';
    userDetailsElement.style.display = 'block';
    userDetailsElement.innerHTML = user.email;

    // Database paths
    // const uid = user.uid;
    const uid = '20:E7:C8:59:6B:9C'
    const dbPathTemp = `devices/${uid}/timestamp`;
    const dbPathHum1 = `devices/${uid}/humidity1`;
    const dbPathMotorState1 = `devices/${uid}/motor1`;
    const dbPathHum2 = `devices/${uid}/humidity2`;
    const dbPathMotorState2 = `devices/${uid}/motor2`;

    // Database references
    const dbRefTime = ref(database, dbPathTemp);
    const dbRefHum1 = ref(database, dbPathHum1);
    const dbRefMotorState1 = ref(database, dbPathMotorState1);
    const dbRefHum2 = ref(database, dbPathHum2);
    const dbRefMotorState2 = ref(database, dbPathMotorState2);

    // Update page with new readings
    onValue(dbRefTime, (snap) => {
      let timeReading = snap.val();
      let date = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Vienna",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(new Date(timeReading * 1000));
      timeElement.innerText = date ?? "N/A";
    });

    onValue(dbRefHum1, (snap) => {
      humElement1.innerText = snap.val()?.toFixed(2) ?? "N/A";
    });

    onValue(dbRefMotorState1, (snap) => {
      stateElement1.textContent = snap.val() === true ? "ON" : "OFF";
    });

    onValue(dbRefHum2, (snap) => {
      humElement2.innerText = snap.val()?.toFixed(2) ?? "N/A";
    });

    onValue(dbRefMotorState2, (snap) => {
      stateElement2.textContent = snap.val() === true ? "ON" : "OFF";
    });

    btn1On.addEventListener('click', () => set(dbRefMotorState1, true));
    btn1Off.addEventListener('click', () => set(dbRefMotorState1, false));
    btn2On.addEventListener('click', () => set(dbRefMotorState2, true));
    btn2Off.addEventListener('click', () => set(dbRefMotorState2, false));
  } else {
    // Toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display = 'none';
    userDetailsElement.style.display = 'none';
    contentElement.style.display = 'none';
  }
};

// Expose setupUI to global scope for auth.js
window.setupUI = setupUI;