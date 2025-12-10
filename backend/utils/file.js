const fs = require('fs');

module.exports = {
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') return resolve([]);
        if (err) return reject(err);
        resolve(JSON.parse(data || '[]'));
      });
    });
  },

  writeFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};
