import FileSystem from "./modules/FileSystem.mjs";

import LlvmBoxProcess from "./modules/LlvmBoxProcess.mjs";
import Python3Process from "./modules/Python3Process.mjs";
import MakeProcess from "./modules/MakeProcess.mjs";

class LLVM {
    initialised = false;

    constructor(){
        this.init();
    }

    fileSystem = null;
    tools = {};
    LLVMStdio;

    get(){
        if(self.buffer.length === 0) return null;
        const c = self.buffer.shift();
        return c;
    }

    async init() {
        // postMessage({
        //     target: "worker",
        //     type: "info",
        //     body: "Populating File System",
        // })

        const fileSystem = await new FileSystem();
        this.fileSystem = fileSystem;
        self.fileSystem = fileSystem;
        self.buffer = [];

        await fileSystem.unpack("./root.pack.br");

        await fileSystem.pull();

        const processConfig = {
            FS: fileSystem.FS
        };

        // postMessage({
        //     target: "worker",
        //     type: "info",
        //     body: "Initialising Tools",
        // })

        const tools = {
            "llvm-box": new LlvmBoxProcess({FS: fileSystem.FS, noFSInit: true}),
            "python": new Python3Process({FS: fileSystem.FS, onrunprocess: llvm.runHelper}),
            "pythonHelper": new Python3Process({FS: fileSystem.FS, onrunprocess: llvm.runHelper}),
            "make": new MakeProcess(processConfig),
        };
        self.tools = tools;

        for (let tool in tools) {
            await tools[tool];
        };

        // postMessage({
        //     target: "worker",
        //     type: "info",
        //     body: "Ready",
        // })

        self.tools["llvm-box"]._module.FS.init(llvm.get, undefined, undefined);

        //this.LLVMStdio = new LLVMStdio(self.tools["llvm-box"]._module);
        //console.log(await self.tools["llvm-box"].fileSystem.analyzePath("/src/codal_port"));
        
        // Faking microbitversion.h
        // this.fileSystem.mkdir('/src/codal_port/build');
        this.fileSystem.mkdir('/src/codal_port/build/genhdr')
        await this.fileSystem.writeFile('src/codal_port/build/genhdr/mpversion.h', '// This file was generated by py/makeversionhdr.py\n#define MICROPY_GIT_TAG "v1.20.0-dirty"\n#define MICROPY_GIT_HASH "294baf52b-dirty"\n#define MICROPY_BUILD_DATE "2023-07-25"');
        await this.fileSystem.writeFile('src/codal_port/build/genhdr/microbitversion.h', '// This file was generated by py/makeversionhdr.py\n#define MICROBIT_GIT_TAG "v1.20.0"\n#define MICROBIT_GIT_HASH "294baf52b"\n#define MICROBIT_BUILD_DATE "2023-07-25"');
        
        // // Using GNU Make, execute a dry-run, to later pipe all of these commands through llvm.run(),
        // let dryrun = await llvm.run("make PYTHON=python --dry-run -s");

        // // Turn into an array, delimited by \n
        // dryrun = dryrun.stdout.split("\n");
        
        // // First element isnt relevant to build.
        // dryrun.shift()
        
        // // TODO, this removes comments which are for some reason returned by the dryrun, maybe a flag changes this?
        // dryrun = dryrun.filter(function (item) {
        //     return item.indexOf("#") !== 0;
        // });

        // // TODO, this removes any 'echo' command, may choose to rewrite this and instead display info to user 
        // dryrun = dryrun.filter(function (item) {
        //     return item.indexOf("echo") !== 0;
        // });

        // // TODO, this removes any 'touch' command, dont have this avaliable in wasm
        // dryrun = dryrun.filter(function (item) {
        //     return item.indexOf("touch") !== 0;
        // });

        // // Send each element in dry run for processing.
        // for(let index in dryrun){
        //     console.log(llvm.runHelper(dryrun[index]));
        // }

        // let o = llvm.run("ld.lld -plugin /libraries/arm-none-eabi/liblto_plugin.so -plugin-opt=/libraries/arm-none-eabi/lto-wrapper -plugin-opt=-fresolution=/tmp/ccljymuZ.res -plugin-opt=-pass-through=-lgcc -plugin-opt=-pass-through=-lc_nano -plugin-opt=-pass-through=-lgcc -plugin-opt=-pass-through=-lc_nano -X -o MICROBIT /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crti.o /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtbegin.o /libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp/crt0.o -L/libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp -L/libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp -L/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp --gc-sections --wrap atexit --start-group -lstdc++_nano -lsupc++_nano -lgcc -lnosys --end-group ../../lib/codal/../../src/codal_port/filesystem.ld -Map ../../lib/codal/build/MICROBIT.map --start-group ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/main.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/microbithal.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/microbithal_audio.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/microbithal_microphone.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/mphalport.cpp.o ../../lib/codal/build/libcodal-microbit-v2.a ../../lib/codal/build/libcodal-core.a ../../lib/codal/build/libcodal-nrf52.a ../../lib/codal/build/libcodal-microbit-nrf5sdk.a ../../lib/codal/../../src/codal_port/build/libmicropython.a ../../lib/codal/build/libcodal-nrf52.a ../../lib/codal/build/libcodal-core.a ../../lib/codal/libraries/codal-microbit-v2/lib/bootloader.o ../../lib/codal/libraries/codal-microbit-v2/lib/mbr.o ../../lib/codal/libraries/codal-microbit-v2/lib/settings.o ../../lib/codal/libraries/codal-microbit-v2/lib/softdevice.o ../../lib/codal/libraries/codal-microbit-v2/lib/uicr.o -lnosys -lstdc++_nano -lsupc++_nano -lm -lc_nano -lgcc -lstdc++_nano -lsupc++_nano -lm -lc_nano -lgcc --end-group -lstdc++_nano -lm -lc_nano --start-group -lgcc -lc_nano --end-group --start-group -lgcc -lc_nano --end-group /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtend.o /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtn.o -T ../../lib/codal/libraries/codal-microbit-v2/ld/nrf52833-softdevice.ld");
        // console.log(o);
        // o = llvm.run("llvm-objcopy -O ihex MICROBIT MICROBIT.hex");
        // console.log(o)
        
        // console.log(await this.fileSystem.analyzePath("/src/codal_port"));
        console.log("READY")
        this.initialised = true;
    };

