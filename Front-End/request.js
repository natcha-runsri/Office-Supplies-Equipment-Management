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
                <td>${request.request_date ? request.request_date.split('T')[0]:''}</td>
                <td>${request.status}</td>
                <td >
                  <button class="edit" data-id="${request.id}">Edit</button>
                </td>
            </tr>  
        `
    }
    htmlData += `</div>`
    userDom.innerHTML = htmlData

    // แก้ไข user เมื่อคลิก "Edit"
    const editButtons = document.getElementsByClassName('edit');
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', (event) => {
            const userId = event.target.dataset.id;
            openModal(userId); // เปิด modal เมื่อกด Edit
        });
    }
} 


//  การเปิดป๊อปอัป
const wrapper = document.querySelector('.wrapper');
const iconClose = document.querySelector('.icon-close');

// ฟังก์ชันเปิด modal
function openModal(userId) {
    // ดึงข้อมูลผู้ใช้จาก API
    getUserData(userId);
    // เปิด modal
    wrapper.classList.add('active-popup');
}
// ฟังก์ชันปิด modal
// close modal
function closeForm() {
    wrapper.classList.remove('active-popup');
}

// ดึงข้อมูลผู้ใช้จาก API และแสดงในฟอร์ม
const getUserData = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/requests/${userId}`);
        const user = response.data;

        // แสดงข้อมูลในฟอร์ม
        document.getElementById('id').value = user.user_id;
        document.getElementById('name').value = user.stock_name;
        document.getElementById('date').value = user.request_date ? user.request_date.split('T')[0] : ''; // แปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD
        document.getElementById('status').value = user.status;
        
        // เก็บ id ของผู้ใช้สำหรับการอัปเดต
        document.getElementById('Form').dataset.id = userId;

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

// เมื่อกรอกข้อมูลในฟอร์มและกด "Save Changes"
document.getElementById('Form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = event.target.dataset.id;
    const updatedUser = {
        user_id: document.getElementById('id').value,
        stock_name: document.getElementById('name').value, // เก็บ password ใน state
        request_date: document.getElementById('date').value,
        status: document.getElementById('status').value,
    };

    try {
        await axios.put(`${BASE_URL}/requests/${userId}`, updatedUser);
        alert('User updated successfully!');
        loadData(); // รีเฟรชข้อมูล
        wrapper.classList.remove('active-popup'); // ปิด modal
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user.');
    }
});