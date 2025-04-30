import {router} from "../../routes";
import {routeUrl} from "../utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Translations",
        icon: "pi pi-language",
        command: () => {
            router.navigate(routeUrl(routes, 'translation.index'));
        },
    },
];