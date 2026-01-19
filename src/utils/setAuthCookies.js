export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export const setAuthCookies = (res, accessTokenVal, refreshTokenVal) => {

    res.cookie('accessToken', accessTokenVal, {
        maxAge: ACCESS_TOKEN_MAX_AGE,
        ...COOKIE_OPTIONS
    });

    res.cookie('refreshToken', refreshTokenVal, {
        maxAge: REFRESH_TOKEN_MAX_AGE,
        ...COOKIE_OPTIONS
    });

};