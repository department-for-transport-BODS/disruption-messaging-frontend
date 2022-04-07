export enum IDisruptionImpactCondition {
	/** Altered */
	A_1 = 'Altered',
	/** Cancelled */
	A_2 = 'Cancelled',
	/** Delayed */
	A_3 = 'Delayed',
	/** Diverted */
	A_4 = 'Diverted',
	/** NoService */
	A_5 = 'No Service',
	/** Disrupted */
	A_6 = 'Disrupted',
	/** AdditionalService */
	A_7 = 'Additional Service',
	/** SpecialService */
	A_8 = 'Special Service',
	/** OnTime */
	A_9 = 'On Time',
	/** NormalService */
	A_10 = 'Normal Service',
	/** Unknown */
	A_100 = 'Unknown'
}

export enum IDisruptionImpactMode {
	/** Bus */
	A_1 = 'Bus',
	/** Tram */
	A_2 = 'Tram',
	/** Train */
	A_3 = 'Train',
	/** Ferry */
	A_4 = 'Ferry'
}

export enum IDisruptionImpactSeverity {
	/** Unknown */
	_100 = 'Unknown',
	/** VerySlight */
	A_1 = 'Very Slight',
	/** Slight */
	A_2 = 'Slight',
	/** Normal */
	A_3 = 'Normal',
	/** Severe */
	A_4 = 'Severe',
	/** VerySevere */
	A_5 = 'Very Severe',
	/** NoImpact */
	_99 = 'No Impact'
}

