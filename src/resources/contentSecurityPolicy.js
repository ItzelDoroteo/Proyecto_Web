// contentSecurityPolicy.js
const contentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.userway.org code.tidio.co https://www.google.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://api.userway.org https://api.tidio.co http://localhost:5000/ https://www.google.com/recaptcha/;
    font-src 'self' data:;
    img-src 'self' data: https://cdn.userway.org code.tidio.co;
    frame-src https://cdn.userway.org code.tidio.co https://www.google.com;
`;

export default contentSecurityPolicy;
