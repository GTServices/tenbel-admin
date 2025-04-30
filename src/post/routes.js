import Forms from "./Forms";
import Index from "./Index";

export default [
    {
        path: "/post",
        element: <Index/>,
        name: "post.index"
    },
    {
        path: "/post/store",
        element: <Forms/>,
        name: "post.store"

    },
    {
        path: "/post/:id",
        element: <Forms/>,
        name: "post.edit"
    },
]