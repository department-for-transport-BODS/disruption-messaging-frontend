import { IDisruptionImpactCondition } from './enum-overrides';
import { IDisruptionImpactCondition as DisruptionImpactCondition } from './enum-overrides';
import { IDisruptionImpactMode } from './enum-overrides';
import { IDisruptionImpactMode as DisruptionImpactMode } from './enum-overrides';
import { IDisruptionImpactSeverity } from './enum-overrides';
import { IDisruptionImpactSeverity as DisruptionImpactSeverity } from './enum-overrides';
import { IDisruptionReason } from './enum-overrides';
import { IDisruptionReason as DisruptionReason } from './enum-overrides';
import { IDisruptionStatus } from './enum-overrides';
import { IDisruptionStatus as DisruptionStatus } from './enum-overrides';
import { IDisruptionType } from './enum-overrides';
import { IDisruptionType as DisruptionType } from './enum-overrides';
import { ISocialMessagePlatform } from './enum-overrides';
import { ISocialMessagePlatform as SocialMessagePlatform } from './enum-overrides';
import { IStopPointType } from './enum-overrides';
import { IStopPointType as StopPointType } from './enum-overrides';
import { IDisruptionNotificationStatus } from './enum-overrides';
import { IDisruptionNotificationStatus as DisruptionNotificationStatus } from './enum-overrides';
import { IDisruptionNotificationMessageType } from './enum-overrides';
import { IDisruptionNotificationMessageType as DisruptionNotificationMessageType } from './enum-overrides';
import { IHootSuiteProfileProfileType } from './enum-overrides';
import { IHootSuiteProfileProfileType as HootSuiteProfileProfileType } from './enum-overrides';
import { IRoleScope } from './enum-overrides';
import { IRoleScope as RoleScope } from './enum-overrides';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 */
  DateTime: any,
  /** The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 */
  Date: any,
  /** The `Time` scalar type represents a Time value as
   * specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
 */
  Time: any,
  /** Allows use of a JSON String for input / output from the GraphQL schema.
   * 
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
 */
  JSONString: any,
  /** Arbitrary JSON Properties for features */
  JSONScalar: any,
  /** Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
 */
  Upload: any,
};



/** Mutation to add a comment to a disruption */
export type IAddComment = {
  __typename?: 'AddComment',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNode>,
};

/** Input for admin area for organisation */
export type IAdminAreaInput = {
  name?: Maybe<Scalars['String']>,
  areaCode?: Maybe<Scalars['String']>,
};

export type IAdminAreaType = {
  __typename?: 'AdminAreaType',
  name: Scalars['String'],
  shortName: Scalars['String'],
  areaCode: Scalars['Int'],
  atcoAreaCode: Scalars['Int'],
  organisations: Array<IOrganisationType>,
  entityId?: Maybe<Scalars['String']>,
};

/** Mutation to approve a disruption */
export type IApproveDisruption = {
  __typename?: 'ApproveDisruption',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNode>,
};

export type IBackgroundCompletedTaskType = {
  __typename?: 'BackgroundCompletedTaskType',
  id: Scalars['ID'],
  taskName: Scalars['String'],
  taskParams: Scalars['String'],
  taskHash: Scalars['String'],
  verboseName?: Maybe<Scalars['String']>,
  priority: Scalars['Int'],
  runAt: Scalars['DateTime'],
  repeat?: Maybe<Scalars['Int']>,
  repeatUntil?: Maybe<Scalars['DateTime']>,
  queue?: Maybe<Scalars['String']>,
  attempts: Scalars['Int'],
  failedAt?: Maybe<Scalars['DateTime']>,
  lastError: Scalars['String'],
  lockedBy?: Maybe<Scalars['String']>,
  lockedAt?: Maybe<Scalars['DateTime']>,
  creatorContentType?: Maybe<IContentTypeType>,
  creatorObjectId?: Maybe<Scalars['Int']>,
};

export type IBackgroundTaskType = {
  __typename?: 'BackgroundTaskType',
  id: Scalars['ID'],
  taskName: Scalars['String'],
  taskParams: Scalars['String'],
  taskHash: Scalars['String'],
  verboseName?: Maybe<Scalars['String']>,
  priority: Scalars['Int'],
  runAt: Scalars['DateTime'],
  repeat?: Maybe<Scalars['Int']>,
  repeatUntil?: Maybe<Scalars['DateTime']>,
  queue?: Maybe<Scalars['String']>,
  attempts: Scalars['Int'],
  failedAt?: Maybe<Scalars['DateTime']>,
  lastError: Scalars['String'],
  lockedBy?: Maybe<Scalars['String']>,
  lockedAt?: Maybe<Scalars['DateTime']>,
  creatorContentType?: Maybe<IContentTypeType>,
  creatorObjectId?: Maybe<Scalars['Int']>,
};

export type ICapabilitiesInfo = {
  __typename?: 'CapabilitiesInfo',
  enumOverrides?: Maybe<Scalars['Boolean']>,
  setUserRestrictions?: Maybe<Scalars['Boolean']>,
};

export type IChangedFields = {
  __typename?: 'ChangedFields',
  field?: Maybe<Scalars['String']>,
  oldValue?: Maybe<Scalars['JSONString']>,
  newValue?: Maybe<Scalars['JSONString']>,
};

/** A mutation to change users password */
export type IChangePassword = {
  __typename?: 'ChangePassword',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

export type ICommentType = {
  __typename?: 'CommentType',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  id: Scalars['ID'],
  disruption: IDisruptionNode,
  user: IUserType,
  comment: Scalars['String'],
};

export enum IConditionInput {
  Altered = 'Altered',
  Cancelled = 'Cancelled',
  Delayed = 'Delayed',
  Diverted = 'Diverted',
  NoService = 'NoService',
  Disrupted = 'Disrupted',
  AdditionalService = 'AdditionalService',
  SpecialService = 'SpecialService',
  OnTime = 'OnTime',
  NormalService = 'NormalService',
  Unknown = 'Unknown'
}

export type IContentTypeType = {
  __typename?: 'ContentTypeType',
  id: Scalars['ID'],
  appLabel: Scalars['String'],
  model: Scalars['String'],
  backgroundTask: Array<IBackgroundTaskType>,
  completedBackgroundTask: Array<IBackgroundCompletedTaskType>,
  name?: Maybe<Scalars['String']>,
};

/** A mutation to create a disruption */
export type ICreateDisruption = {
  __typename?: 'CreateDisruption',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNode>,
};

export type ICreateInvitation = {
  __typename?: 'CreateInvitation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IInvitationsType>,
};

/** A mutation that represents the creates an entry in the mailing List */
export type ICreateMailingListEntry = {
  __typename?: 'CreateMailingListEntry',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IMailingListType>,
};

/** A mutation to create an organisation */
export type ICreateOrganisation = {
  __typename?: 'CreateOrganisation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IOrganisationType>,
};



/** Mutation to delete a disruption */
export type IDeleteDisruption = {
  __typename?: 'DeleteDisruption',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

export type IDeleteInvitation = {
  __typename?: 'DeleteInvitation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** A mutation to delete an entry in mailing list */
export type IDeleteMailingListEntry = {
  __typename?: 'DeleteMailingListEntry',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** A mutation to delete an organisation */
export type IDeleteOrganisation = {
  __typename?: 'DeleteOrganisation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** A mutation to delete a social account */
export type IDeleteSocialAccount = {
  __typename?: 'DeleteSocialAccount',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** A mutation to delete a registration
 * 
 * Note successful registration which resolve in a SocialAccount creation are automatically
 * deleted. Use this to delete failed registrations.
 */
export type IDeleteSocialRegistration = {
  __typename?: 'DeleteSocialRegistration',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

export type IDeleteUser = {
  __typename?: 'DeleteUser',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

export type IDisruptionAuditNode = INode & {
  __typename?: 'DisruptionAuditNode',
  /** The ID of the object. */
  id: Scalars['ID'],
  contentType?: Maybe<IContentTypeType>,
  objectPk: Scalars['String'],
  objectId?: Maybe<Scalars['Int']>,
  objectRepr: Scalars['String'],
  action: ILogEntryAction,
  changes: Scalars['String'],
  actor?: Maybe<IUserType>,
  remoteAddr?: Maybe<Scalars['String']>,
  timestamp?: Maybe<Scalars['DateTime']>,
  changedFields?: Maybe<Array<Maybe<IChangedFields>>>,
};

export type IDisruptionAuditNodeConnection = {
  __typename?: 'DisruptionAuditNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IDisruptionAuditNodeEdge>>,
  totalCount?: Maybe<Scalars['Int']>,
};

/** A Relay edge containing a `DisruptionAuditNode` and its cursor. */
export type IDisruptionAuditNodeEdge = {
  __typename?: 'DisruptionAuditNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<IDisruptionAuditNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

export type IDisruptionCreateInput = {
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  link?: Maybe<Scalars['String']>,
  type?: Maybe<IDisruptionTypeInput>,
  relatedDisruption?: Maybe<Array<Maybe<IRelatedDisruptionInput>>>,
  reason?: Maybe<IDisruptionReasonInput>,
  impact?: Maybe<Array<Maybe<IDisruptionImpactCreateInput>>>,
  isTemplate?: Maybe<Scalars['Boolean']>,
  publishingStart?: Maybe<Scalars['DateTime']>,
  publishingEnd?: Maybe<Scalars['DateTime']>,
  validityPeriod?: Maybe<Array<Maybe<IValidityPeriodInput>>>,
  socialMessages?: Maybe<Array<Maybe<ISocialMessageInput>>>,
  isOpenEnded?: Maybe<Scalars['Boolean']>,
};

/** An enumeration. */
export enum IDisruptionDirectionEnum {
  Anticlockwise = 'anticlockwise',
  Clockwise = 'clockwise',
  NorthBound = 'northBound',
  NorthEastBound = 'northEastBound',
  EastBound = 'eastBound',
  SouthEastBound = 'southEastBound',
  SouthBound = 'southBound',
  SouthWestBound = 'southWestBound',
  WestBound = 'westBound',
  NorthWestBound = 'northWestBound',
  InboundTowardsTown = 'inboundTowardsTown',
  OutboundFromTown = 'outboundFromTown'
}

/** Disruption impact for creating an impact */
export type IDisruptionImpactCreateInput = {
  id?: Maybe<Scalars['ID']>,
  name?: Maybe<Scalars['String']>,
  advice: Scalars['String'],
  delay?: Maybe<Scalars['Int']>,
  severity?: Maybe<ISeverityInput>,
  condition?: Maybe<IConditionInput>,
  journeyPlanner?: Maybe<Scalars['Boolean']>,
  direction?: Maybe<IDisruptionDirectionEnum>,
  mode?: Maybe<IModeInput>,
  operators?: Maybe<Array<Maybe<IOperatorInput>>>,
  allOperators?: Maybe<Scalars['Boolean']>,
  lines?: Maybe<Array<Maybe<ILineInput>>>,
  stops?: Maybe<Array<Maybe<IStopInput>>>,
};

/** An enumeration. */
export enum IDisruptionImpactDirection {
  /** anticlockwise */
  AntiClockwise = 'ANTI_CLOCKWISE',
  /** clockwise */
  Clockwise = 'CLOCKWISE',
  /** northBound */
  Northbound = 'NORTHBOUND',
  /** northEastBound */
  NortheastBound = 'NORTHEAST_BOUND',
  /** eastBound */
  Eastbound = 'EASTBOUND',
  /** southEastBound */
  SoutheastBound = 'SOUTHEAST_BOUND',
  /** southBound */
  Southbound = 'SOUTHBOUND',
  /** southWestBound */
  SouthwestBound = 'SOUTHWEST_BOUND',
  /** westBound */
  Westbound = 'WESTBOUND',
  /** northWestBound */
  NorthwestBound = 'NORTHWEST_BOUND',
  /** inboundTowardsTown */
  InboundTowardsTown = 'INBOUND_TOWARDS_TOWN',
  /** outboundFromTown */
  OutboundFromTown = 'OUTBOUND_FROM_TOWN'
}

export type IDisruptionImpactNode = INode & {
  __typename?: 'DisruptionImpactNode',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  /** The ID of the object. */
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  advice: Scalars['String'],
  delay?: Maybe<Scalars['Int']>,
  severity: IDisruptionImpactSeverity,
  condition: IDisruptionImpactCondition,
  journeyPlanner: Scalars['Boolean'],
  mode: IDisruptionImpactMode,
  allOperators: Scalars['Boolean'],
  operators: IOperatorNodeConnection,
  lines: ILineNodeConnection,
  stops: IStopPointNodeConnection,
  deleted: Scalars['Boolean'],
  direction?: Maybe<IDisruptionImpactDirection>,
  disruptions: IDisruptionNodeConnection,
};


export type IDisruptionImpactNodeOperatorsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  ref?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>
};


export type IDisruptionImpactNodeLinesArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  ref?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>
};


export type IDisruptionImpactNodeStopsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  commonName?: Maybe<Scalars['String']>,
  commonName_Icontains?: Maybe<Scalars['String']>,
  commonName_Istartswith?: Maybe<Scalars['String']>,
  atcoCode?: Maybe<Scalars['String']>
};


export type IDisruptionImpactNodeDisruptionsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};

export type IDisruptionImpactNodeConnection = {
  __typename?: 'DisruptionImpactNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IDisruptionImpactNodeEdge>>,
  totalCount?: Maybe<Scalars['Int']>,
};

/** A Relay edge containing a `DisruptionImpactNode` and its cursor. */
export type IDisruptionImpactNodeEdge = {
  __typename?: 'DisruptionImpactNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<IDisruptionImpactNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

/** Disruption impact for updating an impact */
export type IDisruptionImpactUpdateInput = {
  id?: Maybe<Scalars['ID']>,
  name?: Maybe<Scalars['String']>,
  advice?: Maybe<Scalars['String']>,
  delay?: Maybe<Scalars['Int']>,
  severity?: Maybe<ISeverityInput>,
  condition?: Maybe<IConditionInput>,
  journeyPlanner?: Maybe<Scalars['Boolean']>,
  direction?: Maybe<IDisruptionDirectionEnum>,
  mode?: Maybe<IModeInput>,
  operators?: Maybe<Array<Maybe<IOperatorInput>>>,
  allOperators?: Maybe<Scalars['Boolean']>,
  lines?: Maybe<Array<Maybe<ILineInput>>>,
  stops?: Maybe<Array<Maybe<IStopInput>>>,
};

export type IDisruptionNode = INode & {
  __typename?: 'DisruptionNode',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  /** The ID of the object. */
  id: Scalars['ID'],
  createdBy: IUserType,
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  version: Scalars['Int'],
  link?: Maybe<Scalars['String']>,
  status: IDisruptionStatus,
  type: IDisruptionType,
  relatedDisruption: IDisruptionNodeConnection,
  reason?: Maybe<IDisruptionReason>,
  impact: IDisruptionImpactNodeConnection,
  isTemplate: Scalars['Boolean'],
  publishingStart?: Maybe<Scalars['DateTime']>,
  publishingEnd?: Maybe<Scalars['DateTime']>,
  organisation?: Maybe<IOrganisationType>,
  isOpenEnded: Scalars['Boolean'],
  isLive?: Maybe<Scalars['Boolean']>,
  openSince?: Maybe<Scalars['DateTime']>,
  deleted: Scalars['Boolean'],
  approvedBy?: Maybe<IUserType>,
  approvedOn?: Maybe<Scalars['DateTime']>,
  relatedTo: IDisruptionNodeConnection,
  validityPeriod: Array<IValidityPeriodType>,
  socialMessages?: Maybe<Array<Maybe<ISocialMessageType>>>,
  comments: Array<ICommentType>,
  notifications: Array<IDisruptionNotificationDetailsNode>,
  disruptionnotificationmessageSet: Array<IDisruptionNotificationDetailsNode>,
  severity?: Maybe<Scalars['String']>,
  rawId?: Maybe<Scalars['Int']>,
};


export type IDisruptionNodeRelatedDisruptionArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};


export type IDisruptionNodeImpactArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  stops?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Icontains?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Istartswith?: Maybe<Array<Maybe<Scalars['ID']>>>,
  name?: Maybe<Scalars['String']>,
  name_Icontains?: Maybe<Scalars['String']>,
  name_Istartswith?: Maybe<Scalars['String']>,
  mode?: Maybe<Scalars['String']>,
  severity?: Maybe<Scalars['String']>
};


export type IDisruptionNodeRelatedToArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};

export type IDisruptionNodeConnection = {
  __typename?: 'DisruptionNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IDisruptionNodeEdge>>,
  totalCount?: Maybe<Scalars['Int']>,
};

/** A Relay edge containing a `DisruptionNode` and its cursor. */
export type IDisruptionNodeEdge = {
  __typename?: 'DisruptionNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<IDisruptionNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

export type IDisruptionNotificationDetailsNode = {
  __typename?: 'DisruptionNotificationDetailsNode',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  id: Scalars['ID'],
  type: IDisruptionNotificationMessageType,
  message?: Maybe<Scalars['String']>,
  disruption: IDisruptionNode,
  duplicates: IDisruptionNodeConnection,
  disruptionnotificationSet: IDisruptionNotificationNodeConnection,
};


export type IDisruptionNotificationDetailsNodeDuplicatesArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};


export type IDisruptionNotificationDetailsNodeDisruptionnotificationSetArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};

export type IDisruptionNotificationNode = INode & {
  __typename?: 'DisruptionNotificationNode',
  /** The ID of the object. */
  id: Scalars['ID'],
  user: IUserType,
  sent?: Maybe<Scalars['DateTime']>,
  status: IDisruptionNotificationStatus,
  details?: Maybe<IDisruptionNotificationDetailsNode>,
};

export type IDisruptionNotificationNodeConnection = {
  __typename?: 'DisruptionNotificationNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IDisruptionNotificationNodeEdge>>,
  totalCount?: Maybe<Scalars['Int']>,
};

/** A Relay edge containing a `DisruptionNotificationNode` and its cursor. */
export type IDisruptionNotificationNodeEdge = {
  __typename?: 'DisruptionNotificationNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<IDisruptionNotificationNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

export enum IDisruptionReasonInput {
  Accident = 'Accident',
  SecurityAlert = 'SecurityAlert',
  Congestion = 'Congestion',
  Roadworks = 'Roadworks',
  RoadClosed = 'RoadClosed',
  BombExplosion = 'BombExplosion',
  Incident = 'Incident',
  RouteDiversion = 'RouteDiversion',
  StaffAbsence = 'StaffAbsence',
  SignalProblem = 'SignalProblem',
  MaintenanceWork = 'MaintenanceWork',
  ConstructionWork = 'ConstructionWork',
  Fog = 'Fog',
  Ice = 'Ice',
  HeavyRain = 'HeavyRain',
  Waterlogged = 'Waterlogged',
  Fire = 'Fire',
  Vandalism = 'Vandalism',
  Overcrowded = 'Overcrowded',
  InsufficientDemand = 'InsufficientDemand',
  LightingFailure = 'LightingFailure',
  LeaderBoardFailure = 'LeaderBoardFailure',
  OperatorCeasedTrading = 'OperatorCeasedTrading',
  OperatorSuspended = 'OperatorSuspended',
  RouteBlockage = 'RouteBlockage',
  PersonOnTheLine = 'PersonOnTheLine',
  VehicleOnTheLine = 'VehicleOnTheLine',
  ObjectOnTheLine = 'ObjectOnTheLine',
  AnimalOnTheLine = 'AnimalOnTheLine',
  SpecialEvent = 'SpecialEvent',
  BridgeStrike = 'BridgeStrike',
  OverheadObstruction = 'OverheadObstruction',
  UndefinedProblem = 'UndefinedProblem',
  SafetyViolation = 'SafetyViolation',
  NearMiss = 'NearMiss',
  SignalPassedAtDanger = 'SignalPassedAtDanger',
  StationOverrun = 'StationOverrun',
  TrainDoor = 'TrainDoor',
  StaffSickness = 'StaffSickness',
  StaffInWrongPlace = 'StaffInWrongPlace',
  StaffShortage = 'StaffShortage',
  IndustrialAction = 'IndustrialAction',
  WorkToRule = 'WorkToRule',
  UndefinedPersonnelProblem = 'UndefinedPersonnelProblem',
  StaffInjury = 'StaffInjury',
  ContractorStaffInjury = 'ContractorStaffInjury',
  UnofficialIndustrialAction = 'UnofficialIndustrialAction',
  PointsProblem = 'PointsProblem',
  PointsFailure = 'PointsFailure',
  SignalFailure = 'SignalFailure',
  Derailment = 'Derailment',
  EngineFailure = 'EngineFailure',
  BreakDown = 'BreakDown',
  TechnicalProblem = 'TechnicalProblem',
  RepairWork = 'RepairWork',
  PowerProblem = 'PowerProblem',
  FuelProblem = 'FuelProblem',
  SwingBridgeFailure = 'SwingBridgeFailure',
  EscalatorFailure = 'EscalatorFailure',
  LiftFailure = 'LiftFailure',
  GangwayProblem = 'GangwayProblem',
  ClosedForMaintenance = 'ClosedForMaintenance',
  FuelShortage = 'FuelShortage',
  DeicingWork = 'DeicingWork',
  WheelProblem = 'WheelProblem',
  LuggageCarouselProblem = 'LuggageCarouselProblem',
  UndefinedEquipmentProblem = 'UndefinedEquipmentProblem',
  TractionFailure = 'TractionFailure',
  SlipperyTrack = 'SlipperyTrack',
  TrainWarningSystemProblem = 'TrainWarningSystemProblem',
  TrackCircuitProblem = 'TrackCircuitProblem',
  BrokenRail = 'BrokenRail',
  PoorRailConditions = 'PoorRailConditions',
  WheelImpactLoad = 'WheelImpactLoad',
  LackOfOperationalStock = 'LackOfOperationalStock',
  DefectiveFireAlarmEquipment = 'DefectiveFireAlarmEquipment',
  DefectivePlatformEdgeDoors = 'DefectivePlatformEdgeDoors',
  DefectiveCctv = 'DefectiveCctv',
  DefectivePublicAnnouncementSystem = 'DefectivePublicAnnouncementSystem',
  TicketingSystemNotAvailable = 'TicketingSystemNotAvailable',
  EmergencyEngineeringWork = 'EmergencyEngineeringWork',
  LateFinishToEngineeringWork = 'LateFinishToEngineeringWork',
  RoughSea = 'RoughSea',
  HeavySnowFall = 'HeavySnowFall',
  StrongWinds = 'StrongWinds',
  TidalRestrictions = 'TidalRestrictions',
  HighTide = 'HighTide',
  LowTide = 'LowTide',
  Frozen = 'Frozen',
  Hail = 'Hail',
  HighTemperatures = 'HighTemperatures',
  Flooding = 'Flooding',
  LowWaterLevel = 'LowWaterLevel',
  HighWaterLevel = 'HighWaterLevel',
  FallenLeaves = 'FallenLeaves',
  FallenTree = 'FallenTree',
  Landslide = 'Landslide',
  UndefinedEnvironmentalProblem = 'UndefinedEnvironmentalProblem',
  DriftingSnow = 'DriftingSnow',
  BlizzardConditions = 'BlizzardConditions',
  StormDamage = 'StormDamage',
  StormConditions = 'StormConditions',
  Slipperiness = 'Slipperiness',
  GlazedFrost = 'GlazedFrost',
  LightningStrike = 'LightningStrike',
  SewerOverflow = 'SewerOverflow',
  GrassFire = 'GrassFire',
  Unknown = 'Unknown'
}

export enum IDisruptionSortableFields {
  Status = 'status',
  Type = 'type',
  Reason = 'reason',
  PublishingStart = 'publishing_start',
  PublishingEnd = 'publishing_end',
  ValidityPeriodStartDate = 'validity_period_start_date',
  ValidityPeriodEndDate = 'validity_period_end_date',
  Severity = 'severity',
  Condition = 'condition',
  Mode = 'mode',
  Delay = 'delay',
  StatusReversed = 'status_reversed',
  TypeReversed = 'type_reversed',
  ReasonReversed = 'reason_reversed',
  PublishingStartReversed = 'publishing_start_reversed',
  PublishingEndReversed = 'publishing_end_reversed',
  ValidityPeriodStartDateReversed = 'validity_period_start_date_reversed',
  ValidityPeriodEndDateReversed = 'validity_period_end_date_reversed',
  SeverityReversed = 'severity_reversed',
  ConditionReversed = 'condition_reversed',
  ModeReversed = 'mode_reversed',
  DelayReversed = 'delay_reversed'
}

export type IDisruptionStatsType = {
  __typename?: 'DisruptionStatsType',
  liveDisruptions?: Maybe<IDisruptionNodeConnection>,
  upcomingDisruptions?: Maybe<IDisruptionNodeConnection>,
  requiresApproval?: Maybe<IDisruptionNodeConnection>,
};


export type IDisruptionStatsTypeLiveDisruptionsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};


export type IDisruptionStatsTypeUpcomingDisruptionsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};


export type IDisruptionStatsTypeRequiresApprovalArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};

