import { useMemo } from "react";

// We make our own type because Shopify restricts usage of imports across extensions for some reason.
type AppMetafieldEntry = {
    metafield: {
        /** The key name of a metafield. */
        key: string;

        /**
         * The namespace for a metafield.
         *
         * App owned metafield namespaces are returned using the `$app` format. See [app owned metafields](/docs/apps/build/custom-data/ownership#reserved-prefixes) for more information.
         */
        namespace: string;

        /** The value of a metafield. */
        value: string | number | boolean;

        /** The metafield’s information type. */
        valueType: "boolean" | "float" | "integer" | "json_string" | "string";

        /** The metafield's type name. */
        type: string;
    };
};

const useSegmentFromMetafields = (appMetafields: AppMetafieldEntry[]) => {
    return useMemo(() => {
        const segments = appMetafields
            .map((appMetafield) => {
                const { metafield } = appMetafield;
                const { value } = metafield;

                return value;
            })
            .filter((value) => value !== undefined && value !== null);

        // Remove any duplicates from the segments array
        const segmentSet = [...new Set(segments)];

        console.log("Mention Me segments for this customer:", segmentSet);

        return segmentSet.join("|");
    }, [appMetafields]);
};

export default useSegmentFromMetafields;
