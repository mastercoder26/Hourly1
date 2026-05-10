const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

function resolveHoistedPackage(packageName) {
  const inProject = path.join(projectRoot, 'node_modules', packageName);
  if (fs.existsSync(inProject)) {
    return inProject;
  }
  return path.join(workspaceRoot, 'node_modules', packageName);
}

const workletsRoot = resolveHoistedPackage('react-native-worklets');
const workletsEntry = path.join(workletsRoot, 'lib/module/index.js');

// 1) Workspaces hoist react-native-worklets; ensure bare imports resolve.
// 2) The published package.json "react-native" field points at ./src/index, which is
//    not shipped on npm; Metro must use the built lib entry instead.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-worklets') {
    return { type: 'sourceFile', filePath: workletsEntry };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
