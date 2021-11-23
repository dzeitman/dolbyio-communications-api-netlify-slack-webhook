  
## Dolby.io Communications API Slack intergration with Netlfy

Webhooks Overview 
1. Set up your platform or application with an HTTPS endpoint to receive the Dolby.io webhook events.

2. Copy and save the endpoint URL to use while configuring webhooks.

More information about webhooks and an [overview](https://docs.dolby.io/communications-apis/docs/webhooks-overview)

### Steps to create the slack integration:

3. Create a slack app and a slack webhook for that app: (Full Instructions)

4. Click the ***Deploy to Netlify***  button to clone our repo to your GitHub account and automatically deploy this function to Netlify:   [![Deploy To Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dolbyio-samples/dolbyio-communications-api-netlify-slack-webhook)

5. Enter in the **SLACK_WEBHOOK_URL** with the webhook you created in **Step 1** when prompted during the Netlify in the deployment process.  That form creates the environmental vars for you. So if you missed that step, add **SLACK_WEBHOOK_URL** and the url as the Key / Values in the environmental vars under deployment.

6. Once deployed, click on the link to you newly created app. Follow the link listed, you will see an error message: { statusCode: 405, body: "Method Not Allowed" } this is normal. Copy and save the url in the browser's address bar. This is your newly minted webhook.

7. Follow the directions below to configuring your app with the webhook you just deployed to Netlify.


To integrate your service with the webhook mechanism you'll need to configure within your developer dashboard.


**1.** Select the *SIGN IN* link located in the upper right corner of the Dolby.io page. Log in using your email and password.

**2.** Click the **DASHBOARD** link visible in the upper right corner of the website.

**3.** Select your application from the **APPLICATIONS** category located on the left side menu.

**4.** Select the **Communications APIs** category from the drop-down menu visible under your application.

**5.** Select the **Settings** tab at the top of the window.

**6.** Scroll down to the **Webhooks** category.

**7.** Click the **ADD WEBHOOK** button.

**8.** Enter the URL of your application endpoint and select events that you want to receive.

**9.** To finish, click the **ADD** button.

  

More information about [Configuring Webhooks.](https://docs.dolby.io/communications-apis/docs/guides-dolby-voice#configuring-webhooks)