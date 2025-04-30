import React, {useCallback} from "react";
import {Menubar} from "primereact/menubar";
import {useDispatch} from "react-redux";
import {logout} from "../../../admin/logout/slices/logout";
import {useNavigate} from "react-router-dom";
import "./navbar.scss";
import AdminMenu from "../../../admin/menu";
import MerchantMenu from "../../../merchant/menu";
import UserMenu from "../../../user/menu";
import RegionMenu from "../../../region/menu";
import EventsMenu from "../../../events/menu";
import CurrencyIndex from "../../../currencies/menu";
import PostMenu from "../../../post/menu";
import PartnerMenu from '../../../partner/menu';
import PageMenu from '../../../page/menu';
import SubscriptionMenu from '../../../subscription/menu';
import FormsMenu from '../../../Form/menu';
import CommonMenu from '../../menu';


const Navbar = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const logOut = useCallback(() => {
        dispatch(logout());
        navigate("/login");
        window.location.reload();
    }, [dispatch, navigate]);

    const items = [
        {
            label: "Home",
            icon: "pi pi-fw pi-home",
            command: () => navigate("/"),
        },
        {
            label: "Modules",
            items: [
                ...AdminMenu,
                ...MerchantMenu,
                ...UserMenu,
                ...RegionMenu,
                ...EventsMenu,
                ...PostMenu,
                ...PartnerMenu,
                ...CurrencyIndex,
                ...PageMenu,
                ...SubscriptionMenu,
                ...FormsMenu
            ]
        },
        ...CommonMenu,
        {
            label: "Quit",
            icon: "pi pi-fw pi-power-off",
            command: () => logOut(),
        }
    ];

    return (
        <nav className="navbar">
            <div className="card">
                <Menubar model={items}/>
            </div>
        </nav>
    );
};

export default React.memo(Navbar);
