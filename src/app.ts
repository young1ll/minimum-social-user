import express from 'express';

// intializing
const app = express();

app.get('*', (req, res) => {
  res.status(200).send('helloworld');
});

export default app;
