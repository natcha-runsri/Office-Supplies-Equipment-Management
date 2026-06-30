const BASE_URL = 'http://localhost:8800'

window.onload = async () => {
    await loadData();
}

const loadData = async () => {
    console.log('user page loaded');
    try {
        const response = await axios.get(`${BASE_URL}/stock`)
        console.log(response.data);

        const userDom = document.getElementById('stock')
        let htmlData = '';
        for (let i = 0; i < response.data.length; i++) {
            const stocks = response.data[i];
            htmlData += `<tr>
               <td>${stocks.id}</td>
                <td>${stocks.name}</td>
                <td>${stocks.category}</td>
                <td>${stocks.quantity}</td>
                <td>${stocks.status}</td>
                <td >
                    <button class="edit" data-id="${stocks.id}">Edit</button>
                </td>
                <td>
                    <button class='delete' data-id='${stocks.id}'>Delete</button>
                </td>
            </tr>`;
        }
        userDom.innerHTML = htmlData
        attachDeleteEventListeners();
        attachEditEventListeners();

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

const attachDeleteEventListeners = () => {
    const deleteDOMs = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/stock/${id}`)
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        });
    }
}

const attachEditEventListeners = () => {
    const editButtons = document.getElementsByClassName('edit');
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', (event) => {
            const userId = event.target.dataset.id;
            openModal(userId);
        });
    }
}

// 5. insert
const insertButton = document.querySelector('.insert'); // แก้ selector
if (insertButton) {
    insertButton.addEventListener('click', () => {
        openinsert();
    });
}


// open/close popup
const wrapper = document.querySelector('.wrapper');
const iconClose = document.querySelector('.icon-close');

// open modal for edit
function openModal(userId) {
    console.log("Edit button clicked for user ID:", userId); // เพิ่ม console.log
    getUserData(userId);
    wrapper.classList.add('active');
    document.getElementById('form').dataset.mode = 'edit'; // Set mode to edit
}

// open modal for insert
function openinsert() {
    document.getElementById('form').reset();
    delete document.getElementById('form').dataset.id; // Remove id for insert mode
    document.getElementById('form').dataset.mode = 'insert'; // Set mode to insert
    wrapper.classList.add('active');
}
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

// close modal
function closeForm() {
    wrapper.classList.remove('active');
}

// ดึงข้อมูลผู้ใช้จาก API สำหรับการแก้ไข
const getUserData = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/stock/${userId}`);
        const user = response.data;
        console.log("User data fetched:", user); // เพิ่ม console.log

        // แสดงข้อมูลในฟอร์ม
        document.getElementById('name').value = user.name;
        document.getElementById('category').value = user.category;
        document.getElementById('quantity').value = user.quantity;
        document.getElementById('status').value = user.status;
        document.getElementById('form').dataset.id = userId;

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// เมื่อกรอกข้อมูลและกดบันทึก
document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const mode = document.getElementById('form').dataset.mode;
    const userId = document.getElementById('form').dataset.id;
    console.log("Mode:", mode);
    console.log("UserID:", userId);

    const userData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        quantity: document.getElementById('quantity').value,
        status: document.getElementById('status').value,
    };
    console.log("UserData:", userData);

    try {
        let response;
        let alertMessage;
        if (mode === 'edit' && userId) {
            //เพิ่มเงื่อนไขตรวจสอบ userId
            if (userId !== undefined){
                response = await axios.put(`${BASE_URL}/stock/${userId}`, userData);
                alertMessage = 'User updated successfully!';
            } else {
                alert('UserID is undefined')
                return;
            }

        } else if (mode === 'insert') {
            response = await axios.post(`${BASE_URL}/stock`, userData);
            alertMessage = 'Stock Insert successfully!';
        }
        if (response && response.status >= 200 && response.status < 300) {
            alert(alertMessage);
            loadData();
            document.getElementById('form').reset();
            wrapper.classList.remove('active');
        } else {
            alert('Failed to save data.');
            console.log("Response:", response);
            console.error('Error saving data:', response);
        }
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data.');
    }
});