/** An enumeration. */
export enum IDisruptionReason {
	/** Accident */
	A_1 = 'Accident',
	/** SecurityAlert */
	A_2 = 'Security Alert',
	/** Congestion */
	A_3 = 'Congestion',
	/** Roadworks */
	A_4 = 'Roadworks',
	/** RoadClosed */
	A_5 = 'Road Closed',
	/** BombExplosion */
	A_6 = 'Bomb Explosion',
	/** Incident */
	A_7 = 'Incident',
	/** RouteDiversion */
	A_8 = 'Route Diversion',
	/** StaffAbsence */
	A_9 = 'Staff Absense',
	/** SignalProblem */
	A_10 = 'Signal Problem',
	/** MaintenanceWork */
	A_11 = 'Maintenance Work',
	/** ConstructionWork */
	A_12 = 'Construction Work',
	/** Fog */
	A_13 = 'Fog',
	/** Ice */
	A_14 = 'Ice',
	/** HeavyRain */
	A_15 = 'Heavy Rain',
	/** Waterlogged */
	A_16 = 'Waterlogged',
	/** Fire */
	A_17 = 'Fire',
	/** Vandalism */
	A_18 = 'Vandalism',
	/** Overcrowded */
	A_19 = 'Overcrowded',
	/** InsufficientDemand */
	A_20 = 'Insufficient Demand',
	/** LightingFailure */
	A_21 = 'Lighting Failure',
	/** LeaderBoardFailure */
	A_22 = 'Leader Board Failure',
	/** OperatorCeasedTrading */
	A_23 = 'Operator Ceased Trading',
	/** OperatorSuspended */
	A_24 = 'Operator Suspended',
	/** RouteBlockage */
	A_25 = 'Route Blockage',
	/** PersonOnTheLine */
	A_26 = 'Person On The Line',
	/** VehicleOnTheLine */
	A_27 = 'Vehicle On The Line',
	/** ObjectOnTheLine */
	A_28 = 'Object On The Line',
	/** AnimalOnTheLine */
	A_29 = 'Animal On The Line',
	/** SpecialEvent */
	A_30 = 'Special Event',
	/** BridgeStrike */
	A_31 = 'Bridge Strike',
	/** OverheadObstruction */
	A_32 = 'Overhead Obstruction',
	/** UndefinedProblem */
	A_33 = 'Undefined Problem',
	/** SafetyViolation */
	A_34 = 'Safety Violation',
	/** NearMiss */
	A_35 = 'Near Miss',
	/** SignalPassedAtDanger */
	A_36 = 'Signal Passed At Danger',
	/** StationOverrun */
	A_37 = 'Station Overrun',
	/** TrainDoor */
	A_38 = 'Train Door',
	/** StaffSickness */
	A_39 = 'Staff Sickness',
	/** StaffInWrongPlace */
	A_40 = 'Staff In Wrong Place',
	/** StaffShortage */
	A_41 = 'Staff Shortage',
	/** IndustrialAction */
	A_42 = 'Industrial Action',
	/** WorkToRule */
	A_43 = 'Work To Rule',
	/** UndefinedPersonnelProblem */
	A_44 = 'Undefined Personnel Problem',
	/** StaffInjury */
	A_45 = 'Staff Injury',
	/** ContractorStaffInjury */
	A_46 = 'Contractor Staff Injury',
	/** UnofficialIndustrialAction */
	A_47 = 'Unofficial Industrial Action',
	/** PointsProblem */
	A_48 = 'Points Problem',
	/** PointsFailure */
	A_49 = 'Points Failure',
	/** SignalFailure */
	A_50 = 'Signal Failure',
	/** Derailment */
	A_51 = 'Derailment',
	/** EngineFailure */
	A_52 = 'Engine Failure',
	/** BreakDown */
	A_53 = 'Break Down',
	/** TechnicalProblem */
	A_54 = 'Technical Problem',
	/** RepairWork */
	A_55 = 'Repair Work',
	/** PowerProblem */
	A_56 = 'Power Problem',
	/** FuelProblem */
	A_57 = 'Fuel Problem',
	/** SwingBridgeFailure */
	A_58 = 'Swing Bridge Failure',
	/** EscalatorFailure */
	A_59 = 'Escalator Failure',
	/** LiftFailure */
	A_60 = 'Lift Failure',
	/** GangwayProblem */
	A_61 = 'Gangway Problem',
	/** ClosedForMaintenance */
	A_62 = 'Closed For Maintenance',
	/** FuelShortage */
	A_63 = 'Fuel Shortage',
	/** DeicingWork */
	A_64 = 'Deicing Work',
	/** WheelProblem */
	A_65 = 'Wheel Problem',
	/** LuggageCarouselProblem */
	A_66 = 'Luggage Carousel Problem',
	/** UndefinedEquipmentProblem */
	A_67 = 'Undefined Equipment Problem',
	/** TractionFailure */
	A_68 = 'Traction Failure',
	/** DefectiveTrain */
	// A_69 = 'Defective Train',
	/** SlipperyTrack */
	A_70 = 'Slippery Track',
	/** TrainWarningSystemProblem */
	A_71 = 'Train Warning System Problem',
	/** TrackCircuitProblem */
	A_72 = 'Track Circuit Problem',
	/** BrokenRail */
	A_73 = 'Broken Rail',
	/** PoorRailConditions */
	A_74 = 'Poor Rail Conditions',
	/** WheelImpactLoad */
	A_75 = 'Wheel Impact Load',
	/** LackOfOperationalStock */
	A_76 = 'Lack Of Operational Stock',
	/** DefectiveFireAlarmEquipment */
	A_77 = 'Defective Fire Alarm Equipment',
	/** DefectivePlatformEdgeDoors */
	A_78 = 'Defective Platform Edge Doors',
	/** DefectiveCctv */
	A_79 = 'Defective Cctv',
	/** DefectivePublicAnnouncementSystem */
	A_80 = 'Defective Public Announcement System',
	/** TicketingSystemNotAvailable */
	A_81 = 'Ticketing System Not Available',
	/** LevelCrossingFailure */
	// A_82 = 'Level Crossing Failure',
	/** TrafficManagementSystemFailure */
	// A_83 = 'Traffic Management System Failure',
	/** EmergencyEngineeringWork */
	A_84 = 'Emergency Engineering Work',
	/** LateFinishToEngineeringWork */
	A_85 = 'Late Finish To Engineering Work',
	/** OverheadWireFailure */
	// A_86 = 'Overhead Wire Failure',
	/** RoughSea */
	A_87 = 'Rough Sea',
	/** HeavySnowFall */
	A_88 = 'Heavy Snow Fall',
	/** StrongWinds */
	A_89 = 'Strong Winds',
	/** TidalRestrictions */
	A_90 = 'Tidal Restrictions',
	/** HighTide */
	A_91 = 'High Tide',
	/** LowTide */
	A_92 = 'Low Tide',
	/** Frozen */
	A_93 = 'Frozen',
	/** Hail */
	A_94 = 'Hail',
	/** HighTemperatures */
	A_95 = 'High Temperatures',
	/** Flooding */
	A_96 = 'Flooding',
	/** LowWaterLevel */
	A_97 = 'Low Water Level',
	/** HighWaterLevel */
	A_98 = 'High Water Level',
	/** FallenLeaves */
	A_99 = 'Fallen Leaves',
	/** FallenTree */
	A_100 = 'Fallen Tree',
	/** Landslide */
	A_101 = 'Landslide',
	/** UndefinedEnvironmentalProblem */
	A_102 = 'Undefined Environmental Problem',
	/** DriftingSnow */
	A_103 = 'Drifting Snow',
	/** BlizzardConditions */
	A_104 = 'Blizzard Conditions',
	/** StormDamage */
	A_105 = 'Storm Damage',
	/** StormConditions */
	A_106 = 'Storm Conditions',
	/** Slipperiness */
	A_107 = 'Slipperiness',
	/** GlazedFrost */
	A_108 = 'Glazed Frost',
	/** LightningStrike */
	A_109 = 'Lightning Strike',
	/** Avalanches */
	// A_110 = 'Avalanches',
	/** FlashFloods */
	// A_111 = 'Flash Floods',
	/** Mudslide */
	// A_112 = 'Mudslide',
	/** Rockfalls */
	// A_113 = 'Rockfalls',
	/** Subsidence */
	// A_114 = 'Subsidence',
	/** EarthquakeDamage */
	// A_115 = 'Earthquake Damage',
	/** SewerOverflow */
	A_116 = 'Sewer Overflow',
	/** GrassFire */
	A_117 = 'Grass Fire',
	/** Unknown */
	A_1000 = 'Unknown'
}

