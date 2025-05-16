export const sendResponse = (message: object, status: number, headers?: object) => {
    return new Response(JSON.stringify(message), {
        status: status,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
};
