#!/usr/bin/env node
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var path = require("path");
var fs = require("fs");

const FgWhite = "\x1b[37m%s\x1b[0m";
const FgRed = "\x1b[31m%s\x1b[0m";
const FgYellow = "\x1b[33m%s\x1b[0m";
const FgGreen = "\x1b[32m%s\x1b[0m";
const FgCyan = "\x1b[36m%s\x1b[0m";


// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"

function output(data, color) {
    if (typeof data != "object") data = [data];

    for (let i in data) {
        if (color) console.log(color, data[i]);
        else console.log(data[i]);
    }
}

output(["\n\n",
    "==========================================",
    "======= Helper für Bannerlord Mod ========",
    "=========== by NonTestatum ===============",
    "==========================================",
    "\n\n",
],FgCyan);

var options = {
    "input_path": "F:/SteamLibrary/steamapps/common/Mount & Blade II Bannerlord",
    "lang_path": "/ModuleData/Languages",
    "ref_path": "/.refLang",
    "modules": ["Native", "SandBox", "SandBoxCore", "StoryMode"]
}


/**
 * process.argv.slice(2) => [ '--getFiles', '--compare', '--build' ]
 */
var args = process.argv.slice(2);

// holen der Sprachdateien aus dem Spieleverzeichnis (nach Update für Vergleich)
if(args.indexOf("--getFiles") != -1 || args.indexOf("-f") != -1) {

    output("+++++++++++ Dateien holen +++++++++++")

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
                    output(mod+' >>>'+file, FgGreen)
                }
            })
        });
    });
}




// überprüfen und vergleichen der xml Einträge von Original und Übersetzung
if(args.indexOf("--compare") != -1 || args.indexOf("-c") != -1) {

    output("+++++++++++ Vergleichen +++++++++++")

    options.modules.forEach(mod => {

        let refPath = path.join(__dirname,options.ref_path,mod);
        let modPath = path.join(__dirname,'Mod/Modules/LanguagePack',options.lang_path,'DE',mod);

        fs.readdir(refPath, (err, files) => {
            if(err) return console.error(err);
            
            files.forEach(file => {
                if (fs.existsSync(path.join(modPath, file))) {
                    let xml_ref = fs.readFileSync(path.join(refPath, file), "utf8");
                    let xml_mod = fs.readFileSync(path.join(modPath, file), "utf8");
                    let refText = {}
                    let modText = {}

                    parser.parseString(xml_ref, function(error, result) {
                        if(error === null) {
                            result.base.strings[0].string.forEach(xml=>{
                                refText[xml.ATTR.id] = xml.ATTR.text;
                                // console.log(xml.ATTR)
                            })
                            parser.parseString(xml_mod, function(error, result) {
                                if(error === null) {
                                    result.base.strings[0].string.forEach(xml=>{
                                        modText[xml.ATTR.id] = xml.ATTR.text;
                                        // Prüfung auf entfernte IDs
                                        if (typeof refText[xml.ATTR.id] === 'undefined') output(mod+'/'+file+' Entfernter Eintrag: '+xml.ATTR.id+' '+xml.ATTR.text, FgYellow)
                                    })
                                    
                                    for (let i in refText) {
                                        if (typeof modText[i] === 'undefined') output(mod+'/'+file+' !!Fehlender Eintrag: '+i+' '+refText[i], FgRed)
                                    }
        
                                }
                                else {
                                    console.log(error);
                                }
                            });
                        }
                        else {
                            console.log(error);
                        }
                    });

                }
                else output("!!Folgende Datei fehlt:"+mod+"/"+file, FgRed)
            })
        });
        fs.readdir(modPath, (err, files) => {
            if(err) return console.error(err);
            
            files.forEach(file => {
                if (!fs.existsSync(path.join(refPath, file))) output("!!Datei überflüssig:"+mod+"/"+file, FgYellow)
            })
        });
    });
}




// build Prozess für fertige Zip-Datei
if(args.indexOf("--build") != -1 || args.indexOf("-b") != -1) {

    output("+++++++++++ Mod erstellen +++++++++++")
}
