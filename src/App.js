import {
    RouterProvider,
} from "react-router-dom";
import "./common/style/app.scss";
import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import commonService from "./common/services";
import {setLanguages} from "./common/slices/languages";
import {router} from "./routes";

function App() {
    const dispatch = useDispatch();

    const getLanguages = async () => {
        const res = await commonService.getLanguages();
        const languages = await res.data;
        dispatch(setLanguages(languages.data));
    };

    useEffect(() => {
        getLanguages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <RouterProvider router={router}/>;
}

export default App;
