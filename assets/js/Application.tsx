import "bootstrap";
import "../css/app.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Cats } from "./Pages/Cats";
import { Home } from "./Pages/Home";

declare global {
    interface Window {
        host: string;
    }
}

ReactDOM.render((
    <BrowserRouter>
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
            <div className="container">
                <Link className={"navbar-brand"} to={"/"}>NestJS Single Page Application</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className={"nav-link"} to={"/"}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link"} to={"/cats"}>Cats</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/cats" component={Cats}/>
        </Switch>
    </BrowserRouter>
), document.getElementById("root"));
