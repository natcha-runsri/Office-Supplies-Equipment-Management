**Office Supplies & Equipment Management**
ระบบจัดการอุปกรณ์และวัสดุสำนักงาน (Office Supplies & Equipment Management) พัฒนาด้วย Node.js (Express) สำหรับฝั่ง Back-End และ HTML/CSS/JavaScript สำหรับฝั่ง Front-End เชื่อมต่อกับฐานข้อมูล MySQL

**Tech Stack**
Back-End: Node.js, Express.js
Database: MySQL 5.7 (รันผ่าน Docker)
DB Admin Tool: phpMyAdmin
Front-End: HTML, CSS, JavaScript (axios สำหรับเรียก API)
อื่นๆ: dotenv, cors, body-parser, nodemailer


**โครงสร้างโปรเจกต์**
Office-Supplies-Equipment-Management/
├── Back-End/
│   ├── index.js          # Express server หลัก
│   ├── .env               # ไฟล์ environment variables (ไม่ commit ขึ้น git)
│   └── package.json
├── Front-End/
│   ├── home.html
│   ├── home.js
│   └── ...
└── README.md