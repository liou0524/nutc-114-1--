// 1. 初始化資料與圖表
let dataValues = [0, 0, 0, 0]; // 對應 食, 衣, 住, 行
const categories = ['食', '衣', '住', '行'];

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'pie', // 圓餅圖
    data: {
        labels: categories,
        datasets: [{
            label: '消費比例',
            data: dataValues,
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
        }]
    }
});

// 2. 新增帳目功能
function addItem() {
    const amount = parseInt(document.getElementById('item-amount').value);
    const category = document.getElementById('item-category').value;

    if (isNaN(amount)) return alert("請輸入正確金額");

    // 更新數據陣列
    const index = categories.indexOf(category);
    dataValues[index] += amount;

    // 更新圖表渲染
    myChart.update();

    // 清空輸入框
    document.getElementById('item-amount').value = '';
}

// 3. Fetch API: 抓取 FinMind 匯率資料 (加分項)
async function getExchangeRate() {
    const url = 'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanExchangeRate&data_id=USD&start_date=2024-01-01';
    
    try {
        const response = await fetch(url);
        const json = await response.json();
        // 抓最後一筆（最新的）匯率資料
        const latestRate = json.data[json.data.length - 1].spot_sell;
        document.getElementById('rate-display').innerText = `1 USD = ${latestRate} TWD (即期賣出價)`;
    } catch (error) {
        document.getElementById('rate-display').innerText = "無法載入匯率資料";
    }
}

getExchangeRate();