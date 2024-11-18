import type { FromSchema } from '@readme/api-core/types';
import type * as schemas from './schemas.js';

export type AddressForSegmentationType = FromSchema<typeof schemas.AddressForSegmentationType>;
export type AddressType = FromSchema<typeof schemas.AddressType>;
export type ConfirmOrderType = FromSchema<typeof schemas.ConfirmOrderType>;
export type Content = FromSchema<typeof schemas.Content>;
export type ContentCollectionLink = FromSchema<typeof schemas.ContentCollectionLink>;
export type CustomerType = FromSchema<typeof schemas.CustomerType>;
export type DashboardReward = FromSchema<typeof schemas.DashboardReward>;
export type EnrolCustomerType = FromSchema<typeof schemas.EnrolCustomerType>;
export type EnrolRefereeType = FromSchema<typeof schemas.EnrolRefereeType>;
export type EnrolReferrerType = FromSchema<typeof schemas.EnrolReferrerType>;
export type GetApiNameSearchContentMetadataParam = FromSchema<typeof schemas.GetApiNameSearchContent.metadata>;
export type GetApiNameSearchMetadataParam = FromSchema<typeof schemas.GetApiNameSearch.metadata>;
export type GetApiReferrerDashboardMetadataParam = FromSchema<typeof schemas.GetApiReferrerDashboard.metadata>;
export type Offer = FromSchema<typeof schemas.Offer>;
export type OrderType = FromSchema<typeof schemas.OrderType>;
export type PostApiOrderMetadataParam = FromSchema<typeof schemas.PostApiOrder.metadata>;
export type PostApiReferrerEnrolMetadataParam = FromSchema<typeof schemas.PostApiReferrerEnrol.metadata>;
export type PostApiRegisterRefereeMetadataParam = FromSchema<typeof schemas.PostApiRegisterReferee.metadata>;
export type RefereeContent = FromSchema<typeof schemas.RefereeContent>;
export type RefereeRegister = FromSchema<typeof schemas.RefereeRegister>;
export type RefereeReward = FromSchema<typeof schemas.RefereeReward>;
export type ReferralDashboardOffer = FromSchema<typeof schemas.ReferralDashboardOffer>;
export type ReferralShareOffer = FromSchema<typeof schemas.ReferralShareOffer>;
export type ReferralStats = FromSchema<typeof schemas.ReferralStats>;
export type ReferrerFound = FromSchema<typeof schemas.ReferrerFound>;
export type ReferrerIdentifier = FromSchema<typeof schemas.ReferrerIdentifier>;
export type RequestType = FromSchema<typeof schemas.RequestType>;
export type RequestWithVariationType = FromSchema<typeof schemas.RequestWithVariationType>;
export type Reward = FromSchema<typeof schemas.Reward>;
export type ShareLink = FromSchema<typeof schemas.ShareLink>;
export type TermsLinks = FromSchema<typeof schemas.TermsLinks>;
