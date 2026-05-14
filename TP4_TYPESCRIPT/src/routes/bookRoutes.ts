import { Router } from 'express';
import {
    getAllBooks,
    getBookById,
    createBook,
    updateProgress,
    deleteBook,
    getStats
} from '../controllers/bookController';

const router = Router();

router.get('/', getAllBooks);
router.get('/stats', getStats);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id/progress', updateProgress);
router.delete('/:id', deleteBook);

export default router;