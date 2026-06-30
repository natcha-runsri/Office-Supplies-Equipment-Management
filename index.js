require("dotenv").config();
const express = require('express');
const bodyParset = require('body-parser');
const mysql = require('mysql2/promise');
const e = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require("nodemailer");

const port = 8800;

app.use(bodyParset.json());
app.use(cors());

const initMySQL = async () => {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8890
    })
}
  
//PATH 1:เช็กข้อมูลทั้งหมด
app.get('/login', async (req, res) => {
    const results = await db.query('SELECT * FROM login ')
    res.json(results[0])
});

//PATH 2:เช็กข้อมูลว่ามีผู้ใช้หรือไม่
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบว่ามี username และ password ไหม
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
    try {
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const [user] = await db.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password]);
        // ตรวจสอบว่าพบผู้ใช้ไหม
        if (user.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials. Username not found. Please register if you don\'t have an account.'
            });
        } else {
            // ตรวจสอบรหัสผ่านที่ผู้ใช้กรอก
            const users = user[0];  // ใช้ผู้ใช้คนแรกที่เจอจากผลลัพธ์
            // ถ้ารหัสผ่านตรง ให้ส่งข้อมูลกลับไปที่ผู้ใช้
            const role = users.role;
            if (users.password && user.username == false) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials. Incorrect password.'
                });
            } else {
                return res.json({
                    success: true,
                    message: 'Login successful',
                    role: role
                });
            }
        }
    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

//Path 3: ลงทะเบียนข้อมูลเพิ่มเติม
app.post('/register', async (req, res) => {
    try {
        let user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role
        };

        // ตัวอย่างการบันทึกข้อมูลลงฐานข้อมูล MySQL
        const result = await db.query('INSERT INTO login SET ?', user);
        console.log('Insert result:', result);

        res.json({
            message: 'User created successfully',
            success: true                                                                                                   
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed: ' + error.message
        });
    }
});


//PATH 4:แก้ไขข้อมูลผู้ใช้
app.put('/login/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateUser = req.body;
        const result = await db.query('UPDATE login SET ? WHERE id = ?', [updateUser, id])
        res.json({
            message: "Update  user successfully",
            data: result[0]
        });
    } catch (error) {
        console.error('error', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

//Path 5: รับข้อมูลทั้งหมดจาก stock
app.get('/stock', async (req,res) => {
    const results = await db.query('SELECT * FROM stock ')
    res.json(results[0])
});

//Path 6: รับข้อมูล request
app.get('/requests', async (req,res) => {
    const results = await db.query('SELECT * FROM requests ')
    res.json(results[0])
});

//Path 7: รับข้อมูลทัรายคนจาก login
app.get('/login/:id', async (req, res) => { 
    try {
     let id = req.params.id;
     const results = await db.query('SELECT * FROM login WHERE id = ?', id)
     if (results[0].length == 0) {
        throw { statusCode: 404, message: 'User not found' }
     } 
     res.json(results[0][0])
    } catch (error) {
      console.error('error', error.message)
      let statusCode = error.statusCode || 500
      res.status(500).json({
        message: 'something went wrong',
        errorMessage: error.message  
      })
    }
})

//Path 8: ลบข้อมูลผู้ใช้
app.delete('/login/:id', async(req, res) => {
    try {
        let id = req.params.id;
        const result = await db.query('DELETE FROM login WHERE id = ?', id)
        res.json({
            message: "Delete user successfully",
            data: result[0]
        }); 
    } catch (error) {
        console.error('error', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

//Path 9: แก้ไขข้อมูล stock
app.put('/stock/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateStock = req.body;
        const result = await db.query('UPDATE stock SET ? WHERE id = ?', [updateStock, id])
        res.json({
            message: "Update stock successfully",
            data: result[0]
        });
    } catch (error) {
        console.error('error', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

//Path 10: ลบข้อมูล stock
app.delete('/stock/:id', async(req, res) => {
    try {
        let id = req.params.id;
        const result = await db.query('DELETE FROM stock WHERE id = ?', id)
        res.json({
            message: "Delete user successfully",
            data: result[0]
        }); 
    } catch (error) {
        console.error('error', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

//Path 11: แเรียกดูข้อมูลรายคนจาก stock
app.get('/stock/:id', async (req, res) => { 
    try {
     let id = req.params.id;
     const results = await db.query('SELECT * FROM stock WHERE id = ?', id)
     if (results[0].length == 0) {
        throw { statusCode: 404, message: 'Stock not found' }
     } 
     res.json(results[0][0])
    } catch (error) {
      console.error('error', error.message)
      let statusCode = error.statusCode || 500
      res.status(500).json({
        message: 'something went wrong',
        errorMessage: error.message  
      })
    }
})

//Path 12: เพิ่มข้อมูล stock
app.post('/stock', async (req, res) => {
    try {
        let stock = {
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            status: req.body.status
        };

        // ตัวอย่างการบันทึกข้อมูลลงฐานข้อมูล MySQL
        const result = await db.query('INSERT INTO stock SET ?', stock);
        console.log('Insert result:', result);

        res.json({
            message: 'Stock created successfully',
            success: true
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed: ' + error.message
        });
    }
});

//Path 13: แก้ไขข้อมูล request
app.put('/requests/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateStock = req.body;
        const result = await db.query('UPDATE requests SET ? WHERE id = ?', [updateStock, id])
        res.json({
            message: "Update stock successfully",
            data: result[0]
        });
    } catch (error) {
        console.error('error', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

//Path 14: เรียกข้อมูล request
app.get('/requests/:id', async (req, res) => { 
    try {
     let id = req.params.id;
     const results = await db.query('SELECT * FROM requests WHERE id = ?', id)
     if (results[0].length == 0) {
        throw { statusCode: 404, message: 'Request not found' }
     } 
     res.json(results[0][0])
    } catch (error) {
      console.error('error', error.message)
      let statusCode = error.statusCode || 500
      res.status(500).json({
        message: 'something went wrong',
        errorMessage: error.message  
      })
    }
})

//Path 15: เพิ่มข้อมูล request
app.post('/requests', async (req, res) => {
    try {
        let request = {
            user_id: req.body.user_id,
            stock_name: req.body.stock_name,
            request_date: req.body.request_date,
            status: req.body.status
        };

        // ตัวอย่างการบันทึกข้อมูลลงฐานข้อมูล MySQL
        const result = await db.query('INSERT INTO requests SET ?', request);
        console.log('Requests result:', result);

        res.json({
            message: 'Requests created successfully',
            success: true
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Requests failed: ' + error.message
        });
    }
});

app.get('/register', async (req,res) => {
    const results = await db.query('SELECT * FROM login ')
    res.json(results[0])
});

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log(`Http Server is running on port` + port);
});