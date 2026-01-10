-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== 1. BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Business Logic: total_copies ต้องไม่น้อยกว่า available_copies
    CONSTRAINT check_copies CHECK(total_copies >= available_copies)
);

-- ===== 2. MEMBERS TABLE =====
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    membership_date DATE DEFAULT (CURRENT_DATE),
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active'
);

-- ===== 3. BORROWINGS TABLE =====
CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    borrow_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT CHECK(status IN ('borrowed', 'returned', 'overdue')) DEFAULT 'borrowed',
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- ===== 4. INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_borrowings_lookup ON borrowings(book_id, member_id, status);

-- ===== 5. SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);

-- ===== 6. SAMPLE DATA: Members =====
INSERT INTO members (name, email, phone, status) VALUES
    ('สมชาย ใจดี', 'somchai@email.com', '081-234-5678', 'active'),
    ('สมหญิง รักเรียน', 'somying@email.com', '089-876-5432', 'active'),
    ('John Doe', 'john@example.com', '022-333-4444', 'inactive');

-- ===== 7. SAMPLE DATA: Borrowings =====
-- รายการที่ 1: ยืมปกติ (ยังไม่คืน)
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, status) 
VALUES (1, 1, '2026-01-01', '2026-01-15', 'borrowed');

-- รายการที่ 2: คืนแล้ว
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, return_date, status) 
VALUES (3, 2, '2025-12-15', '2025-12-29', '2025-12-28', 'returned');

-- รายการที่ 3: เกินกำหนด (ยังไม่คืน)
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, status) 
VALUES (5, 1, '2025-12-20', '2026-01-03', 'overdue');