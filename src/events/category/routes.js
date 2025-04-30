import Index from "./Index";
import Forms from "./Forms";

export default [
    {
        path: "/category",
        element: <Index/>,
        name: "category.index"
    },
    {
        path: "/category/store",
        element: <Forms/>,
        name: "category.store"
    },
    {
        path: "/category/:id",
        element: <Forms/>,
        name: "category.update"
    },
];