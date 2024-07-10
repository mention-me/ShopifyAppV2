# Shared

This folder contains common code used across all of our Shopify Extensions.

## Hooks

Due to https://github.com/Shopify/ui-extensions/issues/1885, we understand that we can't use hooks within this code,
which means each hook takes the result from calling the hooks inside the extension as parameters.