export enum IDisruptionStatusInput {
  Draft = 'Draft',
  DraftPendingApproval = 'DraftPendingApproval',
  ApprovedDraft = 'ApprovedDraft',
  Open = 'Open',
  Closing = 'Closing',
  Closed = 'Closed',
  Rejected = 'Rejected'
}

export enum IDisruptionTypeInput {
  Planned = 'Planned',
  Unplanned = 'Unplanned'
}

export type IDisruptionUpdateInput = {
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  link?: Maybe<Scalars['String']>,
  type?: Maybe<IDisruptionTypeInput>,
  relatedDisruption?: Maybe<Array<Maybe<IRelatedDisruptionInput>>>,
  reason?: Maybe<IDisruptionReasonInput>,
  impact?: Maybe<Array<Maybe<IDisruptionImpactUpdateInput>>>,
  isTemplate?: Maybe<Scalars['Boolean']>,
  publishingStart?: Maybe<Scalars['DateTime']>,
  publishingEnd?: Maybe<Scalars['DateTime']>,
  validityPeriod?: Maybe<Array<Maybe<IValidityPeriodInput>>>,
  socialMessages?: Maybe<Array<Maybe<ISocialMessageInput>>>,
  isOpenEnded?: Maybe<Scalars['Boolean']>,
};

/** Debugging information for the current query. */
export type IDjangoDebug = {
  __typename?: 'DjangoDebug',
  /** Executed SQL queries for this API query. */
  sql?: Maybe<Array<Maybe<IDjangoDebugSql>>>,
};

/** Represents a single database query made to a Django managed DB. */
export type IDjangoDebugSql = {
  __typename?: 'DjangoDebugSQL',
  /** The type of database being used (e.g. postrgesql, mysql, sqlite). */
  vendor: Scalars['String'],
  /** The Django database alias (e.g. 'default'). */
  alias: Scalars['String'],
  /** The actual SQL sent to this database. */
  sql?: Maybe<Scalars['String']>,
  /** Duration of this database query in seconds. */
  duration: Scalars['Float'],
  /** The raw SQL of this query, without params. */
  rawSql: Scalars['String'],
  /** JSON encoded database query parameters. */
  params: Scalars['String'],
  /** Start time of this database query. */
  startTime: Scalars['Float'],
  /** Stop time of this database query. */
  stopTime: Scalars['Float'],
  /** Whether this database query took more than 10 seconds. */
  isSlow: Scalars['Boolean'],
  /** Whether this database query was a SELECT. */
  isSelect: Scalars['Boolean'],
  /** Postgres transaction ID if available. */
  transId?: Maybe<Scalars['String']>,
  /** Postgres transaction status if available. */
  transStatus?: Maybe<Scalars['String']>,
  /** Postgres isolation level if available. */
  isoLevel?: Maybe<Scalars['String']>,
  /** Postgres connection encoding if available. */
  encoding?: Maybe<Scalars['String']>,
};

export type IEnumOverridesInput = {
  type?: Maybe<Scalars['String']>,
  values?: Maybe<Array<Maybe<Scalars['String']>>>,
};

export type IEnumOverridesObject = {
  __typename?: 'EnumOverridesObject',
  id: Scalars['ID'],
  type?: Maybe<Scalars['String']>,
  values: Array<Maybe<Scalars['String']>>,
  allValues?: Maybe<Array<Maybe<Scalars['String']>>>,
};

export type IFacebookPageType = {
  __typename?: 'FacebookPageType',
  id: Scalars['ID'],
  pageId: Scalars['String'],
  name: Scalars['String'],
  account?: Maybe<ISocialAccountType>,
};

/** Maps the FeatureFlag model to a graphql type */
export type IFeatureFlagType = {
  __typename?: 'FeatureFlagType',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  id: Scalars['ID'],
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
};

export type IHootSuiteProfileInput = {
  id?: Maybe<Scalars['ID']>,
};

export type IHootSuiteProfileType = {
  __typename?: 'HootSuiteProfileType',
  id: Scalars['ID'],
  account?: Maybe<ISocialAccountType>,
  profileType: IHootSuiteProfileProfileType,
  profileId: Scalars['String'],
  socialId?: Maybe<Scalars['String']>,
  socialUsername?: Maybe<Scalars['String']>,
  socialMessages: ISocialMessageNodeConnection,
};


export type IHootSuiteProfileTypeSocialMessagesArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  published?: Maybe<Scalars['Boolean']>
};

/** Represent a graphql field for Django's ImageField and FileField. */
export type IImageType = {
  __typename?: 'ImageType',
  name?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
};

/** Input for creating and updating an invitation */
export type IInvitationCreateInput = {
  email: Scalars['String'],
  organisation?: Maybe<IOrganisationForeignKeyInput>,
  roles: Array<Maybe<IRoleInput>>,
};

/** Maps the user model to a graphql type */
export type IInvitationsType = {
  __typename?: 'InvitationsType',
  id: Scalars['ID'],
  key: Scalars['String'],
  sent?: Maybe<Scalars['DateTime']>,
  inviter?: Maybe<IUserType>,
  email: Scalars['String'],
  created: Scalars['DateTime'],
  roles?: Maybe<Array<Maybe<IRoleType>>>,
};

/** Input for creating and updating an invitation */
export type IInvitationUpdateInput = {
  email?: Maybe<Scalars['String']>,
  organisation?: Maybe<IOrganisationForeignKeyInput>,
  roles?: Maybe<Array<Maybe<IRoleInput>>>,
};



/** GeoJson having line coordinates and the coordinates for stops in that line. */
export type ILineGeoJsonType = {
  __typename?: 'LineGeoJsonType',
  geometry?: Maybe<Scalars['JSONScalar']>,
  properties?: Maybe<Scalars['JSONScalar']>,
  type?: Maybe<Scalars['String']>,
};

export type ILineInput = {
  ref: Scalars['String'],
  operatorIds?: Maybe<Array<Maybe<Scalars['String']>>>,
  name?: Maybe<Scalars['String']>,
};

export type ILineNode = INode & {
  __typename?: 'LineNode',
  /** The ID of the object. */
  id: Scalars['ID'],
  ref: Scalars['String'],
  name: Scalars['String'],
  operatorIds?: Maybe<Array<Maybe<Scalars['String']>>>,
  disruptionimpactSet: IDisruptionImpactNodeConnection,
};


export type ILineNodeDisruptionimpactSetArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  stops?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Icontains?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Istartswith?: Maybe<Array<Maybe<Scalars['ID']>>>,
  name?: Maybe<Scalars['String']>,
  name_Icontains?: Maybe<Scalars['String']>,
  name_Istartswith?: Maybe<Scalars['String']>,
  mode?: Maybe<Scalars['String']>,
  severity?: Maybe<Scalars['String']>
};

export type ILineNodeConnection = {
  __typename?: 'LineNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ILineNodeEdge>>,
};

