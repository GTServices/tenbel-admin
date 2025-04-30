import routes from "./routes";
import {router} from "../routes";
import {routeUrl} from "../common/utils/helpers";

export default [
    {
        label: "Forms",
        icon: "pi pi-fw pi-box",
        command: () => {
            router.navigate(routeUrl(routes, 'forms.index'));
        },
    },
];