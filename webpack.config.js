export default {
  module: {
    rules: [
      {
        test: /\.(glsl|hlsl|vert)$/i,
        type: 'asset/source',
      },
    ],
  },
};