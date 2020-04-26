import { Application, ConsoleOutput } from "@mscs/console";
import { Docker } from "./utils/Docker";
import { Yarn } from "./utils/Yarn";

const application = new Application("00000011-nestjs-spa", "0.1.0-DEV");

application.register("stop")
           .setDescription("Stops the application")
           .setCode(async (input, output) => {

               if (output instanceof ConsoleOutput) {
                   const docker = new Docker(output);
                   const yarn = new Yarn(output);

                   await docker.down();
               }

               return 0;
           });

application.setDefaultCommand("stop");

async function runtime() {
    await application.run();
}

runtime()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
