let totalIncome = 0;
let totalExpense = 0;
let dataValues = [0, 0, 0, 0, 0, 0]; // 對應食、衣、住、行、育、樂
const categories = ['食', '衣', '住', '行', '育', '樂'];

// 1. 初始化 Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut', // 使用環形圖，看起來更現代
    data: {
        labels: categories,
        datasets: [{
            data: dataValues,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            hoverOffset: 10
        }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
});

// 修改後的匯率抓取函數
async function getExchangeRate() {
    const currency = document.getElementById('currency-select').value;
    const rateDisplay = document.getElementById('rate-display');
    
    rateDisplay.innerText = "讀取中...";

    // 動態傳入幣別 (data_id)
    const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanExchangeRate&data_id=${currency}&start_date=2025-01-01`;
    
    try {
        const response = await fetch(url);
        const res = await response.json();
        
        if (res.data && res.data.length > 0) {
            // 抓取最新一筆資料
            const latestData = res.data[res.data.length - 1];
            const rate = latestData.spot_sell; // 即期賣出價
            rateDisplay.innerText = `1 ${currency} = ${rate} TWD`;
        } else {
            rateDisplay.innerText = "暫無資料";
        }
    } catch (e) {
        console.error(e);
        rateDisplay.innerText = "連線失敗";
    }
}

// 確保頁面載入時先執行一次
window.onload = () => {
    getExchangeRate();
};

// 3. 處理收入
function addIncome() {
    const val = parseInt(document.getElementById('income-amount').value);
    if (isNaN(val) || val <= 0) return alert("請輸入正確收入金額");
    totalIncome += val;
    document.getElementById('income-amount').value = '';
    updateStatus();
}

// 4. 處理支出
function addItem() {
    const amount = parseInt(document.getElementById('item-amount').value);
    const cat = document.getElementById('item-category').value;
    if (isNaN(amount) || amount <= 0) return alert("請輸入正確支出金額");

    totalExpense += amount;
    const idx = categories.indexOf(cat);
    dataValues[idx] += amount;

    myChart.update(); // 更新圖表
    document.getElementById('item-amount').value = '';
    document.getElementById('item-name').value = '';
    updateStatus();
}

// 5. 更新心情與進度
function updateStatus() {
    const goal = parseInt(document.getElementById('saving-goal').value) || 1;
    const balance = totalIncome - totalExpense;
    const progress = (balance / goal) * 100;

    document.getElementById('balance-display').innerText = `目前結餘：$${balance}`;
    
    // 更新進度條
    const fill = document.getElementById('progress-bar-fill');
    fill.style.width = Math.min(Math.max(progress, 0), 100) + "%";

    // 切換表情與美術風格
    const box = document.getElementById('status-container');
    const emoji = document.getElementById('status-emoji');
    const txt = document.getElementById('status-text');

    if (balance < 0) {
        emoji.innerText = "😭"; txt.innerText = "超支了！快停止消費";
        box.className = "status-box status-sad";
    } else if (progress < 50) {
        emoji.innerText = "😐"; txt.innerText = "離目標還有一段距離";
        box.className = "status-box";
    } else if (progress < 100) {
        emoji.innerText = "😮"; txt.innerText = "存一半了，繼續保持！";
        box.className = "status-box status-happy";
    } else {
        emoji.innerText = "🥳"; txt.innerText = "達成目標！你是理財大師";
        box.className = "status-box status-happy";
    }
}

// 啟動 API 抓取
getExchangeRate();