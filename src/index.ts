import app from './app';

// TODO port from .env
// const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
