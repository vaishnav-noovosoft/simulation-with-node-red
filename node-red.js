// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
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


// Initialize combined graph for voltage and temperature
const svg = document.getElementById("svg2");
const combinedGraphXPoints = 60;
const combinedGraph =  new Graph({svg, xPoints: combinedGraphXPoints, yPoints: 12, yLimit: 32});

// Define functions to create queries for fetching latest data points
const voltageQuery = (dataLimit) => query(voltageRef, orderByChild('timestamp'), limitToLast(dataLimit)); // fetch latest 'dataLimit' voltage readings
const temperatureQuery = (dataLimit) => query(temperatureRef, orderByChild('timestamp'), limitToLast(dataLimit)); // fetch latest 'dataLimit' temperature readings

// Buffers to store the latest data points
const combinedVoltageBuffer = []
const combinedTemperatureBuffer = []


// Listen for new voltage data points
onChildAdded(voltageQuery(combinedGraphXPoints), (snapshot) => {
    const dataPoint = snapshot.val();
    combinedVoltageBuffer.push(dataPoint);

    if(combinedVoltageBuffer.length > combinedGraphXPoints) {
        combinedVoltageBuffer.shift();
    }
    combinedGraph.plotVoltage(combinedVoltageBuffer);
})

// Listen for new temperature data points
onChildAdded(temperatureQuery(combinedGraphXPoints), (snapshot) => {
    const dataPoint = snapshot.val();
    combinedTemperatureBuffer.push(dataPoint);

    if(combinedTemperatureBuffer.length > combinedGraphXPoints) {
        combinedTemperatureBuffer.shift();
    }
    combinedGraph.plotTemperature(combinedTemperatureBuffer);
})

// Function to update and plot data on the graph
const updateGraph = (inputData = [], xPoints = 0, delayInSec = 30, graph = null, purpose = '') => {
    if(graph === null) return;

    const data = Object.entries(inputData);
    const entriesCanFit = xPoints * delayInSec;

    if(data.length >= entriesCanFit) {
        const newData = Object.entries(data);

        const dataToPlot = [];
        let points = [];
        newData.forEach((cur, index) => {
            points.push(cur[1][1]);

            if(points.length === delayInSec) {
                const average = points.reduce((sum, curEle) => sum + curEle, 0) / delayInSec;
                points = []
                dataToPlot.push(average);
            }
        });
        graph.plotOnX(dataToPlot, purpose);
    } else {
        if(data.length === 0)
            return;
        const average = data.reduce((sum, curEle) => sum + curEle[1], 0) / delayInSec;
        graph.plotPointOnX(average, purpose);
    }
}


// Set delay for updating voltage and temperature graphs
const delayInSec = 5;

// Initialize and set up voltage graph
const xVoltPoints = 20;
const yVoltPoints = 6;
const svgVoltage = document.getElementById("svg3");
const voltageGraph = new Graph({svg: svgVoltage, xPoints: xVoltPoints, yPoints: yVoltPoints, yLimit: 6});
let voltageData = [];

// Listen for new voltage data points
onChildAdded(voltageQuery(xVoltPoints * delayInSec), (data) => {
    voltageData.push(data.val());
});

// Periodically update voltage graph
setInterval(() => {
    updateGraph(voltageData, xVoltPoints, delayInSec, voltageGraph, 'volt');
    voltageData = [];
}, delayInSec * 1000);


// Initialize and set up temperature graph
const xTempPoints = 20;
const yTempPoints = 12;
const svgTemperature = document.getElementById("svg4");
const temperatureGraph = new Graph({svg: svgTemperature, xPoints: xTempPoints, yPoints: yTempPoints, yLimit: 32});
let temperatureData = [];

// Listen for new temperature data points
onChildAdded(temperatureQuery(xTempPoints * delayInSec), (data) => {
    temperatureData.push(data.val());
});

// Periodically update temperature graph
setInterval(() => {
    updateGraph(temperatureData, xTempPoints, delayInSec, temperatureGraph, 'temp');
    temperatureData = [];
}, delayInSec * 1000);

// Draw all graphs
combinedGraph.draw();
voltageGraph.draw();
temperatureGraph.draw();