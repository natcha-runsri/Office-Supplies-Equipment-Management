const BASE_URL = 'http://localhost:8800'

window.onload = async () => {
    await loadData()
}
const loadData = async () => {
    console.log('User page loaded')
    //1. load user ทั้งหมด จาก API ที่เตรียมไว้
    const response = await axios.get(`${BASE_URL}/requests`)

    console.log(response.data)

    const userDom = document.getElementById('request')
    //2. นำ user ทั้งหมด โหลดกลับเข้าไปใน html (คือเอาไปแสดงใน html)
    let htmlData = `<div>`
    for (let i = 0; i < response.data.length; i++) {
        let request = response.data[i]
        htmlData += `
            <tr> 
                <td>${request.id}</td>
                <td>${request.user_id}</td>
                <td>${request.stock_name}</td>
                <td>${request.request_date}</td>
                <td>${request.status}</td>
            </tr>  
        `
    }
    htmlData += `</div>`
    userDom.innerHTML = htmlData

    //3. ลบ user
    const deleteDoms = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDoms.length; i++) {
        deleteDoms[i].addEventListener('click', async (event) => {
            //ดึง id ของ user ที่ต้องการลบ
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData() //recursive function =   เรียกใช้ฟังกก์ชันตัวเอง
            } catch (error) {
                console.error('error', error)
            }
        })
    }
} 