/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
module.exports = {
  webpack: {
    alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@scss': path.resolve(__dirname, 'src/scss'),
        '@domain': path.resolve(__dirname, 'src/domain'),
        '@constants': path.resolve(__dirname, 'src/constants')
    },
}}