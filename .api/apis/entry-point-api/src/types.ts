import type { FromSchema } from '@readme/api-core/types';
import type * as schemas from './schemas.js';

export type AddressType = FromSchema<typeof schemas.AddressType>;
export type CustomerType = FromSchema<typeof schemas.CustomerType>;
export type EntryPointForDashboardType = FromSchema<typeof schemas.EntryPointForDashboardType>;
export type EntryPointForRefereeType = FromSchema<typeof schemas.EntryPointForRefereeType>;
export type EntryPointForReferrerType = FromSchema<typeof schemas.EntryPointForReferrerType>;
export type EntryPointLink = FromSchema<typeof schemas.EntryPointLink>;
export type EntryPointOfferAndLink = FromSchema<typeof schemas.EntryPointOfferAndLink>;
export type ImplementationType = FromSchema<typeof schemas.ImplementationType>;
export type OrderType = FromSchema<typeof schemas.OrderType>;
export type PostApiEntryPointDashboardMetadataParam = FromSchema<typeof schemas.PostApiEntryPointDashboard.metadata>;
export type PostApiEntryPointOfferMetadataParam = FromSchema<typeof schemas.PostApiEntryPointOffer.metadata>;
export type PostApiEntryPointRefereeMetadataParam = FromSchema<typeof schemas.PostApiEntryPointReferee.metadata>;
export type RefereeCustomerType = FromSchema<typeof schemas.RefereeCustomerType>;
export type RequestWithAuthenticationType = FromSchema<typeof schemas.RequestWithAuthenticationType>;
export type RequestWithVariationType = FromSchema<typeof schemas.RequestWithVariationType>;
