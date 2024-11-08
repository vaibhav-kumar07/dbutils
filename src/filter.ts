import moment from "moment";

export const applyPaginationFilter = (
    filters: any,
    pagination: any,
    sort: string
) => {
    let page = parseInt(pagination?.page as string) || 1;
    if (page < 1) page = 1;
    const limit = parseInt(pagination?.pageSize as string) || 20;

    const skip = page * limit - limit;

    ///sorting
    const [fieldName, order] = sort.split(":");
    const sortingOrder = order === "desc" ? -1 : 1;

    const sortOptions = {
        [fieldName]: sortingOrder,
    };

    const criteria: any = {};

    //filtering
    if (filters) {
        for (const [field, condition] of Object.entries(filters) as [
            string,
            Record<string, any>
        ][]) {
            const [operator, value] = Object.entries(condition)[0] || [];
            if (operator && value !== undefined) {
                if (operator.toLowerCase() === "$eqi") {
                    criteria[field] = { $regex: new RegExp(`^${value}$`, "i") };
                } else if (
                    operator.toLowerCase() === "$between" &&
                    typeof value === "string"
                ) {
                    const values = value.split(",");
                    if (values.length === 2) {
                        if (value.startsWith("dt")) {
                            const startDate = startOfDay(values[0].slice(2));
                            const endDate = endOfDay(values[1]);
                            criteria[field] = {
                                $gte: startDate,
                                $lte: endDate,
                            };
                        } else {
                            criteria[field] = {
                                $gte: values[0],
                                $lte: values[1],
                            };
                        }
                    }
                } else if (operator.toLowerCase() === "$contains") {
                    criteria[field] = { $regex: new RegExp(value, "i") };
                } else if (operator.toLowerCase() === "$in") {
                    const inValues = value
                        .split(",")
                        .map((v: string) => v.trim())
                        .map((v: string) => new RegExp(`^${v}$`, "i"));

                    criteria[field] = { $in: inValues };
                } else if (operator.toLowerCase() === "$lte") {
                    if (value.startsWith("dt")) {
                        const endDate = endOfDay(value.slice(2));
                        criteria[field] = { $lte: endDate };
                    } else {
                        criteria[field] = { $lte: value };
                    }
                } else if (operator.toLowerCase() === "$gte") {
                    if (value.startsWith("dt")) {
                        const startDate = startOfDay(value.slice(2));
                        criteria[field] = { $gte: startDate };
                    } else {
                        criteria[field] = { $gte: value };
                    }
                } else if (operator.toLowerCase() === "$in_num") {
                    const matchValues = value
                        .split(",")
                        .map((v: any) => parseFloat(v));
                    if (matchValues.some(isNaN)) {
                        console.log("Invalid input: Non-numeric values found");
                    } else if (matchValues.length > 1) {
                        criteria[field] = { $in: matchValues };
                    } else {
                        criteria[field] = matchValues[0];
                    }
                } else if (operator.toLowerCase() === "$eq") {
                    if (value == "null") {
                        criteria[field] = null;
                    } else {
                        criteria[field] = value;
                    }
                }
            }
        }
    }

    return { criteria, skip, limit, sortOptions };
};

export const endOfDay = (
    strDate: string,
    format: string = "YYYY-MM-DD"
): Date => {
    return moment(strDate, format).endOf("day").toDate();
};

export const startOfDay = (
    strDate: string,
    format: string = "YYYY-MM-DD"
): Date => {
    return moment(strDate, format).startOf("day").toDate();
};
