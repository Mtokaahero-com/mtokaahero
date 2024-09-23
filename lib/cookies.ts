import { getCookie } from 'cookies-next'



const getAuthCookie = (cookieName: string) => {
    const cookie = getCookie(cookieName);
    if (!cookie) return undefined;
    

    return Buffer.from(cookie, 'base64').toString('ascii');
}


export const getValidAuthTokens = () => {
    const token = getAuthCookie('auth_token');
}