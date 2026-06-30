
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});


const check = async () => {
    //ดึงค่าชื่อผู้ใช้กับรหัสผ่านจากฟอร์ม
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    try {
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        const response = await axios.post('http://localhost:8800/login', {
            username, password
        });
        //ตรวจสอบผลลัพธ์จากเซิร์ฟเวอร์
        if (response.data.success == true) {
            alert('Login successful!');
            if (response.data.role === 'Admin') {
                window.location.href = 'admin.html'; // Redirect to the admin page
            }
            else if (response.data.role === 'Employee') {
                window.location.href = 'employee.html'; // Redirect to the employee page
            }
        } else if (response.data.success == false) {
            alert('Login failed: ' + (response.data.error || 'Invalid credentials or unknown error.'));
        }
    } catch (error) {
        // จัดการข้อผิดพลาดจาก Axios (เช่น 401, 500)
        if (error.response) {
            // หากได้รับ response จากเซิร์ฟเวอร์ (เช่น 401)
            alert('Login failed: ' + (error.response.data.error || 'Invalid credentials.'));
        } else if (error.request) {
            // หากไม่ได้รับ response (เกิดจากการเชื่อมต่อที่ไม่ดี)
            alert('No response from the server. Please try again later.');
        } else {
            // หากเกิดข้อผิดพลาดอื่นๆ
            console.error('Error login:', error);
            alert('Error login: ' + error.message);
        }
    }
}

const register = async () => {
    const urlParams = new URLSearchParams(window.location.search); // ดึง query parameters
    const email = urlParams.get('email');
    const username = urlParams.get('username');
    const password = urlParams.get('password');
    const role = urlParams.get('role');

    console.log(email, username, password, role); // ตรวจสอบค่าที่ดึงมา

    // ข้อมูลที่ต้องการส่งไปยังเซิร์ฟเวอร์
    let userData = {
        email: email,
        username: username,
        password: password,
        role: role
    };
    try {
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์เพื่อบันทึกในฐานข้อมูล
        const response = await axios.post('http://localhost:8800/register', userData);

        // แสดงข้อความหลังจากส่งข้อมูลสำเร็จ
        if (response.data.success) {
            alert('User registered successfully!');
            window.location.href = 'home.html'; // Redirect to the login page
        } else {
            alert('Registration failed: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);

    }
};

// เมื่อโหลดหน้า, เรียกฟังก์ชัน register
window.onload = register;




