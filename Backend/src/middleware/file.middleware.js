import multer from "multer"


export const uplaod = multer ({
    storage:multer.memoryStorage(),
    limits:{
        filesSizes: 3 * 1024 * 1024 // 3MB
    }
})