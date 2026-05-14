import mongoose, { Schema, Document } from 'mongoose';

// Enums (cours TypeScript pages 15-18)
export enum BookStatus {
    READ = 'Read',
    REREAD = 'Re-read',
    DNF = 'DNF',
    CURRENTLY_READING = 'Currently reading',
    RETURNED_UNREAD = 'Returned Unread',
    WANT_TO_READ = 'Want to read'
}

export enum BookFormat {
    PRINT = 'Print',
    PDF = 'PDF',
    EBOOK = 'Ebook',
    AUDIOBOOK = 'AudioBook'
}

// Interface (cours TypeScript page 37-38)
export interface IBook extends Document {
    title: string;
    author: string;
    totalPages: number;
    status: BookStatus;
    price: number;
    pagesRead: number;
    format: BookFormat;
    suggestedBy: string;
    finished: boolean;
    updateFinishedStatus(): void;
    currentlyAt(page: number): Promise<void>;
    deleteBook(): Promise<void>;
}

// Schema (cours Express/Mongoose page 30)
const BookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    totalPages: { type: Number, required: true, min: 1 },
    status: { type: String, enum: Object.values(BookStatus), required: true },
    price: { type: Number, required: true, min: 0 },
    pagesRead: { type: Number, required: true, default: 0, min: 0 },
    format: { type: String, enum: Object.values(BookFormat), required: true },
    suggestedBy: { type: String, required: true },
    finished: { type: Boolean, default: false }
});

// Méthodes de la classe (cours TypeScript page 42-46)
BookSchema.methods.updateFinishedStatus = function(this: IBook): void {
    this.finished = this.pagesRead >= this.totalPages;
};

BookSchema.methods.currentlyAt = async function(this: IBook, page: number): Promise<void> {
    if (page < 0 || page > this.totalPages) {
        throw new Error(`La page doit être entre 0 et ${this.totalPages}`);
    }
    this.pagesRead = page;
    this.updateFinishedStatus();
    await this.save();
};

BookSchema.methods.deleteBook = async function(this: IBook): Promise<void> {
    await this.deleteOne();
};

export const Book = mongoose.model<IBook>('Book', BookSchema);