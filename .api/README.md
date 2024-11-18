# API Types

We install types for each of the APIs we use from Mention Me.

The identifiers come from the developers.mention-me.com API reference - visit the "API Reference" tab, choose the
API you want (e.g. for EntryPoint API, select one of the endpoints within), then click "Node" language choice in
the top right. The example will say something like `npx api install "@mention-me/v2.0#cfufm3n0p6ky"`. The API changes
with each version.

## Installation

Installed via:

```bash
npx api@next install -i "entry-point-api" "@mention-me/v2.0#3b3ja1jm3n0p6f2"
npx api@next install -i "consumer-api" "@mention-me/v2.0#cfufm3n0p6ky"
```

## Upgrade

Updated via:

```bash
npx api@next uninstall "entry-point-api"
npx api@next uninstall "consumer-api"

npx api@next install -i "entry-point-api" "@mention-me/v2.0#3b3ja1jm3n0p6f2"
npx api@next install -i "consumer-api" "@mention-me/v2.0#cfufm3n0p6ky"
```

## Node Version

You may need to switch to an old version of Node as per
