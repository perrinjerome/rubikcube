import "./index.css";

// react
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

/*

// no react (a bit faster build)
const root = document.getElementById("root") as HTMLDivElement;
// XXX set class main as we did in jsx
import "./App.css";
root.className = "main";

import threeEntryPoint from "./three/threeEntryPoint";
threeEntryPoint(root);
*/

//import registerServiceWorker from "./registerServiceWorker";
//registerServiceWorker();
