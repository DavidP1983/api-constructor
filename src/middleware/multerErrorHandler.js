import multer from 'multer';

export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({ message: 'File to large' });
        }
        return res.status(400).send({ message: err.message });
    }

    if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).send({ message: err.message });
    }

    return next(err);
};