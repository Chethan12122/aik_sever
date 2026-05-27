// const server = require('./main/servers');



const app = require('./main/app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
