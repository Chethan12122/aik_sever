const bcrypt = require('bcrypt');

const plainPassword = 'aikyam@1234';

bcrypt.hash(plainPassword, 10).then(hash => {
    console.log('Hashed password:', hash);
});
