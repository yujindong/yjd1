const path = require("path");
const babel = require("rollup-plugin-babel");
const replace = require("rollup-plugin-replace");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const { sizeSnapshot } = require("rollup-plugin-size-snapshot");
const { uglify } = require("rollup-plugin-uglify");

const ModuleName = "PerpetualCalendar";
const moduleFileName = "perpetual-calendar";
const pkg = require("./package.json");

function isBareModuleId(id) {
  console.log(id);
  console.log(path.join(process.cwd(), "modules"));
  return (
    !id.startsWith(".") && !id.includes(path.join(process.cwd(), "modules"))
  );
}

const outpubOptions = {
  banner: `/*!
 * 
 *         ${pkg.name}
 *         version: ${pkg.version}
 *         license: ${pkg.license}
 *         author: ${pkg.author}
 *         home: http://www.yujindong.com
 *       
 */`
};
const cjs = [
  {
    input: "modules/index.js",
    output: {
      file: `cjs/${moduleFileName}.js`,
      format: "cjs",
      esModule: false,
      ...outpubOptions
    },
    external: isBareModuleId,
    plugins: [
      babel({ exclude: /node_modules/, sourceMaps: true, rootMode: "upward" }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
        "process.env.BUILD_FORMAT": JSON.stringify("cjs")
      })
    ]
  },
  {
    input: "modules/index.js",
    output: {
      file: `cjs/${moduleFileName}.min.js`,
      format: "cjs",
      ...outpubOptions
    },
    external: isBareModuleId,
    plugins: [
      babel({ exclude: /node_modules/, sourceMaps: true, rootMode: "upward" }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.BUILD_FORMAT": JSON.stringify("cjs")
      }),
      uglify()
    ]
  }
];

const esm = [
  {
    input: "modules/index.js",
    output: {
      file: `esm/${moduleFileName}.js`,
      format: "esm",
      sourcemap: true,
      ...outpubOptions
    },
    external: isBareModuleId,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
        rootMode: "upward"
      }),
      replace({ "process.env.BUILD_FORMAT": JSON.stringify("esm") }),
      sizeSnapshot()
    ]
  }
];

// 将npm package name 转换成模块名
const globals = {
  // 'jsonrpc-lite': 'jsonrpc'
};
const umd = [
  {
    input: "modules/index.js",
    output: {
      file: `umd/${moduleFileName}.js`,
      sourcemap: true,
      sourcemapPathTransform: (relativePath) => relativePath.replace(/^.*?\/node_modules/, "../../node_modules"),
      format: "umd",
      name: ModuleName,
      globals,
      ...outpubOptions
    },
    external: Object.keys(globals), // external 声明是外部饮用，不会打包到模块中
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
        rootMode: "upward"
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
        "process.env.BUILD_FORMAT": JSON.stringify("umd")
      }),
      sizeSnapshot()
    ]
  },
  {
    input: "modules/index.js",
    output: {
      file: `umd/${moduleFileName}.min.js`,
      sourcemap: true,
      sourcemapPathTransform: relativePath =>
        relativePath.replace(/^.*?\/node_modules/, "../../node_modules"),
      format: "umd",
      name: ModuleName,
      globals,
      ...outpubOptions
    },
    external: Object.keys(globals), // external 声明是外部饮用，不会打包到模块中
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
        rootMode: "upward"
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.BUILD_FORMAT": JSON.stringify("umd")
      }),
      sizeSnapshot(),
      uglify()
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case "cjs":
    config = cjs;
    break;
  case "esm":
    config = esm;
    break;
  case "umd":
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

module.exports = config;