/** A Relay edge containing a `LineNode` and its cursor. */
export type ILineNodeEdge = {
  __typename?: 'LineNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<ILineNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

/** An enumeration. */
export enum ILogEntryAction {
  /** create */
  A_0 = 'A_0',
  /** update */
  A_1 = 'A_1',
  /** delete */
  A_2 = 'A_2'
}

/** A mutation that represents the login action */
export type ILogin = {
  __typename?: 'Login',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** A mutation that represents the login action */
export type ILogout = {
  __typename?: 'Logout',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** Input parameters for create and update */
export type IMailingListInput = {
  email?: Maybe<Scalars['String']>,
  severity?: Maybe<Array<Maybe<ISeverityEnum>>>,
  organisation?: Maybe<IOrganisationForeignKeyInput>,
};

export type IMailingListType = {
  __typename?: 'MailingListType',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  id: Scalars['ID'],
  email: Scalars['String'],
  severity?: Maybe<Array<Maybe<Scalars['String']>>>,
  optedIn: Scalars['Boolean'],
  organisation?: Maybe<IOrganisationType>,
};

export enum IModeInput {
  Bus = 'Bus',
  Tram = 'Tram',
  Train = 'Train',
  Ferry = 'Ferry'
}

export enum IModeTypeEnum {
  BusOrCoach = 'BUS_OR_COACH',
  Rail = 'RAIL',
  Ferry = 'FERRY',
  Bus = 'BUS',
  Coach = 'COACH',
  Tram = 'TRAM',
  Metro = 'METRO'
}

export type IMutations = {
  __typename?: 'Mutations',
  /** A mutation that represents the creates an entry in the mailing List */
  createMailingListEntry?: Maybe<ICreateMailingListEntry>,
  /** A mutation to update an entry in the mailing list */
  updateMailingListEntry?: Maybe<IUpdateMailingListEntry>,
  /** A mutation to delete an entry in mailing list */
  deleteMailingListEntry?: Maybe<IDeleteMailingListEntry>,
  reRegisterTasks?: Maybe<IReRegisterTasks>,
  setEnumOverrides?: Maybe<ISetEnumOverrides>,
  /** A mutation to register a new social account */
  registerSocialAccount?: Maybe<IRegisterSocialAccount>,
  /** A mutation to delete a social account */
  deleteSocialAccount?: Maybe<IDeleteSocialAccount>,
  /** A mutation to delete a registration
   * 
   * Note successful registration which resolve in a SocialAccount creation are automatically
   * deleted. Use this to delete failed registrations.
 */
  deleteSocialRegistration?: Maybe<IDeleteSocialRegistration>,
  /** A mutation to immediately run the publish task to social media accounts.
   * 
   * ** This is for internal use only **
 */
  PublishToSocialMedia?: Maybe<IPublishToSocialMedia>,
  /** Mutation to read a notification */
  readNotification?: Maybe<IReadNotification>,
  /** Mutation to set notification settings for a logged in user */
  notificationSettings?: Maybe<INotificationSettingsMutation>,
  /** A mutation to create a disruption */
  createDisruption?: Maybe<ICreateDisruption>,
  /** Mutation to approve a disruption */
  approveDisruption?: Maybe<IApproveDisruption>,
  /** Mutation to reject a disruption */
  rejectDisruption?: Maybe<IRejectDisruption>,
  /** Mutation to submit a disruption */
  submitDisruption?: Maybe<ISubmitDisruption>,
  /** Mutation to update a disruption */
  updateDisruption?: Maybe<IUpdateDisruption>,
  /** Mutation to add a comment to a disruption */
  addComment?: Maybe<IAddComment>,
  /** Mutation to delete a disruption */
  deleteDisruption?: Maybe<IDeleteDisruption>,
  /** A mutation to create an organisation */
  createOrganisation?: Maybe<ICreateOrganisation>,
  /** A mutation to update the organisation */
  updateOrganisation?: Maybe<IUpdateOrganisation>,
  /** A mutation to delete an organisation */
  deleteOrganisation?: Maybe<IDeleteOrganisation>,
  /** A mutation that represents the login action */
  login?: Maybe<ILogin>,
  /** A mutation that represents the login action */
  logout?: Maybe<ILogout>,
  /** A mutation to change users password */
  changePassword?: Maybe<IChangePassword>,
  /** A mutation to sign-up users */
  signUp?: Maybe<ISignUp>,
  /** Mutation for requesting a password reset email */
  resetPassword?: Maybe<IResetPassword>,
  /** Mutation for confirming a password reset email */
  resetPasswordConfirm?: Maybe<IResetPasswordConfirm>,
  updateUser?: Maybe<IUpdateUser>,
  inviteUser?: Maybe<ICreateInvitation>,
  deleteUser?: Maybe<IDeleteUser>,
  updateInvitation?: Maybe<IUpdateInvitation>,
  deleteInvitation?: Maybe<IDeleteInvitation>,
};


export type IMutationsCreateMailingListEntryArgs = {
  params: IMailingListInput
};


export type IMutationsUpdateMailingListEntryArgs = {
  id: Scalars['Int'],
  params: IMailingListInput
};


export type IMutationsDeleteMailingListEntryArgs = {
  id: Scalars['Int']
};


export type IMutationsSetEnumOverridesArgs = {
  params: Array<Maybe<IEnumOverridesInput>>
};


export type IMutationsRegisterSocialAccountArgs = {
  params: ISocialRegistrationInput
};


export type IMutationsDeleteSocialAccountArgs = {
  id?: Maybe<Scalars['ID']>
};


export type IMutationsDeleteSocialRegistrationArgs = {
  requestToken?: Maybe<Scalars['String']>
};


export type IMutationsReadNotificationArgs = {
  id?: Maybe<Scalars['ID']>
};


export type IMutationsNotificationSettingsArgs = {
  params?: Maybe<Array<Maybe<INotificationSettingsInputType>>>
};


export type IMutationsCreateDisruptionArgs = {
  params: IDisruptionCreateInput
};


export type IMutationsApproveDisruptionArgs = {
  comment?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>
};


export type IMutationsRejectDisruptionArgs = {
  comment?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>
};


export type IMutationsSubmitDisruptionArgs = {
  comment?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>
};


export type IMutationsUpdateDisruptionArgs = {
  id?: Maybe<Scalars['ID']>,
  params: IDisruptionUpdateInput
};


export type IMutationsAddCommentArgs = {
  comment: Scalars['String'],
  id?: Maybe<Scalars['ID']>
};


export type IMutationsDeleteDisruptionArgs = {
  id?: Maybe<Scalars['ID']>
};


export type IMutationsCreateOrganisationArgs = {
  params: IOrganisationInput
};


export type IMutationsUpdateOrganisationArgs = {
  id: Scalars['Int'],
  params: IOrganisationInput
};


export type IMutationsDeleteOrganisationArgs = {
  id: Scalars['Int']
};


export type IMutationsLoginArgs = {
  password: Scalars['String'],
  username: Scalars['String']
};


export type IMutationsChangePasswordArgs = {
  newPassword: Scalars['String'],
  oldPassword: Scalars['String'],
  username: Scalars['String']
};


export type IMutationsSignUpArgs = {
  params?: Maybe<IUserSignUpInput>
};


export type IMutationsResetPasswordArgs = {
  email: Scalars['String']
};


export type IMutationsResetPasswordConfirmArgs = {
  newPassword: Scalars['String'],
  reNewPassword: Scalars['String'],
  token: Scalars['String'],
  uid: Scalars['String']
};


export type IMutationsUpdateUserArgs = {
  id: Scalars['Int'],
  params?: Maybe<IUserInput>
};


export type IMutationsInviteUserArgs = {
  params?: Maybe<IInvitationCreateInput>
};


export type IMutationsDeleteUserArgs = {
  id: Scalars['Int']
};


export type IMutationsUpdateInvitationArgs = {
  id: Scalars['Int'],
  params?: Maybe<IInvitationUpdateInput>
};


export type IMutationsDeleteInvitationArgs = {
  id: Scalars['Int']
};

/** An object with an ID */
export type INode = {
  __typename?: 'Node',
  /** The ID of the object. */
  id: Scalars['ID'],
};

export type INotificationSettingsInputType = {
  notificationType: INotificationTypeEnum,
  email?: Maybe<Scalars['Boolean']>,
  inApp?: Maybe<Scalars['Boolean']>,
};

/** Mutation to set notification settings for a logged in user */
export type INotificationSettingsMutation = {
  __typename?: 'NotificationSettingsMutation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<Array<Maybe<INotificationSettingsType>>>,
};

export type INotificationSettingsType = {
  __typename?: 'NotificationSettingsType',
  id?: Maybe<Scalars['ID']>,
  user: Array<IUserType>,
  notificationType?: Maybe<INotificationTypeEnum>,
  email?: Maybe<Scalars['Boolean']>,
  inApp?: Maybe<Scalars['Boolean']>,
};

export enum INotificationTypeEnum {
  DisruptionSubmitted = 'DISRUPTION_SUBMITTED',
  DisruptionApproved = 'DISRUPTION_APPROVED',
  DisruptionRejected = 'DISRUPTION_REJECTED',
  DisruptionDuplicate = 'DISRUPTION_DUPLICATE',
  DisruptionPublishingFailed = 'DISRUPTION_PUBLISHING_FAILED',
  DisruptionOpenEnded = 'DISRUPTION_OPEN_ENDED',
  DisruptionMissingReferenceByUser = 'DISRUPTION_MISSING_REFERENCE_BY_USER',
  DisruptionOpenUnedited = 'DISRUPTION_OPEN_UNEDITED',
  DisruptionMissingReferenceByOrganisation = 'DISRUPTION_MISSING_REFERENCE_BY_ORGANISATION'
}

export type IOperatorInput = {
  ref: Scalars['String'],
  name?: Maybe<Scalars['String']>,
};

export type IOperatorNode = INode & {
  __typename?: 'OperatorNode',
  /** The ID of the object. */
  id: Scalars['ID'],
  ref: Scalars['String'],
  name: Scalars['String'],
  disruptionimpactSet: IDisruptionImpactNodeConnection,
};


export type IOperatorNodeDisruptionimpactSetArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  stops?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Icontains?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Istartswith?: Maybe<Array<Maybe<Scalars['ID']>>>,
  name?: Maybe<Scalars['String']>,
  name_Icontains?: Maybe<Scalars['String']>,
  name_Istartswith?: Maybe<Scalars['String']>,
  mode?: Maybe<Scalars['String']>,
  severity?: Maybe<Scalars['String']>
};

export type IOperatorNodeConnection = {
  __typename?: 'OperatorNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IOperatorNodeEdge>>,
};

/** A Relay edge containing a `OperatorNode` and its cursor. */
export type IOperatorNodeEdge = {
  __typename?: 'OperatorNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<IOperatorNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

/** To be used by any models that have organisation as a foreign key */
export type IOrganisationForeignKeyInput = {
  id: Scalars['Int'],
};

/** Input parameters for create and update */
export type IOrganisationInput = {
  name?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
  adminAreas?: Maybe<Array<Maybe<IAdminAreaInput>>>,
};

/** Maps the organisation model to a graphql type */
export type IOrganisationType = {
  __typename?: 'OrganisationType',
  id: Scalars['ID'],
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  name: Scalars['String'],
  url?: Maybe<Scalars['String']>,
  adminAreas?: Maybe<Array<Maybe<IAdminAreaType>>>,
  users: Array<IUserType>,
  invitations: Array<IInvitationsType>,
  mailingList: Array<IMailingListType>,
  disruptions: IDisruptionNodeConnection,
};


/** Maps the organisation model to a graphql type */
export type IOrganisationTypeDisruptionsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};

export type IOsGridCoordinate = {
  easting?: Maybe<Scalars['Float']>,
  northing?: Maybe<Scalars['Float']>,
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type IPageInfo = {
  __typename?: 'PageInfo',
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'],
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'],
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>,
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>,
};

/** A mutation to immediately run the publish task to social media accounts.
 * 
 * ** This is for internal use only **
 */
export type IPublishToSocialMedia = {
  __typename?: 'PublishToSocialMedia',
  numPublished?: Maybe<Scalars['Int']>,
  numErrors?: Maybe<Scalars['Int']>,
};

export type IQuery = {
  __typename?: 'Query',
  allFeatures?: Maybe<Array<Maybe<IFeatureFlagType>>>,
  feature?: Maybe<IFeatureFlagType>,
  mailingList?: Maybe<Array<Maybe<IMailingListType>>>,
  mailingListEntry?: Maybe<IMailingListType>,
  disruptionAudit?: Maybe<IDisruptionAuditNodeConnection>,
  organisationAudit?: Maybe<IDisruptionAuditNodeConnection>,
  notificationSettings?: Maybe<Array<Maybe<INotificationSettingsType>>>,
  allSocialRegistrations?: Maybe<Array<Maybe<ISocialRegistrationType>>>,
  socialRegistration?: Maybe<ISocialRegistrationType>,
  allSocialAccounts?: Maybe<Array<Maybe<ISocialAccountType>>>,
  socialAccount?: Maybe<ISocialAccountType>,
  version?: Maybe<Scalars['String']>,
  allTasks?: Maybe<Array<Maybe<IBackgroundTaskType>>>,
  allCompletedTasks?: Maybe<Array<Maybe<IBackgroundCompletedTaskType>>>,
  enumValues?: Maybe<Array<Maybe<IEnumOverridesObject>>>,
  transmodelRestrictions?: Maybe<Array<Maybe<ITransModelRestrictionsObject>>>,
  operator?: Maybe<ITransModelOperatorType>,
  allOperators?: Maybe<Array<Maybe<ITransModelOperatorType>>>,
  line?: Maybe<ITransModelLineType>,
  allLines?: Maybe<Array<Maybe<ITransModelLineType>>>,
  searchAreaLines?: Maybe<Array<Maybe<ITransModelLineType>>>,
  stop?: Maybe<ITransModelStopType>,
  stops?: Maybe<Array<Maybe<ITransModelStopListType>>>,
  adminAreas?: Maybe<Array<Maybe<ITransModelAdminAreaListType>>>,
  allStops?: Maybe<Array<Maybe<ITransModelStopType>>>,
  searchStops?: Maybe<Array<Maybe<ITransModelStopType>>>,
  searchAreaStops?: Maybe<Array<Maybe<ITransModelStopType>>>,
  allRoles?: Maybe<Array<Maybe<IRoleType>>>,
  role?: Maybe<IRoleType>,
  twitterSearch?: Maybe<Array<Maybe<ITwitterSearchList>>>,
  disruptionStats?: Maybe<IDisruptionStatsType>,
  disruption?: Maybe<IDisruptionNode>,
  allDisruptions?: Maybe<IDisruptionNodeConnection>,
  impact?: Maybe<IDisruptionImpactNode>,
  allImpacts?: Maybe<IDisruptionImpactNodeConnection>,
  _debug?: Maybe<IDjangoDebug>,
  socialMessages?: Maybe<ISocialMessageNodeConnection>,
  recentlyClosed?: Maybe<IDisruptionNodeConnection>,
  allOrganisations?: Maybe<Array<Maybe<IOrganisationType>>>,
  allAdminAreas?: Maybe<Array<Maybe<IAdminAreaType>>>,
  organisation?: Maybe<IOrganisationType>,
  allUsers?: Maybe<Array<Maybe<IUserType>>>,
  user?: Maybe<IUserType>,
  allInvitations?: Maybe<Array<Maybe<IInvitationsType>>>,
  invitation?: Maybe<IInvitationsType>,
  invitationByKey?: Maybe<IInvitationsType>,
};


export type IQueryFeatureArgs = {
  name: Scalars['String']
};


export type IQueryMailingListEntryArgs = {
  id: Scalars['ID']
};


export type IQueryDisruptionAuditArgs = {
  id?: Maybe<Scalars['ID']>,
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type IQueryOrganisationAuditArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type IQuerySocialRegistrationArgs = {
  requestToken: Scalars['String']
};


export type IQuerySocialAccountArgs = {
  id: Scalars['ID']
};


export type IQueryOperatorArgs = {
  entityId: Scalars['String']
};


export type IQueryAllOperatorsArgs = {
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type IQueryLineArgs = {
  entityId: Scalars['String']
};


export type IQueryAllLinesArgs = {
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>,
  operators?: Maybe<Array<Maybe<Scalars['String']>>>
};


export type IQuerySearchAreaLinesArgs = {
  polygon: Array<Maybe<IOsGridCoordinate>>
};


export type IQueryStopArgs = {
  entityId: Scalars['String']
};


export type IQueryStopsArgs = {
  ids: Array<Maybe<Scalars['String']>>
};


export type IQuerySearchStopsArgs = {
  searchToken: Scalars['String'],
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type IQuerySearchAreaStopsArgs = {
  polygon: Array<Maybe<IOsGridCoordinate>>,
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type IQueryRoleArgs = {
  id?: Maybe<Scalars['Int']>
};


export type IQueryTwitterSearchArgs = {
  queryString: Scalars['String']
};


export type IQueryDisruptionStatsArgs = {
  severity?: Maybe<ISeverityInput>
};


export type IQueryDisruptionArgs = {
  id?: Maybe<Scalars['ID']>
};


export type IQueryAllDisruptionsArgs = {
  status?: Maybe<IDisruptionStatusInput>,
  severity?: Maybe<ISeverityInput>,
  mode?: Maybe<IModeInput>,
  operators?: Maybe<Array<Maybe<Scalars['String']>>>,
  lines?: Maybe<Array<Maybe<Scalars['String']>>>,
  validityStart?: Maybe<Scalars['Date']>,
  validityEnd?: Maybe<Scalars['Date']>,
  isTemplate: Scalars['Boolean'],
  sortBy?: Maybe<Array<Maybe<IDisruptionSortableFields>>>,
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};


export type IQueryImpactArgs = {
  id?: Maybe<Scalars['ID']>
};


export type IQueryAllImpactsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  stops?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Icontains?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Istartswith?: Maybe<Array<Maybe<Scalars['ID']>>>,
  name?: Maybe<Scalars['String']>,
  name_Icontains?: Maybe<Scalars['String']>,
  name_Istartswith?: Maybe<Scalars['String']>,
  mode?: Maybe<Scalars['String']>,
  severity?: Maybe<Scalars['String']>
};


export type IQuerySocialMessagesArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  published?: Maybe<Scalars['Boolean']>
};


export type IQueryRecentlyClosedArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  title_Icontains?: Maybe<Scalars['String']>
};


export type IQueryOrganisationArgs = {
  id: Scalars['ID']
};


export type IQueryUserArgs = {
  id?: Maybe<Scalars['Int']>
};


export type IQueryInvitationArgs = {
  id: Scalars['Int']
};


export type IQueryInvitationByKeyArgs = {
  key: Scalars['String']
};

/** Mutation to read a notification */
export type IReadNotification = {
  __typename?: 'ReadNotification',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNotificationNode>,
};

/** A mutation to register a new social account */
export type IRegisterSocialAccount = {
  __typename?: 'RegisterSocialAccount',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<ISocialRegistrationResponseType>,
};

/** Mutation to reject a disruption */
export type IRejectDisruption = {
  __typename?: 'RejectDisruption',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNode>,
};

export type IRelatedDisruptionInput = {
  id?: Maybe<Scalars['ID']>,
};

export enum IRepetitionInput {
  Daily = 'Daily',
  Weekly = 'Weekly'
}

export type IReRegisterTasks = {
  __typename?: 'ReRegisterTasks',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** Mutation for requesting a password reset email */
export type IResetPassword = {
  __typename?: 'ResetPassword',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

/** Mutation for confirming a password reset email */
export type IResetPasswordConfirm = {
  __typename?: 'ResetPasswordConfirm',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
};

export enum IRestrictionEnum {
  Operator = 'OPERATOR',
  Line = 'LINE'
}

/** To be used by any models that have Roles as a many-to-many field */
export type IRoleInput = {
  id: Scalars['Int'],
};

export type IRoleType = {
  __typename?: 'RoleType',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  id: Scalars['ID'],
  name: Scalars['String'],
  scope: IRoleScope,
  users: Array<IUserType>,
  invitations: Array<IInvitationsType>,
};

export type ISetEnumOverrides = {
  __typename?: 'SetEnumOverrides',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<Array<Maybe<IEnumOverridesObject>>>,
};

/** An enumeration. */
export enum ISeverityEnum {
  VerySlight = 'VerySlight',
  Slight = 'Slight',
  Normal = 'Normal',
  Severe = 'Severe',
  VerySevere = 'VerySevere',
  Unknown = 'Unknown',
  NoImpact = 'NoImpact'
}

export enum ISeverityInput {
  VerySlight = 'VerySlight',
  Slight = 'Slight',
  Normal = 'Normal',
  Severe = 'Severe',
  VerySevere = 'VerySevere',
  Unknown = 'Unknown',
  NoImpact = 'NoImpact'
}

/** A mutation to sign-up users */
export type ISignUp = {
  __typename?: 'SignUp',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IUserType>,
};

/** An enumeration. */
export enum ISocialAccountAccountType {
  /** Twitter */
  A_1 = 'A_1',
  /** Facebook */
  A_2 = 'A_2',
  /** HootSuite */
  A_3 = 'A_3'
}

/** An enumeration. */
export enum ISocialAccountEnum {
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  HootSuite = 'HootSuite'
}

export type ISocialAccountInput = {
  id?: Maybe<Scalars['ID']>,
};

export type ISocialAccountType = {
  __typename?: 'SocialAccountType',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  id: Scalars['ID'],
  username: Scalars['String'],
  accountType: ISocialAccountAccountType,
  prettyName?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  createdBy: IUserType,
  hootsuiteProfiles: Array<IHootSuiteProfileType>,
  facebookPages?: Maybe<Array<Maybe<IFacebookPageType>>>,
  socialMessages: ISocialMessageNodeConnection,
  tokenExpiresAt?: Maybe<Scalars['Int']>,
};


export type ISocialAccountTypeSocialMessagesArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  published?: Maybe<Scalars['Boolean']>
};

/** Input for social messages for disruptions */
export type ISocialMessageInput = {
  id?: Maybe<Scalars['ID']>,
  message?: Maybe<Scalars['String']>,
  image?: Maybe<Scalars['Upload']>,
  publishOn?: Maybe<Scalars['DateTime']>,
  socialAccount?: Maybe<ISocialAccountInput>,
  hootsuiteProfile?: Maybe<IHootSuiteProfileInput>,
};

export type ISocialMessageNode = INode & {
  __typename?: 'SocialMessageNode',
  /** The ID of the object. */
  id: Scalars['ID'],
  disruption: IDisruptionNode,
  socialAccount?: Maybe<ISocialAccountType>,
  hootsuiteProfile?: Maybe<IHootSuiteProfileType>,
  message: Scalars['String'],
  image?: Maybe<IImageType>,
  publishOn: Scalars['DateTime'],
  published: Scalars['Boolean'],
  publishedOn?: Maybe<Scalars['DateTime']>,
  lastPublishError?: Maybe<Scalars['String']>,
  hootsuiteMessageId?: Maybe<Scalars['String']>,
  hootsuiteScheduledTime?: Maybe<Scalars['DateTime']>,
};

export type ISocialMessageNodeConnection = {
  __typename?: 'SocialMessageNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ISocialMessageNodeEdge>>,
  totalCount?: Maybe<Scalars['Int']>,
};

/** A Relay edge containing a `SocialMessageNode` and its cursor. */
export type ISocialMessageNodeEdge = {
  __typename?: 'SocialMessageNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<ISocialMessageNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

export type ISocialMessageType = {
  __typename?: 'SocialMessageType',
  id: Scalars['ID'],
  disruption: IDisruptionNode,
  socialAccount?: Maybe<ISocialAccountType>,
  hootsuiteProfile?: Maybe<IHootSuiteProfileType>,
  message: Scalars['String'],
  image?: Maybe<IImageType>,
  publishOn: Scalars['DateTime'],
  published: Scalars['Boolean'],
  publishedOn?: Maybe<Scalars['DateTime']>,
  lastPublishError?: Maybe<Scalars['String']>,
  hootsuiteMessageId?: Maybe<Scalars['String']>,
  hootsuiteScheduledTime?: Maybe<Scalars['DateTime']>,
};

/** An enumeration. */
export enum ISocialRegistrationAccountType {
  /** Twitter */
  A_1 = 'A_1',
  /** Facebook */
  A_2 = 'A_2',
  /** HootSuite */
  A_3 = 'A_3'
}

/** Input parameters for create and update */
export type ISocialRegistrationInput = {
  accountType?: Maybe<ISocialAccountEnum>,
};

export type ISocialRegistrationResponseType = {
  __typename?: 'SocialRegistrationResponseType',
  authorizeUrl?: Maybe<Scalars['String']>,
};

/** An enumeration. */
export enum ISocialRegistrationStatus {
  /** Success */
  A_1 = 'A_1',
  /** Failure */
  A_2 = 'A_2',
  /** Pending */
  A_3 = 'A_3',
  /** Error */
  A_4 = 'A_4'
}

export type ISocialRegistrationType = {
  __typename?: 'SocialRegistrationType',
  created: Scalars['DateTime'],
  modified: Scalars['DateTime'],
  requestToken: Scalars['String'],
  accountType: ISocialRegistrationAccountType,
  createdBy: IUserType,
  status: ISocialRegistrationStatus,
  error?: Maybe<Scalars['String']>,
};

/** GeoJson having stop coordinates and the coordinates of lines
 * going through that stop.
 */
export type IStopGeoJsonType = {
  __typename?: 'StopGeoJsonType',
  geometry?: Maybe<Scalars['JSONScalar']>,
  properties?: Maybe<Scalars['JSONScalar']>,
  type?: Maybe<Scalars['String']>,
};

export type IStopInput = {
  ref: Scalars['String'],
  atcoCode?: Maybe<Scalars['String']>,
  commonName?: Maybe<Scalars['String']>,
  naptanCode?: Maybe<Scalars['String']>,
  type?: Maybe<IStopPointInput>,
  street?: Maybe<Scalars['String']>,
  indicator?: Maybe<Scalars['String']>,
  latitude: Scalars['Float'],
  longitude: Scalars['Float'],
  easting?: Maybe<Scalars['Float']>,
  northing?: Maybe<Scalars['Float']>,
};

export enum IStopPointInput {
  BusStop = 'BusStop',
  CoachStop = 'CoachStop',
  BoatQuay = 'BoatQuay',
  FerryLanding = 'FerryLanding',
  TramStop = 'TramStop',
  Unknown = 'Unknown'
}

export type IStopPointNode = INode & {
  __typename?: 'StopPointNode',
  /** The ID of the object. */
  id: Scalars['ID'],
  ref?: Maybe<Scalars['String']>,
  atcoCode?: Maybe<Scalars['String']>,
  naptanCode?: Maybe<Scalars['String']>,
  commonName: Scalars['String'],
  type: IStopPointType,
  street?: Maybe<Scalars['String']>,
  indicator?: Maybe<Scalars['String']>,
  latitude?: Maybe<Scalars['Float']>,
  longitude?: Maybe<Scalars['Float']>,
  easting?: Maybe<Scalars['Int']>,
  northing?: Maybe<Scalars['Int']>,
  disruptionimpactSet: IDisruptionImpactNodeConnection,
};


export type IStopPointNodeDisruptionimpactSetArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  stops?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Icontains?: Maybe<Array<Maybe<Scalars['ID']>>>,
  stops_Istartswith?: Maybe<Array<Maybe<Scalars['ID']>>>,
  name?: Maybe<Scalars['String']>,
  name_Icontains?: Maybe<Scalars['String']>,
  name_Istartswith?: Maybe<Scalars['String']>,
  mode?: Maybe<Scalars['String']>,
  severity?: Maybe<Scalars['String']>
};

export type IStopPointNodeConnection = {
  __typename?: 'StopPointNodeConnection',
  /** Pagination data for this connection. */
  pageInfo: IPageInfo,
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IStopPointNodeEdge>>,
};

/** A Relay edge containing a `StopPointNode` and its cursor. */
export type IStopPointNodeEdge = {
  __typename?: 'StopPointNodeEdge',
  /** The item at the end of the edge */
  node?: Maybe<IStopPointNode>,
  /** A cursor for use in pagination */
  cursor: Scalars['String'],
};

/** Mutation to submit a disruption */
export type ISubmitDisruption = {
  __typename?: 'SubmitDisruption',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNode>,
};


/** Represents a set of admin areas */
export type ITransModelAdminAreaListType = {
  __typename?: 'TransModelAdminAreaListType',
  name?: Maybe<Scalars['String']>,
  atcoCode?: Maybe<Scalars['String']>,
  featureName?: Maybe<Scalars['String']>,
  codePrefix?: Maybe<Scalars['String']>,
  shortName?: Maybe<Scalars['String']>,
  boundingBox?: Maybe<Scalars['String']>,
  entityId?: Maybe<Scalars['String']>,
};

/** Represents a line type (for allLines and Line queries) */
export type ITransModelLineType = {
  __typename?: 'TransModelLineType',
  name?: Maybe<Scalars['String']>,
  featureName?: Maybe<Scalars['String']>,
  entityId?: Maybe<Scalars['String']>,
  boundingBox?: Maybe<Scalars['String']>,
  modes?: Maybe<Array<Maybe<Scalars['String']>>>,
  operatorEntityIds?: Maybe<Array<Maybe<Scalars['String']>>>,
  features?: Maybe<Array<Maybe<ILineGeoJsonType>>>,
};

/** Represents an operator resource */
export type ITransModelOperatorType = {
  __typename?: 'TransModelOperatorType',
  name?: Maybe<Scalars['String']>,
  featureName?: Maybe<Scalars['String']>,
  code?: Maybe<Scalars['String']>,
  entityId?: Maybe<Scalars['String']>,
  boundingBox?: Maybe<Scalars['String']>,
  modes?: Maybe<Scalars['String']>,
};

export type ITransModelRestrictionsInput = {
  type?: Maybe<IRestrictionEnum>,
  name?: Maybe<Scalars['String']>,
  entityId?: Maybe<Scalars['String']>,
};

/** A user can be restricted to a certain set of operator and lines.
 * The API for this object is in the users app.
 */
export type ITransModelRestrictionsObject = {
  __typename?: 'TransModelRestrictionsObject',
  id: Scalars['ID'],
  type: ITransModelRestrictionsType,
  entityId: Scalars['String'],
  name: Scalars['String'],
  users: Array<IUserType>,
};

/** An enumeration. */
export enum ITransModelRestrictionsType {
  /** Line */
  Li = 'LI',
  /** Operator */
  Op = 'OP'
}

/** Represents a set of stops (uses the generic endpoint to get a list of stops with
 * specific ids
 */
export type ITransModelStopListType = {
  __typename?: 'TransModelStopListType',
  name?: Maybe<Scalars['String']>,
  naptanCode?: Maybe<Scalars['String']>,
  atcoCode?: Maybe<Scalars['String']>,
  entityId?: Maybe<Scalars['String']>,
  stopType?: Maybe<Scalars['String']>,
  featureName?: Maybe<Scalars['String']>,
  fullName?: Maybe<Scalars['String']>,
  boundingBox?: Maybe<Scalars['String']>,
  administrativeArea?: Maybe<Scalars['String']>,
  locality?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  lat?: Maybe<Scalars['String']>,
  lon?: Maybe<Scalars['String']>,
  features?: Maybe<Array<Maybe<IStopGeoJsonType>>>,
};

/** Represents a stop resource */
export type ITransModelStopType = {
  __typename?: 'TransModelStopType',
  name?: Maybe<Scalars['String']>,
  naptanCode?: Maybe<Scalars['String']>,
  atcoCode?: Maybe<Scalars['String']>,
  entityId?: Maybe<Scalars['String']>,
  stopType?: Maybe<Scalars['String']>,
  featureName?: Maybe<Scalars['String']>,
  fullName?: Maybe<Scalars['String']>,
  boundingBox?: Maybe<Scalars['String']>,
  administrativeArea?: Maybe<Scalars['String']>,
  locality?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  lat?: Maybe<Scalars['String']>,
  lon?: Maybe<Scalars['String']>,
  features?: Maybe<Array<Maybe<IStopGeoJsonType>>>,
};

export type ITwitterSearchList = {
  __typename?: 'TwitterSearchList',
  screenName?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
};

/** Mutation to update a disruption */
export type IUpdateDisruption = {
  __typename?: 'UpdateDisruption',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IDisruptionNode>,
};

export type IUpdateInvitation = {
  __typename?: 'UpdateInvitation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IInvitationsType>,
};

/** A mutation to update an entry in the mailing list */
export type IUpdateMailingListEntry = {
  __typename?: 'UpdateMailingListEntry',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IMailingListType>,
};

/** A mutation to update the organisation */
export type IUpdateOrganisation = {
  __typename?: 'UpdateOrganisation',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IOrganisationType>,
};

export type IUpdateUser = {
  __typename?: 'UpdateUser',
  success?: Maybe<Scalars['Boolean']>,
  errors?: Maybe<Scalars['String']>,
  data?: Maybe<IUserType>,
};


/** Input for creating and updating a user */
export type IUserInput = {
  username?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  organisation?: Maybe<IOrganisationForeignKeyInput>,
  roles?: Maybe<Array<Maybe<IRoleInput>>>,
  transmodelRestrictions?: Maybe<Array<Maybe<ITransModelRestrictionsInput>>>,
};

/** Input parameters for user sign-up */
export type IUserSignUpInput = {
  username: Scalars['String'],
  password: Scalars['String'],
  key: Scalars['String'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
};

/** Maps the user model to a graphql type */
export type IUserType = {
  __typename?: 'UserType',
  id: Scalars['ID'],
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String'],
  email: Scalars['String'],
  roles?: Maybe<Array<Maybe<IRoleType>>>,
  organisation?: Maybe<IOrganisationType>,
  disruptionNotifications?: Maybe<IDisruptionNotificationNodeConnection>,
  disruptions?: Maybe<IDisruptionNodeConnection>,
  capabilities?: Maybe<ICapabilitiesInfo>,
  transmodelRestrictions?: Maybe<Array<Maybe<ITransModelRestrictionsObject>>>,
  lastLogin?: Maybe<Scalars['DateTime']>,
  numDisruptionsEntered?: Maybe<Scalars['Int']>,
  numDisruptionsApproved?: Maybe<Scalars['Int']>,
  currentUser?: Maybe<Scalars['String']>,
};


/** Maps the user model to a graphql type */
export type IUserTypeDisruptionNotificationsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


/** Maps the user model to a graphql type */
export type IUserTypeDisruptionsArgs = {
  before?: Maybe<Scalars['String']>,
  after?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


/** Maps the user model to a graphql type */
export type IUserTypeNumDisruptionsEnteredArgs = {
  fromDate?: Maybe<Scalars['DateTime']>,
  toDate?: Maybe<Scalars['DateTime']>
};


/** Maps the user model to a graphql type */
export type IUserTypeNumDisruptionsApprovedArgs = {
  fromDate?: Maybe<Scalars['DateTime']>,
  toDate?: Maybe<Scalars['DateTime']>
};

export type IValidityPeriodInput = {
  id?: Maybe<Scalars['ID']>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  startTime?: Maybe<Scalars['Time']>,
  endTime?: Maybe<Scalars['Time']>,
  repetition?: Maybe<IRepetitionInput>,
  finalDate?: Maybe<Scalars['Date']>,
};

/** An enumeration. */
export enum IValidityPeriodRepetition {
  /** Daily */
  Daily = 'DAILY',
  /** Weekly */
  Weekly = 'WEEKLY'
}

export type IValidityPeriodType = {
  __typename?: 'ValidityPeriodType',
  id: Scalars['ID'],
  startDate: Scalars['Date'],
  endDate?: Maybe<Scalars['Date']>,
  startTime?: Maybe<Scalars['Time']>,
  endTime?: Maybe<Scalars['Time']>,
  repetition?: Maybe<IValidityPeriodRepetition>,
  finalDate?: Maybe<Scalars['Date']>,
  disruption: IDisruptionNode,
  days?: Maybe<Array<Maybe<Scalars['Int']>>>,
};

export type IMailingListQueryVariables = {};


export type IMailingListQuery = ({ __typename?: 'Query' } & { mailingList: Maybe<Array<Maybe<({ __typename?: 'MailingListType' } & Pick<IMailingListType, 'id' | 'email' | 'severity' | 'optedIn'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> })>>> });

export type ICreateMailingListEntryMutationVariables = {
  params: IMailingListInput
};


export type ICreateMailingListEntryMutation = ({ __typename?: 'Mutations' } & { createMailingListEntry: Maybe<({ __typename?: 'CreateMailingListEntry' } & Pick<ICreateMailingListEntry, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'MailingListType' } & Pick<IMailingListType, 'email' | 'severity' | 'optedIn'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> })> })> });

export type IUpdateMailingListEntryMutationVariables = {
  id: Scalars['Int'],
  params: IMailingListInput
};


export type IUpdateMailingListEntryMutation = ({ __typename?: 'Mutations' } & { updateMailingListEntry: Maybe<({ __typename?: 'UpdateMailingListEntry' } & Pick<IUpdateMailingListEntry, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'MailingListType' } & Pick<IMailingListType, 'email' | 'severity' | 'optedIn'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> })> })> });

