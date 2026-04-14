import Router from 'express';
import multer from 'multer';
import userController from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { mongoMiddleware } from '../middleware/mongoMiddleware.js';

const router = new Router();
router.use(mongoMiddleware);

const {
    registration,
    login,
    verification,
    resendCodeVerification,
    logout,
    update,
    deleteUser,
    refresh,
    uploadFile,
    getImage,
    getStats,
    submitFeedback
} = userController;


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
            const err = new Error('Only JPG and PDF files must be provided');
            err.code = 'INVALID_FILE_TYPE';
            return callback(err);
        }
        callback(null, true);
    }
});

router.post('/registration', registration);
router.post('/login', login);
router.post('/code-verification', verification);
router.post('/code-resend', resendCodeVerification);
router.post('/logout', logout);
router.patch('/update', authMiddleware, update);
router.delete('/delete', authMiddleware, deleteUser);
router.post('/refresh', refresh);
router.post('/upload', authMiddleware, upload.single('avatar'), uploadFile);
router.get('/:id/avatar', getImage);
router.get('/admin-stats', authMiddleware, getStats);
router.post('/user-feedback', authMiddleware, submitFeedback);

export default router;

