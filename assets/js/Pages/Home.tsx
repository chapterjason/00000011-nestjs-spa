import * as React from "react";

export function Home() {

    const title = (
        <span className="text-success">NestJS Single Page Application</span>
    );

    const link = (
        <a href="https://github.com/chapterjason" rel="noopener noreferrer" target="_blank">chapterjason</a>
    );

    const heart = (
        <span className="fa fa-heart text-danger"/>
    );

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="text-center">
                        <h2>{title} Created with {heart} by {link}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