export type IDeleteMailingListEntryMutationVariables = {
  id: Scalars['Int']
};


export type IDeleteMailingListEntryMutation = ({ __typename?: 'Mutations' } & { deleteMailingListEntry: Maybe<({ __typename?: 'DeleteMailingListEntry' } & Pick<IDeleteMailingListEntry, 'success' | 'errors'>)> });

export type ICreateOrganisationMutationVariables = {
  params: IOrganisationInput
};


export type ICreateOrganisationMutation = ({ __typename?: 'Mutations' } & { createOrganisation: Maybe<({ __typename?: 'CreateOrganisation' } & Pick<ICreateOrganisation, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name' | 'url'> & { adminAreas: Maybe<Array<Maybe<({ __typename?: 'AdminAreaType' } & Pick<IAdminAreaType, 'name'>)>>> })> })> });

export type IUpdateOrganisationMutationVariables = {
  id: Scalars['Int'],
  params: IOrganisationInput
};


export type IUpdateOrganisationMutation = ({ __typename?: 'Mutations' } & { updateOrganisation: Maybe<({ __typename?: 'UpdateOrganisation' } & Pick<IUpdateOrganisation, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'url'> & { adminAreas: Maybe<Array<Maybe<({ __typename?: 'AdminAreaType' } & Pick<IAdminAreaType, 'name'>)>>> })> })> });

export type IDeleteOrganisationMutationVariables = {
  id: Scalars['Int']
};


export type IDeleteOrganisationMutation = ({ __typename?: 'Mutations' } & { deleteOrganisation: Maybe<({ __typename?: 'DeleteOrganisation' } & Pick<IDeleteOrganisation, 'success' | 'errors'>)> });

export type IAllAdminAreasQueryVariables = {};


export type IAllAdminAreasQuery = ({ __typename?: 'Query' } & { allAdminAreas: Maybe<Array<Maybe<({ __typename?: 'AdminAreaType' } & Pick<IAdminAreaType, 'name' | 'areaCode'>)>>> });

export type IOrganisationListQueryVariables = {};


export type IOrganisationListQuery = ({ __typename?: 'Query' } & { allOrganisations: Maybe<Array<Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name' | 'url'> & { adminAreas: Maybe<Array<Maybe<({ __typename?: 'AdminAreaType' } & Pick<IAdminAreaType, 'name' | 'areaCode'>)>>> })>>> });

export type IUpdateUserMutationVariables = {
  id: Scalars['Int'],
  params: IUserInput
};


export type IUpdateUserMutation = ({ __typename?: 'Mutations' } & { updateUser: Maybe<({ __typename?: 'UpdateUser' } & Pick<IUpdateUser, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username' | 'email'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)>, transmodelRestrictions: Maybe<Array<Maybe<({ __typename?: 'TransModelRestrictionsObject' } & Pick<ITransModelRestrictionsObject, 'type' | 'name' | 'entityId'>)>>>, roles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>> })> })> });

export type IInviteUserMutationVariables = {
  params: IInvitationCreateInput
};


export type IInviteUserMutation = ({ __typename?: 'Mutations' } & { inviteUser: Maybe<({ __typename?: 'CreateInvitation' } & Pick<ICreateInvitation, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'InvitationsType' } & Pick<IInvitationsType, 'id' | 'key' | 'email'> & { roles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>> })> })> });

export type ISignUpMutationVariables = {
  params: IUserSignUpInput
};


export type ISignUpMutation = ({ __typename?: 'Mutations' } & { signUp: Maybe<({ __typename?: 'SignUp' } & Pick<ISignUp, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username' | 'email'> & { roles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>>, organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'name'>)> })> })> });

export type IDeleteUserMutationVariables = {
  id: Scalars['Int']
};


export type IDeleteUserMutation = ({ __typename?: 'Mutations' } & { deleteUser: Maybe<({ __typename?: 'DeleteUser' } & Pick<IDeleteUser, 'success' | 'errors'>)> });

export type IChangePasswordMutationVariables = {
  username: Scalars['String'],
  oldPassword: Scalars['String'],
  newPassword: Scalars['String']
};


export type IChangePasswordMutation = ({ __typename?: 'Mutations' } & { changePassword: Maybe<({ __typename?: 'ChangePassword' } & Pick<IChangePassword, 'success' | 'errors'>)> });

export type IResetPasswordMutationVariables = {
  email: Scalars['String']
};


export type IResetPasswordMutation = ({ __typename?: 'Mutations' } & { resetPassword: Maybe<({ __typename?: 'ResetPassword' } & Pick<IResetPassword, 'success' | 'errors'>)> });

export type IResetPasswordConfirmMutationVariables = {
  uid: Scalars['String'],
  token: Scalars['String'],
  password: Scalars['String'],
  confirmPassword: Scalars['String']
};


export type IResetPasswordConfirmMutation = ({ __typename?: 'Mutations' } & { resetPasswordConfirm: Maybe<({ __typename?: 'ResetPasswordConfirm' } & Pick<IResetPasswordConfirm, 'success' | 'errors'>)> });

export type IAllUsersQueryVariables = {};


export type IAllUsersQuery = ({ __typename?: 'Query' } & { allUsers: Maybe<Array<Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username' | 'email'> & { roles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>>, organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)>, transmodelRestrictions: Maybe<Array<Maybe<({ __typename?: 'TransModelRestrictionsObject' } & Pick<ITransModelRestrictionsObject, 'id' | 'type' | 'entityId' | 'name'>)>>> })>>> });

export type IAllRolesQueryVariables = {};


export type IAllRolesQuery = ({ __typename?: 'Query' } & { allRoles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>> });

export type IAllOrganistionsQueryVariables = {};


export type IAllOrganistionsQuery = ({ __typename?: 'Query' } & { allOrganisations: Maybe<Array<Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)>>> });

export type IInvitationByKeyQueryVariables = {
  key: Scalars['String']
};


export type IInvitationByKeyQuery = ({ __typename?: 'Query' } & { invitationByKey: Maybe<({ __typename?: 'InvitationsType' } & Pick<IInvitationsType, 'id' | 'key'>)> });

export type IAllNotificationSettingsQueryVariables = {};


export type IAllNotificationSettingsQuery = ({ __typename?: 'Query' } & { notificationSettings: Maybe<Array<Maybe<({ __typename?: 'NotificationSettingsType' } & Pick<INotificationSettingsType, 'notificationType' | 'email' | 'inApp' | 'id'>)>>> });

export type IUpdateNotificationSettingsMutationVariables = {
  params?: Maybe<Array<Maybe<INotificationSettingsInputType>>>
};


export type IUpdateNotificationSettingsMutation = ({ __typename?: 'Mutations' } & { notificationSettings: Maybe<({ __typename?: 'NotificationSettingsMutation' } & Pick<INotificationSettingsMutation, 'success' | 'errors'> & { data: Maybe<Array<Maybe<({ __typename?: 'NotificationSettingsType' } & Pick<INotificationSettingsType, 'notificationType' | 'id'>)>>> })> });

export type IOrganisationActivityQueryVariables = {};


export type IOrganisationActivityQuery = ({ __typename?: 'Query' } & { organisationAudit: Maybe<({ __typename?: 'DisruptionAuditNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionAuditNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionAuditNode' } & Pick<IDisruptionAuditNode, 'id' | 'action' | 'objectPk' | 'objectRepr' | 'objectId' | 'timestamp'> & { actor: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>)>, contentType: Maybe<({ __typename?: 'ContentTypeType' } & Pick<IContentTypeType, 'id' | 'name'>)>, changedFields: Maybe<Array<Maybe<({ __typename?: 'ChangedFields' } & Pick<IChangedFields, 'field' | 'oldValue' | 'newValue'>)>>> })> })>> })> });

export type IDisruptionAuditByIdQueryVariables = {
  id: Scalars['ID']
};


export type IDisruptionAuditByIdQuery = ({ __typename?: 'Query' } & { disruptionAudit: Maybe<({ __typename?: 'DisruptionAuditNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionAuditNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionAuditNode' } & Pick<IDisruptionAuditNode, 'id' | 'action' | 'objectPk' | 'timestamp'> & { actor: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>)>, contentType: Maybe<({ __typename?: 'ContentTypeType' } & Pick<IContentTypeType, 'id' | 'name'>)>, changedFields: Maybe<Array<Maybe<({ __typename?: 'ChangedFields' } & Pick<IChangedFields, 'field' | 'oldValue' | 'newValue'>)>>> })> })>> })> });

