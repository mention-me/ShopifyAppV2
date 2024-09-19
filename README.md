# Mention Me Shopify App (Beta)

This app implements the Mention Me Referrer and Referee journeys within the Shopify Checkout Extensibility tools.

This application is work in progress, and we recommend reaching out to us at support@mention-me.com if you're interested
in using it.

Our goal is to have this as an app you can install directly within your store. In the meantime, we can work with you to
implement the experience in your store.

## Installing as a Custom App

Installing this application as a custom app should work for any Shopify store.

Access to the admin panel (to change settings) will require some custom configuration. Please contact our team at
support@mention-me.com and we will assist you.

### Set up steps

Follow the steps below to add this application as a Custom App to your Shopify Store(s).

From the root of the repository:

1. On the command line and in this directory, run `yarn run deploy --reset`
2. Choose your organisation
3. Choose "(y) Yes, create it as a new app"
4. Enter a name, e.g. "Mention Me - My Store"
5. Confirm (or edit if desired) the configuration file name
6. Confirm including the toml file on deploy
7. Confirm you'd like to release a version.

You will get a warning that the app requires Network Access.

To do this, visit partners.shopify.com and login. Then:

1. Find your App in the App list
2. Under "API Access", click "Allow network access".
3. (Optional) Under "Configuration" change the Logo and API Contact Email.
4. Return to "Overview" and copy the Client ID.

Now, edit your `shopify.app.<store-name>.toml` file to be similar to the configuration
of `shopify.app.custom-example.toml`.

You will need to:

- Ensure the redirect_url matches the `shopify.app.custom-example.toml` file.
- Ensure the `application_url` includes your client ID

Finally, run `yarn run deploy` again, this time confirming you wish to deploy. Shopify CLI should confirm that your
configuration has changed.

### Distribution

Once ready to install the app, choose "Distribution" from the partners.shopify.com menu for this app.

Select "Custom Distribution", and confirm the "myshopify.com" domain of one of your stores, e.g. "my-store.myshopify.com".

This will generate a URL which you can now use to install the app in your store.

### Installation

The final step is to install the app. Installing the app will work, but you will not be able to access the admin panel
to change settings like your Mention Me Partner Code.

To do this, please contact support@mention-me.com and we will guide you through the process of doing this.
