import { getCookie } from 'cookies-next'



const getAuthCookie = (cookieName: string) => {
    const cookie = getCookie(cookieName);
    if(!cookie) return undefined;
}