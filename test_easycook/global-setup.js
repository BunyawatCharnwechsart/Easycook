const fs = require('fs');
const path = require('path');

module.exports = async () => {
  fs.writeFileSync(path.join(__dirname, '.run-id'), String(Date.now()), 'utf8');
};
