// utility vars and functions used across app 

// navigate within SPA
export function changePage(page, loggedIn = undefined) {
    let appRouter = document.querySelector('stock-app');
    appRouter.setAttribute('page', page);

    if (loggedIn !== undefined) {
        let navBar = appRouter.shadowRoot.querySelector('stock-navbar');
        navBar.setAttribute('logged', loggedIn);
    }
}

// api related
export const API_ROOT = 'https://murmuring-reef-00061.herokuapp.com';

export function getDefaultHeaders(token) {
    let headers = {};
    headers['Content-Type'] = 'application/json';
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function getMe(token) {
    let res = await fetch(`${API_ROOT}/user/me/`, {
        method: 'GET',
        headers: getDefaultHeaders(token)
    });
    let data = await res.json();
    return data;
}