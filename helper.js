#!/usr/bin/env node
var path = require("path");
var fs = require("fs");

function output(data) {
    if (typeof data != "object") data = [data];

    for (let i in data) {
        console.log(data[i]);
    }
}

output(["\n\n",
    "==========================================",
    "======= Helper für Bannerlord Mod ========",
    "============= NonTestatum  ===============",
    "==========================================",
    "\n\n",
]);

var options = {
    "input_path": "F:/SteamLibrary/steamapps/common/Mount & Blade II Bannerlord",
    "lang_path": "/ModuleData/Languages",
    "ref_path": "/.refLang",
    "modules": ["native", "SandBox", "SandBoxCore", "StoryMode"]
}

output(__dirname)
output(path.join(options.input_path,'Modules','Native',options.lang_path))


/**
 * process.argv.slice(2) => [ '--getFiles', '--compare', '--build' ]
 */
var args = process.argv.slice(2);

// holen der Sprachdateien aus dem Spieleverzeichnis (nach Update für Vergleich)
if(args.indexOf("--getFiles") != -1 || args.indexOf("-f") != -1) {

    output("Dateien holen")

    options.modules.forEach(mod => {

        let refPath = path.join(__dirname,options.ref_path,mod);
        fs.readdir(refPath, (err, files) => {
            if(err) return console.error(err);
            
            files.forEach(file => {
                fs.unlinkSync(path.join(refPath,file))
            })
        });

        let srcPath = path.join(options.input_path,'Modules',mod,options.lang_path);
        fs.readdir(srcPath, (err, files) => {
            if(err) return console.error(err);
            
            files.forEach(file => {
                if (file.match(/(\.xml)/)) {
                    fs.copyFile(path.join(srcPath,file), path.join(refPath,file), (err) => {
                        if (err) throw err;
                    });
                    output(mod+' >>>'+file)
                }
            })
        });
    });

    // fs.copyFile('source.txt', 'destination.txt', (err) => {
    //     if (err) throw err;
    //     console.log('source.txt was copied to destination.txt');
    // });


}




// überprüfen und vergleichen der xml Einträge von Original und Übersetzung
if(args.indexOf("--compare") != -1 || args.indexOf("-c") != -1) {

    output("Vergleichen")
}




// build Prozess für fertige Zip-Datei
if(args.indexOf("--build") != -1 || args.indexOf("-b") != -1) {

    output("Mod erstellen")
}
