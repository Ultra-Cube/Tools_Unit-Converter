const units = {
    length: [
        { name: 'Meter', value: 'm' },
        { name: 'Kilometer', value: 'km' },
        { name: 'Centimeter', value: 'cm' },
        { name: 'Millimeter', value: 'mm' },
        { name: 'Mile', value: 'mi' },
        { name: 'Yard', value: 'yd' },
        { name: 'Foot', value: 'ft' },
        { name: 'Inch', value: 'in' }
    ],
    weight: [
        { name: 'Kilogram', value: 'kg' },
        { name: 'Gram', value: 'g' },
        { name: 'Milligram', value: 'mg' },
        { name: 'Pound', value: 'lb' },
        { name: 'Ounce', value: 'oz' }
    ],
    temperature: [
        { name: 'Celsius', value: 'c' },
        { name: 'Fahrenheit', value: 'f' },
        { name: 'Kelvin', value: 'k' }
    ],
    area: [
        { name: 'Square Meter', value: 'sqm' },
        { name: 'Square Kilometer', value: 'sqkm' },
        { name: 'Square Mile', value: 'sqmi' },
        { name: 'Square Yard', value: 'sqyd' },
        { name: 'Square Foot', value: 'sqft' },
        { name: 'Square Inch', value: 'sqin' },
        { name: 'Hectare', value: 'ha' },
        { name: 'Acre', value: 'ac' }
    ],
    volume: [
        { name: 'Cubic Meter', value: 'cum' },
        { name: 'Liter', value: 'l' },
        { name: 'Milliliter', value: 'ml' },
        { name: 'Cubic Centimeter', value: 'cc' },
        { name: 'Cubic Inch', value: 'cuin' },
        { name: 'Cubic Foot', value: 'cuft' },
        { name: 'Gallon (US)', value: 'gal' },
        { name: 'Pint (US)', value: 'pt' }
    ],
    data: [
        { name: 'Bit', value: 'b' },
        { name: 'Byte', value: 'B' },
        { name: 'Kilobyte', value: 'KB' },
        { name: 'Megabyte', value: 'MB' },
        { name: 'Gigabyte', value: 'GB' },
        { name: 'Terabyte', value: 'TB' }
    ]
};

function createUnitSelectors(category) {
    const unitSelectors = document.getElementById('unit-selectors');
    unitSelectors.innerHTML = '';
    const fromLabel = document.createElement('label');
    fromLabel.textContent = 'From:';
    const fromSelect = document.createElement('select');
    fromSelect.id = 'from-unit';
    units[category].forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.value;
        opt.textContent = u.name;
        fromSelect.appendChild(opt);
    });
    const toLabel = document.createElement('label');
    toLabel.textContent = 'To:';
    const toSelect = document.createElement('select');
    toSelect.id = 'to-unit';
    units[category].forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.value;
        opt.textContent = u.name;
        toSelect.appendChild(opt);
    });
    unitSelectors.appendChild(fromLabel);
    unitSelectors.appendChild(fromSelect);
    unitSelectors.appendChild(toLabel);
    unitSelectors.appendChild(toSelect);
}


// --- State helpers ---
function getCategory() {
    return document.getElementById('category').value;
}
function getFromUnit() {
    return document.getElementById('from-unit').value;
}
function getToUnit() {
    return document.getElementById('to-unit').value;
}
function getInputValue() {
    return parseFloat(document.getElementById('input-value').value);
}
function setResult(val) {
    document.getElementById('result').textContent = val;
}

// --- Persistence ---
const savedCategory = localStorage.getItem('unit-category');
if (savedCategory && units[savedCategory]) {
    document.getElementById('category').value = savedCategory;
    createUnitSelectors(savedCategory);
} else {
    createUnitSelectors('length');
}

// --- Auto-convert logic ---
function doConvert() {
    const category = getCategory();
    const from = getFromUnit();
    const to = getToUnit();
    const value = getInputValue();
    if (isNaN(value)) {
        setResult('Please enter a valid number.');
        return;
    }
    const result = convert(category, from, to, value);
    setResult(result !== undefined ? result : 'Conversion not supported.');
}

