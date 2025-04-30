import Index from "./Index";
import Forms from "./Forms";

export default [
    {
        path: "/package-group",
        element: <Index/>,
        name: "package-group.index"
    },
    {
        path: "/package-group/store",
        element: <Forms/>,
        name: "package-group.store"
    },
    {
        path: "/package-group/:id",
        element: <Forms/>,
        name: "package-group.update"
    },
];