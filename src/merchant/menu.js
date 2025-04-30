import MerchantMenu from './user/menu';
import ProductMenu from './product/menu';

export default [
    {
        label: "Merchants",
        icon: "pi pi-fw pi-shopping-cart",
        items: [
            ...MerchantMenu,
            ...ProductMenu,
        ],
    },
];