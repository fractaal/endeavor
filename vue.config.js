const path = require('path');

module.exports = {
  pluginOptions: {
    electronBuilder: {
      //chainWebpackMainProcess(config) {
      //  config.entry('elearn').add(path.join(__dirname, 'src/elearn.js'))
      //},
      nodeIntegration: true,
      builderOptions: {
        productName: "Endeavor",
        appId: "jude.endeavor",
        asar: true,
        /*
        win: {
            target: ["portable"]
        },
        portable: {
            artifactName: "Endeavor.exe"
        },*/
        publish: ['github']
      }
    }
  }
}