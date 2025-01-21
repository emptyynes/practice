const path = require('path')

module.exports = {
    entry: 'backend/index.js',

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.bundle.js',
    }
}