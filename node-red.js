// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwv7iqHYRSmlfD3I4PGiaRkr5AqTft-Nk",
    authDomain: "nodered-exercise.firebaseapp.com",
    databaseURL: "https://nodered-exercise-default-rtdb.firebaseio.com",
    projectId: "nodered-exercise",
    storageBucket: "nodered-exercise.appspot.com",
    messagingSenderId: "746370713464",
    appId: "1:746370713464:web:79288227d87a6cbfbd2a8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const voltageRef = ref(db, 'voltage');
const temperatureRef = ref(db, 'temperature');

const svg = document.getElementById("svg2");
const graph =  new Graph({svg});
onValue(voltageRef, (snapshot) => {
   const data = snapshot.val();
    // console.log(data)

   graph.plotVoltage(data);
});

onValue(temperatureRef, (snapshot) => {
   const data = snapshot.val();
    // console.log(data)
   graph.plotTemperature(data);
});

graph.draw();