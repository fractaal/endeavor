
module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: ['keytar'],
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