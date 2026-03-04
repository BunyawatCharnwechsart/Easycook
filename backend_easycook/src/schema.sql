-- ============================================================
--  Recipe Website — SQLite Schema (ปรับจากโครงสร้างเดิม)
-- ============================================================

-- เปิดใช้ Foreign Key (SQLite ต้องเปิดเองทุกครั้ง)
PRAGMA foreign_keys = ON;

-- ============================================================
--  1. users — สมาชิก
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    uid           INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    username      TEXT    NOT NULL UNIQUE,        -- เพิ่ม: ชื่อผู้ใช้สำหรับแสดงผล
    email         TEXT    NOT NULL UNIQUE,
    password      TEXT    NOT NULL,
    profile_image TEXT,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
--  2. category — หมวดหมู่อาหาร
-- ============================================================
CREATE TABLE IF NOT EXISTS category (
    categoryid    INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryname  TEXT    NOT NULL UNIQUE
);

-- ============================================================
--  3. menu — สูตรอาหาร
-- ============================================================
CREATE TABLE IF NOT EXISTS menu (
    menuid        INTEGER PRIMARY KEY AUTOINCREMENT,
    uid           INTEGER NOT NULL,
    categoryid    INTEGER NOT NULL,
    mname         TEXT    NOT NULL,
    cooktime      INTEGER NOT NULL,               -- เวลาทำ (นาที)
    description   TEXT,
    cover_image   TEXT,                           -- เพิ่ม: รูปภาพปกอาหาร
    status        TEXT    NOT NULL DEFAULT 'published'
                          CHECK (status IN ('draft', 'published')),
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (uid)        REFERENCES users(uid)         ON DELETE CASCADE,
    FOREIGN KEY (categoryid) REFERENCES category(categoryid)
);

-- ============================================================
--  4. ingredient — ส่วนผสม
-- ============================================================
CREATE TABLE IF NOT EXISTS ingredient (
    ingredientid     INTEGER PRIMARY KEY AUTOINCREMENT,
    menuid           INTEGER NOT NULL,
    ingredient_order INTEGER NOT NULL,
    ingredient_name  TEXT    NOT NULL,

    FOREIGN KEY (menuid) REFERENCES menu(menuid) ON DELETE CASCADE,
    UNIQUE (menuid, ingredient_order)
);

-- ============================================================
--  5. makestep — ขั้นตอนการทำ
-- ============================================================
CREATE TABLE IF NOT EXISTS makestep (
    stepid      INTEGER PRIMARY KEY AUTOINCREMENT,
    menuid      INTEGER NOT NULL,
    step_order  INTEGER NOT NULL,
    step        TEXT    NOT NULL,
    step_image  TEXT,

    FOREIGN KEY (menuid) REFERENCES menu(menuid) ON DELETE CASCADE,
    UNIQUE (menuid, step_order)
);

-- ============================================================
--  6. saved_menu — สูตรที่บันทึกไว้ (กดใจ/bookmark)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_menu (
    saveid    INTEGER PRIMARY KEY AUTOINCREMENT,
    uid       INTEGER NOT NULL,
    menuid    INTEGER NOT NULL,
    saved_at  TEXT    NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (uid)    REFERENCES users(uid)   ON DELETE CASCADE,
    FOREIGN KEY (menuid) REFERENCES menu(menuid) ON DELETE CASCADE,
    UNIQUE (uid, menuid)                          -- กด save ซ้ำไม่ได้
);

-- ============================================================
--  Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_menu_uid        ON menu(uid);
CREATE INDEX IF NOT EXISTS idx_menu_categoryid ON menu(categoryid);
CREATE INDEX IF NOT EXISTS idx_menu_status     ON menu(status);
CREATE INDEX IF NOT EXISTS idx_saved_uid       ON saved_menu(uid);

