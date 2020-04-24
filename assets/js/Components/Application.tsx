import { BrowserRouter, HashRouter, Link, Route, Switch } from "react-router-dom";
import { Home } from "../Pages/Home";
import { ListCats } from "../Pages/Cats/ListCats";
import * as React from "react";
import { ApplicationContextProvider } from "../Contexts/ApplicationContextProvider";
import { Client } from "../Services/Client";
import { ApplicationContextProps } from "../Contexts/ApplicationContextProps";
import { ApplicationProps } from "./ApplicationProps";
import { CreateCat } from "../Pages/Cats/CreateCat";

export function Application(props: ApplicationProps) {
    const { base } = props;
    const client = new Client(base);

    const applicationContext: ApplicationContextProps = {
        client,
    };

    return (
        <ApplicationContextProvider value={applicationContext}>
            <HashRouter>
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
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/cats/create" component={CreateCat}/>
                        <Route path="/cats" component={ListCats}/>
                    </Switch>
                </div>
            </HashRouter>
        </ApplicationContextProvider>
    );
}
