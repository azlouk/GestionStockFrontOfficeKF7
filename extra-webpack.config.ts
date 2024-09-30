const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    plugins: [
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg|png|jpg|jpeg|gif|bmp|webp)$/,
            threshold: 1024,
            minRatio: 0.8,
        }),
    ],
};
