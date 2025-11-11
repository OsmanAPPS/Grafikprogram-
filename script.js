document.addEventListener('DOMContentLoaded', () => {
    const addPointBtn = document.getElementById('add-point');
    const drawChartBtn = document.getElementById('draw-chart');
    const dataPointsContainer = document.getElementById('data-points');
    const resultsDiv = document.getElementById('results');
    const findEquationBtn = document.getElementById('find-equation');
    const calculateAreaBtn = document.getElementById('calculate-area');
    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart;
    let currentData = [];

    // Add a new point input pair
    addPointBtn.addEventListener('click', () => {
        const pointDiv = document.createElement('div');
        pointDiv.classList.add('point');
        pointDiv.innerHTML = `
            <input type="number" class="x-input" placeholder="X Değeri">
            <input type="number" class="y-input" placeholder="Y Değeri">
        `;
        dataPointsContainer.appendChild(pointDiv);
    });

    // Draw the chart based on input data
    drawChartBtn.addEventListener('click', () => {
        const xInputs = document.querySelectorAll('.x-input');
        const yInputs = document.querySelectorAll('.y-input');
        const data = [];

        for (let i = 0; i < xInputs.length; i++) {
            const x = parseFloat(xInputs[i].value);
            const y = parseFloat(yInputs[i].value);
            if (!isNaN(x) && !isNaN(y)) {
                data.push({ x, y });
            }
        }

        // Sort data based on x values for a proper line chart and calculations
        data.sort((a, b) => a.x - b.x);
        currentData = data;

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Veri Grafiği',
                    data: currentData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        });
    });

    // Find the equation of the line of best fit (linear regression)
    findEquationBtn.addEventListener('click', () => {
        if (currentData.length < 2) {
            resultsDiv.innerHTML = 'Denklem bulmak için en az 2 noktaya ihtiyaç var.';
            return;
        }

        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        const n = currentData.length;

        currentData.forEach(point => {
            sumX += point.x;
            sumY += point.y;
            sumXY += point.x * point.y;
            sumX2 += point.x * point.x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        resultsDiv.innerHTML = `Bulunan Doğru Denklemi: <br> y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
    });

    // Calculate the area under the curve using the trapezoidal rule
    calculateAreaBtn.addEventListener('click', () => {
        if (currentData.length < 2) {
            resultsDiv.innerHTML = 'Alan hesaplamak için en az 2 noktaya ihtiyaç var.';
            return;
        }

        let area = 0;
        for (let i = 0; i < currentData.length - 1; i++) {
            const p1 = currentData[i];
            const p2 = currentData[i + 1];
            const width = p2.x - p1.x;
            const avgHeight = (p1.y + p2.y) / 2;
            area += width * avgHeight;
        }

        resultsDiv.innerHTML = `Eğrinin Altında Kalan Yaklaşık Alan: ${area.toFixed(2)}`;
    });
});
