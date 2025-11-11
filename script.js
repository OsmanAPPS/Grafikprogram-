document.addEventListener('DOMContentLoaded', () => {
    // --- Common DOM Elements ---
    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart;

    // --- 2D Plotting ---
    const datasetContainer = document.getElementById('dataset-container');
    const addDatasetBtn = document.getElementById('add-dataset');
    const drawChartBtn = document.getElementById('draw-chart');
    const resultsDiv = document.getElementById('results');
    const datasetSelector = document.getElementById('dataset-selector');
    let datasetCount = 1;
    let chartData = []; // To hold data for analysis

    const COLORS = [
        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'
    ];

    function addNewDataset() {
        datasetCount++;
        const datasetDiv = document.createElement('div');
        datasetDiv.classList.add('dataset');
        datasetDiv.innerHTML = `
            <div class="dataset-header">
                <h3>Veri Seti ${datasetCount}</h3>
                <button class="remove-dataset">X</button>
            </div>
            <div class="data-points">
                <div class="point">
                    <input type="number" class="x-input" placeholder="X Değeri">
                    <input type="number" class="y-input" placeholder="Y Değeri">
                    <button class="remove-point">X</button>
                </div>
            </div>
            <button class="add-point">Nokta Ekle</button>
            <div class="file-upload-container">
                <label for="file-upload-${datasetCount}">TXT'den Yükle:</label>
                <input type="file" class="file-upload" id="file-upload-${datasetCount}" accept=".txt">
            </div>
        `;
        datasetContainer.appendChild(datasetDiv);
    }

    addDatasetBtn.addEventListener('click', addNewDataset);

    datasetContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('file-upload')) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target.result;
                    const pointsContainer = e.target.closest('.dataset').querySelector('.data-points');
                    pointsContainer.innerHTML = ''; // Clear existing points
                    const lines = content.split('\n').filter(line => line.trim() !== '');
                    lines.forEach((line, index) => {
                        const [x, y] = line.split(/[,;\\s]+/).map(Number);
                        if (!isNaN(x) && !isNaN(y)) {
                            const pointDiv = document.createElement('div');
                            pointDiv.classList.add('point');
                            pointDiv.innerHTML = `
                                <input type="number" class="x-input" placeholder="X Değeri" value="${x}">
                                <input type="number" class="y-input" placeholder="Y Değeri" value="${y}">
                                <button class="remove-point">X</button>
                            `;
                            pointsContainer.appendChild(pointDiv);
                        }
                    });
                };
                reader.readAsText(file);
            }
        }
    });

    datasetContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-point')) {
            const pointsContainer = e.target.previousElementSibling;
            const pointDiv = document.createElement('div');
            pointDiv.classList.add('point');
            pointDiv.innerHTML = `
                <input type="number" class="x-input" placeholder="X Değeri">
                <input type="number" class="y-input" placeholder="Y Değeri">
                <button class="remove-point">X</button>
            `;
            pointsContainer.appendChild(pointDiv);
        }
        if (e.target.classList.contains('remove-point')) {
            const pointsContainer = e.target.closest('.data-points');
            if (pointsContainer.children.length > 1) {
                e.target.parentElement.remove();
            }
        }
        if (e.target.classList.contains('remove-dataset')) {
            if (datasetContainer.children.length > 1) {
                e.target.closest('.dataset').remove();
            }
        }
    });

    drawChartBtn.addEventListener('click', () => {
        const datasets = document.querySelectorAll('.dataset');
        const chartDatasets = [];
        chartData = [];
        datasetSelector.innerHTML = ''; // Clear previous options
        const selector1 = document.getElementById('dataset-selector-1');
        const selector2 = document.getElementById('dataset-selector-2');
        selector1.innerHTML = '';
        selector2.innerHTML = '';


        datasets.forEach((dataset, index) => {
            const xInputs = dataset.querySelectorAll('.x-input');
            const yInputs = dataset.querySelectorAll('.y-input');
            const data = [];

            for (let i = 0; i < xInputs.length; i++) {
                const x = parseFloat(xInputs[i].value);
                const y = parseFloat(yInputs[i].value);
                if (!isNaN(x) && !isNaN(y)) {
                    data.push({ x, y });
                }
            }
            data.sort((a, b) => a.x - b.x);
            chartData.push(data);

            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Veri Seti ${index + 1}`;
            datasetSelector.appendChild(option);

            // Also populate the selectors for area calculation
            const option1 = document.createElement('option');
            option1.value = index;
            option1.textContent = `Veri Seti ${index + 1}`;
            selector1.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = index;
            option2.textContent = `Veri Seti ${index + 1}`;
            selector2.appendChild(option2);

            chartDatasets.push({
                label: `Veri Seti ${index + 1}`,
                data: data,
                borderColor: COLORS[index % COLORS.length],
                fill: false,
                tension: 0.1
            });
        });

        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'line',
            data: { datasets: chartDatasets },
            options: { scales: { x: { type: 'linear', position: 'bottom' } } }
        });
    });

    // --- 2D Analysis Logic ---
    function getSelectedDataset() {
        const selectedIndex = parseInt(datasetSelector.value, 10);
        return chartData[selectedIndex];
    }

    // ... (rest of the file is the same, including all 3D logic and analysis)
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

    const getValues = (data, axis) => data.map(p => p[axis]);
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

    function run2DAnalysis(calculation, resultText) {
        const data = getSelectedDataset();
        if (!data || data.length < 1) {
            resultsDiv.innerHTML = 'Analiz için geçerli bir veri seti seçin.';
            return;
        }
        const result = calculation(data);
        resultsDiv.innerHTML = `${resultText}: ${result.toFixed(3)}`;
    }

    calcMeanXBtn.addEventListener('click', () => run2DAnalysis((data) => getMean(getValues(data, 'x')), 'X Ortalaması'));
    calcMeanYBtn.addEventListener('click', () => run2DAnalysis((data) => getMean(getValues(data, 'y')), 'Y Ortalaması'));
    calcMedianXBtn.addEventListener('click', () => run2DAnalysis((data) => getMedian(getValues(data, 'x')), 'X Medyanı'));
    calcMedianYBtn.addEventListener('click', () => run2DAnalysis((data) => getMedian(getValues(data, 'y')), 'Y Medyanı'));
    calcStdDevXBtn.addEventListener('click', () => run2DAnalysis((data) => getStdDev(getValues(data, 'x')), 'X Std. Sapma'));
    calcStdDevYBtn.addEventListener('click', () => run2DAnalysis((data) => getStdDev(getValues(data, 'y')), 'Y Std. Sapma'));

    findEquationBtn.addEventListener('click', () => {
        const data = getSelectedDataset();
        if (!data || data.length < 2) {
            resultsDiv.innerHTML = 'Denklem bulmak için en az 2 noktalı bir veri seti seçin.';
            return;
        }
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        const n = data.length;
        data.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumX2 += p.x * p.x; });
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        resultsDiv.innerHTML = `Bulunan Doğru Denklemi: <br> y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
    });

    calculateAreaBtn.addEventListener('click', () => {
        const data = getSelectedDataset();
         if (!data || data.length < 2) {
            resultsDiv.innerHTML = 'Alan hesaplamak için en az 2 noktalı bir veri seti seçin.';
            return;
        }
        let area = 0;
        for (let i = 0; i < data.length - 1; i++) {
            const p1 = data[i], p2 = data[i + 1];
            area += (p2.x - p1.x) * (p1.y + p2.y) / 2;
        }
        resultsDiv.innerHTML = `Eğrinin Altında Kalan Yaklaşık Alan: ${area.toFixed(2)}`;
    });

    function getCorrelation(data) {
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        const n = data.length;
        data.forEach(p => {
            sumX += p.x; sumY += p.y; sumXY += p.x * p.y;
            sumX2 += p.x * p.x; sumY2 += p.y * p.y;
        });
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        return numerator / denominator;
    }

    calcCorrelationBtn.addEventListener('click', () => run2DAnalysis(getCorrelation, 'Korelasyon Katsayısı (r)'));

    calcRSquaredBtn.addEventListener('click', () => {
        const data = getSelectedDataset();
        if (!data || data.length < 2) {
            resultsDiv.innerHTML = 'R-Kare için en az 2 noktalı bir veri seti seçin.';
            return;
        }
        const r = getCorrelation(data);
        resultsDiv.innerHTML = `Belirlilik Katsayısı (R-kare): ${(r*r).toFixed(3)}`;
    });

    document.getElementById('calculate-area-between').addEventListener('click', () => {
        const selector1 = document.getElementById('dataset-selector-1');
        const selector2 = document.getElementById('dataset-selector-2');
        const index1 = parseInt(selector1.value, 10);
        const index2 = parseInt(selector2.value, 10);

        if (isNaN(index1) || isNaN(index2)) {
            resultsDiv.innerHTML = 'Lütfen alan hesaplaması için iki veri seti seçin.';
            return;
        }
        if (index1 === index2) {
            resultsDiv.innerHTML = 'Lütfen iki farklı veri seti seçin.';
            return;
        }

        const data1 = chartData[index1];
        const data2 = chartData[index2];

        if (!data1 || data1.length < 2 || !data2 || data2.length < 2) {
            resultsDiv.innerHTML = 'Seçilen veri setlerinden en az birinde yeterli nokta (en az 2) yok.';
            return;
        }

        // Helper function for linear interpolation
        const interpolate = (data, x) => {
            for (let i = 0; i < data.length - 1; i++) {
                if (data[i].x <= x && data[i+1].x >= x) {
                    const x1 = data[i].x, y1 = data[i].y;
                    const x2 = data[i+1].x, y2 = data[i+1].y;
                    if (x2 - x1 === 0) return y1; // Avoid division by zero
                    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
                }
            }
            return null; // x is out of range
        };

        const allX = [...new Set([...data1.map(p => p.x), ...data2.map(p => p.x)])].sort((a, b) => a - b);
        let totalArea = 0;

        for (let i = 0; i < allX.length - 1; i++) {
            const x_start = allX[i];
            const x_end = allX[i+1];
            const mid_x = (x_start + x_end) / 2;

            const y1_start = interpolate(data1, x_start);
            const y2_start = interpolate(data2, x_start);
            const y1_end = interpolate(data1, x_end);
            const y2_end = interpolate(data2, x_end);

            // Check if the interval is valid for both datasets
            if (y1_start !== null && y2_start !== null && y1_end !== null && y2_end !== null) {
                const height_diff_start = Math.abs(y1_start - y2_start);
                const height_diff_end = Math.abs(y1_end - y2_end);
                const segment_area = ((height_diff_start + height_diff_end) / 2) * (x_end - x_start);
                totalArea += segment_area;
            }
        }

        resultsDiv.innerHTML = `İki Eğri Arasında Kalan Yaklaşık Alan: ${totalArea.toFixed(2)}`;
    });

    // --- 3D Plotting Logic ---
    const draw3dChartBtn = document.getElementById('draw-3d-chart');
    const eqInput = document.getElementById('eq-input');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const yMinInput = document.getElementById('y-min');
    const yMaxInput = document.getElementById('y-max');
    const results3dDiv = document.getElementById('results-3d');
    let zData = [];

    draw3dChartBtn.addEventListener('click', () => {
        try {
            const expr = eqInput.value;
            if (!expr) {
                results3dDiv.innerHTML = 'Lütfen bir denklem girin.';
                return;
            }
            const node = math.parse(expr);
            const code = node.compile();
            const xMin = parseFloat(xMinInput.value), xMax = parseFloat(xMaxInput.value);
            const yMin = parseFloat(yMinInput.value), yMax = parseFloat(yMaxInput.value);
            const steps = 50;
            const xStep = (xMax - xMin) / steps, yStep = (yMax - yMin) / steps;
            const xValues = Array.from({length: steps + 1}, (_, i) => xMin + i * xStep);
            const yValues = Array.from({length: steps + 1}, (_, i) => yMin + i * yStep);
            zData = yValues.map(y => xValues.map(x => code.evaluate({x, y})));

            const data = [{ z: zData, x: xValues, y: yValues, type: 'surface' }];
            const layout = {
                title: `z = ${expr}`,
                autosize: true,
                margin: { l: 65, r: 50, b: 65, t: 90 }
            };
            Plotly.newPlot('my3dChart', data, layout);
            results3dDiv.innerHTML = 'Grafik başarıyla çizildi.';
        } catch (error) {
            results3dDiv.innerHTML = `Hata: ${error.message}`;
        }
    });

    // --- 3D Analysis Logic ---
    function run3dAnalysis(calculation, resultText) {
        if (zData.length === 0) {
            results3dDiv.innerHTML = 'Lütfen önce bir 3D grafik çizin.';
            return;
        }
        try {
            const result = calculation();
            results3dDiv.innerHTML = `${resultText}: ${result}`;
        } catch (error) {
            results3dDiv.innerHTML = `Hesaplama hatası: ${error.message}`;
        }
    }

    document.getElementById('calc-max-z').addEventListener('click', () => run3dAnalysis(() => Math.max(...zData.flat()).toFixed(3), 'Maksimum Değer (Tepe)'));
    document.getElementById('calc-min-z').addEventListener('click', () => run3dAnalysis(() => Math.min(...zData.flat()).toFixed(3), 'Minimum Değer (Çukur)'));
    document.getElementById('calc-mean-z').addEventListener('click', () => {
        run3dAnalysis(() => {
            const flatZ = zData.flat();
            return (flatZ.reduce((a, b) => a + b, 0) / flatZ.length).toFixed(3);
        }, 'Ortalama Yükseklik');
    });
     document.getElementById('calc-height-diff').addEventListener('click', () => {
        run3dAnalysis(() => {
            const flatZ = zData.flat();
            return (Math.max(...flatZ) - Math.min(...flatZ)).toFixed(3);
        }, 'Toplam Yükseklik Farkı');
    });
     document.getElementById('calc-peak-coords').addEventListener('click', () => {
        run3dAnalysis(() => {
            const maxZ = Math.max(...zData.flat());
            for (let j = 0; j < zData.length; j++) {
                for (let i = 0; i < zData[j].length; i++) {
                    if (zData[j][i] === maxZ) {
                        const x = parseFloat(xMinInput.value) + i * ((parseFloat(xMaxInput.value) - parseFloat(xMinInput.value)) / 50);
                        const y = parseFloat(yMinInput.value) + j * ((parseFloat(yMaxInput.value) - parseFloat(yMinInput.value)) / 50);
                        return `(x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${maxZ.toFixed(2)})`;
                    }
                }
            }
        }, 'Tepe Noktası Koordinatları');
    });
     document.getElementById('calc-trough-coords').addEventListener('click', () => {
        run3dAnalysis(() => {
            const minZ = Math.min(...zData.flat());
            for (let j = 0; j < zData.length; j++) {
                for (let i = 0; i < zData[j].length; i++) {
                    if (zData[j][i] === minZ) {
                        const x = parseFloat(xMinInput.value) + i * ((parseFloat(xMaxInput.value) - parseFloat(xMinInput.value)) / 50);
                        const y = parseFloat(yMinInput.value) + j * ((parseFloat(yMaxInput.value) - parseFloat(yMinInput.value)) / 50);
                        return `(x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${minZ.toFixed(2)})`;
                    }
                }
            }
        }, 'Çukur Noktası Koordinatları');
    });
     document.getElementById('calc-volume').addEventListener('click', () => {
        run3dAnalysis(() => {
             const xStep = (parseFloat(xMaxInput.value) - parseFloat(xMinInput.value)) / 50;
             const yStep = (parseFloat(yMaxInput.value) - parseFloat(yMinInput.value)) / 50;
             const cellArea = xStep * yStep;
             const totalVolume = zData.flat().reduce((sum, z) => sum + z * cellArea, 0);
             return totalVolume.toFixed(3);
        }, 'Yüzeyin Altındaki Hacim');
    });
     document.getElementById('calc-surface-area').addEventListener('click', () => {
        run3dAnalysis(() => {
            let totalArea = 0;
            const xStep = (parseFloat(xMaxInput.value) - parseFloat(xMinInput.value)) / 50;
            const yStep = (parseFloat(yMaxInput.value) - parseFloat(yMinInput.value)) / 50;
             for (let j = 0; j < zData.length - 1; j++) {
                for (let i = 0; i < zData[j].length - 1; i++) {
                     const dz_dx = (zData[j][i+1] - zData[j][i]) / xStep;
                     const dz_dy = (zData[j+1][i] - zData[j][i]) / yStep;
                     totalArea += Math.sqrt(1 + dz_dx**2 + dz_dy**2) * xStep * yStep;
                }
            }
             return totalArea.toFixed(3);
        }, '3D Yüzey Alanı');
    });
    document.getElementById('calc-avg-slope').addEventListener('click', () => {
        run3dAnalysis(() => {
            let totalSlope = 0;
            let count = 0;
            const xStep = (parseFloat(xMaxInput.value) - parseFloat(xMinInput.value)) / 50;
            const yStep = (parseFloat(yMaxInput.value) - parseFloat(yMinInput.value)) / 50;
            for (let j = 0; j < zData.length - 1; j++) {
                for (let i = 0; i < zData[j].length - 1; i++) {
                    const dz_dx = (zData[j][i+1] - zData[j][i]) / xStep;
                    const dz_dy = (zData[j+1][i] - zData[j][i]) / yStep;
                    totalSlope += Math.sqrt(dz_dx**2 + dz_dy**2);
                    count++;
                }
            }
            return (totalSlope / count).toFixed(3);
        }, 'Ortalama Eğim');
    });
    document.getElementById('check-symmetry').addEventListener('click', () => {
        run3dAnalysis(() => {
            // Check for symmetry across y-z plane (f(x,y) vs f(-x,y))
            // This is an approximation
            let diff = 0;
            const steps = 50;
            for (let j = 0; j < zData.length; j++) {
                for (let i = 0; i < Math.floor(zData[j].length / 2); i++) {
                     diff += Math.abs(zData[j][i] - zData[j][steps-i]);
                }
            }
            return (diff / (steps*steps)) < 0.1 ? 'Simetrik Görünüyor' : 'Simetrik Değil';
        }, 'Simetri (y-z düzlemine göre)');
    });
});
