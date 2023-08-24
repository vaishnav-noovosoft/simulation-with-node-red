// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, onValue, onChildAdded } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
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
const graph =  new Graph({svg, xPoints: 60, yPoints: 12, yLimit: 32});
onValue(voltageRef, (snapshot) => {
   const data = snapshot.val();
   graph.plotVoltage(data);
});

onValue(temperatureRef, (snapshot) => {
   const data = snapshot.val();
   graph.plotTemperature(data);
});




const xPoints = 20;
const yPoints = 6;
const svgVoltage = document.getElementById("svg3");
const graph2 = new Graph({svg: svgVoltage, xPoints, yPoints, yLimit: 6});
const delayInSec = 5;
let voltageData = []
onChildAdded(voltageRef, (data) => {
    voltageData.push(data.val());
});

setInterval(() => {
    const data = Object.entries(voltageData);
    const entriesCanFit = xPoints * delayInSec;

    if(data.length >= entriesCanFit) {
        const newData = Object.entries(data).slice(-entriesCanFit);

        const dataToPlot = []
        let points = []
        newData.forEach((cur, index) => {
            points.push(cur[1][1]);

            if(points.length === delayInSec) {
                const average = points.reduce((sum, curEle) => sum + curEle, 0) / delayInSec;
                points = []
                dataToPlot.push(average);
            }
        });

        graph2.plotOnX(dataToPlot);
    } else {
        const average = data.reduce((sum, curEle) => sum + curEle[1], 0) / delayInSec;
        graph2.plotPointOnX(average);
    }
    voltageData = []
}, delayInSec * 1000);


const xTempPoints = 20;
const yTempPoints = 12;
const svgTemperature = document.getElementById("svg4");
const graph3 = new Graph({svg: svgTemperature, xTempPoints, yTempPoints, yLimit: 32});
let tempData = []
onChildAdded(temperatureRef, (data) => {
    tempData.push(data.val());
});

graph.draw();
graph2.draw();
// graph3.draw();