export type ILoginMutationVariables = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type ILoginMutation = ({ __typename?: 'Mutations' } & { login: Maybe<({ __typename?: 'Login' } & Pick<ILogin, 'success' | 'errors'>)> });

export type ILogoutMutationVariables = {};


export type ILogoutMutation = ({ __typename?: 'Mutations' } & { logout: Maybe<({ __typename?: 'Logout' } & Pick<ILogout, 'success' | 'errors'>)> });

export type IDisruptionStatsQueryVariables = {
  first: Scalars['Int'],
  after?: Maybe<Scalars['String']>,
  severity?: Maybe<ISeverityInput>
};


export type IDisruptionStatsQuery = ({ __typename?: 'Query' } & { disruptionStats: Maybe<({ __typename: 'DisruptionStatsType' } & { liveDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'description' | 'status' | 'severity'> & { validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'days' | 'finalDate' | 'repetition'>)>, impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'mode' | 'severity'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'latitude' | 'longitude'>)> })>> }) })> })>> }) })> })>> })>, upcomingDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'description' | 'status' | 'severity'> & { validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'days' | 'finalDate' | 'repetition'>)>, impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'mode' | 'severity'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'latitude' | 'longitude'>)> })>> }) })> })>> }) })> })>> })> })> });

export type IReviewsDashboardListQueryVariables = {};


export type IReviewsDashboardListQuery = ({ __typename?: 'Query' } & { allDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title'>)> })>> })> });

export type IRecentlyClosedQueryVariables = {};


export type IRecentlyClosedQuery = ({ __typename?: 'Query' } & { recentlyClosed: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title'>)> })>> })> });

export type ISocialMessagesQueryVariables = {};


export type ISocialMessagesQuery = ({ __typename?: 'Query' } & { socialMessages: Maybe<({ __typename?: 'SocialMessageNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'SocialMessageNodeEdge' } & { node: Maybe<({ __typename?: 'SocialMessageNode' } & Pick<ISocialMessageNode, 'id' | 'publishedOn' | 'message'> & { socialAccount: Maybe<({ __typename?: 'SocialAccountType' } & ISocialAccountFragmentFragment)>, hootsuiteProfile: Maybe<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)>, image: Maybe<({ __typename?: 'ImageType' } & Pick<IImageType, 'name' | 'url'>)> })> })>> })> });

export type IDeleteDisruptionMutationVariables = {
  id?: Maybe<Scalars['ID']>
};


export type IDeleteDisruptionMutation = ({ __typename?: 'Mutations' } & { deleteDisruption: Maybe<({ __typename?: 'DeleteDisruption' } & Pick<IDeleteDisruption, 'success' | 'errors'>)> });

export type ICreateDisruptionMutationVariables = {
  params: IDisruptionCreateInput
};


export type ICreateDisruptionMutation = ({ __typename?: 'Mutations' } & { createDisruption: Maybe<({ __typename?: 'CreateDisruption' } & Pick<ICreateDisruption, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'isTemplate' | 'description' | 'link' | 'type' | 'reason' | 'publishingStart' | 'publishingEnd' | 'isOpenEnded' | 'modified'> & { relatedDisruption: ({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title'>)> })>> }), impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'mode' | 'advice' | 'journeyPlanner' | 'direction' | 'delay' | 'severity'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'ref' | 'name'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'ref' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'atcoCode' | 'type' | 'ref' | 'latitude' | 'longitude'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'repetition' | 'finalDate'>)>, socialMessages: Maybe<Array<Maybe<({ __typename?: 'SocialMessageType' } & Pick<ISocialMessageType, 'id' | 'publishOn' | 'message' | 'published' | 'publishedOn' | 'lastPublishError'> & { socialAccount: Maybe<({ __typename?: 'SocialAccountType' } & ISocialAccountFragmentFragment)>, hootsuiteProfile: Maybe<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)>, image: Maybe<({ __typename?: 'ImageType' } & Pick<IImageType, 'name' | 'url'>)> })>>> })> })> });

export type ISubmitDisruptionMutationVariables = {
  id?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['String']>
};


export type ISubmitDisruptionMutation = ({ __typename?: 'Mutations' } & { submitDisruption: Maybe<({ __typename?: 'SubmitDisruption' } & Pick<ISubmitDisruption, 'success' | 'errors'>)> });

export type IUpdateDisruptionMutationVariables = {
  id?: Maybe<Scalars['ID']>,
  params: IDisruptionUpdateInput
};


export type IUpdateDisruptionMutation = ({ __typename?: 'Mutations' } & { updateDisruption: Maybe<({ __typename?: 'UpdateDisruption' } & Pick<IUpdateDisruption, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'isTemplate' | 'description' | 'link' | 'type' | 'reason' | 'publishingStart' | 'publishingEnd' | 'isOpenEnded' | 'modified'> & { relatedDisruption: ({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title'>)> })>> }), impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'mode' | 'advice' | 'journeyPlanner' | 'delay' | 'severity' | 'direction'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'ref' | 'name'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'ref' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'atcoCode' | 'type' | 'ref' | 'latitude' | 'longitude'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'repetition' | 'finalDate'>)>, socialMessages: Maybe<Array<Maybe<({ __typename?: 'SocialMessageType' } & Pick<ISocialMessageType, 'id' | 'publishOn' | 'message' | 'published' | 'publishedOn' | 'lastPublishError'> & { socialAccount: Maybe<({ __typename?: 'SocialAccountType' } & ISocialAccountFragmentFragment)>, hootsuiteProfile: Maybe<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)>, image: Maybe<({ __typename?: 'ImageType' } & Pick<IImageType, 'name' | 'url'>)> })>>> })> })> });

export type IHootSuiteProfileFragmentFragment = ({ __typename: 'HootSuiteProfileType' } & Pick<IHootSuiteProfileType, 'id' | 'profileType' | 'profileId' | 'socialId' | 'socialUsername'>);

export type ISocialAccountFragmentFragment = ({ __typename: 'SocialAccountType' } & Pick<ISocialAccountType, 'username' | 'id' | 'email' | 'accountType' | 'prettyName'> & { facebookPages: Maybe<Array<Maybe<({ __typename?: 'FacebookPageType' } & Pick<IFacebookPageType, 'id' | 'name'>)>>>, createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> }), hootsuiteProfiles: Array<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)> });

export type IDisruptionByIdForEditQueryVariables = {
  id: Scalars['ID']
};


export type IDisruptionByIdForEditQuery = ({ __typename?: 'Query' } & { disruption: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'isTemplate' | 'title' | 'description' | 'link' | 'type' | 'reason' | 'isOpenEnded' | 'publishingStart' | 'publishingEnd'> & { relatedDisruption: ({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'deleted'>)> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'repetition' | 'finalDate'>)>, impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'mode' | 'allOperators' | 'advice' | 'delay' | 'severity' | 'direction' | 'journeyPlanner'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'ref' | 'name'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'ref' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'atcoCode' | 'type' | 'ref' | 'latitude' | 'longitude'>)> })>> }) })> })>> }), socialMessages: Maybe<Array<Maybe<({ __typename?: 'SocialMessageType' } & Pick<ISocialMessageType, 'id' | 'publishOn' | 'message' | 'published' | 'publishedOn' | 'lastPublishError'> & { socialAccount: Maybe<({ __typename?: 'SocialAccountType' } & ISocialAccountFragmentFragment)>, hootsuiteProfile: Maybe<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)>, image: Maybe<({ __typename?: 'ImageType' } & Pick<IImageType, 'name' | 'url'>)> })>>> })> });

export type IAutcompleteDisruptionsListQueryVariables = {
  titleFilter?: Maybe<Scalars['String']>
};


export type IAutcompleteDisruptionsListQuery = ({ __typename?: 'Query' } & { allDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title'>)> })>> })> });

export type ITwitterSearchQueryVariables = {
  queryString: Scalars['String']
};


export type ITwitterSearchQuery = ({ __typename?: 'Query' } & { twitterSearch: Maybe<Array<Maybe<({ __typename?: 'TwitterSearchList' } & Pick<ITwitterSearchList, 'id' | 'screenName'>)>>> });

export type IDisruptionByIdQueryVariables = {
  id: Scalars['ID']
};


export type IDisruptionByIdQuery = ({ __typename?: 'Query' } & { disruption: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'isTemplate' | 'status' | 'description' | 'link' | 'type' | 'isOpenEnded' | 'severity' | 'created' | 'publishingStart' | 'publishingEnd' | 'isLive' | 'reason'> & { createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>), approvedBy: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>)>, comments: Array<({ __typename?: 'CommentType' } & Pick<ICommentType, 'created' | 'id' | 'comment'> & { user: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>) })>, socialMessages: Maybe<Array<Maybe<({ __typename?: 'SocialMessageType' } & Pick<ISocialMessageType, 'id' | 'message' | 'publishOn' | 'published' | 'publishedOn' | 'lastPublishError'> & { image: Maybe<({ __typename?: 'ImageType' } & Pick<IImageType, 'name' | 'url'>)>, socialAccount: Maybe<({ __typename?: 'SocialAccountType' } & Pick<ISocialAccountType, 'username' | 'id' | 'email' | 'accountType' | 'prettyName'> & { createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> }), facebookPages: Maybe<Array<Maybe<({ __typename?: 'FacebookPageType' } & Pick<IFacebookPageType, 'name' | 'id'>)>>> })>, hootsuiteProfile: Maybe<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)> })>>>, impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'advice' | 'name' | 'severity' | 'mode' | 'delay'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'ref' | 'name'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'ref' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'days' | 'repetition' | 'finalDate'>)>, relatedDisruption: ({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'status'>)> })>> }) })> });

export type IApproveDisruptionMutationVariables = {
  id?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['String']>
};


export type IApproveDisruptionMutation = ({ __typename?: 'Mutations' } & { approveDisruption: Maybe<({ __typename?: 'ApproveDisruption' } & Pick<IApproveDisruption, 'success' | 'errors'>)> });

