const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

const borrow = async () => {
    let userIdDom = document.querySelector('input[name=userid]');
    let stocknameDom = document.querySelector('input[name=stock_name]');
    let requestdateDom = document.querySelector('input[name=requestdate]');

    let userData = {
        user_id: userIdDom.value,
        stock_name: stocknameDom.value,
        request_date: requestdateDom.value,
        status: 'pending' 
    };
    try {
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์เพื่อบันทึกในฐานข้อมูล
        const response = await axios.post('http://localhost:8800/requests', userData);

        console.log('Server response:', response.data);

        // แสดงข้อความหลังจากส่งข้อมูลสำเร็จ
        if (response.data.success) {
            alert('successfully!');
            window.location.href = 'employee.html'; // Redirect to the login page
        } else {
            alert('Registration failed: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);

    }
}
window.onload = borrow();