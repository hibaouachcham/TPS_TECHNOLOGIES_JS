import { Request, Response } from 'express';
import { Book } from '../models/Book';

// Récupérer tous les livres
export const getAllBooks = async (_req: Request, res: Response) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres', error });
    }
};

// Récupérer un livre par ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du livre', error });
    }
};

// Créer un nouveau livre
export const createBook = async (req: Request, res: Response) => {
    try {
        const { title, author, totalPages, status, price, pagesRead, format, suggestedBy } = req.body;
        
        const newBook = new Book({
            title,
            author,
            totalPages,
            status,
            price,
            pagesRead: pagesRead || 0,
            format,
            suggestedBy,
            finished: pagesRead >= totalPages
        });
        
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du livre', error });
    }
};

// Mettre à jour la progression de lecture
export const updateProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { page } = req.body;
        
        const book = await Book.findById(id);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        
        await book.currentlyAt(page);
        res.status(200).json({ message: 'Progression mise à jour', book });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour', error });
    }
};

// Supprimer un livre
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        
        await book.deleteBook();
        res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression', error });
    }
};

// Statistiques globales
export const getStats = async (_req: Request, res: Response) => {
    try {
        const allBooks = await Book.find();
        const finishedBooks = allBooks.filter((book: any) => book.finished);
        const totalPagesRead = allBooks.reduce((sum: number, book: any) => sum + book.pagesRead, 0);
        const totalPages = allBooks.reduce((sum: number, book: any) => sum + book.totalPages, 0);
        
        res.status(200).json({
            totalBooks: allBooks.length,
            finishedBooks: finishedBooks.length,
            totalPagesRead,
            totalPages,
            completionRate: totalPages > 0 ? (totalPagesRead / totalPages) * 100 : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error });
    }
};