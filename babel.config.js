const loose = true;

module.exports = api => {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          loose,
          ...(api.env("test") && { targets: { node: "current" } })
        }
      ]
    ],
    plugins: [
      "dev-expression",
      ["@babel/plugin-proposal-class-properties", { loose }]
    ]
  };
};
