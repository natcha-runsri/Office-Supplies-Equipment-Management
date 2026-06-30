const BASE_URL = 'http://localhost:8800'

window.onload = async () => {
    await loadData()
}
const loadData = async () => {
    console.log('User page loaded')
    //1. load user ทั้งหมด จาก API ที่เตรียมไว้
    const response = await axios.get(`${BASE_URL}/stock`)

    console.log(response.data)

    const userDom = document.getElementById('stock')
    //2. นำ user ทั้งหมด โหลดกลับเข้าไปใน html (คือเอาไปแสดงใน html)
    let htmlData = `<div>`
    for (let i = 0; i < response.data.length; i++) {
        let stocks = response.data[i]
        htmlData += `
            <tr> 
                <td>${stocks.id}</td>
                <td>${stocks.name}</td>
                <td>${stocks.category}</td>
                <td>${stocks.quantity}</td>
                <td>${stocks.status}</td>
            </tr>  
        `
    }
    htmlData += `</div>`
    userDom.innerHTML = htmlData

   
} 