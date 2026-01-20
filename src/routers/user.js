import Router from 'express';
const router = new Router();

import multer from 'multer';
import userController from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const {
    registration,
    login,
    logout,
    update,
    deleteUser,
    refresh,
    uploadFile,
    getImage
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
router.post('/logout', logout);
router.patch('/update', authMiddleware, update);
router.delete('/delete', authMiddleware, deleteUser);
router.post('/refresh', refresh);
router.post('/upload', authMiddleware, upload.single('avatar'), uploadFile);
router.get('/:id/avatar', getImage);

export default router;

