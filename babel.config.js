module.exports = {
  presets: [
  ['@babel/preset-env', {targets: {node: 'current'}}],
  ["@babel/preset-react", { "runtime": "automatic" }], // Transforms JSX into JavaScript
  "@babel/preset-typescript", // If you're using TypeScript
  ],
};