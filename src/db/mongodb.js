const mongoose = require('mongoose');
const connection =  async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log('MongoDB is connection');
  } catch (e) {
    console.error(e);
  }
};

module.exports = async () => {
  if(process.env.NODE_ENV === 'test'){
    const { Mockgoose } = require('mockgoose');
    const mockgoose = new Mockgoose(mongoose);
    console.log('Yep');
    await mockgoose.prepareStorage();
    return await connection();
  }
  // Normal state
  return await connection();
}
