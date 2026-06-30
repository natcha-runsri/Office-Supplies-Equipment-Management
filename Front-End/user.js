const BASE_URL = 'http://localhost:8800';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('User page loaded');
    // 1. load user ทั้งหมด จาก API
    const response = await axios.get(`${BASE_URL}/login`);

    console.log(response.data);

    const userDom = document.getElementById('user');
    let htmlData = `<div>`;
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i];
        htmlData += `
            <tr> 
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit" data-id="${user.id}">Edit</button>
                    <button class="delete" data-id="${user.id}">Delete</button>
                </td>
            </tr>
        `;
    }
    htmlData += `</div>`;
    userDom.innerHTML = htmlData;

    // 2. ลบ user
    const deleteDoms = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteDoms.length; i++) {
        deleteDoms[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/login/${id}`);
                loadData(); // เรียกฟังก์ชันใหม่เพื่อโหลดข้อมูล
            } catch (error) {
                console.error('Error deleting user', error);
            }
        });
    }

    // 3. แก้ไข user เมื่อคลิก "Edit"
    const editButtons = document.getElementsByClassName('edit');
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', (event) => {
            const userId = event.target.dataset.id;
            openModal(userId); // เปิด modal เมื่อกด Edit
        });
    }
};

// 4. การเปิดป๊อปอัป
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
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});
// close modal
function closeForm() {
    wrapper.classList.remove('active-popup');
}
// ดึงข้อมูลผู้ใช้จาก API และแสดงในฟอร์ม
const getUserData = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/login/${userId}`);
        const user = response.data;

        // แสดงข้อมูลในฟอร์ม
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = user.password;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        
        // เก็บ id ของผู้ใช้สำหรับการอัปเดต
        document.getElementById('editUserForm').dataset.id = userId;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

// 5. เมื่อกรอกข้อมูลในฟอร์มและกด "Save Changes"
document.getElementById('editUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = event.target.dataset.id;
    const updatedUser = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value, // เก็บ password ใน state
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
    };

    try {
        await axios.put(`${BASE_URL}/login/${userId}`, updatedUser);
        alert('User updated successfully!');
        loadData(); // รีเฟรชข้อมูล
        wrapper.classList.remove('active-popup'); // ปิด modal
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user.');
    }
});

