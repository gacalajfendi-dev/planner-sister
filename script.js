// ==========================================
// ТЕМА
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const sunIcon = '<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />';
const moonIcon = '<path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />';

if (localStorage.getItem('plannerTheme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.innerHTML = sunIcon;
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.innerHTML = moonIcon;
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('plannerTheme', next);
    themeIcon.innerHTML = next === 'dark' ? sunIcon : moonIcon;
}

// ==========================================
// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
// ==========================================
function switchPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.querySelector('.menu-btn[data-page="' + name + '"]').classList.add('active');
    localStorage.setItem('plannerPage', name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'sf') { renderSFCalendar(); updateSFUI(); }
}

// ==========================================
// ДЕКОР
// ==========================================
function createPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.classList.add('petal');
        const s = Math.random() * 8 + 5;
        p.style.width = s + 'px';
        p.style.height = s + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 10 + 10 + 's';
        p.style.animationDelay = Math.random() * 12 + 's';
        p.style.opacity = Math.random() * 0.4 + 0.4;
        container.appendChild(p);
    }
}

function createStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    const svg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"/></svg>';
    for (let i = 0; i < 30; i++) {
        const s = document.createElement('div');
        s.classList.add('star');
        const size = Math.random() * 8 + 3;
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.top = Math.random() * 100 + 'vh';
        s.style.animationDuration = Math.random() * 3 + 2 + 's';
        s.style.animationDelay = Math.random() * 5 + 's';
        s.innerHTML = svg;
        container.appendChild(s);
    }
}

// ==========================================
// SF — календарь
// ==========================================
const SF_MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                   'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const SF_GOAL = 100;
let sfCurrentDate = new Date();

function sfTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getSFData() {
    return JSON.parse(localStorage.getItem('sfState') || '[]');
}

function saveSFData(arr) {
    localStorage.setItem('sfState', JSON.stringify(arr));
}

function isSFDone(dateStr) {
    return getSFData().includes(dateStr);
}

function toggleSFDay(dateStr) {
    let data = getSFData();
    if (data.includes(dateStr)) {
        data = data.filter(d => d !== dateStr);
    } else {
        data.push(dateStr);
    }
    saveSFData(data);
    renderSFCalendar();
    updateSFUI();
    hideSFRestoreButton();
}

function changeSFMonth(delta) {
    sfCurrentDate.setMonth(sfCurrentDate.getMonth() + delta);
    renderSFCalendar();
    updateSFUI();
}

function renderSFCalendar() {
    const grid = document.getElementById('sfCalendar');
    const label = document.getElementById('sfMonthLabel');
    if (!grid || !label) return;

    const year = sfCurrentDate.getFullYear();
    const month = sfCurrentDate.getMonth();

    label.textContent = `${SF_MONTHS[month]} ${year}`;
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    let startWeekday = firstDay.getDay();
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startWeekday; i++) {
        const empty = document.createElement('div');
        empty.className = 'sf-cal-empty';
        grid.appendChild(empty);
    }

    const today = sfTodayStr();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const cell = document.createElement('div');
        cell.className = 'sf-cal-day';
        cell.textContent = day;
        cell.dataset.date = dateStr;

        if (isSFDone(dateStr)) cell.classList.add('done');
        if (dateStr === today) cell.classList.add('today');
        if (dateStr > today) cell.classList.add('future');

        if (dateStr <= today) {
            cell.addEventListener('click', () => toggleSFDay(dateStr));
        }

        grid.appendChild(cell);
    }
}

