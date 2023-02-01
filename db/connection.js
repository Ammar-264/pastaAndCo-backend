const mongoose = require('mongoose')

mongoose
  .connect('mongodb+srv://ammar:ammar26apr@cluster0.vos3uee.mongodb.net/pastaAndCo?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));