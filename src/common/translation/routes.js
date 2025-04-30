import Forms from "./Forms";
import Index from "./Index";

export default [
    {
        path: "/translation",
        element: <Index/>,
        name: "translation.index"
    },
    {
        path: "/translation/store",
        element: <Forms/>,
        name: "translation.store"

    },
    {
        path: "/translation/:id",
        element: <Forms/>,
        name: "translation.edit"
    },
]