-- ============================================================
--  Sample Data
-- ============================================================
INSERT OR IGNORE INTO category (categoryname) VALUES
    ('อาหารไทย'),
    ('อาหารญี่ปุ่น'),
    ('อาหารอิตาลี'),
    ('ของหวาน'),
    ('เครื่องดื่ม');

INSERT OR IGNORE INTO users (name, username, email, password) VALUES
    ('สมชาย ใจดี',  'chef_somchai', 'somchai@example.com', 'hashed_password_1'),
    ('มาลี แสนสวย', 'malee_cook',   'malee@example.com',   'hashed_password_2');

INSERT OR IGNORE INTO menu (uid, categoryid, mname, cooktime, description, status) VALUES
    (1, 1, 'ผัดไทยสูตรดั้งเดิม', 25, 'ผัดไทยสูตรต้นตำรับ หอมกลิ่นกุ้งสด เส้นเหนียวนุ่ม', 'published'),
    (2, 4, 'บัวลอยไข่หวาน',      50, 'บัวลอยแป้งสีสดใสในน้ำกะทิหวานมัน',                  'published');

INSERT OR IGNORE INTO ingredient (menuid, ingredient_order, ingredient_name) VALUES
    (1, 1, 'เส้นจันท์'),
    (1, 2, 'กุ้งสด'),
    (1, 3, 'ไข่ไก่'),
    (1, 4, 'น้ำมะขามเปียก'),
    (1, 5, 'น้ำตาลทราย'),
    (1, 6, 'น้ำปลา');

INSERT OR IGNORE INTO makestep (menuid, step_order, step) VALUES
    (1, 1, 'แช่เส้นจันท์ในน้ำเย็นประมาณ 30 นาที จนเส้นนิ่ม แล้วพักให้สะเด็ดน้ำ'),
    (1, 2, 'ตั้งกระทะบนไฟแรง ใส่น้ำมัน ผัดกุ้งจนสุก แล้วพักไว้'),
    (1, 3, 'ใส่เส้นลงในกระทะ ตามด้วยน้ำมะขาม น้ำตาล และน้ำปลา ผัดให้เข้ากัน'),
    (1, 4, 'เขี่ยเส้นออกด้านข้าง ตอกไข่ลงผัดให้สุก แล้วคลุกเข้ากับเส้น'),
    (1, 5, 'ใส่กุ้งกลับลงไป ผัดรวมกัน ตักใส่จาน โรยถั่วลิสงและต้นหอม');

INSERT OR IGNORE INTO saved_menu (uid, menuid) VALUES (2, 1);

-- ============================================================
--  Useful Queries
-- ============================================================

-- ดึงเมนูทั้งหมดพร้อม category และชื่อ user
-- SELECT m.*, c.categoryname, u.username
-- FROM menu m
-- JOIN category c ON m.categoryid = c.categoryid
-- JOIN users u    ON m.uid = u.uid
-- WHERE m.status = 'published'
-- ORDER BY m.created_at DESC;

-- ดูเมนูตามหมวดหมู่
-- SELECT m.* FROM menu m
-- JOIN category c ON m.categoryid = c.categoryid
-- WHERE c.categoryname = 'อาหารไทย' AND m.status = 'published';

-- ดูสูตรที่ user บันทึกไว้
-- SELECT m.*, s.saved_at
-- FROM saved_menu s
-- JOIN menu m ON s.menuid = m.menuid
-- WHERE s.uid = 1
-- ORDER BY s.saved_at DESC;

-- นับจำนวน save ของแต่ละเมนู
-- SELECT m.mname, COUNT(s.saveid) AS save_count
-- FROM menu m
-- LEFT JOIN saved_menu s ON m.menuid = s.menuid
-- GROUP BY m.menuid
-- ORDER BY save_count DESC;

-- ดึง ingredient ทั้งหมดของเมนู
-- SELECT * FROM ingredient
-- WHERE menuid = 1
-- ORDER BY ingredient_order;

-- ดึง step ทั้งหมดของเมนู
-- SELECT * FROM makestep
-- WHERE menuid = 1
-- ORDER BY step_order;