export type IRejectDisruptionMutationVariables = {
  id?: Maybe<Scalars['ID']>,
  comment?: Maybe<Scalars['String']>
};


export type IRejectDisruptionMutation = ({ __typename?: 'Mutations' } & { rejectDisruption: Maybe<({ __typename?: 'RejectDisruption' } & Pick<IRejectDisruption, 'success' | 'errors'>)> });

export type IExportDisruptionsListQueryVariables = {
  status?: Maybe<IDisruptionStatusInput>,
  severity?: Maybe<ISeverityInput>,
  mode?: Maybe<IModeInput>,
  operators?: Maybe<Array<Maybe<Scalars['String']>>>,
  lines?: Maybe<Array<Maybe<Scalars['String']>>>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  isTemplate?: Maybe<Scalars['Boolean']>,
  after?: Maybe<Scalars['String']>,
  titleFilter?: Maybe<Scalars['String']>,
  sortBy?: Maybe<Array<Maybe<IDisruptionSortableFields>>>
};


export type IExportDisruptionsListQuery = ({ __typename?: 'Query' } & { allDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { pageInfo: ({ __typename?: 'PageInfo' } & Pick<IPageInfo, 'hasNextPage' | 'endCursor'>), edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'description' | 'version' | 'link' | 'status' | 'severity' | 'isLive' | 'type' | 'isTemplate' | 'isOpenEnded' | 'openSince' | 'deleted' | 'reason' | 'publishingStart' | 'publishingEnd'> & { createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>), relatedDisruption: ({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id'>)> })>> }), organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)>, approvedBy: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>)>, relatedTo: ({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id'>)> })>> }), impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'advice' | 'severity' | 'delay' | 'journeyPlanner' | 'direction' | 'allOperators' | 'mode'> & { lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'naptanCode' | 'atcoCode'>)> })>> }), operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'name'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'finalDate' | 'repetition'>)>, socialMessages: Maybe<Array<Maybe<({ __typename?: 'SocialMessageType' } & Pick<ISocialMessageType, 'id' | 'message' | 'publishOn' | 'published' | 'publishedOn' | 'lastPublishError'> & { image: Maybe<({ __typename?: 'ImageType' } & Pick<IImageType, 'name' | 'url'>)>, socialAccount: Maybe<({ __typename?: 'SocialAccountType' } & Pick<ISocialAccountType, 'id' | 'username' | 'accountType' | 'prettyName' | 'email'> & { facebookPages: Maybe<Array<Maybe<({ __typename?: 'FacebookPageType' } & Pick<IFacebookPageType, 'id' | 'name'>)>>>, createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>), hootsuiteProfiles: Array<({ __typename?: 'HootSuiteProfileType' } & Pick<IHootSuiteProfileType, 'id' | 'profileType' | 'profileId' | 'socialId' | 'socialUsername'> & { account: Maybe<({ __typename?: 'SocialAccountType' } & Pick<ISocialAccountType, 'username'>)> })> })> })>>> })> })>> })> });

export type ILinesListQueryVariables = {};


export type ILinesListQuery = ({ __typename?: 'Query' } & { allLines: Maybe<Array<Maybe<({ __typename?: 'TransModelLineType' } & Pick<ITransModelLineType, 'entityId' | 'name' | 'featureName'>)>>> });

export type IDisruptionsListQueryVariables = {
  status?: Maybe<IDisruptionStatusInput>,
  severity?: Maybe<ISeverityInput>,
  mode?: Maybe<IModeInput>,
  operators?: Maybe<Array<Maybe<Scalars['String']>>>,
  lines?: Maybe<Array<Maybe<Scalars['String']>>>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  isTemplate?: Maybe<Scalars['Boolean']>,
  first: Scalars['Int'],
  after?: Maybe<Scalars['String']>,
  titleFilter?: Maybe<Scalars['String']>,
  sortBy?: Maybe<Array<Maybe<IDisruptionSortableFields>>>
};


export type IDisruptionsListQuery = ({ __typename?: 'Query' } & { allDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { pageInfo: ({ __typename?: 'PageInfo' } & Pick<IPageInfo, 'hasNextPage' | 'endCursor'>), edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'description' | 'status' | 'severity' | 'isLive'> & { impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'severity' | 'mode'> & { lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName'>)> })>> }), operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'finalDate'>)> })> })>> })> });

export type IDisruptionPreviewByIdQueryVariables = {
  id: Scalars['ID']
};


export type IDisruptionPreviewByIdQuery = ({ __typename?: 'Query' } & { disruption: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'isTemplate' | 'status' | 'isLive' | 'description' | 'severity' | 'reason' | 'isOpenEnded'> & { createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'username' | 'id'>), impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'severity' | 'mode' | 'delay' | 'severity'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'name'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'id' | 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'days' | 'repetition' | 'finalDate'>)> })> });

export type IReadNotificationMutationVariables = {
  id: Scalars['ID']
};


export type IReadNotificationMutation = ({ __typename?: 'Mutations' } & { readNotification: Maybe<({ __typename?: 'ReadNotification' } & Pick<IReadNotification, 'success' | 'errors'> & { data: Maybe<({ __typename?: 'DisruptionNotificationNode' } & Pick<IDisruptionNotificationNode, 'id'>)> })> });

export type IReviewsListQueryVariables = {};


export type IReviewsListQuery = ({ __typename?: 'Query' } & { allDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'description' | 'severity' | 'status' | 'created'> & { createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'>), impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'allOperators' | 'severity' | 'mode'> & { operators: ({ __typename?: 'OperatorNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'OperatorNodeEdge' } & { node: Maybe<({ __typename?: 'OperatorNode' } & Pick<IOperatorNode, 'id' | 'name'>)> })>> }), lines: ({ __typename?: 'LineNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'LineNodeEdge' } & { node: Maybe<({ __typename?: 'LineNode' } & Pick<ILineNode, 'id' | 'name'>)> })>> }), stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName'>)> })>> }) })> })>> }), validityPeriod: Array<({ __typename?: 'ValidityPeriodType' } & Pick<IValidityPeriodType, 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'finalDate'>)> })> })>> })> });

export type IEnumValuesQueryVariables = {};


export type IEnumValuesQuery = ({ __typename?: 'Query' } & { enumValues: Maybe<Array<Maybe<({ __typename?: 'EnumOverridesObject' } & Pick<IEnumOverridesObject, 'id' | 'type' | 'values' | 'allValues'>)>>> });

export type ISetEnumsMutationVariables = {
  params: Array<Maybe<IEnumOverridesInput>>
};


export type ISetEnumsMutation = ({ __typename?: 'Mutations' } & { setEnumOverrides: Maybe<({ __typename?: 'SetEnumOverrides' } & Pick<ISetEnumOverrides, 'success' | 'errors'> & { data: Maybe<Array<Maybe<({ __typename?: 'EnumOverridesObject' } & Pick<IEnumOverridesObject, 'id' | 'type' | 'values' | 'allValues'>)>>> })> });

export type IUserUsageInformationQueryVariables = {
  fromDate?: Maybe<Scalars['DateTime']>,
  toDate?: Maybe<Scalars['DateTime']>
};


export type IUserUsageInformationQuery = ({ __typename?: 'Query' } & { allUsers: Maybe<Array<Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username' | 'email' | 'lastLogin' | 'numDisruptionsEntered' | 'numDisruptionsApproved'> & { roles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>>, organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> })>>> });

export type IOperatorsListQueryVariables = {};


export type IOperatorsListQuery = ({ __typename?: 'Query' } & { allOperators: Maybe<Array<Maybe<({ __typename?: 'TransModelOperatorType' } & Pick<ITransModelOperatorType, 'code' | 'entityId' | 'name'>)>>> });

export type IDisruptionsMapListQueryVariables = {
  status?: Maybe<IDisruptionStatusInput>,
  severity?: Maybe<ISeverityInput>,
  mode?: Maybe<IModeInput>,
  operators?: Maybe<Array<Maybe<Scalars['String']>>>,
  lines?: Maybe<Array<Maybe<Scalars['String']>>>,
  startDate?: Maybe<Scalars['Date']>,
  endDate?: Maybe<Scalars['Date']>,
  isTemplate?: Maybe<Scalars['Boolean']>,
  first: Scalars['Int'],
  titleFilter?: Maybe<Scalars['String']>
};


export type IDisruptionsMapListQuery = ({ __typename?: 'Query' } & { allDisruptions: Maybe<({ __typename?: 'DisruptionNodeConnection' } & Pick<IDisruptionNodeConnection, 'totalCount'> & { pageInfo: ({ __typename?: 'PageInfo' } & Pick<IPageInfo, 'hasNextPage' | 'endCursor'>), edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title' | 'description' | 'status' | 'severity' | 'isLive'> & { impact: ({ __typename?: 'DisruptionImpactNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionImpactNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionImpactNode' } & Pick<IDisruptionImpactNode, 'id' | 'name' | 'mode' | 'severity'> & { stops: ({ __typename?: 'StopPointNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'StopPointNodeEdge' } & { node: Maybe<({ __typename?: 'StopPointNode' } & Pick<IStopPointNode, 'id' | 'commonName' | 'latitude' | 'longitude'>)> })>> }) })> })>> }) })> })>> })> });

