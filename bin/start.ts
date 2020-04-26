import { Application, ConsoleOutput, OptionMode } from "@mscs/console";
import { Docker } from "./utils/Docker";
import { Yarn } from "./utils/Yarn";

const application = new Application("00000011-nestjs-spa", "0.1.0-DEV");

application.register("start")
           .setDescription("Starts the application")
           .addOption("build", null, OptionMode.VALUE_NONE, "Rebuild the container")
           .setCode(async (input, output) => {
               const build = input.getOption("build");

               if (output instanceof ConsoleOutput) {
                   const docker = new Docker(output);
                   const yarn = new Yarn(output);

                   await Promise.all([yarn.install(), docker.up(!!build)]);
                   await docker.waitUntilContainerIsHealthy("database");
                   await docker.execute("backend", ["yarn", "run", "ts-node", "--project", "./configs/tsconfig.backend.json", "node_modules/typeorm/cli.js", "migration:run"], "Running migration", "Migration successfully executed.", "Migration failed.");
               }

               return 0;
           });

application.setDefaultCommand("start");

async function runtime() {
    await application.run();
}

runtime()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
