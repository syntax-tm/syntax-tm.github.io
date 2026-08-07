export default {
  module: {
    rules: [
      {
        test: /\.(glsl|hlsl|vert)$/i,
        type: 'asset/source',
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          'postcss-loader',
          'style-loader',
          'css-loader',
        ]
      }
    ],
  },
};