export type IOperatorByModeQueryVariables = {
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type IOperatorByModeQuery = ({ __typename?: 'Query' } & { allOperators: Maybe<Array<Maybe<({ __typename?: 'TransModelOperatorType' } & Pick<ITransModelOperatorType, 'code' | 'entityId' | 'name'>)>>> });

export type IAllLinesQueryVariables = {
  operators?: Maybe<Array<Maybe<Scalars['String']>>>,
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type IAllLinesQuery = ({ __typename?: 'Query' } & { allLines: Maybe<Array<Maybe<({ __typename?: 'TransModelLineType' } & Pick<ITransModelLineType, 'name' | 'featureName' | 'entityId' | 'operatorEntityIds'>)>>> });

export type ILineQueryVariables = {
  entityId: Scalars['String']
};


export type ILineQuery = ({ __typename?: 'Query' } & { line: Maybe<({ __typename?: 'TransModelLineType' } & Pick<ITransModelLineType, 'name' | 'featureName' | 'entityId' | 'operatorEntityIds' | 'boundingBox'> & { features: Maybe<Array<Maybe<({ __typename?: 'LineGeoJsonType' } & Pick<ILineGeoJsonType, 'type' | 'geometry' | 'properties'>)>>> })> });

export type ISearchStopsQueryVariables = {
  term: Scalars['String'],
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type ISearchStopsQuery = ({ __typename?: 'Query' } & { searchStops: Maybe<Array<Maybe<({ __typename?: 'TransModelStopType' } & Pick<ITransModelStopType, 'featureName' | 'entityId' | 'atcoCode' | 'stopType' | 'lat' | 'lon'>)>>> });

export type ISearchAreaLinesQueryVariables = {
  polygon: Array<Maybe<IOsGridCoordinate>>
};


export type ISearchAreaLinesQuery = ({ __typename?: 'Query' } & { searchAreaLines: Maybe<Array<Maybe<({ __typename?: 'TransModelLineType' } & Pick<ITransModelLineType, 'name' | 'featureName' | 'entityId' | 'operatorEntityIds' | 'boundingBox'> & { features: Maybe<Array<Maybe<({ __typename?: 'LineGeoJsonType' } & Pick<ILineGeoJsonType, 'type' | 'geometry' | 'properties'>)>>> })>>> });

export type ISearchAreaStopsQueryVariables = {
  polygon: Array<Maybe<IOsGridCoordinate>>,
  modes?: Maybe<Array<Maybe<IModeTypeEnum>>>
};


export type ISearchAreaStopsQuery = ({ __typename?: 'Query' } & { searchAreaStops: Maybe<Array<Maybe<({ __typename?: 'TransModelStopType' } & Pick<ITransModelStopType, 'featureName' | 'entityId' | 'atcoCode' | 'stopType' | 'lat' | 'lon'>)>>> });

export type IStopGeoJsonQueryVariables = {
  entityId: Scalars['String']
};


export type IStopGeoJsonQuery = ({ __typename?: 'Query' } & { stop: Maybe<({ __typename?: 'TransModelStopType' } & Pick<ITransModelStopType, 'featureName' | 'entityId' | 'atcoCode' | 'stopType' | 'lat' | 'lon'> & { features: Maybe<Array<Maybe<({ __typename?: 'StopGeoJsonType' } & Pick<IStopGeoJsonType, 'type' | 'geometry' | 'properties'>)>>> })> });

export type IStopsGeoJsonQueryVariables = {
  entityIds: Array<Maybe<Scalars['String']>>
};


export type IStopsGeoJsonQuery = ({ __typename?: 'Query' } & { stops: Maybe<Array<Maybe<({ __typename?: 'TransModelStopListType' } & Pick<ITransModelStopListType, 'featureName' | 'entityId' | 'atcoCode' | 'stopType' | 'lat' | 'lon'> & { features: Maybe<Array<Maybe<({ __typename?: 'StopGeoJsonType' } & Pick<IStopGeoJsonType, 'type' | 'geometry' | 'properties'>)>>> })>>> });

export type IAdminAreasQueryVariables = {};


export type IAdminAreasQuery = ({ __typename?: 'Query' } & { adminAreas: Maybe<Array<Maybe<({ __typename?: 'TransModelAdminAreaListType' } & Pick<ITransModelAdminAreaListType, 'name' | 'atcoCode' | 'featureName' | 'codePrefix' | 'shortName' | 'boundingBox' | 'entityId'>)>>> });

export type IAppVersionQueryVariables = {};


export type IAppVersionQuery = ({ __typename?: 'Query' } & Pick<IQuery, 'version'>);

export type IFeatureQueryVariables = {
  name: Scalars['String']
};


export type IFeatureQuery = ({ __typename?: 'Query' } & { feature: Maybe<({ __typename?: 'FeatureFlagType' } & Pick<IFeatureFlagType, 'enabled'>)> });

export type IAllFeaturesQueryVariables = {};


export type IAllFeaturesQuery = ({ __typename?: 'Query' } & { allFeatures: Maybe<Array<Maybe<({ __typename?: 'FeatureFlagType' } & Pick<IFeatureFlagType, 'name' | 'enabled'>)>>> });

export type IAllSocialAccountsQueryVariables = {};


export type IAllSocialAccountsQuery = ({ __typename?: 'Query' } & { allSocialAccounts: Maybe<Array<Maybe<({ __typename?: 'SocialAccountType' } & Pick<ISocialAccountType, 'username' | 'email' | 'accountType' | 'prettyName' | 'id' | 'tokenExpiresAt'> & { createdBy: ({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'username'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)> }), facebookPages: Maybe<Array<Maybe<({ __typename?: 'FacebookPageType' } & Pick<IFacebookPageType, 'id' | 'name'>)>>>, hootsuiteProfiles: Array<({ __typename?: 'HootSuiteProfileType' } & IHootSuiteProfileFragmentFragment)> })>>> });

export type IRegisterSocialAccountMutationVariables = {
  params: ISocialRegistrationInput
};


export type IRegisterSocialAccountMutation = ({ __typename?: 'Mutations' } & { registerSocialAccount: Maybe<({ __typename?: 'RegisterSocialAccount' } & Pick<IRegisterSocialAccount, 'errors' | 'success'> & { data: Maybe<({ __typename?: 'SocialRegistrationResponseType' } & Pick<ISocialRegistrationResponseType, 'authorizeUrl'>)> })> });

export type IDeleteSocialAccountMutationVariables = {
  id?: Maybe<Scalars['ID']>
};


export type IDeleteSocialAccountMutation = ({ __typename?: 'Mutations' } & { deleteSocialAccount: Maybe<({ __typename?: 'DeleteSocialAccount' } & Pick<IDeleteSocialAccount, 'errors' | 'success'>)> });

export type IUserQueryVariables = {};


export type IUserQuery = ({ __typename?: 'Query' } & { user: Maybe<({ __typename?: 'UserType' } & Pick<IUserType, 'id' | 'email' | 'username'> & { organisation: Maybe<({ __typename?: 'OrganisationType' } & Pick<IOrganisationType, 'id' | 'name'>)>, roles: Maybe<Array<Maybe<({ __typename?: 'RoleType' } & Pick<IRoleType, 'id' | 'name' | 'scope'>)>>>, capabilities: Maybe<({ __typename?: 'CapabilitiesInfo' } & Pick<ICapabilitiesInfo, 'enumOverrides'>)>, transmodelRestrictions: Maybe<Array<Maybe<({ __typename?: 'TransModelRestrictionsObject' } & Pick<ITransModelRestrictionsObject, 'id' | 'type' | 'entityId' | 'name'>)>>>, disruptionNotifications: Maybe<({ __typename?: 'DisruptionNotificationNodeConnection' } & Pick<IDisruptionNotificationNodeConnection, 'totalCount'> & { edges: Array<Maybe<({ __typename?: 'DisruptionNotificationNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNotificationNode' } & Pick<IDisruptionNotificationNode, 'id' | 'status' | 'sent'> & { details: Maybe<({ __typename?: 'DisruptionNotificationDetailsNode' } & Pick<IDisruptionNotificationDetailsNode, 'message' | 'type'> & { disruption: ({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id' | 'title'>), duplicates: ({ __typename?: 'DisruptionNodeConnection' } & { edges: Array<Maybe<({ __typename?: 'DisruptionNodeEdge' } & { node: Maybe<({ __typename?: 'DisruptionNode' } & Pick<IDisruptionNode, 'id'>)> })>> }) })> })> })>> })> })> });

export const HootSuiteProfileFragmentFragmentDoc = gql`
    fragment HootSuiteProfileFragment on HootSuiteProfileType {
  __typename
  id
  profileType
  profileId
  socialId
  socialUsername
}
    `;
export const SocialAccountFragmentFragmentDoc = gql`
    fragment SocialAccountFragment on SocialAccountType {
  __typename
  username
  id
  email
  accountType
  prettyName
  facebookPages {
    id
    name
  }
  createdBy {
    id
    username
    organisation {
      id
      name
    }
  }
  hootsuiteProfiles {
    ...HootSuiteProfileFragment
  }
}
    ${HootSuiteProfileFragmentFragmentDoc}`;
export const MailingListDocument = gql`
    query mailingList {
  mailingList {
    id
    email
    severity
    optedIn
    organisation {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IMailingListGQL extends Apollo.Query<IMailingListQuery, IMailingListQueryVariables> {
    document = MailingListDocument;
    
  }
export const CreateMailingListEntryDocument = gql`
    mutation createMailingListEntry($params: MailingListInput!) {
  createMailingListEntry(params: $params) {
    success
    errors
    data {
      email
      severity
      optedIn
      organisation {
        id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ICreateMailingListEntryGQL extends Apollo.Mutation<ICreateMailingListEntryMutation, ICreateMailingListEntryMutationVariables> {
    document = CreateMailingListEntryDocument;
    
  }
export const UpdateMailingListEntryDocument = gql`
    mutation updateMailingListEntry($id: Int!, $params: MailingListInput!) {
  updateMailingListEntry(id: $id, params: $params) {
    success
    errors
    data {
      email
      severity
      optedIn
      organisation {
        id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateMailingListEntryGQL extends Apollo.Mutation<IUpdateMailingListEntryMutation, IUpdateMailingListEntryMutationVariables> {
    document = UpdateMailingListEntryDocument;
    
  }
export const DeleteMailingListEntryDocument = gql`
    mutation deleteMailingListEntry($id: Int!) {
  deleteMailingListEntry(id: $id) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteMailingListEntryGQL extends Apollo.Mutation<IDeleteMailingListEntryMutation, IDeleteMailingListEntryMutationVariables> {
    document = DeleteMailingListEntryDocument;
    
  }
export const CreateOrganisationDocument = gql`
    mutation createOrganisation($params: OrganisationInput!) {
  createOrganisation(params: $params) {
    success
    errors
    data {
      id
      name
      url
      adminAreas {
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ICreateOrganisationGQL extends Apollo.Mutation<ICreateOrganisationMutation, ICreateOrganisationMutationVariables> {
    document = CreateOrganisationDocument;
    
  }
export const UpdateOrganisationDocument = gql`
    mutation updateOrganisation($id: Int!, $params: OrganisationInput!) {
  updateOrganisation(id: $id, params: $params) {
    success
    errors
    data {
      id
      url
      adminAreas {
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateOrganisationGQL extends Apollo.Mutation<IUpdateOrganisationMutation, IUpdateOrganisationMutationVariables> {
    document = UpdateOrganisationDocument;
    
  }
export const DeleteOrganisationDocument = gql`
    mutation deleteOrganisation($id: Int!) {
  deleteOrganisation(id: $id) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteOrganisationGQL extends Apollo.Mutation<IDeleteOrganisationMutation, IDeleteOrganisationMutationVariables> {
    document = DeleteOrganisationDocument;
    
  }
export const AllAdminAreasDocument = gql`
    query allAdminAreas {
  allAdminAreas {
    name
    areaCode
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllAdminAreasGQL extends Apollo.Query<IAllAdminAreasQuery, IAllAdminAreasQueryVariables> {
    document = AllAdminAreasDocument;
    
  }
export const OrganisationListDocument = gql`
    query organisationList {
  allOrganisations {
    id
    name
    url
    adminAreas {
      name
      areaCode
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IOrganisationListGQL extends Apollo.Query<IOrganisationListQuery, IOrganisationListQueryVariables> {
    document = OrganisationListDocument;
    
  }
export const UpdateUserDocument = gql`
    mutation updateUser($id: Int!, $params: UserInput!) {
  updateUser(id: $id, params: $params) {
    success
    errors
    data {
      id
      username
      email
      organisation {
        id
        name
      }
      transmodelRestrictions {
        type
        name
        entityId
      }
      roles {
        id
        name
        scope
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateUserGQL extends Apollo.Mutation<IUpdateUserMutation, IUpdateUserMutationVariables> {
    document = UpdateUserDocument;
    
  }
export const InviteUserDocument = gql`
    mutation inviteUser($params: InvitationCreateInput!) {
  inviteUser(params: $params) {
    success
    errors
    data {
      id
      key
      email
      roles {
        id
        name
        scope
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IInviteUserGQL extends Apollo.Mutation<IInviteUserMutation, IInviteUserMutationVariables> {
    document = InviteUserDocument;
    
  }
export const SignUpDocument = gql`
    mutation signUp($params: UserSignUpInput!) {
  signUp(params: $params) {
    success
    errors
    data {
      id
      username
      email
      roles {
        id
        name
        scope
      }
      organisation {
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISignUpGQL extends Apollo.Mutation<ISignUpMutation, ISignUpMutationVariables> {
    document = SignUpDocument;
    
  }
export const DeleteUserDocument = gql`
    mutation deleteUser($id: Int!) {
  deleteUser(id: $id) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteUserGQL extends Apollo.Mutation<IDeleteUserMutation, IDeleteUserMutationVariables> {
    document = DeleteUserDocument;
    
  }
export const ChangePasswordDocument = gql`
    mutation changePassword($username: String!, $oldPassword: String!, $newPassword: String!) {
  changePassword(username: $username, oldPassword: $oldPassword, newPassword: $newPassword) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IChangePasswordGQL extends Apollo.Mutation<IChangePasswordMutation, IChangePasswordMutationVariables> {
    document = ChangePasswordDocument;
    
  }
export const ResetPasswordDocument = gql`
    mutation resetPassword($email: String!) {
  resetPassword(email: $email) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IResetPasswordGQL extends Apollo.Mutation<IResetPasswordMutation, IResetPasswordMutationVariables> {
    document = ResetPasswordDocument;
    
  }
export const ResetPasswordConfirmDocument = gql`
    mutation resetPasswordConfirm($uid: String!, $token: String!, $password: String!, $confirmPassword: String!) {
  resetPasswordConfirm(uid: $uid, token: $token, newPassword: $password, reNewPassword: $confirmPassword) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IResetPasswordConfirmGQL extends Apollo.Mutation<IResetPasswordConfirmMutation, IResetPasswordConfirmMutationVariables> {
    document = ResetPasswordConfirmDocument;
    
  }
export const AllUsersDocument = gql`
    query allUsers {
  allUsers {
    id
    username
    email
    roles {
      id
      name
      scope
    }
    organisation {
      id
      name
    }
    transmodelRestrictions {
      id
      type
      entityId
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllUsersGQL extends Apollo.Query<IAllUsersQuery, IAllUsersQueryVariables> {
    document = AllUsersDocument;
    
  }
export const AllRolesDocument = gql`
    query allRoles {
  allRoles {
    id
    name
    scope
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllRolesGQL extends Apollo.Query<IAllRolesQuery, IAllRolesQueryVariables> {
    document = AllRolesDocument;
    
  }
export const AllOrganistionsDocument = gql`
    query allOrganistions {
  allOrganisations {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllOrganistionsGQL extends Apollo.Query<IAllOrganistionsQuery, IAllOrganistionsQueryVariables> {
    document = AllOrganistionsDocument;
    
  }
export const InvitationByKeyDocument = gql`
    query InvitationByKey($key: String!) {
  invitationByKey(key: $key) {
    id
    key
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IInvitationByKeyGQL extends Apollo.Query<IInvitationByKeyQuery, IInvitationByKeyQueryVariables> {
    document = InvitationByKeyDocument;
    
  }
export const AllNotificationSettingsDocument = gql`
    query allNotificationSettings {
  notificationSettings {
    notificationType
    email
    inApp
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllNotificationSettingsGQL extends Apollo.Query<IAllNotificationSettingsQuery, IAllNotificationSettingsQueryVariables> {
    document = AllNotificationSettingsDocument;
    
  }
export const UpdateNotificationSettingsDocument = gql`
    mutation updateNotificationSettings($params: [NotificationSettingsInputType]) {
  notificationSettings(params: $params) {
    success
    errors
    data {
      notificationType
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateNotificationSettingsGQL extends Apollo.Mutation<IUpdateNotificationSettingsMutation, IUpdateNotificationSettingsMutationVariables> {
    document = UpdateNotificationSettingsDocument;
    
  }
export const OrganisationActivityDocument = gql`
    query organisationActivity {
  organisationAudit {
    edges {
      node {
        id
        actor {
          id
          username
        }
        action
        contentType {
          id
          name
        }
        objectPk
        objectRepr
        objectId
        changedFields {
          field
          oldValue
          newValue
        }
        timestamp
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IOrganisationActivityGQL extends Apollo.Query<IOrganisationActivityQuery, IOrganisationActivityQueryVariables> {
    document = OrganisationActivityDocument;
    
  }
export const DisruptionAuditByIdDocument = gql`
    query disruptionAuditById($id: ID!) {
  disruptionAudit(id: $id) {
    edges {
      node {
        id
        actor {
          id
          username
        }
        action
        contentType {
          id
          name
        }
        objectPk
        changedFields {
          field
          oldValue
          newValue
        }
        timestamp
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionAuditByIdGQL extends Apollo.Query<IDisruptionAuditByIdQuery, IDisruptionAuditByIdQueryVariables> {
    document = DisruptionAuditByIdDocument;
    
  }
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ILoginGQL extends Apollo.Mutation<ILoginMutation, ILoginMutationVariables> {
    document = LoginDocument;
    
  }
export const LogoutDocument = gql`
    mutation logout {
  logout {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ILogoutGQL extends Apollo.Mutation<ILogoutMutation, ILogoutMutationVariables> {
    document = LogoutDocument;
    
  }
export const DisruptionStatsDocument = gql`
    query disruptionStats($first: Int!, $after: String, $severity: SeverityInput) {
  disruptionStats(severity: $severity) {
    __typename
    liveDisruptions(first: $first, after: $after) {
      totalCount
      edges {
        node {
          id
          title
          description
          status
          severity
          validityPeriod {
            id
            startDate
            endDate
            startTime
            endTime
            days
            finalDate
            repetition
          }
          impact {
            edges {
              node {
                id
                name
                mode
                severity
                operators {
                  edges {
                    node {
                      id
                    }
                  }
                }
                lines {
                  edges {
                    node {
                      id
                    }
                  }
                }
                stops {
                  edges {
                    node {
                      id
                      commonName
                      latitude
                      longitude
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    upcomingDisruptions(first: $first, after: $after) {
      totalCount
      edges {
        node {
          id
          title
          description
          status
          severity
          validityPeriod {
            id
            startDate
            endDate
            startTime
            endTime
            days
            finalDate
            repetition
          }
          impact {
            edges {
              node {
                id
                name
                mode
                severity
                operators {
                  edges {
                    node {
                      id
                    }
                  }
                }
                lines {
                  edges {
                    node {
                      id
                    }
                  }
                }
                stops {
                  edges {
                    node {
                      id
                      commonName
                      latitude
                      longitude
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionStatsGQL extends Apollo.Query<IDisruptionStatsQuery, IDisruptionStatsQueryVariables> {
    document = DisruptionStatsDocument;
    
  }
export const ReviewsDashboardListDocument = gql`
    query reviewsDashboardList {
  allDisruptions(status: DraftPendingApproval, sortBy: validity_period_start_date_reversed, first: 5) {
    totalCount
    edges {
      node {
        id
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IReviewsDashboardListGQL extends Apollo.Query<IReviewsDashboardListQuery, IReviewsDashboardListQueryVariables> {
    document = ReviewsDashboardListDocument;
    
  }
export const RecentlyClosedDocument = gql`
    query recentlyClosed {
  recentlyClosed {
    totalCount
    edges {
      node {
        id
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IRecentlyClosedGQL extends Apollo.Query<IRecentlyClosedQuery, IRecentlyClosedQueryVariables> {
    document = RecentlyClosedDocument;
    
  }
export const SocialMessagesDocument = gql`
    query socialMessages {
  socialMessages {
    edges {
      node {
        id
        socialAccount {
          ...SocialAccountFragment
        }
        hootsuiteProfile {
          ...HootSuiteProfileFragment
        }
        publishedOn
        message
        image {
          name
          url
        }
      }
    }
  }
}
    ${SocialAccountFragmentFragmentDoc}
${HootSuiteProfileFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ISocialMessagesGQL extends Apollo.Query<ISocialMessagesQuery, ISocialMessagesQueryVariables> {
    document = SocialMessagesDocument;
    
  }
export const DeleteDisruptionDocument = gql`
    mutation deleteDisruption($id: ID) {
  deleteDisruption(id: $id) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteDisruptionGQL extends Apollo.Mutation<IDeleteDisruptionMutation, IDeleteDisruptionMutationVariables> {
    document = DeleteDisruptionDocument;
    
  }
export const CreateDisruptionDocument = gql`
    mutation createDisruption($params: DisruptionCreateInput!) {
  createDisruption(params: $params) {
    success
    errors
    data {
      id
      title
      isTemplate
      description
      link
      type
      reason
      relatedDisruption {
        edges {
          node {
            id
            title
          }
        }
      }
      publishingStart
      publishingEnd
      impact {
        edges {
          node {
            id
            mode
            advice
            journeyPlanner
            direction
            delay
            severity
            operators {
              edges {
                node {
                  id
                  ref
                  name
                }
              }
            }
            lines {
              edges {
                node {
                  id
                  ref
                  name
                }
              }
            }
            stops {
              edges {
                node {
                  id
                  commonName
                  atcoCode
                  type
                  ref
                  latitude
                  longitude
                }
              }
            }
          }
        }
      }
      isOpenEnded
      validityPeriod {
        id
        startDate
        endDate
        startTime
        endTime
        repetition
        finalDate
      }
      socialMessages {
        id
        socialAccount {
          ...SocialAccountFragment
        }
        hootsuiteProfile {
          ...HootSuiteProfileFragment
        }
        publishOn
        message
        image {
          name
          url
        }
        published
        publishedOn
        lastPublishError
      }
      modified
    }
  }
}
    ${SocialAccountFragmentFragmentDoc}
${HootSuiteProfileFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ICreateDisruptionGQL extends Apollo.Mutation<ICreateDisruptionMutation, ICreateDisruptionMutationVariables> {
    document = CreateDisruptionDocument;
    
  }
export const SubmitDisruptionDocument = gql`
    mutation submitDisruption($id: ID, $comment: String) {
  submitDisruption(id: $id, comment: $comment) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISubmitDisruptionGQL extends Apollo.Mutation<ISubmitDisruptionMutation, ISubmitDisruptionMutationVariables> {
    document = SubmitDisruptionDocument;
    
  }
export const UpdateDisruptionDocument = gql`
    mutation updateDisruption($id: ID, $params: DisruptionUpdateInput!) {
  updateDisruption(id: $id, params: $params) {
    success
    errors
    data {
      id
      title
      isTemplate
      description
      link
      type
      reason
      relatedDisruption {
        edges {
          node {
            id
            title
          }
        }
      }
      publishingStart
      publishingEnd
      impact {
        edges {
          node {
            id
            mode
            advice
            journeyPlanner
            delay
            severity
            direction
            operators {
              edges {
                node {
                  id
                  ref
                  name
                }
              }
            }
            lines {
              edges {
                node {
                  id
                  ref
                  name
                }
              }
            }
            stops {
              edges {
                node {
                  id
                  commonName
                  atcoCode
                  type
                  ref
                  latitude
                  longitude
                }
              }
            }
          }
        }
      }
      isOpenEnded
      validityPeriod {
        id
        startDate
        endDate
        startTime
        endTime
        repetition
        finalDate
      }
      socialMessages {
        id
        socialAccount {
          ...SocialAccountFragment
        }
        hootsuiteProfile {
          ...HootSuiteProfileFragment
        }
        publishOn
        message
        image {
          name
          url
        }
        published
        publishedOn
        lastPublishError
      }
      modified
    }
  }
}
    ${SocialAccountFragmentFragmentDoc}
${HootSuiteProfileFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateDisruptionGQL extends Apollo.Mutation<IUpdateDisruptionMutation, IUpdateDisruptionMutationVariables> {
    document = UpdateDisruptionDocument;
    
  }
export const DisruptionByIdForEditDocument = gql`
    query disruptionByIdForEdit($id: ID!) {
  disruption(id: $id) {
    id
    isTemplate
    title
    description
    link
    type
    reason
    relatedDisruption {
      edges {
        node {
          id
          title
          deleted
        }
      }
    }
    isOpenEnded
    validityPeriod {
      id
      startDate
      endDate
      startTime
      endTime
      repetition
      finalDate
    }
    publishingStart
    publishingEnd
    impact {
      edges {
        node {
          id
          mode
          allOperators
          advice
          delay
          severity
          direction
          journeyPlanner
          operators {
            edges {
              node {
                id
                ref
                name
              }
            }
          }
          lines {
            edges {
              node {
                id
                ref
                name
              }
            }
          }
          stops {
            edges {
              node {
                id
                commonName
                atcoCode
                type
                ref
                latitude
                longitude
              }
            }
          }
        }
      }
    }
    socialMessages {
      id
      socialAccount {
        ...SocialAccountFragment
      }
      hootsuiteProfile {
        ...HootSuiteProfileFragment
      }
      publishOn
      message
      image {
        name
        url
      }
      published
      publishedOn
      lastPublishError
    }
  }
}
    ${SocialAccountFragmentFragmentDoc}
${HootSuiteProfileFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionByIdForEditGQL extends Apollo.Query<IDisruptionByIdForEditQuery, IDisruptionByIdForEditQueryVariables> {
    document = DisruptionByIdForEditDocument;
    
  }
export const AutcompleteDisruptionsListDocument = gql`
    query autcompleteDisruptionsList($titleFilter: String) {
  allDisruptions(title_Icontains: $titleFilter) {
    edges {
      node {
        id
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAutcompleteDisruptionsListGQL extends Apollo.Query<IAutcompleteDisruptionsListQuery, IAutcompleteDisruptionsListQueryVariables> {
    document = AutcompleteDisruptionsListDocument;
    
  }
export const TwitterSearchDocument = gql`
    query twitterSearch($queryString: String!) {
  twitterSearch(queryString: $queryString) {
    id
    screenName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ITwitterSearchGQL extends Apollo.Query<ITwitterSearchQuery, ITwitterSearchQueryVariables> {
    document = TwitterSearchDocument;
    
  }
export const DisruptionByIdDocument = gql`
    query disruptionById($id: ID!) {
  disruption(id: $id) {
    id
    title
    isTemplate
    status
    description
    link
    type
    isOpenEnded
    severity
    created
    createdBy {
      id
      username
    }
    publishingStart
    publishingEnd
    approvedBy {
      id
      username
    }
    isLive
    comments {
      created
      user {
        id
        username
      }
      id
      comment
    }
    socialMessages {
      id
      message
      image {
        name
        url
      }
      socialAccount {
        username
        id
        email
        accountType
        prettyName
        createdBy {
          id
          username
          organisation {
            id
            name
          }
        }
        facebookPages {
          name
          id
        }
      }
      hootsuiteProfile {
        ...HootSuiteProfileFragment
      }
      publishOn
      published
      publishedOn
      lastPublishError
    }
    impact {
      edges {
        node {
          id
          advice
          name
          severity
          mode
          delay
          operators {
            edges {
              node {
                id
                ref
                name
              }
            }
          }
          lines {
            edges {
              node {
                id
                ref
                name
              }
            }
          }
          stops {
            edges {
              node {
                id
                commonName
              }
            }
          }
        }
      }
    }
    reason
    validityPeriod {
      id
      startDate
      endDate
      startTime
      endTime
      days
      repetition
      finalDate
    }
    relatedDisruption {
      totalCount
      edges {
        node {
          id
          title
          status
        }
      }
    }
  }
}
    ${HootSuiteProfileFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionByIdGQL extends Apollo.Query<IDisruptionByIdQuery, IDisruptionByIdQueryVariables> {
    document = DisruptionByIdDocument;
    
  }
export const ApproveDisruptionDocument = gql`
    mutation approveDisruption($id: ID, $comment: String) {
  approveDisruption(id: $id, comment: $comment) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IApproveDisruptionGQL extends Apollo.Mutation<IApproveDisruptionMutation, IApproveDisruptionMutationVariables> {
    document = ApproveDisruptionDocument;
    
  }
export const RejectDisruptionDocument = gql`
    mutation rejectDisruption($id: ID, $comment: String) {
  rejectDisruption(id: $id, comment: $comment) {
    success
    errors
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IRejectDisruptionGQL extends Apollo.Mutation<IRejectDisruptionMutation, IRejectDisruptionMutationVariables> {
    document = RejectDisruptionDocument;
    
  }
export const ExportDisruptionsListDocument = gql`
    query exportDisruptionsList($status: DisruptionStatusInput, $severity: SeverityInput, $mode: ModeInput, $operators: [String], $lines: [String], $startDate: Date, $endDate: Date, $isTemplate: Boolean, $after: String, $titleFilter: String, $sortBy: [DisruptionSortableFields]) {
  allDisruptions(status: $status, severity: $severity, mode: $mode, operators: $operators, lines: $lines, validityStart: $startDate, validityEnd: $endDate, isTemplate: $isTemplate, after: $after, title_Icontains: $titleFilter, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        description
        version
        link
        status
        severity
        isLive
        createdBy {
          id
          username
        }
        type
        isTemplate
        relatedDisruption {
          edges {
            node {
              id
            }
          }
        }
        organisation {
          id
          name
        }
        isOpenEnded
        openSince
        deleted
        reason
        approvedBy {
          id
          username
        }
        relatedTo {
          edges {
            node {
              id
            }
          }
        }
        publishingStart
        publishingEnd
        impact {
          edges {
            node {
              id
              name
              advice
              severity
              delay
              journeyPlanner
              direction
              allOperators
              mode
              lines {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              stops {
                edges {
                  node {
                    id
                    commonName
                    naptanCode
                    atcoCode
                  }
                }
              }
              operators {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
        validityPeriod {
          startDate
          endDate
          startTime
          endTime
          finalDate
          repetition
        }
        socialMessages {
          id
          message
          image {
            name
            url
          }
          socialAccount {
            id
            username
            accountType
            prettyName
            facebookPages {
              id
              name
            }
            email
            createdBy {
              id
              username
            }
            hootsuiteProfiles {
              id
              account {
                username
              }
              profileType
              profileId
              socialId
              socialUsername
            }
          }
          publishOn
          published
          publishedOn
          lastPublishError
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IExportDisruptionsListGQL extends Apollo.Query<IExportDisruptionsListQuery, IExportDisruptionsListQueryVariables> {
    document = ExportDisruptionsListDocument;
    
  }
export const LinesListDocument = gql`
    query linesList {
  allLines {
    entityId
    name
    featureName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ILinesListGQL extends Apollo.Query<ILinesListQuery, ILinesListQueryVariables> {
    document = LinesListDocument;
    
  }
export const DisruptionsListDocument = gql`
    query disruptionsList($status: DisruptionStatusInput, $severity: SeverityInput, $mode: ModeInput, $operators: [String], $lines: [String], $startDate: Date, $endDate: Date, $isTemplate: Boolean, $first: Int!, $after: String, $titleFilter: String, $sortBy: [DisruptionSortableFields]) {
  allDisruptions(status: $status, severity: $severity, mode: $mode, operators: $operators, lines: $lines, validityStart: $startDate, validityEnd: $endDate, isTemplate: $isTemplate, first: $first, after: $after, title_Icontains: $titleFilter, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        description
        status
        severity
        isLive
        impact {
          edges {
            node {
              id
              name
              severity
              mode
              lines {
                edges {
                  node {
                    id
                  }
                }
              }
              stops {
                edges {
                  node {
                    id
                    commonName
                  }
                }
              }
              operators {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
        validityPeriod {
          startDate
          endDate
          startTime
          endTime
          finalDate
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionsListGQL extends Apollo.Query<IDisruptionsListQuery, IDisruptionsListQueryVariables> {
    document = DisruptionsListDocument;
    
  }
export const DisruptionPreviewByIdDocument = gql`
    query disruptionPreviewById($id: ID!) {
  disruption(id: $id) {
    id
    title
    createdBy {
      username
      id
    }
    isTemplate
    status
    isLive
    description
    severity
    impact {
      edges {
        node {
          id
          name
          severity
          mode
          delay
          severity
          operators {
            edges {
              node {
                id
                name
              }
            }
          }
          lines {
            edges {
              node {
                id
                name
              }
            }
          }
          stops {
            edges {
              node {
                id
                commonName
              }
            }
          }
        }
      }
    }
    reason
    isOpenEnded
    validityPeriod {
      id
      startDate
      endDate
      startTime
      endTime
      days
      repetition
      finalDate
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionPreviewByIdGQL extends Apollo.Query<IDisruptionPreviewByIdQuery, IDisruptionPreviewByIdQueryVariables> {
    document = DisruptionPreviewByIdDocument;
    
  }
export const ReadNotificationDocument = gql`
    mutation readNotification($id: ID!) {
  readNotification(id: $id) {
    success
    errors
    data {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IReadNotificationGQL extends Apollo.Mutation<IReadNotificationMutation, IReadNotificationMutationVariables> {
    document = ReadNotificationDocument;
    
  }
export const ReviewsListDocument = gql`
    query reviewsList {
  allDisruptions(status: DraftPendingApproval, sortBy: validity_period_start_date_reversed) {
    totalCount
    edges {
      node {
        id
        title
        description
        severity
        status
        created
        createdBy {
          id
          username
        }
        impact {
          edges {
            node {
              id
              name
              allOperators
              severity
              mode
              operators {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              lines {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              stops {
                edges {
                  node {
                    id
                    commonName
                  }
                }
              }
            }
          }
        }
        validityPeriod {
          startDate
          startTime
          endDate
          endTime
          finalDate
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IReviewsListGQL extends Apollo.Query<IReviewsListQuery, IReviewsListQueryVariables> {
    document = ReviewsListDocument;
    
  }
export const EnumValuesDocument = gql`
    query enumValues {
  enumValues {
    id
    type
    values
    allValues
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IEnumValuesGQL extends Apollo.Query<IEnumValuesQuery, IEnumValuesQueryVariables> {
    document = EnumValuesDocument;
    
  }
export const SetEnumsDocument = gql`
    mutation setEnums($params: [EnumOverridesInput]!) {
  setEnumOverrides(params: $params) {
    success
    errors
    data {
      id
      type
      values
      allValues
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISetEnumsGQL extends Apollo.Mutation<ISetEnumsMutation, ISetEnumsMutationVariables> {
    document = SetEnumsDocument;
    
  }
export const UserUsageInformationDocument = gql`
    query userUsageInformation($fromDate: DateTime, $toDate: DateTime) {
  allUsers {
    id
    username
    email
    roles {
      id
      name
      scope
    }
    organisation {
      id
      name
    }
    lastLogin
    numDisruptionsEntered(fromDate: $fromDate, toDate: $toDate)
    numDisruptionsApproved(fromDate: $fromDate, toDate: $toDate)
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUserUsageInformationGQL extends Apollo.Query<IUserUsageInformationQuery, IUserUsageInformationQueryVariables> {
    document = UserUsageInformationDocument;
    
  }
export const OperatorsListDocument = gql`
    query operatorsList {
  allOperators {
    code
    entityId
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IOperatorsListGQL extends Apollo.Query<IOperatorsListQuery, IOperatorsListQueryVariables> {
    document = OperatorsListDocument;
    
  }
export const DisruptionsMapListDocument = gql`
    query disruptionsMapList($status: DisruptionStatusInput, $severity: SeverityInput, $mode: ModeInput, $operators: [String], $lines: [String], $startDate: Date, $endDate: Date, $isTemplate: Boolean, $first: Int!, $titleFilter: String) {
  allDisruptions(status: $status, severity: $severity, mode: $mode, operators: $operators, lines: $lines, validityStart: $startDate, validityEnd: $endDate, isTemplate: $isTemplate, first: $first, title_Icontains: $titleFilter) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        description
        status
        severity
        isLive
        impact {
          edges {
            node {
              id
              name
              mode
              severity
              stops {
                edges {
                  node {
                    id
                    commonName
                    latitude
                    longitude
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDisruptionsMapListGQL extends Apollo.Query<IDisruptionsMapListQuery, IDisruptionsMapListQueryVariables> {
    document = DisruptionsMapListDocument;
    
  }
export const OperatorByModeDocument = gql`
    query operatorByMode($modes: [ModeTypeEnum]) {
  allOperators(modes: $modes) {
    code
    entityId
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IOperatorByModeGQL extends Apollo.Query<IOperatorByModeQuery, IOperatorByModeQueryVariables> {
    document = OperatorByModeDocument;
    
  }
export const AllLinesDocument = gql`
    query allLines($operators: [String], $modes: [ModeTypeEnum]) {
  allLines(operators: $operators, modes: $modes) {
    name
    featureName
    entityId
    operatorEntityIds
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllLinesGQL extends Apollo.Query<IAllLinesQuery, IAllLinesQueryVariables> {
    document = AllLinesDocument;
    
  }
export const LineDocument = gql`
    query line($entityId: String!) {
  line(entityId: $entityId) {
    name
    featureName
    entityId
    operatorEntityIds
    boundingBox
    features {
      type
      geometry
      properties
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ILineGQL extends Apollo.Query<ILineQuery, ILineQueryVariables> {
    document = LineDocument;
    
  }
export const SearchStopsDocument = gql`
    query searchStops($term: String!, $modes: [ModeTypeEnum]) {
  searchStops(searchToken: $term, modes: $modes) {
    featureName
    entityId
    atcoCode
    stopType
    lat
    lon
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISearchStopsGQL extends Apollo.Query<ISearchStopsQuery, ISearchStopsQueryVariables> {
    document = SearchStopsDocument;
    
  }
export const SearchAreaLinesDocument = gql`
    query searchAreaLines($polygon: [OSGridCoordinate]!) {
  searchAreaLines(polygon: $polygon) {
    name
    featureName
    entityId
    operatorEntityIds
    boundingBox
    features {
      type
      geometry
      properties
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISearchAreaLinesGQL extends Apollo.Query<ISearchAreaLinesQuery, ISearchAreaLinesQueryVariables> {
    document = SearchAreaLinesDocument;
    
  }
export const SearchAreaStopsDocument = gql`
    query searchAreaStops($polygon: [OSGridCoordinate]!, $modes: [ModeTypeEnum]) {
  searchAreaStops(polygon: $polygon, modes: $modes) {
    featureName
    entityId
    atcoCode
    stopType
    lat
    lon
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISearchAreaStopsGQL extends Apollo.Query<ISearchAreaStopsQuery, ISearchAreaStopsQueryVariables> {
    document = SearchAreaStopsDocument;
    
  }
export const StopGeoJsonDocument = gql`
    query stopGeoJson($entityId: String!) {
  stop(entityId: $entityId) {
    featureName
    entityId
    atcoCode
    stopType
    lat
    lon
    features {
      type
      geometry
      properties
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IStopGeoJsonGQL extends Apollo.Query<IStopGeoJsonQuery, IStopGeoJsonQueryVariables> {
    document = StopGeoJsonDocument;
    
  }
export const StopsGeoJsonDocument = gql`
    query stopsGeoJson($entityIds: [String]!) {
  stops(ids: $entityIds) {
    featureName
    entityId
    atcoCode
    stopType
    lat
    lon
    features {
      type
      geometry
      properties
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IStopsGeoJsonGQL extends Apollo.Query<IStopsGeoJsonQuery, IStopsGeoJsonQueryVariables> {
    document = StopsGeoJsonDocument;
    
  }
export const AdminAreasDocument = gql`
    query adminAreas {
  adminAreas {
    name
    atcoCode
    featureName
    codePrefix
    shortName
    boundingBox
    entityId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAdminAreasGQL extends Apollo.Query<IAdminAreasQuery, IAdminAreasQueryVariables> {
    document = AdminAreasDocument;
    
  }
export const AppVersionDocument = gql`
    query appVersion {
  version
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAppVersionGQL extends Apollo.Query<IAppVersionQuery, IAppVersionQueryVariables> {
    document = AppVersionDocument;
    
  }
export const FeatureDocument = gql`
    query feature($name: String!) {
  feature(name: $name) {
    enabled
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IFeatureGQL extends Apollo.Query<IFeatureQuery, IFeatureQueryVariables> {
    document = FeatureDocument;
    
  }
export const AllFeaturesDocument = gql`
    query allFeatures {
  allFeatures {
    name
    enabled
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllFeaturesGQL extends Apollo.Query<IAllFeaturesQuery, IAllFeaturesQueryVariables> {
    document = AllFeaturesDocument;
    
  }
export const AllSocialAccountsDocument = gql`
    query allSocialAccounts {
  allSocialAccounts {
    username
    email
    accountType
    prettyName
    id
    createdBy {
      id
      username
      organisation {
        id
        name
      }
    }
    facebookPages {
      id
      name
    }
    hootsuiteProfiles {
      ...HootSuiteProfileFragment
    }
    tokenExpiresAt
  }
}
    ${HootSuiteProfileFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllSocialAccountsGQL extends Apollo.Query<IAllSocialAccountsQuery, IAllSocialAccountsQueryVariables> {
    document = AllSocialAccountsDocument;
    
  }
export const RegisterSocialAccountDocument = gql`
    mutation registerSocialAccount($params: SocialRegistrationInput!) {
  registerSocialAccount(params: $params) {
    errors
    success
    data {
      authorizeUrl
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IRegisterSocialAccountGQL extends Apollo.Mutation<IRegisterSocialAccountMutation, IRegisterSocialAccountMutationVariables> {
    document = RegisterSocialAccountDocument;
    
  }
export const DeleteSocialAccountDocument = gql`
    mutation deleteSocialAccount($id: ID) {
  deleteSocialAccount(id: $id) {
    errors
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteSocialAccountGQL extends Apollo.Mutation<IDeleteSocialAccountMutation, IDeleteSocialAccountMutationVariables> {
    document = DeleteSocialAccountDocument;
    
  }
export const UserDocument = gql`
    query user {
  user {
    id
    email
    username
    organisation {
      id
      name
    }
    roles {
      id
      name
      scope
    }
    capabilities {
      enumOverrides
    }
    transmodelRestrictions {
      id
      type
      entityId
      name
    }
    disruptionNotifications {
      totalCount
      edges {
        node {
          id
          status
          sent
          details {
            message
            disruption {
              id
              title
            }
            type
            duplicates {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUserGQL extends Apollo.Query<IUserQuery, IUserQueryVariables> {
    document = UserDocument;
    
  }