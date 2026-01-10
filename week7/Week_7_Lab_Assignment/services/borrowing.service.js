const BorrowingDB = require('../database/borrowings.db');
const BookDB = require('../database/books.db');
const MemberDB = require('../database/members.db');

class BorrowingService {
    static async borrowBook(borrowData) {
        const { book_id, member_id } = borrowData;

        // 1. ตรวจสอบข้อมูลเบื้องต้น
        const book = await BookDB.findById(book_id);
        if (!book || book.available_copies <= 0) throw new Error("No available copies");

        const member = await MemberDB.findById(member_id);
        if (!member || member.status !== 'active') throw new Error("Member is not active");

        const activeCount = await BorrowingDB.countActiveByMemberId(member_id);
        if (activeCount >= 3) throw new Error("Borrow limit exceeded (max 3)");

        // 2. ตั้งค่าวันที่ (ยืมวันนี้ คืนใน 14 วัน)
        const borrowDate = new Date().toISOString().split('T')[0];
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 14);
        const dueDate = dueDateObj.toISOString().split('T')[0];

        // 3. บันทึกและลดสต็อก
        await BookDB.decreaseAvailableCopies(book_id);
        const result = await BorrowingDB.create({
            book_id,
            member_id,
            borrow_date: borrowDate,
            due_date: dueDate
        });

        // 4. ดึงข้อมูลแบบละเอียดมาตอบกลับ
        return await BorrowingDB.getDetailById(result.id);
    }

    static async returnBook(borrowingId) {
        const borrowing = await BorrowingDB.findById(borrowingId);
        if (!borrowing || borrowing.status === 'returned') throw new Error("Invalid record");

        const returnDateStr = new Date().toISOString().split('T')[0];
        await BorrowingDB.updateStatus(borrowingId, 'returned', returnDateStr);
        await BookDB.increaseAvailableCopies(borrowing.book_id);

        const dueDate = new Date(borrowing.due_date);
        const returnDate = new Date(returnDateStr);
        let fine = 0;
        let daysOverdue = 0;

        if (returnDate > dueDate) {
            const diffTime = returnDate.getTime() - dueDate.getTime();
            daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = daysOverdue * 20;
        }

        return { id: Number(borrowingId), return_date: returnDateStr, days_overdue: daysOverdue, fine: fine };
    }
}

module.exports = BorrowingService;