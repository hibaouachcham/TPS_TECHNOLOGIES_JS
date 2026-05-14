import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import bookRoutes from './routes/bookRoutes';
import { Request, Response } from 'express';

// Étendre le type Session pour inclure 'user'
declare module 'express-session' {
    interface SessionData {
        user: string;
    }
}

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(session({
    secret: 'BOOK-TRACKER-SECRET-KEY-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/booktracker')
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch((err) => console.error('❌ Erreur MongoDB:', err));

// Routes API
app.use('/api/books', bookRoutes);

// Middleware pour protéger les routes
const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }
    next();
};

// ============ ROUTES WEB (PUG) ============

// Page d'accueil
app.get('/', (req: Request, res: Response) => {
    res.render('index', { session: req.session });
});

// Page de connexion
app.get('/login', (req: Request, res: Response) => {
    res.render('login', { session: req.session, error: null });
});

// Traitement de la connexion
app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    // Authentification simple (admin/admin)
    if (username === 'admin' && password === 'admin') {
        req.session.user = username;
        res.redirect('/');
    } else {
        res.render('login', { session: req.session, error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
});

// Déconnexion
app.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Interface pour le type Book
interface Book {
    _id: string;
    title: string;
    author: string;
    totalPages: number;
    status: string;
    price: number;
    pagesRead: number;
    format: string;
    suggestedBy: string;
    finished: boolean;
}

// Page liste des livres
app.get('/books', async (req: Request, res: Response) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3000/api/books');
        const books = await response.json() as Book[];
        res.render('books', { session: req.session, books });
    } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        res.render('books', { session: req.session, books: [] });
    }
});

// Page ajout de livre (protégée)
app.get('/books/add', requireAuth, (req: Request, res: Response) => {
    res.render('add-book', { session: req.session, error: null });
});

// Traitement ajout de livre (protégé)
app.post('/books/add', requireAuth, async (req: Request, res: Response) => {
    try {
        const fetch = (await import('node-fetch')).default;
        await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        res.redirect('/books');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du livre:', error);
        res.render('add-book', { session: req.session, error: 'Erreur lors de l\'ajout du livre' });
    }
});

// Page statistiques
app.get('/stats', async (req: Request, res: Response) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3000/api/books');
        const books = await response.json() as Book[];
        
        const totalBooks = books.length;
        const finishedBooks = books.filter((b) => b.finished).length;
        const totalPagesRead = books.reduce((sum, b) => sum + (b.pagesRead || 0), 0);
        const totalPages = books.reduce((sum, b) => sum + b.totalPages, 0);
        
        res.render('stats', { 
            session: req.session, 
            totalBooks, 
            finishedBooks, 
            totalPagesRead, 
            totalPages,
            books 
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.render('stats', { 
            session: req.session, 
            totalBooks: 0, 
            finishedBooks: 0, 
            totalPagesRead: 0, 
            totalPages: 0, 
            books: [] 
        });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});