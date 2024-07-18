#!/bin/sh



for FILE in `find . -name "*.toml" -depth 1`; do
	  APP_NAME=`echo $FILE | cut -d "." -f 4`

		if [ "$APP_NAME" == "custom-example" ]; then
			echo "Skipping $APP_NAME"
			continue
		fi

		echo "Deploying $APP_NAME"

		yarn run deploy -c $APP_NAME --force
done
