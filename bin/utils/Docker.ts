import { ConsoleOutput, OutputMode } from "@mscs/console";
import { Process } from "@mscs/process";
import { Loader } from "./Loader";
import { sleep } from "./Sleep";

export class Docker {

    private output: ConsoleOutput;

    public constructor(output: ConsoleOutput) {
        this.output = output;
    }

    async getContainerStatus(id: string) {
        const process = new Process(["docker", "inspect", "--format", "{{.State.Health.Status}}", id]);

        this.output.writeln(`Running command "${process.toString()}"`, { mode: OutputMode.VERBOSITY_VERY_VERBOSE });

        await process.mustRun();

        this.debug(process);

        return process.getOutput().trim();
    }

    async getContainerId(name: string) {
        const process = new Process(["docker-compose", "ps", "-q", name]);

        this.output.writeln(`Running command "${process.toString()}"`, { mode: OutputMode.VERBOSITY_VERY_VERBOSE });

        await process.mustRun();

        this.debug(process);

        return process.getOutput().trim();
    }

    async execute(name: string, command: string[], display: string, successMessage: string, failedMessage: string) {
        const id = await this.getContainerId(name);
        const process = new Process(["docker", "exec", id, ...command]);

        this.output.writeln(`Running command "${process.toString()}"`, { mode: OutputMode.VERBOSITY_VERY_VERBOSE });

        const section = this.output.section();
        const loader = new Loader(section);

        loader.start(`<comment>[Docker]</comment> ${display}`);

        try {
            await process.mustRun();

            this.debug(process);
            loader.stop(`<info>✔</info> <comment>[Docker]</comment> ${successMessage}`);
        } catch (error) {
            this.debug(process);
            loader.stop(`<error>✖ <comment>[Docker]</comment> ${failedMessage}.</error>`);
            section.writeln(process.getErrorOutput());
        }

        return process;
    }

    async up(build: boolean): Promise<boolean> {
        const process = new Process(["docker-compose", "up", "-d", ...(build ? ["--build"] : [])]);

        this.output.writeln(`Running command "${process.toString()}"`, { mode: OutputMode.VERBOSITY_VERY_VERBOSE });
        const section = this.output.section();
        const loader = new Loader(section);

        loader.start(`<comment>[Docker]</comment> Start container composition...`);

        try {
            await process.mustRun();

            this.debug(process);

            loader.stop(`<info>✔</info> <comment>[Docker]</comment> Container composition started.`);

            return true;
        } catch (error) {
            this.debug(process);
            loader.stop(`<error>✖ <comment>[Docker]</comment> Couldn't start container composition.</error>`);
            section.writeln(process.getErrorOutput());
        }
        return false;
    }

    async down(): Promise<boolean> {
        const process = new Process(["docker-compose", "down", "--remove-orphans", "--volumes"]);

        this.output.writeln(`Running command "${process.toString()}"`, { mode: OutputMode.VERBOSITY_VERY_VERBOSE });
        const section = this.output.section();
        const loader = new Loader(section);

        loader.start(`<comment>[Docker]</comment> Stop container composition...`);

        try {
            await process.mustRun();

            this.debug(process);
            loader.stop(`<info>✔</info> <comment>[Docker]</comment> Container composition stopped.`);

            return true;
        } catch (error) {
            this.debug(process);
            loader.stop(`<error>✖ <comment>[Docker]</comment> Couldn't stop container composition.</error>`);
            section.writeln(process.getErrorOutput());
        }

        return false;
    }

    async waitUntilContainerIsHealthy(name: string): Promise<boolean> {
        const id = await this.getContainerId(name);

        const section = this.output.section();
        const loader = new Loader(section);

        loader.start(`<comment>[Docker]</comment> Wait until container "${name}" is healthy...`);

        let status: string;
        while ("healthy" !== (status = await this.getContainerStatus(id))) {
            if ("unhealthy" === status) {
                loader.stop(`<error>✖ <comment>[Docker]</comment> Container "${name}" is unhealthy.</error>`);

                return false;
            }

            await sleep(1000);
        }

        loader.stop(`<info>✔</info> <comment>[Docker]</comment> Container ${name} is healthy.`);

        return true;
    }

    protected debug(process: Process) {
        this.output.writeln(["Output:", process.getOutput()], { mode: OutputMode.VERBOSITY_DEBUG });
        this.output.writeln(["ErrorOutput:", process.getErrorOutput()], { mode: OutputMode.VERBOSITY_DEBUG });
        this.output.writeln(["ExitCode:", (process as any).exitCode.toString()], { mode: OutputMode.VERBOSITY_DEBUG });
    }
}
