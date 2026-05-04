const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات السحابية التي أنشأتها
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// رسالة تأكيد عمل الخادم
app.get('/', (req, res) => {
  res.send('تم تشغيل خادم منصة درع بنجاح! قاعدة البيانات متصلة.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});