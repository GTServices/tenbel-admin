import Forms from "./Forms";
import Index from "./Index";

export default [
    {
        path: "/product",
        element: <Index/>,
        name: "product.index"
    },
    {
        path: "/product/store",
        element: <Forms/>,
        name: "product.store"

    },
    {
        path: "/product/:id",
        element: <Forms/>,
        name: "product.edit"
    },
]