function calcSFStreak() {
    const data = getSFData();
    if (data.length === 0) return 0;
    let streak = 0;
    let d = new Date();
    let dateStr = sfTodayStr();
    while (data.includes(dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
        dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
    return streak;
}

function calcSFBest() {
    const data = getSFData().slice().sort();
    if (data.length === 0) return 0;
    let best = 1;
    let current = 1;
    for (let i = 1; i < data.length; i++) {
        const prev = new Date(data[i-1]);
        const cur = new Date(data[i]);
        const diff = Math.round((cur - prev) / (1000*60*60*24));
        if (diff === 1) {
            current++;
            if (current > best) best = current;
        } else if (diff > 1) {
            current = 1;
        }
    }
    return best;
}

function calcSFMonth() {
    const data = getSFData();
    const year = sfCurrentDate.getFullYear();
    const month = sfCurrentDate.getMonth();
    const prefix = `${year}-${String(month+1).padStart(2,'0')}`;
    return data.filter(d => d.startsWith(prefix)).length;
}

function updateSFUI() {
    const total = getSFData().length;
    const monthCount = calcSFMonth();

    const el1 = document.getElementById('sfTotal');
    const el2 = document.getElementById('sfMonth');
    const el3 = document.getElementById('sfStreak');
		const el4 = document.getElementById('sfBest');

    if (el1) el1.textContent = total;
    if (el2) el2.textContent = monthCount;
    if (el3) el3.textContent = calcSFStreak();
    if (el4) el4.textContent = calcSFBest();

    const percent = Math.min(Math.round((total / SF_GOAL) * 100), 100);
    const elFill = document.getElementById('sfProgressFill');
    const elLabel = document.getElementById('sfProgressLabel');
    if (elFill) elFill.style.width = percent + '%';
    if (elLabel) elLabel.textContent = `${total} / ${SF_GOAL}`;
}

function resetSF() {
    if (!confirm("Сбросить весь прогресс SF?")) return;
    const data = getSFData();
    if (data.length > 0) {
        localStorage.setItem('sfBackup', JSON.stringify(data));
    }
    localStorage.removeItem('sfState');
    renderSFCalendar();
    updateSFUI();
    const btn = document.getElementById('sfRestoreBtn');
    if (data.length > 0 && btn) btn.classList.add('visible');
}

function restoreSF() {
    const backup = localStorage.getItem('sfBackup');
    if (!backup) return;
    saveSFData(JSON.parse(backup));
    renderSFCalendar();
    updateSFUI();
    const btn = document.getElementById('sfRestoreBtn');
    if (btn) btn.classList.remove('visible');
    localStorage.removeItem('sfBackup');
}

function hideSFRestoreButton() {
    const btn = document.getElementById('sfRestoreBtn');
    if (btn) btn.classList.remove('visible');
}

// ==========================================
// ТРИ КОПИЛКИ
// ==========================================
const POTS_MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                     'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const POTS_COLUMNS = ['save', 'invest', 'charity'];
const POTS_ROWS = 12;

function createPotsTable() {
    const body = document.getElementById('potsBody');
    if (!body) return;
    body.innerHTML = '';

    const saved = JSON.parse(localStorage.getItem('potsData') || '{}');

    for (let row = 0; row < POTS_ROWS; row++) {
        const tr = document.createElement('tr');

        const monthCell = document.createElement('td');
        monthCell.className = 'pots-month-cell';
        monthCell.textContent = POTS_MONTHS[row];
        tr.appendChild(monthCell);

        POTS_COLUMNS.forEach(col => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'pots-input';
            input.placeholder = '—';
            input.dataset.id = `${col}-${row}`;
            input.value = saved[`${col}-${row}`] || '';
            input.addEventListener('input', () => {
                savePotsField(input.dataset.id, input.value);
                updatePotsTotals();
            });
            td.appendChild(input);
            tr.appendChild(td);
        });

        body.appendChild(tr);
    }
    updatePotsTotals();
}

function savePotsField(id, value) {
    const data = JSON.parse(localStorage.getItem('potsData') || '{}');
    if (value === '' || value === null) {
        delete data[id];
    } else {
        data[id] = value;
    }
    localStorage.setItem('potsData', JSON.stringify(data));
    hidePotsRestoreButton();
}

function getPotsValue(id) {
    const data = JSON.parse(localStorage.getItem('potsData') || '{}');
    const v = parseFloat(data[id]);
    return isNaN(v) ? 0 : v;
}

function calcPotsColumn(col) {
    let sum = 0;
    for (let row = 0; row < POTS_ROWS; row++) {
        sum += getPotsValue(`${col}-${row}`);
    }
    return sum;
}

function updatePotsTotals() {
    const save = calcPotsColumn('save');
    const invest = calcPotsColumn('invest');
    const charity = calcPotsColumn('charity');
    const grand = save + invest + charity;

    const elSave = document.getElementById('potsTotalSave');
    const elInvest = document.getElementById('potsTotalInvest');
    const elCharity = document.getElementById('potsTotalCharity');
		const elGrand = document.getElementById('potsGrandTotal');

    if (elSave) elSave.textContent = save.toLocaleString('ru-RU') + ' ₽';
    if (elInvest) elInvest.textContent = invest.toLocaleString('ru-RU') + ' ₽';
    if (elCharity) elCharity.textContent = charity.toLocaleString('ru-RU') + ' ₽';
    if (elGrand) elGrand.textContent = grand.toLocaleString('ru-RU') + ' ₽';
}

function resetPots() {
    if (!confirm("Сбросить всю таблицу трёх копилок?")) return;
    const data = localStorage.getItem('potsData');
    if (data) localStorage.setItem('potsBackup', data);

    localStorage.removeItem('potsData');
    document.querySelectorAll('.pots-input').forEach(inp => inp.value = '');
    updatePotsTotals();

    const btn = document.getElementById('potsRestoreBtn');
    if (data && btn) btn.classList.add('visible');
}

function restorePots() {
    const backup = localStorage.getItem('potsBackup');
    if (!backup) return;
    localStorage.setItem('potsData', backup);
    const saved = JSON.parse(backup);
    document.querySelectorAll('.pots-input').forEach(inp => {
        inp.value = saved[inp.dataset.id] || '';
    });
    updatePotsTotals();

    const btn = document.getElementById('potsRestoreBtn');
    if (btn) btn.classList.remove('visible');
    localStorage.removeItem('potsBackup');
}

function hidePotsRestoreButton() {
    const btn = document.getElementById('potsRestoreBtn');
    if (btn) btn.classList.remove('visible');
}

// ==========================================
// ЗАПУСК
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    createPetals();
    createStars();
    renderSFCalendar();
    updateSFUI();
    createPotsTable();
    const last = localStorage.getItem('plannerPage') || 'sf';
    switchPage(last === 'pots' ? 'pots' : 'sf');
});