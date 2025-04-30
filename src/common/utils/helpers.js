export const routeUrl = (routes, routeName) => {
    return routes.find(r => r?.name === routeName)?.path;
}

export const formattedDate = (date) => {
    function getDay() {
        const day = date.getDate();
        return day < 10 ? `0${day}` : day;
    }

    function getMonth() {
        const month = date.getMonth() + 1;
        return month < 10 ? `0${month}` : month;
    }

    return `${date.getFullYear()}-${getMonth()}-${getDay()}`
}

export const stringToDate = (stringDate) => {
    if (!stringDate) {
        return null;
    }
    return new Date(Date.parse(stringDate));
}

export const boolToInt = (bool) => {
    return bool ? 1 : 0;
}

export const typeToValue = (value, type) => {
    let val = value;
    switch (type) {
        case 'date':
            val = formattedDate(value)
            break;
        case 'bool':
            val = boolToInt(value);
    }
    return val;
}