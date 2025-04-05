const { AuthenticationClient } = require('auth0');

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        const accessToken = data.accessToken;

        // Initialize Auth0 client
        const auth0 = new AuthenticationClient({
            domain: process.env.AUTH0_DOMAIN,
            clientId: process.env.AUTH0_CLIENT_ID
        });

        // Verify the token
        const userInfo = await auth0.getProfile(accessToken);

        // Check if user is in allowed users list/has correct permissions
        // This is where you'd implement your officer access control

        return {
            statusCode: 200,
            body: JSON.stringify({
                isAuthorized: true,
                user: userInfo
            })
        };
    } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized" })
        };
    }
};