    onprocessstart = () => {};
    onprocessend = () => {};
    onstdout = () => {};
    onstderr = () => {};

    runHelper(args){
        if(self.fileSystem.FS.analyzePath("/src/codal_port/stream")?.object?.contents){
            self.buffer = Array.from(self.fileSystem.FS.analyzePath("/src/codal_port/stream").object.contents);
        }

        if(args.includes("makeversionhdr.py") || args.includes("microbitversion.h.pre")){
            return "Git Commands breaking things, ignoring";
        }

        // Below is a hacky way to parse bash commands, it will be custom to the commands we are using. 
        // Maybe some wasm based things can be done to replace this? 
        
        // This is used to tell users an error occured, and show some help, removing for now.
        if(args.includes(" || ")){ 
            args = args.split(" || "); 
            return llvm.run(args[0]);
        }
        // " | " each command reads the output of the previous. This is handled in python.
        // Also handles redirecting stdout.
        else if(args.includes(" | ") || args.includes(" > ")){
            args = "pythonHelper utils.py "+args;
            return llvm.run(args);
        }
        if(args.includes("PORT_DIR=")) args = args.replace("PORT_DIR=","PORT_DIR=../../src/codal_port") 
        // Default case
        return llvm.run(args);
    }

    run(args) {
        if((typeof args) === "string") args = args.split(/ +/g);
                
        switch (args[0]){
            case "arm-none-eabi-as"  : args.shift(); args.unshift("clang", "--target=thumbv7m-none-eabi", "-c"); break;
            case "arm-none-eabi-gcc" : args.shift(); args.unshift(...replaceGCC); break;
            case "arm-none-eabi-ar"  : args[0] = "llvm-ar"; break; 
        }

        let process = null;
        let cd = "";
        switch (args[0]){
            case "python": process = "python";   break;
            case "pythonHelper" : process = "pythonHelper"; args[0] = "python"; break;
            case "make"  : process = "make";     break;
            case "cp" : return; // Ignoring CP for now 
            //case "cp"    : process = "pythonHelper" ; args = args.unshift("python", "utils.py"); break;
            case "(cd"   : cd = args[1];         return args;  // TODO, Append to end of CWD, and still run nex command.
            case "mkdir" : console.log(args) ; llvm.fileSystem.mkdirTree("/src/codal_port/"+args[2]); return "Made"; // mkdir replacement.
            default      : process = "llvm-box"; break;  // TODO Avoid doing 5 different checks for this, should probably be error handling though
        }

        // console.log(args);

        let p = self.tools[process].exec(args, {
            print: (...args) => (...args) => {},
            printErr: (...args) => (...args) => {},
            cwd: "/src/codal_port".concat(cd)
        })
        return p;
    };

