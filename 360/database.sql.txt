-- إنشاء قاعدة البيانات
CREATE DATABASE deraa_cmms_db;

-- 1. جدول المستخدمين (العملاء، الفنيين، الإدارة)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- 'Client', 'Technician', 'Supervisor', 'Admin'
    specialty VARCHAR(50), -- للفنيين: 'AC', 'Electrical', 'Plumbing'
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول قوالب المنازل (للتوليد التلقائي)
CREATE TABLE house_templates (
    template_id SERIAL PRIMARY KEY,
    template_name VARCHAR(50) NOT NULL, -- 'Villa', 'Apartment'
    layout_json JSONB NOT NULL -- يحتوي على الهيكل الشجري للغرف
);

-- 3. جدول المواقع (يدعم الهيكلة الشجرية للمنازل)
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    parent_id INT REFERENCES locations(location_id), -- لدعم: منزل -> قسم -> غرفة
    location_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(50), -- 'Main_House', 'Zone', 'Room'
    gps_coordinates VARCHAR(100)
);

-- 4. جدول المخزون (Inventory)
CREATE TABLE inventory (
    part_barcode VARCHAR(50) PRIMARY KEY,
    part_name VARCHAR(150) NOT NULL,
    current_quantity INT DEFAULT 0,
    min_threshold INT DEFAULT 5,
    last_restock_date TIMESTAMP
);

-- 5. جدول الأصول والمعدات (Assets & Warranty)
CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id),
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    warranty_end_date DATE,
    supplier_email VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active'
);

-- 6. جدول التذاكر (Tickets)
CREATE TABLE tickets (
    ticket_id VARCHAR(20) PRIMARY KEY, -- مثال: TCK-1001
    requester_id INT REFERENCES users(user_id),
    tech_id INT REFERENCES users(user_id),
    location_id INT REFERENCES locations(location_id),
    asset_id INT REFERENCES assets(asset_id),
    issue_type VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'New', -- New, Assigned, In_Progress, Waiting_Parts, Completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- 7. جدول سجل الأداء ومعدلات الإنتاج (SLA & Performance)
CREATE TABLE performance_log (
    log_id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(20) REFERENCES tickets(ticket_id),
    estimated_time_mins INT NOT NULL,
    actual_time_mins INT,
    variance_mins INT,
    warranty_status VARCHAR(50),
    automated_action_taken TEXT
);