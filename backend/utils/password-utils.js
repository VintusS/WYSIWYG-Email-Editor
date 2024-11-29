const bcrypt = require('bcryptjs'); // If using Node.js

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

hashPassword('templatePassword').then(hashedPassword => {
    console.log(hashedPassword);
});
