import routes from "./routes";
import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";

export default [
    {
        label: "Steps",
        icon: "pi pi-fw pi-step-forward",
        command: () => router.navigate(routeUrl(routes, "step.index")),
    },
];