    //Cannot get readFile() to work, not sure if its due to the encoding of MICROBIT.hex,
    //FileSystem only allows 'utf8' and 'binary'. This returns the byte array anyway.
    async getHex(){
        let arr = Array.from(await this.fileSystem.FS.analyzePath('/src/codal_port/MICROBIT.hex').object.contents);
        while(arr[arr.length-1] === 0) arr.pop(); // Removing trailing Zeroes, Array is ~twice the size it needs to be
        return Uint8Array.from(arr);
    };

    async saveFiles(files) {
        for (let f in files) {
            this.saveFile(f, files[f]);
        }
    }

    async saveFile(name, contents){
        await this.fileSystem.writeFile('/working/'+name,contents);
    };
}

const replaceGCC = ['clang','--target=arm-none-eabi','-I/include','-I/include/arm-none-eabi-c++/c++/10.3.1',
'-I/include/arm-none-eabi-c++','-I/include/arm-none-eabi-c++/arm-none-eabi/thumb/v7e-m+fp/softfp','-I/include/arm-none-eabi-c++/c++/10.3.1/arm-none-eabi',
'-I/include/arm-none-eabi-c++/backward','-I/include/arm-none-eabi/include','-I/include/arm-none-eabi/include-fixed']

function buildMicropython(fileArray) {
    // Using GNU Make, execute a dry-run, to later pipe all of these commands through llvm.run(),
    let dryrun = llvm.run("make PYTHON=python --dry-run -s");

    // Turn into an array, delimited by \n
    dryrun = dryrun.stdout.split("\n");
    
    // First element isnt relevant to build.
    dryrun.shift()
    
    // TODO, this removes comments which are for some reason returned by the dryrun, maybe a flag changes this?
    dryrun = dryrun.filter(function (item) {
        return item.indexOf("#") !== 0;
    });

    // // TODO, this removes any 'echo' command, may choose to rewrite this and instead display info to user 
    // dryrun = dryrun.filter(function (item) {
    //     return item.indexOf("echo") !== 0;
    // });

    // TODO, this removes any 'touch' command, dont have this avaliable in wasm
    dryrun = dryrun.filter(function (item) {
        return item.indexOf("touch") !== 0;
    });

    // Send each element in dry run for processing.
    for(let index in dryrun){
        if(dryrun[index].includes("GEN") || dryrun[index].includes("CC")) console.log(dryrun[index].replace("echo ", ""))
        else console.log(llvm.runHelper(dryrun[index]));
    }

    let o = llvm.run("ld.lld -plugin /libraries/arm-none-eabi/liblto_plugin.so -plugin-opt=/libraries/arm-none-eabi/lto-wrapper -plugin-opt=-fresolution=/tmp/ccljymuZ.res -plugin-opt=-pass-through=-lgcc -plugin-opt=-pass-through=-lc_nano -plugin-opt=-pass-through=-lgcc -plugin-opt=-pass-through=-lc_nano -X -o MICROBIT /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crti.o /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtbegin.o /libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp/crt0.o -L/libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp -L/libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp -L/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp --gc-sections --wrap atexit --start-group -lstdc++_nano -lsupc++_nano -lgcc -lnosys --end-group ../../lib/codal/../../src/codal_port/filesystem.ld -Map ../../lib/codal/build/MICROBIT.map --start-group ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/main.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/microbithal.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/microbithal_audio.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/microbithal_microphone.cpp.o ../build/CMakeFiles/MICROBIT.dir/home/johnn333/Documents/micro/micropython-microbit-v2/src/codal_app/mphalport.cpp.o ../../lib/codal/build/libcodal-microbit-v2.a ../../lib/codal/build/libcodal-core.a ../../lib/codal/build/libcodal-nrf52.a ../../lib/codal/build/libcodal-microbit-nrf5sdk.a ../../lib/codal/../../src/codal_port/build/libmicropython.a ../../lib/codal/build/libcodal-nrf52.a ../../lib/codal/build/libcodal-core.a ../../lib/codal/libraries/codal-microbit-v2/lib/bootloader.o ../../lib/codal/libraries/codal-microbit-v2/lib/mbr.o ../../lib/codal/libraries/codal-microbit-v2/lib/settings.o ../../lib/codal/libraries/codal-microbit-v2/lib/softdevice.o ../../lib/codal/libraries/codal-microbit-v2/lib/uicr.o -lnosys -lstdc++_nano -lsupc++_nano -lm -lc_nano -lgcc -lstdc++_nano -lsupc++_nano -lm -lc_nano -lgcc --end-group -lstdc++_nano -lm -lc_nano --start-group -lgcc -lc_nano --end-group --start-group -lgcc -lc_nano --end-group /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtend.o /libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtn.o -T ../../lib/codal/libraries/codal-microbit-v2/ld/nrf52833-softdevice.ld");
    console.log(o);
    o = llvm.run("llvm-objcopy -O ihex MICROBIT MICROBIT.hex");
    console.log(o)
    
    //console.log(await this.fileSystem.analyzePath("/src/codal_port"));
 
    // postMessage({
    //     target: "compile",
    //     type: "output",
    //     source: "objcopy",
    //     body: objOutput,
    // })

    return true;
}

