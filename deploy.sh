#!/bin/sh

VERSION=`git rev-parse --short HEAD`

# Update the version in the shared constants file
FILE="shared/constants.ts"

# Use sed to replace the version
sed -i.bak "s/export const APP_VERSION = \".*\";/export const APP_VERSION = \"$VERSION\";/" "$FILE"

# Remove the backup file created by sed
rm "$FILE.bak"

yarn install

for CONF_FILE in `find . -name "*.toml" -depth 1 | sort -h`; do
	  APP_NAME=`echo $CONF_FILE | cut -d "." -f 4`

		if [ "$APP_NAME" = "custom-example" ]; then
			echo "Skipping $APP_NAME"
			continue
		fi

		echo "Deploying $APP_NAME"

		yarn run deploy -c $APP_NAME --force
done

git checkout -- $FILE