document.getElementById('category').addEventListener('change', function() {
    createUnitSelectors(this.value);
    localStorage.setItem('unit-category', this.value);
    setTimeout(doConvert, 0);
});

document.getElementById('unit-selectors').addEventListener('change', function(e) {
    if (e.target && (e.target.id === 'from-unit' || e.target.id === 'to-unit')) {
        doConvert();
    }
});

document.getElementById('input-value').addEventListener('input', doConvert);

document.getElementById('convert-btn').addEventListener('click', doConvert);

// --- Swap units ---
document.getElementById('swap-btn').addEventListener('click', function() {
    const from = document.getElementById('from-unit');
    const to = document.getElementById('to-unit');
    const tmp = from.value;
    from.value = to.value;
    to.value = tmp;
    doConvert();
});

// --- Copy result ---
document.getElementById('copy-btn').addEventListener('click', function() {
    const result = document.getElementById('result').textContent;
    if (result && result !== 'Please enter a valid number.' && result !== 'Conversion not supported.') {
        navigator.clipboard.writeText(result);
        setResult(result + ' (Copied!)');
        setTimeout(() => setResult(result), 1000);
    }
});

// --- Dark mode toggle ---
const darkToggle = document.getElementById('dark-toggle');
const darkKey = 'unit-dark-mode';
function setDarkMode(on) {
    document.body.classList.toggle('dark', on);
    document.querySelector('.container').classList.toggle('dark', on);
    darkToggle.checked = on;
}
const savedDark = localStorage.getItem(darkKey);
if (savedDark === '1') setDarkMode(true);
darkToggle.addEventListener('change', function() {
    setDarkMode(this.checked);
    localStorage.setItem(darkKey, this.checked ? '1' : '0');
});

// Re-attach listeners after unit selectors change
const origCreateUnitSelectors = createUnitSelectors;
createUnitSelectors = function(category) {
    origCreateUnitSelectors(category);
    document.getElementById('from-unit').addEventListener('change', doConvert);
    document.getElementById('to-unit').addEventListener('change', doConvert);
};

function convert(category, from, to, value) {
    if (from === to) return value;
    switch (category) {
        case 'length':
            return convertLength(from, to, value);
        case 'weight':
            return convertWeight(from, to, value);
        case 'temperature':
            return convertTemperature(from, to, value);
        case 'area':
            return convertArea(from, to, value);
        case 'volume':
            return convertVolume(from, to, value);
        case 'data':
            return convertData(from, to, value);
        default:
            return undefined;
    }
}
// Conversion functions below
function convertLength(from, to, value) {
    const toMeter = {
        m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254
    };
    return +(value * toMeter[from] / toMeter[to]).toFixed(6);
}
function convertWeight(from, to, value) {
    const toKg = {
        kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.0283495231
    };
    return +(value * toKg[from] / toKg[to]).toFixed(6);
}
function convertTemperature(from, to, value) {
    let celsius;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5/9;
    else if (from === 'k') celsius = value - 273.15;
    else return undefined;
    if (to === 'c') return +celsius.toFixed(2);
    if (to === 'f') return +(celsius * 9/5 + 32).toFixed(2);
    if (to === 'k') return +(celsius + 273.15).toFixed(2);
    return undefined;
}
function convertArea(from, to, value) {
    const toSqm = {
        sqm: 1, sqkm: 1e6, sqmi: 2.59e6, sqyd: 0.836127, sqft: 0.092903, sqin: 0.00064516, ha: 10000, ac: 4046.86
    };
    return +(value * toSqm[from] / toSqm[to]).toFixed(6);
}
function convertVolume(from, to, value) {
    const toCum = {
        cum: 1, l: 0.001, ml: 0.000001, cc: 0.000001, cuin: 0.0000163871, cuft: 0.0283168, gal: 0.00378541, pt: 0.000473176
    };
    return +(value * toCum[from] / toCum[to]).toFixed(6);
}
function convertData(from, to, value) {
    const toBit = {
        b: 1, B: 8, KB: 8*1024, MB: 8*1024*1024, GB: 8*1024*1024*1024, TB: 8*1024*1024*1024*1024
    };
    return +(value * toBit[from] / toBit[to]).toFixed(6);
}
