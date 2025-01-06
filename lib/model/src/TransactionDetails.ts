interface Model {
    transactionDetails_id: string;
    credit_id: string;
    monthlyAmount: number; // סכום הגבייה החודשי
    totalAmount: number; // סכום כולל לגבייה
    nextBillingDate: Date; // תאריך הגבייה הבא
    lastBillingDate?: Date; // תאריך הגבייה האחרון שבוצע (לא חובה)
    isActive: boolean; // האם העסקה פעילה
}

export { Model }