export enum IDisruptionStatus {
	/** Draft */
	A_1 = 'Draft',
	/** DraftPendingApproval */
	A_2 = 'Draft Pending Approval',
	/** ApprovedDraft */
	A_3 = 'Approved Draft',
	/** Open */
	A_4 = 'Open',
	/** Closing */
	A_5 = 'Closing',
	/** Closed */
	A_6 = 'Closed',
	/** Rejected */
	A_7 = 'Rejected'
}

export enum IDisruptionType {
	/** Planned */
	A_1 = 'Planned',
	/** Unplanned */
	A_2 = 'Unplanned'
}

export enum ISocialMessagePlatform {
	/** Facebook */
	A_1 = 'Facebook',
	/** Twitter */
	A_2 = 'Twitter'
}

export enum IStopPointType {
	/** BusStop */
	A_1 = 'Bus Stop',
	/** CoachStop */
	A_2 = 'Coach Stop',
	/** BoatQuay */
	A_3 = 'Boat Quay',
	/** FerryLanding */
	A_4 = 'Ferry Landing',
	/** TramStop */
	A_5 = 'Tram Stop',
	/** Unknown */
	A_100 = 'Unknown'
}

export enum IDisruptionNotificationStatus {
	/** READ */
	A_0 = 'Read',
	/** UNREAD */
	A_1 = 'Unread'
}

export enum IDisruptionNotificationMessageType {
	/** Disruption SUBMITTED */
	A_0 = 'Disruption submitted',
	/** Disruption APPROVED */
	A_1 = 'Disruption approved',
	/** Disruption REJECTED */
	A_2 = 'Disruption rejected',
	/** Disruption DUPLICATE */
	A_3 = 'Duplicate disruption detected',
	/** PUBLISHING FAILED */
	A_4 = 'Publishing to social media failed'
}

export enum IDisruptionImpactDirection {
	/** Unknown */
	_100 = 'Unknown',
	/** VerySlight */
	A_1 = 'Very Slight',
	/** Slight */
	A_2 = 'Slight',
	/** Normal */
	A_3 = 'Normal',
	/** Severe */
	A_4 = 'Severe',
	/** VerySevere */
	A_5 = 'Very Severe',
	/** NoImpact */
	_99 = 'No Impact'
}

/** An enumeration. */
export enum IDisruptionImpactDirectionReverse {
	ANTI_CLOCKWISE = 'anticlockwise',
	CLOCKWISE = 'clockwise',
	NORTHBOUND = 'northBound',
	NORTHEAST_BOUND = 'northEastBound',
	EASTBOUND = 'eastBound',
	SOUTHEAST_BOUND = 'southEastBound',
	SOUTHBOUND = 'southBound',
	SOUTHWEST_BOUND = 'southWestBound',
	WESTBOUND = 'westBound',
	NORTHWEST_BOUND = 'northWestBound',
	INBOUND_TOWARDS_TOWN = 'inboundTowardsTown',
	OUTBOUND_FROM_TOWN = 'outboundFromTown'
}

export enum ISocialRegistrationAccountType {
	A_1 = 'Twitter',
	A_2 = 'Facebook',
	A_3 = 'HootSuite'
}

export enum ILogActionEntry {
	A_0 = 'Created',
	A_1 = 'Updated',
	A_2 = 'Deleted'
}

export enum IHootSuiteProfileProfileType {
	A_1 = 'Twitter',
	A_2 = 'Facebook'
}

export enum IRoleScope {
	SYS = 'System',
	ORG = 'Organisation'
}
