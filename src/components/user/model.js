const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

});

const rolesSchema = mongoose.Schema({

});

const sessionSchema = mongoose.Schema({

});

const User = mongoose.model('users', userSchema);

const Role = mongoose.model('user_roles', rolesSchema);

const Session = mongoose.model('sessions', sessionSchema);

module.exports = {
  // TODO: all abstraction to database
};
