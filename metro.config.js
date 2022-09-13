
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);

/*
module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      sourceExts: ['.native','.ios.ts', '.native.ts', '.ts', '.ios.tsx', '.native.tsx','.tsx', '.ios.js', '.native.js','.js', '.ios.jsx' , '.native.jsx', '.jsx', '.ios.json', '.native.json', '.json'], //add here
    },
  };
  */