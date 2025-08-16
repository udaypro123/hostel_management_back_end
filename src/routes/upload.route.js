import { Router } from 'express';
import { upload, uploadFile, uploadToCloudinary, deleteFile } from '../utils/fileUpload.js';

const router = Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const tmpPath = await uploadFile(req.file);
    const result = await uploadToCloudinary(tmpPath, 'my-app');
    await deleteFile(tmpPath);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
