let totalIncome = 0;
let totalExpense = 0;
let dataValues = [0, 0, 0, 0, 0, 0];
const categories = ['食', '衣', '住', '行', '育', '樂'];

// 初始化 Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: categories,
        datasets: [{
            data: dataValues,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } }
    }
});

async function getExchangeRate() {
    const cur = document.getElementById('currency-select').value;
    const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanExchangeRate&data_id=${cur}&start_date=2025-01-01`;
    try {
        const res = await fetch(url).then(r => r.json());
        document.getElementById('rate-display').innerText = `1 ${cur} = ${res.data[res.data.length-1].spot_sell}`;
    } catch(e) { document.getElementById('rate-display').innerText = "載入失敗"; }
}

function addHistoryRecord(type, name, amount) {
    const list = document.getElementById('history-list');
    const li = document.createElement('li');
    li.className = 'history-item';
    const colorClass = type === 'income' ? 'amount-income' : 'amount-expense';
    const sign = type === 'income' ? '+' : '-';
    li.innerHTML = `<span>${name}</span><span class="${colorClass}">${sign}$${amount}</span>`;
    list.insertBefore(li, list.firstChild);
}

function addIncome() {
    const nameInput = document.getElementById('income-name');
    const amtInput = document.getElementById('income-amount');
    const name = nameInput.value || "收入";
    const amt = parseInt(amtInput.value);
    
    if (!amt) return alert("請輸入金額");
    
    totalIncome += amt;
    addHistoryRecord('income', name, amt);
    
    nameInput.value = '';
    amtInput.value = '';
    updateStatus();
}

function addItem() {
    const amt = parseInt(document.getElementById('item-amount').value);
    const name = document.getElementById('item-name').value || "支出";
    const cat = document.getElementById('item-category').value;
    if (!amt) return;
    totalExpense += amt;
    dataValues[categories.indexOf(cat)] += amt;
    myChart.update();
    addHistoryRecord('expense', name, amt);
    document.getElementById('item-amount').value = '';
    document.getElementById('item-name').value = '';
    updateStatus();
}

function updateStatus() {
    const goal = parseInt(document.getElementById('saving-goal').value) || 1;
    const balance = totalIncome - totalExpense;
    const progress = (balance / goal) * 100;
    document.getElementById('balance-display').innerText = `結餘：$${balance}`;
    document.getElementById('progress-bar-fill').style.width = Math.min(Math.max(progress, 0), 100) + "%";
    const emoji = document.getElementById('status-emoji');
    emoji.innerText = balance < 0 ? "😢" : (progress >= 100 ? "🥳" : "😐");
}

getExchangeRate();