const apiKey = 'ac20a9fb78351c059556cc0609c9c9ec';
const city = 'Dar Es Salaam';

function updateWeather() {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      const { temp } = response.data.main;
      const weatherDesc = response.data.weather[0].description;

      document.getElementById('temperature').innerText = `${temp.toFixed(1)} °C`;
      document.getElementById('weather').innerText = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
    })
    .catch(error => {
      console.error('Weather API error:', error.message);
      document.getElementById('temperature').innerText = 'Unavailable';
      document.getElementById('weather').innerText = 'Unavailable';
    });
}

updateWeather();
setInterval(updateWeather, 600000); // every 10 minutes

//Fuel Sale Logic
const fuelPricePerLitre = 2569.04;
let fuelReserve = 10000; // Initial reserve

// DOM elements
const totalSalesEl = document.getElementById('total-sales');
const totalCashEl = document.getElementById('total-cash');
const reserveEl = document.getElementById('fuel-reserved');
const customerTable = document.getElementById('customer-table');

let totalSales = 0;
let totalCash = 0;

// Initialize summary display
function initDashboard() {
  totalSalesEl.innerText = totalSales;
  totalCashEl.innerText = totalCash.toFixed(2);
  reserveEl.innerText = fuelReserve.toFixed(2);
}
initDashboard();

// Sale logging
function logFuelSale(customerName, litres) {
  if (!customerName || litres <= 0) return alert('Enter valid name and litres');

  const now = new Date().toLocaleString();
  const amount = (litres * fuelPricePerLitre).toFixed(2);

  const newRow = customerTable.insertRow();
  newRow.innerHTML = `
    <td>${customerName}</td>
    <td>${litres}</td>
    <td>${amount} TSh</td>
    <td>${now}</td>
  `;

  // Update dashboard stats
  totalSales++;
  totalCash += parseFloat(amount);
  fuelReserve -= litres;

  totalSalesEl.innerText = totalSales;
  totalCashEl.innerText = totalCash.toFixed(2);
  reserveEl.innerText = fuelReserve.toFixed(2);

  updateChart(litres);
}

//Chart.js Setup
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sales (Litres)',
      data: [],
      borderColor: '#00c6ff',
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function updateChart(litres) {
  const now = new Date().toLocaleTimeString();
  salesChart.data.labels.push(now);
  salesChart.data.datasets[0].data.push(litres);
  salesChart.update();
}

//Form Submission
document.getElementById('fuel-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const litres = parseFloat(document.getElementById('litres').value);
  logFuelSale(name, litres);

  this.reset();
});

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiD0sbm0RkH-pPESFUirkxL9JUC4qaE5o",
  authDomain: "fuel-station-management-f33d9.firebaseapp.com",
  databaseURL: "https://fuel-station-management-f33d9-default-rtdb.firebaseio.com",
  projectId: "fuel-station-management-f33d9",
  storageBucket: "fuel-station-management-f33d9.firebasestorage.app",
  messagingSenderId: "922667303860",
  appId: "1:922667303860:web:1ed4dc5d33685071ed68e1",
  measurementId: "G-7NT4775H41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



npm install firebase

*/