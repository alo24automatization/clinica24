const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');


module.exports = {
    // ... other configuration settings
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new NodePolyfillPlugin(),
    ],
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            "fs": false,
            "tls": false,
            "net": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
        },
    }
};