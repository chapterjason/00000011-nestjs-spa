import { ConsoleSectionOutput } from "@mscs/console";

export class Loader {

    protected interval: number = 80;

    protected frames: string[] = [
        "⠋",
        "⠙",
        "⠹",
        "⠸",
        "⠼",
        "⠴",
        "⠦",
        "⠧",
        "⠇",
        "⠏",
    ];

    protected text: string = "";

    protected timer: number = 0;

    protected lastFrameTime: number = 0;

    protected running: boolean = false;

    protected output: ConsoleSectionOutput;

    protected id: NodeJS.Timeout;

    protected lastDisplay: string = "";

    public constructor(output: ConsoleSectionOutput) {
        this.output = output;
        this.lastFrameTime = this.frames.length * this.interval;
    }

    public setText(text: string) {
        this.text = text;
    }

    public start(text: string) {
        this.setText(text);
        this.running = true;
        this.id = setTimeout(() => {
            this.loop();
        }, 1);
    }

    public stop(text: string) {
        if (this.running) {
            clearTimeout(this.id);
            this.running = false;
            this.setText(text);
            this.output.overwrite(this.text);
        }
    }

    protected display(display: string) {
        if (this.lastDisplay !== display) {
            this.output.overwrite(display);
            this.lastDisplay = display;
        }
    }

    protected loop() {
        this.timer++;

        if (this.lastFrameTime === this.timer) {
            this.timer = 0;
        }

        const frame = Math.ceil((this.timer + 1) / this.interval);
        const display = this.frames[frame - 1] + " " + this.text;

        this.display(display);

        this.id = setTimeout(() => {
            if (this.running) {
                this.loop();
            }
        }, 1);
    }

}
