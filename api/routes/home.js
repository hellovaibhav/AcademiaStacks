import express from 'express';
import cors from 'cors';

const router = express.Router();

router.get('/', cors(), (req, res) => {
  res.status(200).json('The app is up and running');
});

export default router;