import Forms from "./Forms";
import Index from "./Index";

export default [
    {
        path: "/page",
        element: <Index/>,
        name: "page.index"
    },
    {
        path: "/page/store",
        element: <Forms/>,
        name: "page.store"

    },
    {
        path: "/page/:id",
        element: <Forms/>,
        name: "page.edit"
    },
]