//Checks if stderr is an error and not a warning
function isError(stderr) {
    return stderr.includes("error:");
}

async function clean() {
    let workingDir = await llvm.fileSystem.FS.analyzePath('/working/');
    let filesToRemove = workingDir.object.contents;

    for(let f in filesToRemove) {
        await llvm.fileSystem.unlink(`/working/${f}`);
    }
}

onmessage = async(e) => {
    //const msg = e.data;
    buildMicropython();
    postMessage(await llvm.getHex());

    // switch (msg.type) {
    //     case "buildMicropython": buildMicropython(); break;
    //     default: 
    //         postMessage({
    //             target: "worker",
    //             type: "error",
    //             body: `Unhandled request message type '${msg.type}' received.\nFull message:\n${msg}`,
    //         })
    //         break;
            
    // }
}

// async function handleBuildRequest(files) {
//     if (!llvm.initialised) {
//         postMessage({
//             target: "worker",
//             type: "error",
//             body: "Cannot compile yet, worker is not yet initialised"
//         })
//         return;
//     }

//     llvm.saveFiles(files);
        
//     let success = await compileCode(Object.keys(files))
    
//     if (success) {
//         const hex = await llvm.getHex();
//         postMessage({
//             target: "compile",
//             type: "hex",
//             body: hex,
//         });
//     } else {
//         postMessage({
//             target: "compile",
//             type: "error",
//             body: "Compilation failed",
//         })
//     }

//     postMessage({
//         target: "compile",
//         type: "compile-complete",
//     })

//     await clean();
// }

const llvm = new LLVM();