document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addPointBtn = document.getElementById('add-point');
    const drawChartBtn = document.getElementById('draw-chart');
    const dataPointsContainer = document.getElementById('data-points');
    const resultsDiv = document.getElementById('results');
    const ctx = document.getElementById('myChart').getContext('2d');

    // Analysis Buttons
    const findEquationBtn = document.getElementById('find-equation');
    const calculateAreaBtn = document.getElementById('calculate-area');
    const calcMeanXBtn = document.getElementById('calc-mean-x');
    const calcMeanYBtn = document.getElementById('calc-mean-y');
    const calcMedianXBtn = document.getElementById('calc-median-x');
    const calcMedianYBtn = document.getElementById('calc-median-y');
    const calcStdDevXBtn = document.getElementById('calc-stddev-x');
    const calcStdDevYBtn = document.getElementById('calc-stddev-y');
    const calcCorrelationBtn = document.getElementById('calc-correlation');
    const calcRSquaredBtn = document.getElementById('calc-r-squared');

    let myChart;
    let currentData = [];

    // --- Data Input and Management ---

    function addPoint() {
        const pointDiv = document.createElement('div');
        pointDiv.classList.add('point');
        pointDiv.innerHTML = `
            <input type="number" class="x-input" placeholder="X Değeri">
            <input type="number" class="y-input" placeholder="Y Değeri">
            <button class="remove-point">X</button>
        `;
        dataPointsContainer.appendChild(pointDiv);
    }

    addPointBtn.addEventListener('click', addPoint);

    dataPointsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-point')) {
            if (dataPointsContainer.children.length > 1) {
                e.target.parentElement.remove();
            }
        }
    });

    // --- Chart Drawing ---

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

        data.sort((a, b) => a.x - b.x);
        currentData = data;

        if (myChart) myChart.destroy();

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
            options: { scales: { x: { type: 'linear', position: 'bottom' } } }
        });
    });

    // --- Statistical Helper Functions ---

    const getValues = (axis) => currentData.map(p => p[axis]);
    const getMean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const getMedian = (arr) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };
    const getStdDev = (arr) => {
        const mean = getMean(arr);
        const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    };

    // --- Analysis Event Listeners ---

    function runAnalysis(calculation, resultText) {
        if (currentData.length < 1) {
            resultsDiv.innerHTML = 'Analiz için en az 1 noktaya ihtiyaç var.';
            return;
        }
        const result = calculation();
        resultsDiv.innerHTML = `${resultText}: ${result.toFixed(3)}`;
    }

    calcMeanXBtn.addEventListener('click', () => runAnalysis(() => getMean(getValues('x')), 'X Değerlerinin Ortalaması'));
    calcMeanYBtn.addEventListener('click', () => runAnalysis(() => getMean(getValues('y')), 'Y Değerlerinin Ortalaması'));
    calcMedianXBtn.addEventListener('click', () => runAnalysis(() => getMedian(getValues('x')), 'X Değerlerinin Medyanı'));
    calcMedianYBtn.addEventListener('click', () => runAnalysis(() => getMedian(getValues('y')), 'Y Değerlerinin Medyanı'));
    calcStdDevXBtn.addEventListener('click', () => runAnalysis(() => getStdDev(getValues('x')), 'X Değerlerinin Std. Sapması'));
    calcStdDevYBtn.addEventListener('click', () => runAnalysis(() => getStdDev(getValues('y')), 'Y Değerlerinin Std. Sapması'));

    findEquationBtn.addEventListener('click', () => {
        if (currentData.length < 2) {
            resultsDiv.innerHTML = 'Denklem bulmak için en az 2 noktaya ihtiyaç var.';
            return;
        }
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        const n = currentData.length;
        currentData.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumX2 += p.x * p.x; });
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        resultsDiv.innerHTML = `Bulunan Doğru Denklemi: <br> y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
    });

    calculateAreaBtn.addEventListener('click', () => {
        if (currentData.length < 2) {
            resultsDiv.innerHTML = 'Alan hesaplamak için en az 2 noktaya ihtiyaç var.';
            return;
        }
        let area = 0;
        for (let i = 0; i < currentData.length - 1; i++) {
            const p1 = currentData[i], p2 = currentData[i + 1];
            area += (p2.x - p1.x) * (p1.y + p2.y) / 2;
        }
        resultsDiv.innerHTML = `Eğrinin Altında Kalan Yaklaşık Alan: ${area.toFixed(2)}`;
    });

    function getCorrelation() {
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        const n = currentData.length;
        currentData.forEach(p => {
            sumX += p.x; sumY += p.y; sumXY += p.x * p.y;
            sumX2 += p.x * p.x; sumY2 += p.y * p.y;
        });
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        return numerator / denominator;
    }

    calcCorrelationBtn.addEventListener('click', () => {
        if (currentData.length < 2) {
            resultsDiv.innerHTML = 'Korelasyon için en az 2 noktaya ihtiyaç var.';
            return;
        }
        runAnalysis(getCorrelation, 'Korelasyon Katsayısı (r)');
    });

    calcRSquaredBtn.addEventListener('click', () => {
        if (currentData.length < 2) {
            resultsDiv.innerHTML = 'R-Kare için en az 2 noktaya ihtiyaç var.';
            return;
        }
        const r = getCorrelation();
        runAnalysis(() => r * r, 'Belirlilik Katsayısı (R-kare)');
    });
});
