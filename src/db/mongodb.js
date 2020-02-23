const mongoose = require('mongoose');
module.exports = async () => {
  try{
      await mongoose.connect(process.env.DB_CONNECTION, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false
      });

      console.log('MongoDB is connection');
  }catch(e){
      console.error(e);
  }
}
