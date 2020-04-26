import { ConsoleOutput, OutputMode } from "@mscs/console";
import { Loader } from "./Loader";
import { Process } from "@mscs/process";

export class Yarn {

    protected output: ConsoleOutput;

    public constructor(output: ConsoleOutput) {
        this.output = output;
    }

    protected debug(process: Process){
        this.output.writeln(["Output:", process.getOutput()], { mode: OutputMode.VERBOSITY_DEBUG });
        this.output.writeln(["ErrorOutput:", process.getErrorOutput()], { mode: OutputMode.VERBOSITY_DEBUG });
        this.output.writeln(["ExitCode:", (process as any).exitCode.toString()], { mode: OutputMode.VERBOSITY_DEBUG });
    }

    public async install() {
        const process = new Process(["yarn", "install"]);
        const section = this.output.section();
        const loader = new Loader(section);

        this.output.writeln(`Running command "${process.toString()}"`, { mode: OutputMode.VERBOSITY_VERY_VERBOSE });

        loader.start(`<comment>[Yarn]</comment> Install dependencies...`);

        try {
            await process.run();

            this.debug(process);
            loader.stop(`<info>✔</info> <comment>[Yarn]</comment> Dependencies installed.`);

            return true;
        } catch (error) {
            this.debug(process);
            loader.stop(`<error>✖ <comment>[Yarn]</comment> Dependencies couldn't be installed.</error>`);
            section.writeln(process.getErrorOutput());
        }

        return false;
    }
}
