const { google } = require("googleapis");
const readline = require("readline");

// Usage: node scripts/getRefreshToken.js <CLIENT_ID> <CLIENT_SECRET>

const CLIENT_ID = process.argv[2];
const CLIENT_SECRET = process.argv[3];
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.log("Usage: node scripts/getRefreshToken.js <CLIENT_ID> <CLIENT_SECRET>");
    process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
});

console.log("\nAuthorize this app by visiting this url:\n", authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("\nEnter the code from that page here: ", async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log("\nSuccessfully retrieved tokens!");
        console.log("\nAdd these to your .env file:");
        console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
        console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log(`GOOGLE_REDIRECT_URI=${REDIRECT_URI}`);
    } catch (err) {
        console.error("\nError retrieving access token", err);
    }
    rl.close();
});
