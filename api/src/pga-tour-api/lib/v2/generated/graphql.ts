import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDateTime: { input: unknown; output: unknown; }
  AWSTimestamp: { input: unknown; output: unknown; }
};

export type ArHole = {
  __typename?: 'ARHole';
  holeNumber: Scalars['Int']['output'];
};

export type Abbreviations = {
  __typename?: 'Abbreviations';
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AdConfig = {
  __typename?: 'AdConfig';
  aon?: Maybe<AdTagConfig>;
  aonSection?: Maybe<AdTagConfig>;
  audio?: Maybe<AdTagConfig>;
  comcastSection?: Maybe<AdTagConfig>;
  comcastTop10?: Maybe<AdTagConfig>;
  config: GlobalAdConfig;
  course?: Maybe<AdTagConfig>;
  cupLeaderboardGroup?: Maybe<AdTagConfig>;
  cupLeaderboardSingles?: Maybe<AdTagConfig>;
  cupTeeTimesGroup?: Maybe<AdTagConfig>;
  cupTeeTimesSingles?: Maybe<AdTagConfig>;
  dpwtRankings?: Maybe<AdTagConfig>;
  fantasy?: Maybe<AdTagConfig>;
  fedexCup?: Maybe<AdTagConfig>;
  fedexcupSection?: Maybe<AdTagConfig>;
  fortinetCup?: Maybe<AdTagConfig>;
  fortinetcupSection?: Maybe<AdTagConfig>;
  golfBet?: Maybe<AdTagConfig>;
  groupScorecard?: Maybe<AdTagConfig>;
  groupStageLeaderboard?: Maybe<AdTagConfig>;
  groupStageStandings?: Maybe<AdTagConfig>;
  groupstageStandings?: Maybe<AdTagConfig>;
  homepage?: Maybe<AdTagConfig>;
  knockoutLeaderboard?: Maybe<AdTagConfig>;
  leaderboard?: Maybe<AdTagConfig>;
  leaderboardCutline?: Maybe<AdTagConfig>;
  leaderboardFavorites?: Maybe<AdTagConfig>;
  leaderboardHoleByHole?: Maybe<AdTagConfig>;
  leaderboardLandscape?: Maybe<AdTagConfig>;
  leaderboardLandscapeHoleByHole?: Maybe<AdTagConfig>;
  leaderboardLandscapeOdds?: Maybe<AdTagConfig>;
  leaderboardLandscapeProbability?: Maybe<AdTagConfig>;
  leaderboardLandscapeShotDetails?: Maybe<AdTagConfig>;
  leaderboardLandscapeStrokesGained?: Maybe<AdTagConfig>;
  leaderboardOdds?: Maybe<AdTagConfig>;
  leaderboardProbability?: Maybe<AdTagConfig>;
  leaderboardRow50?: Maybe<AdTagConfig>;
  leaderboardShotDetails?: Maybe<AdTagConfig>;
  leaderboardStrokesGained?: Maybe<AdTagConfig>;
  liveLeaderboard?: Maybe<AdTagConfig>;
  mobileHeroStory?: Maybe<AdTagConfig>;
  mobilePlayerStory?: Maybe<AdTagConfig>;
  mobileTopicStory?: Maybe<AdTagConfig>;
  mobileYourTourHomeStory?: Maybe<AdTagConfig>;
  more?: Maybe<AdTagConfig>;
  netflix?: Maybe<AdTagConfig>;
  news?: Maybe<AdTagConfig>;
  newsArticlemidcontent?: Maybe<AdTagConfig>;
  newsArticles?: Maybe<AdTagConfig>;
  odds?: Maybe<AdTagConfig>;
  payneStewartaward?: Maybe<AdTagConfig>;
  playerProfile?: Maybe<AdTagConfig>;
  playerProfileBio?: Maybe<AdTagConfig>;
  playerProfileEquipment?: Maybe<AdTagConfig>;
  playerProfileResults?: Maybe<AdTagConfig>;
  playerProfileStats?: Maybe<AdTagConfig>;
  playerScorecard?: Maybe<AdTagConfig>;
  players?: Maybe<AdTagConfig>;
  playoffScorecard?: Maybe<AdTagConfig>;
  rsm?: Maybe<AdTagConfig>;
  rsmSection?: Maybe<AdTagConfig>;
  schedule?: Maybe<AdTagConfig>;
  schwabCup?: Maybe<AdTagConfig>;
  schwabcupSection?: Maybe<AdTagConfig>;
  scorecard?: Maybe<AdTagConfig>;
  scorecardOdds?: Maybe<AdTagConfig>;
  sidebarTicker?: Maybe<AdTagConfig>;
  standings?: Maybe<AdTagConfig>;
  stats?: Maybe<AdTagConfig>;
  statsSection?: Maybe<AdTagConfig>;
  studios?: Maybe<AdTagConfig>;
  teeTimes?: Maybe<AdTagConfig>;
  the25Section?: Maybe<AdTagConfig>;
  the25pointsList?: Maybe<AdTagConfig>;
  tickets?: Maybe<AdTagConfig>;
  totalPlayCup?: Maybe<AdTagConfig>;
  totalplaycupSection?: Maybe<AdTagConfig>;
  tourcast?: Maybe<AdTagConfig>;
  tournament?: Maybe<AdTagConfig>;
  tournamentSection?: Maybe<AdTagConfig>;
  training?: Maybe<AdTagConfig>;
  university?: Maybe<AdTagConfig>;
  universityRanking?: Maybe<AdTagConfig>;
  watch?: Maybe<AdTagConfig>;
  webPlayerStories?: Maybe<AdTagConfig>;
  webTopicStories?: Maybe<AdTagConfig>;
  yahooLeaderboard?: Maybe<AdTagConfig>;
};

export type AdSize = {
  __typename?: 'AdSize';
  height: Scalars['Int']['output'];
  width: Scalars['Int']['output'];
};

export type AdTagConfig = {
  __typename?: 'AdTagConfig';
  actRefresh?: Maybe<Scalars['Boolean']['output']>;
  adTest?: Maybe<Scalars['String']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  injectAds?: Maybe<Scalars['Boolean']['output']>;
  refresh?: Maybe<Scalars['Int']['output']>;
  rows: Array<AdTagRowConfig>;
  s1: Scalars['String']['output'];
  s2?: Maybe<Scalars['String']['output']>;
  timedRefresh?: Maybe<Scalars['Boolean']['output']>;
  uniqueId: Scalars['String']['output'];
};

export type AdTagRowConfig = {
  __typename?: 'AdTagRowConfig';
  container?: Maybe<AdSize>;
  containerLarge?: Maybe<AdSize>;
  containerMedium?: Maybe<AdSize>;
  containerSmall?: Maybe<AdSize>;
  fluid?: Maybe<Scalars['Boolean']['output']>;
  index: Scalars['Int']['output'];
  playerSponsorship?: Maybe<Scalars['Boolean']['output']>;
  pos: Scalars['String']['output'];
  sizes?: Maybe<Array<AdSize>>;
};

export type AllTimeRecordCategories = {
  __typename?: 'AllTimeRecordCategories';
  categories: Array<AllTimeRecordCategory>;
  tourCode: TourCode;
};

export type AllTimeRecordCategory = {
  __typename?: 'AllTimeRecordCategory';
  categoryId: Scalars['String']['output'];
  displayText: Scalars['String']['output'];
  subCategories: Array<AllTimeRecordSubCategory>;
};

export type AllTimeRecordStat = {
  __typename?: 'AllTimeRecordStat';
  categoryId: Scalars['String']['output'];
  categoryName: Scalars['String']['output'];
  isPlayerBased: Scalars['Boolean']['output'];
  primaryColumnIndex?: Maybe<Scalars['Int']['output']>;
  recordId: Scalars['String']['output'];
  rows?: Maybe<Array<AllTimeRecordStatRow>>;
  statHeaders: Array<Scalars['String']['output']>;
  subCategoryName: Scalars['String']['output'];
  /**   1-17 */
  title: Scalars['String']['output'];
};

export type AllTimeRecordStatRow = {
  __typename?: 'AllTimeRecordStatRow';
  playerId?: Maybe<Scalars['String']['output']>;
  values: Array<Scalars['String']['output']>;
};

export type AllTimeRecordStatistic = {
  __typename?: 'AllTimeRecordStatistic';
  displayText: Scalars['String']['output'];
  recordId: Scalars['String']['output'];
};

export type AllTimeRecordSubCategory = {
  __typename?: 'AllTimeRecordSubCategory';
  displayText: Scalars['String']['output'];
  statistics: Array<AllTimeRecordStatistic>;
};

export type Aon = {
  __typename?: 'Aon';
  description: Scalars['String']['output'];
  leaders: Array<AonPlayer>;
  logo: Scalars['String']['output'];
  pastTournaments: Array<AonHole>;
  players: Array<AonPlayer>;
  title: Scalars['String']['output'];
  upcomingTournaments: Array<AonHole>;
};

export type AonHole = {
  __typename?: 'AonHole';
  courseName: Scalars['String']['output'];
  dateText: Scalars['String']['output'];
  holeImage: Scalars['String']['output'];
  holeNum: Scalars['Int']['output'];
  par: Scalars['Int']['output'];
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
  yardage: Scalars['Int']['output'];
};

export type AonPlayer = {
  __typename?: 'AonPlayer';
  countryCode: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  position: Scalars['String']['output'];
  roundsPlayed: Scalars['String']['output'];
  roundsToGo: Scalars['String']['output'];
  score: Scalars['String']['output'];
};

export type ArticleFormType =
  | 'External'
  | 'Standard';

export type ArticleOddsMarkets = {
  __typename?: 'ArticleOddsMarkets';
  class: Scalars['String']['output'];
  market: HistoricalOddsId;
};

export type ArticleOddsMarketsInput = {
  class: Scalars['String']['input'];
  market: HistoricalOddsId;
};

export type ArticleOddsPlayer = {
  __typename?: 'ArticleOddsPlayer';
  playerId: Scalars['String']['output'];
  playerName?: Maybe<Scalars['String']['output']>;
};

export type ArticleOddsPlayerInput = {
  playerId: Scalars['String']['input'];
  playerName?: InputMaybe<Scalars['String']['input']>;
};

export type ArticleOddsTableQuery = {
  __typename?: 'ArticleOddsTableQuery';
  markets?: Maybe<Array<ArticleOddsMarkets>>;
  players?: Maybe<Array<ArticleOddsPlayer>>;
  timeStamp?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type ArticlePlayer = {
  __typename?: 'ArticlePlayer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ArticleSponsor =
  | 'GOLFWRX';

export type Audio = {
  __typename?: 'Audio';
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  latestPubDate: Scalars['AWSTimestamp']['output'];
  numEpisodes: Scalars['Int']['output'];
  rssFeed: Scalars['String']['output'];
  shareUrl: Scalars['String']['output'];
  streamUrls: StreamUrls;
  summary: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AudioStream = {
  __typename?: 'AudioStream';
  id: Scalars['ID']['output'];
  live: Scalars['Boolean']['output'];
  posterImage: Scalars['String']['output'];
  shareUrl: Scalars['String']['output'];
  streamTitle: Scalars['String']['output'];
  streamUrl: Scalars['String']['output'];
};

export type AugmentedRealityConfig = {
  __typename?: 'AugmentedRealityConfig';
  holes: Array<ArHole>;
};

export type AvailableMarket = {
  __typename?: 'AvailableMarket';
  market: Scalars['String']['output'];
  oddsOptions: Array<OddsOption>;
  subMarket?: Maybe<Scalars['String']['output']>;
};

export type BallPath = {
  __typename?: 'BallPath';
  path: Array<BallPathCoordinate>;
};

export type BallPathCoordinate = {
  __typename?: 'BallPathCoordinate';
  secondsSinceStart: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};

/**   Odds Options Types */
export type BaseOddsOption = {
  entity: OddsEntity;
  odds: OddsValues;
};

export type BioRank = {
  __typename?: 'BioRank';
  rank: Scalars['Int']['output'];
  statName: Scalars['String']['output'];
};

export type BrazeFragment = {
  __typename?: 'BrazeFragment';
  checkZipCode: Scalars['Boolean']['output'];
  ctaLink?: Maybe<Scalars['String']['output']>;
  ctaText?: Maybe<Scalars['String']['output']>;
  feedType?: Maybe<Scalars['String']['output']>;
  layout?: Maybe<Scalars['String']['output']>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  sectionType?: Maybe<Scalars['String']['output']>;
};

export type BroadcastAudioStream = {
  __typename?: 'BroadcastAudioStream';
  channelTitle: Scalars['String']['output'];
  endTime: Scalars['AWSTimestamp']['output'];
  id: Scalars['String']['output'];
  liveStatus: LiveStatus;
  network: BroadcastNetwork;
  roundDisplay: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
  startTime: Scalars['AWSTimestamp']['output'];
  streamTitle: Scalars['String']['output'];
};

export type BroadcastCoverage = {
  __typename?: 'BroadcastCoverage';
  countryCode: Scalars['String']['output'];
  coverageType: Array<BroadcastCoverageType>;
  id: Scalars['String']['output'];
  livePillLabel: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type BroadcastCoverageCarousel = {
  __typename?: 'BroadcastCoverageCarousel';
  carousel: Array<BroadcastCoverageVideo>;
};

export type BroadcastCoverageItem = BroadcastAudioStream | BroadcastFeaturedGroup | BroadcastFeaturedHole | BroadcastFullTelecast;

export type BroadcastCoverageType = BroadcastAudioStream | BroadcastCoverageCarousel | BroadcastFeaturedGroup | BroadcastFeaturedHole | BroadcastFullTelecast;

export type BroadcastCoverageVideo = BroadcastFeaturedGroup | BroadcastFeaturedHole | BroadcastFullTelecast;

export type BroadcastFeaturedGroup = {
  __typename?: 'BroadcastFeaturedGroup';
  channelTitle: Scalars['String']['output'];
  courseId?: Maybe<Scalars['String']['output']>;
  endTime: Scalars['AWSTimestamp']['output'];
  groups: Array<BroadcastGroup>;
  id: Scalars['String']['output'];
  liveStatus: LiveStatus;
  network: BroadcastNetwork;
  promoImage?: Maybe<Scalars['String']['output']>;
  promoImages: Array<Scalars['String']['output']>;
  roundDisplay: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
  startTime: Scalars['AWSTimestamp']['output'];
  streamTitle: Scalars['String']['output'];
};

export type BroadcastFeaturedHole = {
  __typename?: 'BroadcastFeaturedHole';
  channelTitle: Scalars['String']['output'];
  courseId?: Maybe<Scalars['String']['output']>;
  endTime: Scalars['AWSTimestamp']['output'];
  featuredHoles: Array<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  liveStatus: LiveStatus;
  network: BroadcastNetwork;
  promoImage?: Maybe<Scalars['String']['output']>;
  promoImages: Array<Scalars['String']['output']>;
  roundDisplay: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
  startTime: Scalars['AWSTimestamp']['output'];
  streamTitle: Scalars['String']['output'];
};

export type BroadcastFullTelecast = {
  __typename?: 'BroadcastFullTelecast';
  channelTitle: Scalars['String']['output'];
  endTime: Scalars['AWSTimestamp']['output'];
  id: Scalars['String']['output'];
  liveStatus: LiveStatus;
  network: BroadcastNetwork;
  promoImage?: Maybe<Scalars['String']['output']>;
  promoImages: Array<Scalars['String']['output']>;
  roundDisplay: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
  startTime: Scalars['AWSTimestamp']['output'];
  streamTitle: Scalars['String']['output'];
};

export type BroadcastGroup = {
  __typename?: 'BroadcastGroup';
  extendedCoverage?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  liveStatus: LiveStatus;
  playerLastNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type BroadcastNetwork = {
  __typename?: 'BroadcastNetwork';
  androidLink: Scalars['String']['output'];
  androidStreamUrl?: Maybe<Scalars['String']['output']>;
  appleAppStore: Scalars['String']['output'];
  asnw?: Maybe<Scalars['String']['output']>;
  backgroundColor?: Maybe<Scalars['String']['output']>;
  backgroundColorDark?: Maybe<Scalars['String']['output']>;
  caid?: Maybe<Scalars['String']['output']>;
  channelId?: Maybe<Scalars['String']['output']>;
  daiAssetKey?: Maybe<Scalars['String']['output']>;
  daiPreRollUrl?: Maybe<Scalars['String']['output']>;
  daiStreamActivityId?: Maybe<Scalars['String']['output']>;
  descriptionUrl?: Maybe<Scalars['String']['output']>;
  flag?: Maybe<Scalars['String']['output']>;
  fwCoppa?: Maybe<Scalars['String']['output']>;
  fwHReferer?: Maybe<Scalars['String']['output']>;
  fwNielsenAppId?: Maybe<Scalars['String']['output']>;
  googlePlayStore: Scalars['String']['output'];
  iOSLink: Scalars['String']['output'];
  id: Scalars['String']['output'];
  iosStreamUrl?: Maybe<Scalars['String']['output']>;
  liveAssetId?: Maybe<Scalars['String']['output']>;
  metr?: Maybe<Scalars['String']['output']>;
  mode?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use networkLogoAsset */
  networkLogo?: Maybe<Scalars['String']['output']>;
  networkLogoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use networkLogoDarkAsset */
  networkLogoDark?: Maybe<Scalars['String']['output']>;
  networkLogoDarkAsset?: Maybe<ImageAsset>;
  networkName: Scalars['String']['output'];
  nw?: Maybe<Scalars['String']['output']>;
  priorityNum?: Maybe<Scalars['Int']['output']>;
  prof?: Maybe<Scalars['String']['output']>;
  resp?: Maybe<Scalars['String']['output']>;
  simulcast?: Maybe<Scalars['Boolean']['output']>;
  simulcastUrl?: Maybe<Scalars['String']['output']>;
  ssnw?: Maybe<Scalars['String']['output']>;
  streamUrl?: Maybe<Scalars['String']['output']>;
  sz?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  vdty?: Maybe<Scalars['String']['output']>;
  vrdu?: Maybe<Scalars['String']['output']>;
};

export type BroadcastNetworks = {
  __typename?: 'BroadcastNetworks';
  networks: Array<BroadcastNetwork>;
};

export type BroadcastTableFragment = {
  __typename?: 'BroadcastTableFragment';
  path: Scalars['String']['output'];
  webviewUrl: Scalars['String']['output'];
};

export type BubblePill = {
  __typename?: 'BubblePill';
  iconDark: ImageAsset;
  iconLight: ImageAsset;
  pillText: Scalars['String']['output'];
};

export type BubbleType =
  | 'PLAYOFFS'
  | 'SIGNATURE_EVENTS';

export type BubbleWatch = {
  __typename?: 'BubbleWatch';
  bubbleId: Scalars['ID']['output'];
  bubbleType: BubbleType;
  items: Array<BubbleWatchItem>;
};

export type BubbleWatchItem = {
  __typename?: 'BubbleWatchItem';
  info?: Maybe<Scalars['String']['output']>;
  infoDesc?: Maybe<Scalars['String']['output']>;
  standings: TourCupRankingEvent;
};

export type CallToAction = {
  __typename?: 'CallToAction';
  color?: Maybe<Scalars['String']['output']>;
  fontColor?: Maybe<Scalars['String']['output']>;
  link: Scalars['String']['output'];
  target?: Maybe<Scalars['String']['output']>;
  text: Scalars['String']['output'];
  webViewLink?: Maybe<Scalars['String']['output']>;
};

export type Category = {
  __typename?: 'Category';
  displayName: Scalars['String']['output'];
  franchises: Array<Franchise>;
  queryValue: Scalars['String']['output'];
};

export type CategoryPlayerStat = {
  __typename?: 'CategoryPlayerStat';
  color: StatColor;
  statName: Scalars['String']['output'];
  statValue: Scalars['String']['output'];
};

export type CategoryStat = {
  __typename?: 'CategoryStat';
  displaySeason: Scalars['String']['output'];
  lastProcessed: Scalars['String']['output'];
  players: Array<CategoryStatPlayer>;
  statDescription: Scalars['String']['output'];
  statHeaders: Array<Scalars['String']['output']>;
  statTitle: Scalars['String']['output'];
  tourAvg?: Maybe<Scalars['String']['output']>;
  year: Scalars['Int']['output'];
};

export type CategoryStatPlayer = {
  __typename?: 'CategoryStatPlayer';
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  rankChangeTendency?: Maybe<StatRankMovement>;
  rankDiff: Scalars['String']['output'];
  stats: Array<CategoryPlayerStat>;
};

export type CategoryStatType =
  | 'EVENT'
  | 'YTD';

export type CerosEmbedPlugin = {
  __typename?: 'CerosEmbedPlugin';
  aspectRatio: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  mobileAspectRatio: Scalars['Float']['output'];
  padding: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ContentCarousel = Image | Video;

export type ContentFragment = {
  __typename?: 'ContentFragment';
  fragments: Array<ContentFragments>;
  pageMetadata: PageMetadata;
  totalLength: Scalars['Int']['output'];
};

export type ContentFragmentTab = {
  __typename?: 'ContentFragmentTab';
  contentType: ContentType;
  label?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  webview?: Maybe<Scalars['String']['output']>;
};

export type ContentFragmentTabs = {
  __typename?: 'ContentFragmentTabs';
  pageHeader: Scalars['String']['output'];
  partnerShipAssets?: Maybe<Array<Scalars['String']['output']>>;
  path: Scalars['String']['output'];
  tabs: Array<ContentFragmentTab>;
};

export type ContentFragmentType = {
  __typename?: 'ContentFragmentType';
  contentType: ContentType;
  path: Scalars['String']['output'];
};

export type ContentFragments = BrazeFragment | DropdownFragment | HomepageLead | HomepageNews | HomepageProgramStanding | KopHeader | KopSignUp | KopStandingsList | KopSubheader | KopUpcomingTournament | KopUserProfile | KopZigZag | LandingPageImageBlock | MediaGallery | OddsToWinTracker | TglBoxScoreFragment | ThreeUpPhoto | ThreeUpStats | TwoColumn | VideoHero;

export type ContentFragmentsCompressed = {
  __typename?: 'ContentFragmentsCompressed';
  limit?: Maybe<Scalars['Int']['output']>;
  offset?: Maybe<Scalars['Int']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  payload: Scalars['String']['output'];
  tourCode: TourCode;
};

export type ContentStat = {
  __typename?: 'ContentStat';
  statId: Scalars['String']['output'];
  statName: Scalars['String']['output'];
};

export type ContentStory = {
  __typename?: 'ContentStory';
  desktopLatestNewsIndex?: Maybe<Scalars['Int']['output']>;
  mobileLatestNewsIndex?: Maybe<Scalars['Int']['output']>;
  path: Scalars['String']['output'];
  sectionHeader?: Maybe<Scalars['String']['output']>;
  storyType?: Maybe<Story_Type>;
  topicLabels?: Maybe<Array<Scalars['String']['output']>>;
};

export type ContentTopics = {
  __typename?: 'ContentTopics';
  displayValue?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ContentType =
  | 'CONTENT_FRAGMENTS'
  | 'CONTENT_TABS'
  | 'GENERIC_CONTENT'
  | 'NEWS_ARTICLE'
  | 'RYDER_CUP_CONTENT_FRAGMENTS'
  | 'RYDER_CUP_CONTENT_TABS'
  | 'RYDER_CUP_GENERIC_CONTENT'
  | 'RYDER_CUP_NEWS_ARTICLE';

export type ContentVideoCarousel = {
  __typename?: 'ContentVideoCarousel';
  bottomCta?: Maybe<CallToAction>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  topCta?: Maybe<CallToAction>;
  videos?: Maybe<Array<Video>>;
};

export type Course = {
  __typename?: 'Course';
  courseCode: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  enabled?: Maybe<Scalars['Boolean']['output']>;
  features?: Maybe<Array<TeeTimesFeature>>;
  hostCourse: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  scoringLevel: ScoringLevel;
};

export type CourseDetailRowValue = {
  __typename?: 'CourseDetailRowValue';
  tendency?: Maybe<ScoringTendency>;
  value: Scalars['String']['output'];
};

export type CourseFilter = {
  __typename?: 'CourseFilter';
  courseId: Scalars['Int']['output'];
  courseName: Scalars['String']['output'];
};

export type CourseHoleHeader = {
  __typename?: 'CourseHoleHeader';
  courseId: Scalars['ID']['output'];
  holeHeaders: Array<HoleHeaderV2>;
};

export type CourseHoleStats = {
  __typename?: 'CourseHoleStats';
  /** @deprecated Use paceOfPlay field instead */
  averagePaceOfPlay?: Maybe<Scalars['String']['output']>;
  birdies?: Maybe<Scalars['Int']['output']>;
  bogeys?: Maybe<Scalars['Int']['output']>;
  courseHoleNum: Scalars['Int']['output'];
  doubleBogey?: Maybe<Scalars['Int']['output']>;
  eagles?: Maybe<Scalars['Int']['output']>;
  holeImage: Scalars['String']['output'];
  holePickle?: Maybe<HolePickle>;
  /** @deprecated Use holePickleGreenLeftToRightAsset */
  holePickleGreenLeftToRight: Scalars['String']['output'];
  holePickleGreenLeftToRightAsset: ImageAsset;
  /** @deprecated Use broadcast api indication instead of this. */
  live: Scalars['Boolean']['output'];
  paceOfPlay?: Maybe<CourseHoleStatsPaceData>;
  parValue: Scalars['String']['output'];
  pars?: Maybe<Scalars['Int']['output']>;
  pinGreen: PointOfInterestCoords;
  rank?: Maybe<Scalars['Int']['output']>;
  scoringAverage: Scalars['String']['output'];
  scoringAverageDiff: Scalars['String']['output'];
  scoringDiffTendency: ScoringTendency;
  yards: Scalars['Int']['output'];
};

export type CourseHoleStatsPaceData = {
  __typename?: 'CourseHoleStatsPaceData';
  approachRank?: Maybe<Scalars['String']['output']>;
  approachTime?: Maybe<Scalars['String']['output']>;
  averageHoleRank?: Maybe<Scalars['String']['output']>;
  averageHoleTime?: Maybe<Scalars['String']['output']>;
  offTeeRank?: Maybe<Scalars['String']['output']>;
  offTeeTime?: Maybe<Scalars['String']['output']>;
  overallRank?: Maybe<Scalars['String']['output']>;
  overallTime?: Maybe<Scalars['String']['output']>;
  puttingRank?: Maybe<Scalars['String']['output']>;
  puttingTime?: Maybe<Scalars['String']['output']>;
};

export type CourseInfo = {
  __typename?: 'CourseInfo';
  bottomCta?: Maybe<CallToAction>;
  coursePhotos?: Maybe<Array<Scalars['String']['output']>>;
  cta1?: Maybe<CallToAction>;
  cta2?: Maybe<CallToAction>;
  subhead?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topCta?: Maybe<CallToAction>;
};

export type CourseOverviewInfo = {
  __typename?: 'CourseOverviewInfo';
  cutsMade: Scalars['String']['output'];
  cutsMissed: Scalars['String']['output'];
  disqualified: Scalars['String']['output'];
  events: Scalars['String']['output'];
  money: Scalars['String']['output'];
  runnerUp: Scalars['String']['output'];
  second: Scalars['String']['output'];
  third: Scalars['String']['output'];
  top10: Scalars['String']['output'];
  top25: Scalars['String']['output'];
  wins: Scalars['String']['output'];
  withdrew: Scalars['String']['output'];
};

export type CourseOverviewItem = {
  __typename?: 'CourseOverviewItem';
  details: Array<CourseOverviewItemDetails>;
  displayName: Scalars['String']['output'];
  image: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
};

export type CourseOverviewItemDetails = {
  __typename?: 'CourseOverviewItemDetails';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CoursePills = {
  __typename?: 'CoursePills';
  courseId: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
};

export type CourseResultsTournament = {
  __typename?: 'CourseResultsTournament';
  points: Scalars['String']['output'];
  position: Scalars['String']['output'];
  roundScores: Array<RoundScoreItem>;
  season: Scalars['String']['output'];
  toPar: Scalars['String']['output'];
  total: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
  winnings: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type CourseRound = {
  __typename?: 'CourseRound';
  enablePaceOfPlay?: Maybe<Scalars['Boolean']['output']>;
  holeStats: Array<HoleStat>;
  live: Scalars['Boolean']['output'];
  paceOfPlayDescription?: Maybe<Scalars['String']['output']>;
  paceOfPlayHeader: Scalars['String']['output'];
  paceOfPlayLabelTitle?: Maybe<Scalars['String']['output']>;
  roundHeader: Scalars['String']['output'];
  roundNum?: Maybe<Scalars['Int']['output']>;
  scoringHeader: Scalars['String']['output'];
};

export type CourseStat = {
  __typename?: 'CourseStat';
  courseCode: Scalars['String']['output'];
  courseId: Scalars['String']['output'];
  courseImage: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  courseOverview: TournamentCourse;
  holeDetailsAvailability: HoleDetailsAvailability;
  hostCourse: Scalars['Boolean']['output'];
  par: Scalars['Int']['output'];
  roundHoleStats: Array<CourseRound>;
  roundPills?: Maybe<Array<Scalars['String']['output']>>;
  shotlinkLogo?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
  yardage: Scalars['String']['output'];
};

export type CourseStatsCategory = {
  __typename?: 'CourseStatsCategory';
  detailId: CourseStatsId;
  header: Scalars['String']['output'];
  items: Array<CourseOverviewItem>;
};

export type CourseStatsDetails = {
  __typename?: 'CourseStatsDetails';
  displayName: Scalars['String']['output'];
  displayYear: Scalars['String']['output'];
  headers: Array<Scalars['String']['output']>;
  round: ToughestRound;
  roundPills: Array<ToughestCourseRoundPills>;
  rows: Array<CourseStatsDetailsRow>;
  seasons: Array<StatYearPills>;
  shareURL?: Maybe<Scalars['String']['output']>;
  tableName: Scalars['String']['output'];
  tourCode: TourCode;
  year: Scalars['Int']['output'];
};

export type CourseStatsDetailsRow = {
  __typename?: 'CourseStatsDetailsRow';
  displayName: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
  values: Array<CourseDetailRowValue>;
};

export type CourseStatsId =
  | 'TOUGHEST_COURSE'
  | 'TOUGHEST_HOLES';

export type CourseStatsOverview = {
  __typename?: 'CourseStatsOverview';
  categories: Array<CourseStatsCategory>;
  tourCode: TourCode;
  year: Scalars['Int']['output'];
};

export type CupLeaderboardMatch = {
  __typename?: 'CupLeaderboardMatch';
  displayScore: Scalars['String']['output'];
  euMatchWin?: Maybe<Scalars['Float']['output']>;
  holeScores?: Maybe<Array<CupLeaderboardMatchHoles>>;
  location: Scalars['String']['output'];
  locationDescription?: Maybe<Scalars['String']['output']>;
  locationSort: Scalars['Int']['output'];
  matchDraw?: Maybe<Scalars['Float']['output']>;
  matchId: Scalars['ID']['output'];
  matchStatus: Scalars['String']['output'];
  matchStatusColor: Scalars['String']['output'];
  matchStatusFlag?: Maybe<Scalars['String']['output']>;
  matchTitle: Scalars['String']['output'];
  startingTee: Scalars['String']['output'];
  teams: Array<CupLeaderboardMatchTeam>;
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  usMatchWin?: Maybe<Scalars['Float']['output']>;
};

export type CupLeaderboardMatchHoles = {
  __typename?: 'CupLeaderboardMatchHoles';
  holeNumber: Scalars['String']['output'];
  holeNumberColor: Scalars['String']['output'];
  holeOutlineColor?: Maybe<Scalars['String']['output']>;
  holePlayedStatus: HolePlayedStatus;
};

export type CupLeaderboardMatchPlayer = {
  __typename?: 'CupLeaderboardMatchPlayer';
  color?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  hideHeadshot?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  results?: Maybe<CupLeaderboardMatchPlayerResults>;
  shortName: Scalars['String']['output'];
};

export type CupLeaderboardMatchPlayerResults = {
  __typename?: 'CupLeaderboardMatchPlayerResults';
  losses: Scalars['String']['output'];
  ties: Scalars['String']['output'];
  total: Scalars['String']['output'];
  wins: Scalars['String']['output'];
};

export type CupLeaderboardMatchTeam = {
  __typename?: 'CupLeaderboardMatchTeam';
  flagSurroundColor?: Maybe<Scalars['String']['output']>;
  flagSurroundColorDark?: Maybe<Scalars['String']['output']>;
  players: Array<CupLeaderboardMatchPlayer>;
  status: CupLeaderboardTeamStatus;
  teamColor: Scalars['String']['output'];
  teamFlag: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  teamName: Scalars['String']['output'];
  teamScore?: Maybe<Scalars['String']['output']>;
  teamStoryContentInfo?: Maybe<Array<TeamStoryContentInfo>>;
  textColor?: Maybe<Scalars['String']['output']>;
};

export type CupLeaderboardTeamStatus =
  | 'BEHIND'
  | 'LEADS'
  | 'TIED'
  | 'UNKNOWN'
  | 'WINS';

export type CupLiveActivitySponsor = {
  __typename?: 'CupLiveActivitySponsor';
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorText?: Maybe<Scalars['String']['output']>;
};

export type CupMatchesCompleteData = {
  __typename?: 'CupMatchesCompleteData';
  completedMatches: Scalars['Int']['output'];
  totalMatches: Scalars['Int']['output'];
};

export type CupOverviewDisplayType =
  | 'POINTS_ONLY'
  | 'PROGRESS';

export type CupPastResults = {
  __typename?: 'CupPastResults';
  permId: Scalars['ID']['output'];
  years: Array<CupPastResultsYear>;
};

export type CupPastResultsTeam = {
  __typename?: 'CupPastResultsTeam';
  badgeText?: Maybe<Scalars['String']['output']>;
  color: Scalars['String']['output'];
  score: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  teamLogo: Scalars['String']['output'];
  teamName: Scalars['String']['output'];
};

export type CupPastResultsYear = {
  __typename?: 'CupPastResultsYear';
  displayYear: Scalars['String']['output'];
  teams: Array<CupPastResultsTeam>;
  year: Scalars['Int']['output'];
};

export type CupRankMovementDirection =
  | 'CONSTANT'
  | 'DOWN'
  | 'UNKNOWN'
  | 'UP';

export type CupRankingPlayer = {
  __typename?: 'CupRankingPlayer';
  id: Scalars['String']['output'];
  movement: Scalars['String']['output'];
  movementDirection: CupRankMovementDirection;
  name: Scalars['String']['output'];
  playerCountry: Scalars['String']['output'];
  position: Scalars['String']['output'];
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  total: Scalars['String']['output'];
  totals: Array<CupRankingTotal>;
  tourBound?: Maybe<Scalars['Boolean']['output']>;
  winner?: Maybe<Scalars['Boolean']['output']>;
};

export type CupRankingPlayerInfoRow = {
  __typename?: 'CupRankingPlayerInfoRow';
  image?: Maybe<Scalars['String']['output']>;
  imageDark?: Maybe<Scalars['String']['output']>;
  text: Scalars['String']['output'];
};

export type CupRankingPlayerWrapper = CupRankingPlayer | CupRankingPlayerInfoRow;

export type CupRankingTotal = {
  __typename?: 'CupRankingTotal';
  display: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CupRound = {
  __typename?: 'CupRound';
  roundDisplayName: Scalars['String']['output'];
  roundNum: Scalars['Int']['output'];
};

export type CupRoundFormat =
  | 'ALTERNATE_SHOT'
  | 'BEST_BALL'
  | 'SINGLES';

export type CupScorecard = {
  __typename?: 'CupScorecard';
  currentHole?: Maybe<Scalars['Int']['output']>;
  displayScore: Scalars['String']['output'];
  format: CupRoundFormat;
  id: Scalars['ID']['output'];
  infoWebUrl?: Maybe<Scalars['String']['output']>;
  matchHoleScores: Array<MatchHole>;
  matchName: Scalars['String']['output'];
  matchStatus: Scalars['String']['output'];
  matchStatusColor: Scalars['String']['output'];
  matchStatusFlag?: Maybe<Scalars['String']['output']>;
  messages: Array<Message>;
  scorecardTitle: Scalars['String']['output'];
  teams: Array<CupTeam>;
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrlWeb?: Maybe<Scalars['String']['output']>;
};

export type CupTeam = {
  __typename?: 'CupTeam';
  flagSurroundColor?: Maybe<Scalars['String']['output']>;
  flagSurroundColorDark?: Maybe<Scalars['String']['output']>;
  players?: Maybe<Array<MpScorecardPlayer>>;
  status: CupLeaderboardTeamStatus;
  teamColor: Scalars['String']['output'];
  teamFlag: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  teamName: Scalars['String']['output'];
  teamPoints?: Maybe<Scalars['String']['output']>;
  teamShortName: Scalars['String']['output'];
  textColor?: Maybe<Scalars['String']['output']>;
};

export type CupTeamRoster = {
  __typename?: 'CupTeamRoster';
  flagSurroundColor?: Maybe<Scalars['String']['output']>;
  flagSurroundColorDark?: Maybe<Scalars['String']['output']>;
  sections: Array<CupTeamRosterSection>;
  teamColor: Scalars['String']['output'];
  teamFlag: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  teamLogo?: Maybe<Scalars['String']['output']>;
  teamName: Scalars['String']['output'];
};

export type CupTeamRosterSection = {
  __typename?: 'CupTeamRosterSection';
  players: Array<CupLeaderboardMatchPlayer>;
  sectionTitle: Scalars['String']['output'];
  showResults: Scalars['Boolean']['output'];
};

export type CupTeamRosters = {
  __typename?: 'CupTeamRosters';
  teams: Array<CupTeamRoster>;
  tournamentId: Scalars['ID']['output'];
};

export type CupTeeTimes = {
  __typename?: 'CupTeeTimes';
  currentRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  rounds: Array<CupTeeTimesRound>;
};

export type CupTeeTimesRound = {
  __typename?: 'CupTeeTimesRound';
  adConfig: Scalars['String']['output'];
  completedMatches: Scalars['Int']['output'];
  matches: Array<CupLeaderboardMatch>;
  roundDisplay: Scalars['String']['output'];
  roundNum: Scalars['Int']['output'];
  totalMatches: Scalars['Int']['output'];
};

export type CupTournamentLeaderboard = {
  __typename?: 'CupTournamentLeaderboard';
  allRounds: Array<CupRound>;
  completedMatches: Scalars['Int']['output'];
  currentId: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  format: CupRoundFormat;
  id: Scalars['ID']['output'];
  liveActivitySponsor?: Maybe<CupLiveActivitySponsor>;
  matches: Array<CupLeaderboardMatch>;
  outcomeIqLogo?: Maybe<Scalars['String']['output']>;
  rounds: Array<CupTournamentRound>;
  title: Scalars['String']['output'];
  totalMatches: Scalars['Int']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type CupTournamentLeaderboardCompressed = {
  __typename?: 'CupTournamentLeaderboardCompressed';
  currentId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type CupTournamentRound = {
  __typename?: 'CupTournamentRound';
  adConfig: Scalars['String']['output'];
  description: Scalars['String']['output'];
  format: CupRoundFormat;
  roundNumber: Scalars['Int']['output'];
};

export type CupTournamentStatus = {
  __typename?: 'CupTournamentStatus';
  heroImage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  infoPath?: Maybe<Scalars['String']['output']>;
  matchesComplete?: Maybe<CupMatchesCompleteData>;
  messages: Array<LeaderboardMessage>;
  miniLeaderboardOverride?: Maybe<Scalars['String']['output']>;
  scorecardEnabled: Scalars['Boolean']['output'];
  stickyBanner: Scalars['Boolean']['output'];
  teams: Array<CupTournamentTeam>;
  tournamentId: Scalars['String']['output'];
  type: CupOverviewDisplayType;
};

export type CupTournamentTeam = {
  __typename?: 'CupTournamentTeam';
  badgeText?: Maybe<Scalars['String']['output']>;
  color: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  goalPoints?: Maybe<Scalars['String']['output']>;
  projected?: Maybe<Scalars['String']['output']>;
  projectedColor: Scalars['String']['output'];
  projectedProgress: Scalars['Float']['output'];
  projectedValue: Scalars['Float']['output'];
  shortBadgeText?: Maybe<Scalars['String']['output']>;
  shortName: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  teamLogo: Scalars['String']['output'];
  textColor?: Maybe<Scalars['String']['output']>;
  toWin?: Maybe<Scalars['String']['output']>;
  toWinSuffix?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['String']['output']>;
  totalProgress: Scalars['Float']['output'];
  totalValue: Scalars['Float']['output'];
  winner?: Maybe<Scalars['Boolean']['output']>;
};

export type CurrentLeaderPlayer = {
  __typename?: 'CurrentLeaderPlayer';
  backNine: Scalars['Boolean']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  groupNumber: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  leaderboardSortOrder: Scalars['Int']['output'];
  playerIcon?: Maybe<LeaderboardPlayerIcon>;
  playerState?: Maybe<PlayerState>;
  position: Scalars['String']['output'];
  roundHeader: Scalars['String']['output'];
  roundScore: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  thru: Scalars['String']['output'];
  totalScore: Scalars['String']['output'];
};

export type CurrentLeaderSponsors = {
  __typename?: 'CurrentLeaderSponsors';
  images: Array<SponsorImage>;
  text: Scalars['String']['output'];
};

export type CurrentLeaders = {
  __typename?: 'CurrentLeaders';
  hideRolexClock: Scalars['Boolean']['output'];
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  miniatureLeaderboardExternalLinkOverride?: Maybe<Scalars['String']['output']>;
  miniatureLeaderboardImgOverride?: Maybe<Scalars['String']['output']>;
  players: Array<CurrentLeaderPlayer>;
  profileEnabled: Scalars['Boolean']['output'];
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
  sponsor?: Maybe<CurrentLeaderSponsors>;
  tournamentName: Scalars['String']['output'];
};

export type CurrentLeadersCompressed = {
  __typename?: 'CurrentLeadersCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type CutLineInfo = {
  __typename?: 'CutLineInfo';
  lastUpdated: Scalars['AWSTimestamp']['output'];
  new?: Maybe<Scalars['Boolean']['output']>;
  possibleCutLines: Array<CutLinePossibility>;
  probableCutLine: Scalars['String']['output'];
  projectedCutLine: Scalars['String']['output'];
  sponsorLogo?: Maybe<ImageAsset>;
  sponsorName?: Maybe<Scalars['String']['output']>;
};

export type CutLinePossibility = {
  __typename?: 'CutLinePossibility';
  displayProbability: Scalars['String']['output'];
  probability: Scalars['Float']['output'];
  score: Scalars['String']['output'];
};

export type DayWeather = {
  __typename?: 'DayWeather';
  day: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

export type DeleteAccountResponse = {
  __typename?: 'DeleteAccountResponse';
  ok: Scalars['Boolean']['output'];
};

export type DrawerDisplayState =
  | 'HOLE_ONLY'
  | 'PLAY_BY_PLAY'
  | 'ROUND_COMPLETE'
  | 'TEE_TIME';

export type DropdownFragment = {
  __typename?: 'DropdownFragment';
  bottomCta?: Maybe<CallToAction>;
  header: Scalars['String']['output'];
  rows: Array<DropdownRow>;
  subheader?: Maybe<Scalars['String']['output']>;
  topCta?: Maybe<CallToAction>;
};

export type DropdownRow = {
  __typename?: 'DropdownRow';
  content?: Maybe<Array<Maybe<NewsArticleNode>>>;
  cta?: Maybe<CallToAction>;
  header: Scalars['String']['output'];
};

export type EfiHole = {
  __typename?: 'EFIHole';
  count: Scalars['String']['output'];
  hole: Scalars['String']['output'];
};

export type EfiPlayer = {
  __typename?: 'EFIPlayer';
  displayName: Scalars['String']['output'];
  history: Array<EfiPlayerEagle>;
  playerId: Scalars['ID']['output'];
  totalEagles: Scalars['String']['output'];
};

export type EfiPlayerEagle = {
  __typename?: 'EFIPlayerEagle';
  hole: Scalars['Int']['output'];
  round: Scalars['Int']['output'];
  videoId?: Maybe<Scalars['String']['output']>;
};

export type EaglesForImpact = {
  __typename?: 'EaglesForImpact';
  charity: Scalars['String']['output'];
  donation: Scalars['String']['output'];
  eaglesTitle: Scalars['String']['output'];
  holes: Array<EfiHole>;
  linkText?: Maybe<Scalars['String']['output']>;
  linkUrl?: Maybe<Scalars['String']['output']>;
  players: Array<EfiPlayer>;
  sponsorDescription: Scalars['String']['output'];
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo: Scalars['String']['output'];
  sponsorLogoAsset: ImageAsset;
  title: Scalars['String']['output'];
  totalEagles: Scalars['String']['output'];
  tournamentId: Scalars['ID']['output'];
};

/**   Player Odds V2 */
export type EntityOdds = {
  __typename?: 'EntityOdds';
  bettingProfile?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['ID']['output'];
  marketPills: Array<MarketPill>;
  /**   others available to request */
  markets: Array<Market>;
  message?: Maybe<OddsMessage>;
  provider: OddsProvider;
  /**   playerId or teamId */
  tournamentId: Scalars['String']['output'];
};

export type Episode = {
  __typename?: 'Episode';
  date: Scalars['AWSTimestamp']['output'];
  description: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  podcastId: Scalars['String']['output'];
  streamUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Event = {
  __typename?: 'Event';
  eventName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  leaderboardId: Scalars['String']['output'];
};

export type EventGuideConfig = {
  __typename?: 'EventGuideConfig';
  augmentedReality?: Maybe<AugmentedRealityConfig>;
  eventGuideMap?: Maybe<Scalars['String']['output']>;
  eventGuideURL?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type EventHub = {
  __typename?: 'EventHub';
  bottomSectionTitle?: Maybe<Scalars['String']['output']>;
  notSharingLocationFallbackDescriptionText?: Maybe<Scalars['String']['output']>;
  notSharingLocationFallbackTitle?: Maybe<Scalars['String']['output']>;
  outOfRangeFallbackDescriptionText?: Maybe<Scalars['String']['output']>;
  outOfRangeFallbackPromoImage?: Maybe<Scalars['String']['output']>;
  outOfRangeFallbackTitle?: Maybe<Scalars['String']['output']>;
  partnershipAsset?: Maybe<Scalars['String']['output']>;
  partnershipText?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  radius?: Maybe<Scalars['Float']['output']>;
  topSectionTitle?: Maybe<Scalars['String']['output']>;
};

export type EventHubTable = {
  __typename?: 'EventHubTable';
  cta?: Maybe<CallToAction>;
  mapCtaText?: Maybe<Scalars['String']['output']>;
  mapIframe?: Maybe<Scalars['String']['output']>;
  mapPdf?: Maybe<Scalars['String']['output']>;
  mapSectionTitle?: Maybe<Scalars['String']['output']>;
  notSharingLocationCta?: Maybe<CallToAction>;
  notSharingLocationFallbackDescriptionText?: Maybe<Scalars['String']['output']>;
  notSharingLocationFallbackTitle?: Maybe<Scalars['String']['output']>;
  outOfRangeCta?: Maybe<CallToAction>;
  outOfRangeFallbackDescriptionText?: Maybe<Scalars['String']['output']>;
  outOfRangeFallbackPromoImg?: Maybe<Scalars['String']['output']>;
  outOfRangeFallbackTitle?: Maybe<Scalars['String']['output']>;
  partnershipAsset?: Maybe<Scalars['String']['output']>;
  partnershipText?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  radius?: Maybe<Scalars['Float']['output']>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
};

export type EventRegion =
  | 'EUROPE'
  | 'INTERNATIONAL'
  | 'US';

export type ExpertPicks = {
  __typename?: 'ExpertPicks';
  expertPicksTableRows: Array<ExpertPicksTableRow>;
  tournamentName: Scalars['String']['output'];
};

export type ExpertPicksNode = {
  __typename?: 'ExpertPicksNode';
  isPowerRankings: Scalars['Boolean']['output'];
  path: Scalars['String']['output'];
};

export type ExpertPicksTableRow = {
  __typename?: 'ExpertPicksTableRow';
  comment: Array<TourSponsorDescription>;
  expertName?: Maybe<Scalars['String']['output']>;
  expertTitle?: Maybe<Scalars['String']['output']>;
  lineup: Array<PlayerInfo>;
  percentSelected?: Maybe<Scalars['String']['output']>;
  percentSelectedColor?: Maybe<StatColor>;
  winner?: Maybe<PlayerInfo>;
};

export type FavoritePlayer = {
  __typename?: 'FavoritePlayer';
  id: Scalars['ID']['output'];
};

export type FavoritePlayerInput = {
  id: Scalars['ID']['input'];
};

export type FavoriteTourResponse = {
  __typename?: 'FavoriteTourResponse';
  ok: Scalars['Boolean']['output'];
  tourCode?: Maybe<TourCode>;
};

export type FeatureItem = {
  __typename?: 'FeatureItem';
  fieldStatType?: Maybe<FieldStatType>;
  leaderboardFeatures?: Maybe<LeaderboardFeature>;
  name: Scalars['String']['output'];
  new: Scalars['Boolean']['output'];
  sponsor?: Maybe<FeatureSponsor>;
  tooltipText?: Maybe<Scalars['String']['output']>;
  tooltipTitle?: Maybe<Scalars['String']['output']>;
};

export type FeatureSponsor = {
  __typename?: 'FeatureSponsor';
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo: Scalars['String']['output'];
  sponsorLogoAsset: ImageAsset;
  /** @deprecated use sponsorLogoDarkAsset */
  sponsorLogoDark: Scalars['String']['output'];
  sponsorLogoDarkAsset: ImageAsset;
  sponsorText: Scalars['String']['output'];
};

export type Field = {
  __typename?: 'Field';
  alternates: Array<PlayerField>;
  features: Array<FeatureItem>;
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  lastUpdated?: Maybe<Scalars['AWSTimestamp']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  players: Array<PlayerField>;
  standingsHeader: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type FieldGroup = {
  __typename?: 'FieldGroup';
  groupId?: Maybe<Scalars['String']['output']>;
  groupTitle: Scalars['String']['output'];
  players: Array<PlayerField>;
};

export type FieldPromoSection = {
  __typename?: 'FieldPromoSection';
  title: Scalars['String']['output'];
  tournamentIds: Array<Scalars['String']['output']>;
};

export type FieldStatCourseFit = {
  __typename?: 'FieldStatCourseFit';
  playerId: Scalars['String']['output'];
  score: Scalars['String']['output'];
  stats: Array<FieldStatCourseFitStat>;
  totalRounds: Scalars['String']['output'];
};

export type FieldStatCourseFitStat = {
  __typename?: 'FieldStatCourseFitStat';
  statColor: StatColor;
  statRank: Scalars['String']['output'];
  statValue: Scalars['String']['output'];
};

export type FieldStatCurrentForm = {
  __typename?: 'FieldStatCurrentForm';
  playerId: Scalars['String']['output'];
  strokesGained: Array<FieldStatStrokesGained>;
  strokesGainedHeader: Array<Scalars['String']['output']>;
  totalRounds: Scalars['String']['output'];
  tournamentResults: Array<FieldStatTournamentResult>;
};

export type FieldStatPlayer = FieldStatCourseFit | FieldStatCurrentForm;

export type FieldStatStrokesGained = {
  __typename?: 'FieldStatStrokesGained';
  statColor: StatColor;
  statId: Scalars['String']['output'];
  statValue: Scalars['String']['output'];
};

export type FieldStatTournamentResult = {
  __typename?: 'FieldStatTournamentResult';
  columnIndex: Scalars['Int']['output'];
  endDate: Scalars['String']['output'];
  name: Scalars['String']['output'];
  position: Scalars['String']['output'];
  score: Scalars['String']['output'];
  season: Scalars['Int']['output'];
  tourCode: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
};

export type FieldStatType =
  | 'COURSE_FIT'
  | 'CURRENT_FORM'
  | 'TOURNAMENT_HISTORY';

export type FieldStats = {
  __typename?: 'FieldStats';
  fieldStatType: FieldStatType;
  players: Array<FieldStatPlayer>;
  statHeaders?: Maybe<Array<Scalars['String']['output']>>;
  tournamentId: Scalars['ID']['output'];
  tournamentSeasonHeaders?: Maybe<Array<SeasonDisplayHeader>>;
};

export type FinishStatValue = {
  __typename?: 'FinishStatValue';
  date: Scalars['Int']['output'];
  displayDate: Scalars['String']['output'];
  displayValue: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type FormatType =
  | 'MATCH_PLAY'
  | 'STABLEFORD'
  | 'STROKE_PLAY'
  | 'TEAM_CUP'
  | 'TEAM_STROKE';

export type Franchise = {
  __typename?: 'Franchise';
  displayName: Scalars['String']['output'];
  queryValue: Scalars['String']['output'];
};

export type FranchisePillConfig = {
  __typename?: 'FranchisePillConfig';
  category?: Maybe<Scalars['String']['output']>;
  franchises: Array<Franchise>;
  rating?: Maybe<Scalars['Int']['output']>;
};

export type FutureVenuesCard = {
  __typename?: 'FutureVenuesCard';
  course?: Maybe<Scalars['String']['output']>;
  coursePhoto?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CallToAction>;
  location?: Maybe<Scalars['String']['output']>;
  venueLink?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type FutureVenuesFragment = {
  __typename?: 'FutureVenuesFragment';
  bottomCta?: Maybe<CallToAction>;
  cards?: Maybe<Array<FutureVenuesCard>>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  topCta?: Maybe<CallToAction>;
};

export type FutureVenuesRow = {
  __typename?: 'FutureVenuesRow';
  /** @deprecated Use beautyImageAsset */
  beautyImage?: Maybe<Scalars['String']['output']>;
  beautyImageAsset?: Maybe<ImageAsset>;
  course?: Maybe<Scalars['String']['output']>;
  eventDates?: Maybe<Scalars['String']['output']>;
  hospitalityLink?: Maybe<Scalars['String']['output']>;
  hospitalityLinkTarget?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  moreInfoDescription?: Maybe<Array<Maybe<NewsArticleNode>>>;
  ticketLink?: Maybe<Scalars['String']['output']>;
  ticketLinkTarget?: Maybe<Scalars['String']['output']>;
  volunteersLink?: Maybe<Scalars['String']['output']>;
  volunteersLinkTarget?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type FutureVenuesTableFragment = {
  __typename?: 'FutureVenuesTableFragment';
  rows: Array<FutureVenuesRow>;
};

export type GenericContent = {
  __typename?: 'GenericContent';
  adConfigNode?: Maybe<Scalars['String']['output']>;
  authorReference?: Maybe<NewsArticleAuthor>;
  datePublished: Scalars['AWSTimestamp']['output'];
  headline: Scalars['String']['output'];
  metadata?: Maybe<NewsArticleMetadata>;
  nodes: Array<NewsArticleNode>;
  path: Scalars['String']['output'];
};

export type GenericContentCompressed = {
  __typename?: 'GenericContentCompressed';
  path: Scalars['String']['output'];
  payload: Scalars['String']['output'];
};

export type GlobalAdConfig = {
  __typename?: 'GlobalAdConfig';
  actRefresh: Scalars['Boolean']['output'];
  adUnitId: Scalars['String']['output'];
  environment: Scalars['String']['output'];
  fluid: Scalars['Boolean']['output'];
  injectAds?: Maybe<Scalars['Boolean']['output']>;
  networkId: Scalars['String']['output'];
  playerSponsorship: Scalars['Boolean']['output'];
  refresh: Scalars['Int']['output'];
  timedRefresh?: Maybe<Scalars['Boolean']['output']>;
};

export type Group = {
  __typename?: 'Group';
  backNine: Scalars['Boolean']['output'];
  courseId?: Maybe<Scalars['String']['output']>;
  courseName?: Maybe<Scalars['String']['output']>;
  groupHole: Scalars['Int']['output'];
  groupLocation: Scalars['String']['output'];
  groupLocationCode: Scalars['String']['output'];
  groupNumber: Scalars['Int']['output'];
  groupSort: Scalars['String']['output'];
  groupStatus: PlayerState;
  holeLocation: Scalars['String']['output'];
  players: Array<Player>;
  showScorecard: Scalars['Boolean']['output'];
  startTee: Scalars['Int']['output'];
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type GroupHoleLocation =
  | 'COMPLETE'
  | 'FAIRWAY'
  | 'GREEN'
  | 'NOT_STARTED'
  | 'TEE'
  | 'UNKNOWN';

export type GroupLocation = {
  __typename?: 'GroupLocation';
  courses: Array<GroupLocationCourse>;
  tournamentId: Scalars['ID']['output'];
};

export type GroupLocationCourse = {
  __typename?: 'GroupLocationCourse';
  courseId: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  holes: Array<GroupLocationHole>;
  round: Scalars['Int']['output'];
  tournamentAndCourseId: Scalars['ID']['output'];
  tournamentId: Scalars['String']['output'];
};

export type GroupLocationData = {
  __typename?: 'GroupLocationData';
  backNinePaceOfPlayTime?: Maybe<Scalars['String']['output']>;
  courseId: Scalars['String']['output'];
  currentHole?: Maybe<Scalars['String']['output']>;
  frontNinePaceOfPlayTime?: Maybe<Scalars['String']['output']>;
  group: Scalars['Int']['output'];
  location: Scalars['String']['output'];
  locationCode: GroupHoleLocation;
  locationSort: Scalars['String']['output'];
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
};

export type GroupLocationGroup = {
  __typename?: 'GroupLocationGroup';
  color?: Maybe<Scalars['String']['output']>;
  groupNum: Scalars['Int']['output'];
  groupSort: Scalars['String']['output'];
  location: GroupHoleLocation;
  playerData?: Maybe<GroupLocationPlayerData>;
  round: Scalars['Int']['output'];
};

export type GroupLocationHole = {
  __typename?: 'GroupLocationHole';
  groups: Array<GroupLocationGroup>;
  holeNumber: Scalars['Int']['output'];
  par: Scalars['Int']['output'];
  yardage: Scalars['Int']['output'];
};

export type GroupLocationPlayerData = {
  __typename?: 'GroupLocationPlayerData';
  addressingBall?: Maybe<Scalars['String']['output']>;
  nextToHit?: Maybe<Scalars['String']['output']>;
};

export type GroupRoundScore = {
  __typename?: 'GroupRoundScore';
  holes: Array<GroupScoreHeader>;
  parTotal: Scalars['Int']['output'];
  players: Array<GroupScorePlayer>;
  totalLabel: Scalars['String']['output'];
};

export type GroupScoreHeader = {
  __typename?: 'GroupScoreHeader';
  holeNumber: Scalars['Int']['output'];
  par: Scalars['Int']['output'];
};

export type GroupScorePlayer = {
  __typename?: 'GroupScorePlayer';
  active: Scalars['Boolean']['output'];
  player: Player;
  roundTotal: Scalars['String']['output'];
  roundTotalHeader: Scalars['String']['output'];
  rowTotal: Scalars['String']['output'];
  scores: Array<SimpleScore>;
};

export type GroupScorecard = {
  __typename?: 'GroupScorecard';
  backNine: Scalars['Boolean']['output'];
  courseId?: Maybe<Scalars['String']['output']>;
  courseName: Scalars['String']['output'];
  currentHole: Scalars['Int']['output'];
  firstNine: GroupRoundScore;
  holeDetail: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  locationDetail: Scalars['String']['output'];
  players: Array<ScorecardHeaderPlayer>;
  roundHeader: Scalars['String']['output'];
  secondNine: GroupRoundScore;
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURL?: Maybe<Scalars['String']['output']>;
};

export type GroupShotDetails = {
  __typename?: 'GroupShotDetails';
  defaultHolePickle: HolePickleType;
  displayType: ShotDetailsDisplayType;
  groupNumber: Scalars['Int']['output'];
  holes: Array<GroupShotDetailsHole>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  players: Array<GroupShotDetailsPlayer>;
  round: Scalars['Int']['output'];
  shotVideo?: Maybe<Video>;
  shotVideos?: Maybe<Array<Video>>;
  tournamentId: Scalars['String']['output'];
};

export type GroupShotDetailsCompressed = {
  __typename?: 'GroupShotDetailsCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type GroupShotDetailsHole = {
  __typename?: 'GroupShotDetailsHole';
  activePlayers: Array<Scalars['String']['output']>;
  displayHoleNumber: Scalars['String']['output'];
  enhancedPickle?: Maybe<HolePickle>;
  fairwayCenter: StrokeCoordinates;
  green: Scalars['Boolean']['output'];
  holeNumber: Scalars['Int']['output'];
  /** @deprecated Use holePickleBottomToTopAsset */
  holePickleBottomToTop: Scalars['String']['output'];
  holePickleBottomToTopAsset: ImageAsset;
  /** @deprecated Use holePickleGreenBottomToTopAsset */
  holePickleGreenBottomToTop: Scalars['String']['output'];
  holePickleGreenBottomToTopAsset: ImageAsset;
  /** @deprecated Use holePickleGreenLeftToRightAsset */
  holePickleGreenLeftToRight: Scalars['String']['output'];
  holePickleGreenLeftToRightAsset: ImageAsset;
  /** @deprecated Use holePickleLeftToRightAsset */
  holePickleLeftToRight: Scalars['String']['output'];
  holePickleLeftToRightAsset: ImageAsset;
  par: Scalars['Int']['output'];
  pinGreen: PointOfInterestCoords;
  pinOverview: PointOfInterestCoords;
  rank?: Maybe<Scalars['String']['output']>;
  strokes: Array<GroupShotDetailsStroke>;
  teeGreen: PointOfInterestCoords;
  teeOverview: PointOfInterestCoords;
  yardage: Scalars['Int']['output'];
};

export type GroupShotDetailsPlayer = {
  __typename?: 'GroupShotDetailsPlayer';
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  lineColor: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
};

export type GroupShotDetailsStroke = {
  __typename?: 'GroupShotDetailsStroke';
  playByPlayLabel: Scalars['String']['output'];
  players: Array<GroupShotDetailsStrokePlayer>;
  strokeNumber: Scalars['Int']['output'];
};

export type GroupShotDetailsStrokePlayer = {
  __typename?: 'GroupShotDetailsStrokePlayer';
  ballPath?: Maybe<BallPath>;
  displayName: Scalars['String']['output'];
  distance: Scalars['String']['output'];
  distanceRemaining: Scalars['String']['output'];
  finalShot: Scalars['Boolean']['output'];
  fromLocation: Scalars['String']['output'];
  fromLocationCode: Scalars['String']['output'];
  green: ShotLinkCoordWrapper;
  markerText: Scalars['String']['output'];
  overview: ShotLinkCoordWrapper;
  playByPlay: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  radarData?: Maybe<RadarData>;
  score: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
  showMarker: Scalars['Boolean']['output'];
  status: HoleScoreStatus;
  strokeType: HoleStrokeType;
  toLocation: Scalars['String']['output'];
  toLocationCode: Scalars['String']['output'];
  videoId?: Maybe<Scalars['String']['output']>;
};

export type GroupShotDetailsTeam = {
  __typename?: 'GroupShotDetailsTeam';
  players?: Maybe<Array<GroupShotDetailsPlayer>>;
  teamId: Scalars['String']['output'];
  teamName: Scalars['String']['output'];
};

export type GroupStageGroup = {
  __typename?: 'GroupStageGroup';
  groupHeader: Scalars['String']['output'];
  groupPlayers: Array<GroupStagePlayer>;
};

export type GroupStageHeader = {
  __typename?: 'GroupStageHeader';
  lost: Scalars['String']['output'];
  player: Scalars['String']['output'];
  points: Scalars['String']['output'];
  tied: Scalars['String']['output'];
  type: HeaderType;
  won: Scalars['String']['output'];
};

export type GroupStagePlayer = {
  __typename?: 'GroupStagePlayer';
  bracketSeed: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  groupRankDisplayText?: Maybe<Scalars['String']['output']>;
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  latestMatchId: Scalars['ID']['output'];
  latestRound: Scalars['Int']['output'];
  playerId: Scalars['ID']['output'];
  playoffWinner: Scalars['Boolean']['output'];
  position: Scalars['String']['output'];
  previousMatches: PreviousMatches;
  record: PlayerRecord;
  shortName: Scalars['String']['output'];
  tournamentSeed: Scalars['String']['output'];
};

export type GroupStageRankings = {
  __typename?: 'GroupStageRankings';
  groupStageHeaders: Array<GroupStageHeader>;
  groups: Array<GroupStageGroup>;
  informationSections: Array<InformationSection>;
  title: Scalars['String']['output'];
  tournamentId: Scalars['ID']['output'];
};

export type GroupV2 = {
  __typename?: 'GroupV2';
  backNine: Scalars['Boolean']['output'];
  courseId?: Maybe<Scalars['String']['output']>;
  courseName?: Maybe<Scalars['String']['output']>;
  groupNumber: Scalars['Int']['output'];
  players: Array<Player>;
  showScorecard: Scalars['Boolean']['output'];
  startTee: Scalars['Int']['output'];
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type GroupedField = {
  __typename?: 'GroupedField';
  alternates: PlayerGroup;
  features: Array<FeatureItem>;
  id: Scalars['ID']['output'];
  lastUpdated?: Maybe<Scalars['AWSTimestamp']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  players: PlayerGroup;
  standingsHeader: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type HeaderType =
  | 'LONG'
  | 'SHORT';

export type HeroCarousel = {
  __typename?: 'HeroCarousel';
  displayInline: Scalars['Boolean']['output'];
  slides: Array<HeroCarouselItem>;
};

export type HeroCarouselItem = {
  __typename?: 'HeroCarouselItem';
  articleContent?: Maybe<NewsArticle>;
  autoplay?: Maybe<Scalars['Boolean']['output']>;
  cta1?: Maybe<CallToAction>;
  cta2?: Maybe<CallToAction>;
  heroImage?: Maybe<Scalars['String']['output']>;
  slideHeadline?: Maybe<Scalars['String']['output']>;
  slideSubhead?: Maybe<Scalars['String']['output']>;
  videoContent?: Maybe<Video>;
};

export type HistoricalLeaderboard = {
  __typename?: 'HistoricalLeaderboard';
  additionalDataHeaders: Array<Scalars['String']['output']>;
  availableSeasons: Array<StatYearPills>;
  id: Scalars['ID']['output'];
  players: Array<HistoricalLeaderboardRow>;
  recap?: Maybe<WeatherNotes>;
  rounds: Array<Scalars['String']['output']>;
  teams?: Maybe<Array<Maybe<HistoricalLeaderboardTeamRow>>>;
  tournamentResultsMessage?: Maybe<TournamentResultsMessage>;
  winner?: Maybe<Winner>;
  winningTeam?: Maybe<Array<Maybe<Winner>>>;
};

export type HistoricalLeaderboardRow = {
  __typename?: 'HistoricalLeaderboardRow';
  additionalData: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  parRelativeScore: Scalars['String']['output'];
  player: Player;
  position: Scalars['String']['output'];
  rounds: Array<HistoricalRoundScore>;
  total: Scalars['String']['output'];
};

export type HistoricalLeaderboardTeamRow = {
  __typename?: 'HistoricalLeaderboardTeamRow';
  additionalData: Array<Scalars['String']['output']>;
  parRelativeScore: Scalars['String']['output'];
  players: Array<Player>;
  position: Scalars['String']['output'];
  rounds?: Maybe<Array<HistoricalRoundScore>>;
  teamId: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type HistoricalOddsId =
  | 'TOP_RANKED_3'
  | 'TOP_RANKED_5'
  | 'TOP_RANKED_10'
  | 'TOP_RANKED_20'
  | 'WINNER';

export type HistoricalPlayerOdds = {
  __typename?: 'HistoricalPlayerOdds';
  marketName: Scalars['String']['output'];
  message?: Maybe<OddsMessage>;
  odds: Scalars['String']['output'];
  oddsSwing: OddsSwing;
  optionId: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  season: Scalars['Int']['output'];
  timeStamp: Scalars['AWSTimestamp']['output'];
  tournamentId: Scalars['String']['output'];
};

export type HistoricalPlayerScorecards = {
  __typename?: 'HistoricalPlayerScorecards';
  playerId: Scalars['ID']['output'];
  tours: Array<HistoricalScorecardTour>;
};

export type HistoricalRoundScore = {
  __typename?: 'HistoricalRoundScore';
  parRelativeScore: Scalars['String']['output'];
  score: Scalars['String']['output'];
};

export type HistoricalScorecardTour = {
  __typename?: 'HistoricalScorecardTour';
  tourCode: TourCode;
  years: Array<HistoricalScorecardYear>;
};

export type HistoricalScorecardYear = {
  __typename?: 'HistoricalScorecardYear';
  displayYear: Scalars['String']['output'];
  tournamentPills: Array<StatTournamentPill>;
  year: Scalars['Int']['output'];
};

/**
 *   End
 *  Market Abstractions
 */
export type HistoricalTournamentOdds = {
  __typename?: 'HistoricalTournamentOdds';
  id: Scalars['ID']['output'];
  market?: Maybe<Market>;
  message?: Maybe<OddsMessage>;
  /**   tournamentId-provider */
  provider: OddsProvider;
  tournamentId: Scalars['String']['output'];
};

export type HistoricalTournamentOddsArgs = {
  __typename?: 'HistoricalTournamentOddsArgs';
  marketId: OddsMarketType;
  timeStamp?: Maybe<Scalars['AWSDateTime']['output']>;
  tournamentId: Scalars['String']['output'];
};

export type HistoryInfo = {
  __typename?: 'HistoryInfo';
  contentCarousel: Array<Maybe<ContentCarousel>>;
  cta?: Maybe<CallToAction>;
  displayCta?: Maybe<Scalars['Boolean']['output']>;
  europeCaptain?: Maybe<Scalars['String']['output']>;
  infoText?: Maybe<Array<Maybe<NewsArticleNode>>>;
  usCaptain?: Maybe<Scalars['String']['output']>;
};

export type HistoryScore = {
  __typename?: 'HistoryScore';
  bottomCta?: Maybe<CallToAction>;
  leftFlagIcon?: Maybe<Scalars['String']['output']>;
  leftScore?: Maybe<Scalars['String']['output']>;
  leftTeam?: Maybe<Scalars['String']['output']>;
  rightFlagIcon?: Maybe<Scalars['String']['output']>;
  rightScore?: Maybe<Scalars['String']['output']>;
  rightTeam?: Maybe<Scalars['String']['output']>;
  sectionSubhead: Scalars['String']['output'];
  sectionTitle: Scalars['String']['output'];
  topCta?: Maybe<CallToAction>;
  trophyIcon?: Maybe<Scalars['String']['output']>;
};

export type HoleDetail = {
  __typename?: 'HoleDetail';
  courseId: Scalars['String']['output'];
  holeImage: Scalars['String']['output'];
  holeImageLandscape: Scalars['String']['output'];
  holeInfo: HoleDetailInfo;
  holeNum: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  rounds: Array<HoleDetailRound>;
  statsAvailability: HoleDetailsAvailability;
  statsSummary: HoleStatSummary;
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
};

export type HoleDetailInfo = {
  __typename?: 'HoleDetailInfo';
  aboutThisHole: Scalars['String']['output'];
  /** @deprecated Use holePickleGreenLeftToRightAsset */
  greenPickle: Scalars['String']['output'];
  holeNum: Scalars['Int']['output'];
  /** @deprecated Use holePickleLeftToRightAsset */
  holePickle: Scalars['String']['output'];
  /** @deprecated Use holePickleBottomToTopAsset */
  holePickleBottomToTop: Scalars['String']['output'];
  holePickleBottomToTopAsset: ImageAsset;
  /** @deprecated Use holePickleGreenBottomToTopAsset */
  holePickleGreenBottomToTop: Scalars['String']['output'];
  holePickleGreenBottomToTopAsset: ImageAsset;
  holePickleGreenLeftToRightAsset: ImageAsset;
  holePickleLeftToRightAsset: ImageAsset;
  par: Scalars['Int']['output'];
  pinGreen: PointOfInterestCoords;
  rank?: Maybe<Scalars['Int']['output']>;
  rounds?: Maybe<Scalars['Int']['output']>;
  scoringAverageDiff: Scalars['String']['output'];
  yards: Scalars['Int']['output'];
};

export type HoleDetailRound = {
  __typename?: 'HoleDetailRound';
  groups: Array<HoleGroup>;
  matches?: Maybe<Array<HoleMatch>>;
  roundNum: Scalars['Int']['output'];
  teamGroups?: Maybe<Array<TeamHoleGroups>>;
};

export type HoleDetailsAvailability =
  | 'NONE'
  | 'SHOT_DETAILS'
  | 'STATS';

export type HoleGroup = {
  __typename?: 'HoleGroup';
  groupLocation: Scalars['String']['output'];
  groupLocationCode: Scalars['String']['output'];
  groupNumber: Scalars['Int']['output'];
  players: Array<HoleGroupPlayer>;
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type HoleGroupPlayer = {
  __typename?: 'HoleGroupPlayer';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  position: Scalars['String']['output'];
  roundScore: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type HoleGroupTeam = {
  __typename?: 'HoleGroupTeam';
  players: Array<HoleGroupPlayer>;
};

export type HoleHeader = {
  __typename?: 'HoleHeader';
  hole: Scalars['String']['output'];
  holeNumber: Scalars['Int']['output'];
  par: Scalars['String']['output'];
};

export type HoleHeaderV2 = {
  __typename?: 'HoleHeaderV2';
  displayValue: Scalars['String']['output'];
  holeNumber?: Maybe<Scalars['Int']['output']>;
  order: Scalars['Int']['output'];
  par: Scalars['String']['output'];
};

export type HoleMatch = {
  __typename?: 'HoleMatch';
  groupName?: Maybe<Scalars['String']['output']>;
  match?: Maybe<MpLeaderboardMatch>;
  matchLocation: Scalars['String']['output'];
  matchLocationCode: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type HolePickle = {
  __typename?: 'HolePickle';
  bottomToTop: Scalars['String']['output'];
  bottomToTopAsset: ImageAsset;
  greenBottomToTop: Scalars['String']['output'];
  greenBottomToTopAsset: ImageAsset;
  greenLeftToRight: Scalars['String']['output'];
  greenLeftToRightAsset: ImageAsset;
  leftToRight: Scalars['String']['output'];
  leftToRightAsset: ImageAsset;
};

export type HolePickleType =
  | 'STANDARD'
  | 'TOURCAST_2D';

export type HolePlayedStatus =
  | 'PLAYED'
  | 'UNPLAYED';

export type HoleScore = {
  __typename?: 'HoleScore';
  holeNumber: Scalars['Int']['output'];
  par: Scalars['Int']['output'];
  roundScore: Scalars['String']['output'];
  score: Scalars['String']['output'];
  sequenceNumber: Scalars['Int']['output'];
  status: HoleScoreStatus;
  yardage: Scalars['Int']['output'];
};

export type HoleScoreStatus =
  | 'BIRDIE'
  | 'BOGEY'
  | 'CONCEDED'
  | 'DOUBLE_BOGEY'
  | 'EAGLE'
  | 'NONE'
  | 'PAR';

export type HoleStat = CourseHoleStats | SummaryRow;

export type HoleStatSummary = {
  __typename?: 'HoleStatSummary';
  birdies?: Maybe<Scalars['Int']['output']>;
  birdiesPercent: Scalars['String']['output'];
  bogeys?: Maybe<Scalars['Int']['output']>;
  bogeysPercent: Scalars['String']['output'];
  courseId: Scalars['String']['output'];
  doubleBogeys?: Maybe<Scalars['Int']['output']>;
  doubleBogeysPercent: Scalars['String']['output'];
  eagles?: Maybe<Scalars['Int']['output']>;
  eaglesPercent: Scalars['String']['output'];
  holeNum: Scalars['Int']['output'];
  pars?: Maybe<Scalars['Int']['output']>;
  parsPercent: Scalars['String']['output'];
  scoringAverage?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
};

export type HoleStroke = {
  __typename?: 'HoleStroke';
  ballPath?: Maybe<BallPath>;
  distance: Scalars['String']['output'];
  distanceRemaining: Scalars['String']['output'];
  finalStroke: Scalars['Boolean']['output'];
  fromLocation: Scalars['String']['output'];
  fromLocationCode: Scalars['String']['output'];
  green: ShotLinkCoordWrapper;
  groupShowMarker: Scalars['Boolean']['output'];
  markerText: Scalars['String']['output'];
  overview: ShotLinkCoordWrapper;
  playByPlay: Scalars['String']['output'];
  playByPlayLabel: Scalars['String']['output'];
  player?: Maybe<TspStrokePlayer>;
  radarData?: Maybe<RadarData>;
  showMarker: Scalars['Boolean']['output'];
  strokeNumber: Scalars['Int']['output'];
  strokeType: HoleStrokeType;
  toLocation: Scalars['String']['output'];
  toLocationCode: Scalars['String']['output'];
  videoId?: Maybe<Scalars['String']['output']>;
};

export type HoleStrokeType =
  | 'DROP'
  | 'PENALTY'
  | 'PROVISIONAL'
  | 'STROKE';

export type HoleStrokeV4 = {
  __typename?: 'HoleStrokeV4';
  ballPath?: Maybe<BallPath>;
  distance: Scalars['String']['output'];
  distanceRemaining: Scalars['String']['output'];
  finalStroke: Scalars['Boolean']['output'];
  fromLocation: Scalars['String']['output'];
  fromLocationCode: Scalars['String']['output'];
  green: ShotLinkCoordWrapperV4;
  groupShowMarker: Scalars['Boolean']['output'];
  markerText: Scalars['String']['output'];
  overview: ShotLinkCoordWrapperV4;
  playByPlay: Scalars['String']['output'];
  playByPlayLabel: Scalars['String']['output'];
  player?: Maybe<TspStrokePlayer>;
  radarData?: Maybe<RadarData>;
  showMarker: Scalars['Boolean']['output'];
  strokeNumber: Scalars['Int']['output'];
  strokeType: HoleStrokeType;
  toLocation: Scalars['String']['output'];
  toLocationCode: Scalars['String']['output'];
  videoId?: Maybe<Scalars['String']['output']>;
};

export type HomePageLeadLayout =
  | 'HALF_HERO'
  | 'HALF_HERO_STACK'
  | 'HERO_STATUS'
  | 'HERO_STORY'
  | 'PLAYER_STORIES'
  | 'TOPIC_STORIES';

export type HomePageNewsLayout =
  | 'THREE_UP_ASSET'
  | 'TWO_UP_LARGE'
  | 'TWO_UP_SMALL'
  | 'TWO_UP_TEXT_ONLY';

export type HomePageProgramStandingLayout =
  | 'FIELD_PROMO_SECTION'
  | 'NORMAL'
  | 'SHORT'
  | 'SIGNATURE_EVENT_STANDINGS'
  | 'TWO_STANDINGS';

export type HomePageStanding = {
  __typename?: 'HomePageStanding';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  image: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  stats: Array<ProgramStat>;
};

export type Homepage = {
  __typename?: 'Homepage';
  fragments: Array<HomepageFragment>;
};

export type HomepageAssets = NewsArticle | Video;

export type HomepageCta = {
  __typename?: 'HomepageCta';
  link: Scalars['String']['output'];
  text: Scalars['String']['output'];
  topText: Scalars['String']['output'];
};

export type HomepageFragment = HomepageLead | HomepageNews | HomepageProgramStanding | MediaGallery | OddsToWinTracker | ThreeUpPhoto;

export type HomepageLead = {
  __typename?: 'HomepageLead';
  ambientVideo?: Maybe<Video>;
  content: Array<HomepageAssets>;
  cta?: Maybe<HomepageCta>;
  displayDateTime?: Maybe<Scalars['Boolean']['output']>;
  displayPlayerPromoStats?: Maybe<Scalars['Boolean']['output']>;
  halfHeroShortHeadline?: Maybe<Scalars['Boolean']['output']>;
  headlineColor?: Maybe<Scalars['String']['output']>;
  headlineJustification?: Maybe<Scalars['String']['output']>;
  headshot?: Maybe<ProfileHeadshot>;
  leadLayout: HomePageLeadLayout;
  location?: Maybe<TournamentLocation>;
  photoJustification?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['String']['output'];
  playerScore?: Maybe<HomepagePlayerScore>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  topStats?: Maybe<Array<Maybe<PlayerProfileStatItem>>>;
  topicLabel?: Maybe<Scalars['String']['output']>;
  weather?: Maybe<TournamentWeather>;
};

export type HomepageNews = {
  __typename?: 'HomepageNews';
  content: Array<HomepageAssets>;
  cta?: Maybe<HomepageCta>;
  displayDateTime?: Maybe<Scalars['Boolean']['output']>;
  franchises: Array<Scalars['String']['output']>;
  limit: Scalars['String']['output'];
  newsLayout: HomePageNewsLayout;
  title: Scalars['String']['output'];
};

export type HomepagePlayerScore = {
  __typename?: 'HomepagePlayerScore';
  playerId: Scalars['ID']['output'];
  round: Scalars['String']['output'];
  roundScore: Scalars['String']['output'];
  score: Scalars['String']['output'];
  total?: Maybe<Scalars['String']['output']>;
};

export type HomepageProgramStanding = {
  __typename?: 'HomepageProgramStanding';
  backgroundImg?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<HomepageCta>;
  lastProcessed?: Maybe<Scalars['String']['output']>;
  pullFieldUpdates?: Maybe<Scalars['Boolean']['output']>;
  secondaryStandings?: Maybe<Array<Maybe<HomePageStanding>>>;
  secondaryStandingsTitle?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use sponsorImgAsset */
  sponsorImg?: Maybe<Scalars['String']['output']>;
  sponsorImgAsset?: Maybe<ImageAsset>;
  standingLayout: HomePageProgramStandingLayout;
  standings?: Maybe<Array<Maybe<HomePageStanding>>>;
  standingsTitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type HomepageScoring = {
  __typename?: 'HomepageScoring';
  desktopCta?: Maybe<CallToAction>;
  path: Scalars['String']['output'];
  pillCta?: Maybe<CallToAction>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  tournamentId?: Maybe<Scalars['String']['output']>;
};

export type HospitalityCard = {
  __typename?: 'HospitalityCard';
  blueBackground: Scalars['Boolean']['output'];
  cardDescription?: Maybe<Array<Maybe<NewsArticleNode>>>;
  cardPhoto?: Maybe<Scalars['String']['output']>;
  cardTitle?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CallToAction>;
  cta2?: Maybe<CallToAction>;
  photoSubtitle?: Maybe<Scalars['String']['output']>;
};

export type Icon =
  | 'AMATEUR'
  | 'BACKNINE'
  | 'CUSTOM_ICON'
  | 'DISQUALIFIED'
  | 'FAVORITES'
  | 'HOT_STREAK'
  | 'LIVE'
  | 'ODDS_IMPROVED'
  | 'ODDS_WORSENED'
  | 'PLAYOFF_WIN'
  | 'PREVIOUSROUND'
  | 'SPONSOR'
  | 'SUDDEN_DEATH'
  | 'TOP_FEDEX_FALL_PLAYER'
  | 'TOUR_BOUND'
  | 'UPCOMING'
  | 'WITHDRAW';

export type Image = {
  __typename?: 'Image';
  imageCreator?: Maybe<Scalars['String']['output']>;
  imageDescription?: Maybe<Scalars['String']['output']>;
  imageOrientation?: Maybe<Orientation>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ImageAsset = {
  __typename?: 'ImageAsset';
  assetType?: Maybe<Scalars['String']['output']>;
  /**   will always be image */
  deliveryType?: Maybe<Scalars['String']['output']>;
  /**   either "upload" or "fetch" */
  fallbackImage?: Maybe<Scalars['String']['output']>;
  imageOrg: Scalars['String']['output'];
  imagePath: Scalars['String']['output'];
};

export type ImageBlock = {
  __typename?: 'ImageBlock';
  backgroundImage?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CallToAction>;
  textNodes?: Maybe<Array<Maybe<NewsArticleNode>>>;
};

export type InformationData = {
  __typename?: 'InformationData';
  detail?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  secondaryDetail?: Maybe<Scalars['String']['output']>;
  smallCopy?: Maybe<Scalars['Boolean']['output']>;
  value: Scalars['String']['output'];
  wide?: Maybe<Scalars['Boolean']['output']>;
};

export type InformationRow = {
  __typename?: 'InformationRow';
  displayText: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  leaderboardSortOrder: Scalars['Int']['output'];
  mobileDisplayText: Scalars['String']['output'];
  sponsorLogo?: Maybe<ImageAsset>;
  sponsorName?: Maybe<Scalars['String']['output']>;
};

export type InformationSection = {
  __typename?: 'InformationSection';
  items: Array<InformationSectionItem>;
  sponsorImages?: Maybe<Array<SponsorImage>>;
  title: Scalars['String']['output'];
};

export type InformationSectionItem = Abbreviations | Legend;

export type IntegratedComponent = {
  __typename?: 'IntegratedComponent';
  index: Scalars['Int']['output'];
  partner: IntegrationPartner;
};

export type IntegrationPartner =
  | 'GOLFWRX';

export type JumpToSection = {
  __typename?: 'JumpToSection';
  anchorHtmlId?: Maybe<Array<Scalars['String']['output']>>;
  dropdownText?: Maybe<Array<Scalars['String']['output']>>;
};

export type KopContentType = NewsArticleHeader | NewsArticleImage | NewsArticleLineBreak | NewsArticleLink | NewsArticleParagraph | NewsArticleText | TableFragment | UnorderedListNode;

export type KitOfParts = {
  __typename?: 'KitOfParts';
  fragments: Array<KopFragment>;
};

export type KopFragment = BrazeFragment | HomepageNews | KopHeader | KopSignUp | KopStandingsList | KopSubheader | KopUpcomingTournament | KopUserProfile | KopZigZag | ThreeUpPhoto | ThreeUpStats | TwoColumn | VideoHero;

export type KopHeader = {
  __typename?: 'KopHeader';
  cta?: Maybe<CallToAction>;
  headerTitle: Scalars['String']['output'];
  headlineColor?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  opacity?: Maybe<Scalars['String']['output']>;
  titleJustification?: Maybe<Scalars['String']['output']>;
};

export type KopSignUp = {
  __typename?: 'KopSignUp';
  backgroundColor?: Maybe<Scalars['String']['output']>;
  backgroundImage?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CallToAction>;
  ctaColor?: Maybe<Scalars['String']['output']>;
  header?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  signUpText?: Maybe<Scalars['String']['output']>;
  textColor?: Maybe<Scalars['String']['output']>;
};

export type KopStandingsList = {
  __typename?: 'KopStandingsList';
  cta?: Maybe<CallToAction>;
  sectionTitle: Scalars['String']['output'];
  standings?: Maybe<Array<Maybe<HomePageStanding>>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type KopSubheader = {
  __typename?: 'KopSubheader';
  cta?: Maybe<CallToAction>;
  darkMobileImage?: Maybe<Scalars['String']['output']>;
  displayCta?: Maybe<Scalars['Boolean']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  mobileImage?: Maybe<Scalars['String']['output']>;
  subHeaderText?: Maybe<Array<Maybe<NewsArticleNode>>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type KopUpcomingTournament = {
  __typename?: 'KopUpcomingTournament';
  title: Scalars['String']['output'];
};

export type KopUserProfile = {
  __typename?: 'KopUserProfile';
  displayUserProfile?: Maybe<Scalars['Boolean']['output']>;
};

export type KopZigZag = {
  __typename?: 'KopZigZag';
  backgroundColorOne?: Maybe<Scalars['String']['output']>;
  backgroundColorTwo?: Maybe<Scalars['String']['output']>;
  ctaOne?: Maybe<CallToAction>;
  ctaTwo?: Maybe<CallToAction>;
  descriptionBackgroundColorOne?: Maybe<Scalars['String']['output']>;
  descriptionBackgroundColorTwo?: Maybe<Scalars['String']['output']>;
  descriptionOne?: Maybe<Array<Maybe<NewsArticleNode>>>;
  descriptionTwo?: Maybe<Array<Maybe<NewsArticleNode>>>;
  imageOne?: Maybe<Scalars['String']['output']>;
  imageTwo?: Maybe<Scalars['String']['output']>;
  subHeader?: Maybe<Scalars['String']['output']>;
  zigZaHeader: Scalars['String']['output'];
};

export type LbRound = {
  __typename?: 'LBRound';
  displayText: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
};

export type LandingPageImageBlock = {
  __typename?: 'LandingPageImageBlock';
  consentCategory?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CallToAction>;
  deniedConsent: Scalars['Boolean']['output'];
  image?: Maybe<Scalars['String']['output']>;
  imageDark?: Maybe<Scalars['String']['output']>;
  locationFallback: Scalars['Boolean']['output'];
  mobileImage?: Maybe<Scalars['String']['output']>;
  subTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type LeaderStat = {
  __typename?: 'LeaderStat';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  statId: Scalars['String']['output'];
  statTitle: Scalars['String']['output'];
  statValue: Scalars['String']['output'];
};

export type LeaderboardCompressed = {
  __typename?: 'LeaderboardCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type LeaderboardCompressedV2 = {
  __typename?: 'LeaderboardCompressedV2';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

/**   Returns the leaderboard for a tournament where payload contains the leaderboard data in Base64 encoding. */
export type LeaderboardCompressedV3 = {
  __typename?: 'LeaderboardCompressedV3';
  /**   The tournament ID */
  id: Scalars['ID']['output'];
  /**   The full leaderboard payload/response. Will need to be Base64 decoded by clients */
  payload: Scalars['String']['output'];
};

export type LeaderboardDrawerV2 = {
  __typename?: 'LeaderboardDrawerV2';
  backNine: Scalars['Boolean']['output'];
  currentHole?: Maybe<Scalars['Int']['output']>;
  currentRound: Scalars['Int']['output'];
  groupNumber: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  player: Player;
  playerState?: Maybe<PlayerState>;
  roundScores: Array<RoundScore>;
  teeTime: Scalars['AWSTimestamp']['output'];
  tournamentName: Scalars['String']['output'];
};

export type LeaderboardFeature =
  | 'HOLE_BY_HOLE'
  | 'ODDS'
  | 'PROBABILITIES'
  | 'SHOT_DETAILS'
  | 'STROKES_GAINED';

export type LeaderboardHoleByHole = {
  __typename?: 'LeaderboardHoleByHole';
  courseHoleHeaders: Array<CourseHoleHeader>;
  courses: Array<Course>;
  currentRound: Scalars['Int']['output'];
  /** @deprecated use courseHoleHeaders */
  holeHeaders: Array<HoleHeader>;
  playerData: Array<PlayerRowHoleByHole>;
  rounds: Array<LbRound>;
  tournamentId: Scalars['ID']['output'];
  tournamentName: Scalars['String']['output'];
};

export type LeaderboardInfo = {
  __typename?: 'LeaderboardInfo';
  /** @deprecated can ignore, we remove sponship in MW */
  disableCdw: Scalars['Boolean']['output'];
  informationSections: Array<InformationSection>;
  odds: Scalars['Boolean']['output'];
  tournamentId: Scalars['ID']['output'];
};

export type LeaderboardMessage = {
  __typename?: 'LeaderboardMessage';
  externalLink?: Maybe<Scalars['Boolean']['output']>;
  messageIcon: LeaderboardMessageIcon;
  messageLink?: Maybe<Scalars['String']['output']>;
  messageText: Scalars['String']['output'];
  platforms: Array<Platform>;
  timing?: Maybe<Scalars['Int']['output']>;
  webViewLink?: Maybe<Scalars['String']['output']>;
};

export type LeaderboardMessageIcon =
  | 'DELAY'
  | 'NONE'
  | 'WEATHER';

export type LeaderboardMovement =
  | 'CONSTANT'
  | 'DOWN'
  | 'UP';

export type LeaderboardOddsSwing = {
  __typename?: 'LeaderboardOddsSwing';
  swing: OddsSwing;
};

/**   new enum of possible player icon values, limited to hot streak at first creation */
export type LeaderboardPlayerIcon =
  | 'HOT_STREAK';

export type LeaderboardRoundStats = {
  __typename?: 'LeaderboardRoundStats';
  players: Array<LeaderboardStatsPlayer>;
  roundDisplayText: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
};

export type LeaderboardRowV2 = InformationRow | PlayerRowV2;

export type LeaderboardRowV3 = InformationRow | PlayerRowV3;

export type LeaderboardScoringDataV3 = {
  __typename?: 'LeaderboardScoringDataV3';
  backNine: Scalars['Boolean']['output'];
  /**   COURSE */
  courseId: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  /**   LOCATION */
  groupNumber: Scalars['Int']['output'];
  /**   PLAYER STORIES */
  hasStoryContent: Scalars['Boolean']['output'];
  movementAmount: Scalars['String']['output'];
  movementDirection: LeaderboardMovement;
  movementSort?: Maybe<Scalars['Int']['output']>;
  oddsOptionId?: Maybe<Scalars['String']['output']>;
  oddsSort?: Maybe<Scalars['Float']['output']>;
  oddsSwing?: Maybe<OddsSwing>;
  /**   ODDS */
  oddsToWin?: Maybe<Scalars['String']['output']>;
  /**   POINTS */
  official: Scalars['String']['output'];
  officialSort: Scalars['Int']['output'];
  /**   Player icon, first us is for hot streak */
  playerIcon?: Maybe<LeaderboardPlayerIcon>;
  playerState: PlayerState;
  position: Scalars['String']['output'];
  projected: Scalars['String']['output'];
  projectedSort: Scalars['Int']['output'];
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  rankingMovement: CupRankMovementDirection;
  rankingMovementAmount: Scalars['String']['output'];
  rankingMovementAmountSort: Scalars['Int']['output'];
  roundDisplaySort?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  roundHeader: Scalars['String']['output'];
  roundStatus: Scalars['String']['output'];
  rounds: Array<Scalars['String']['output']>;
  score: Scalars['String']['output'];
  scoreSort: Scalars['Int']['output'];
  storyContentRound?: Maybe<Scalars['Int']['output']>;
  storyContentRounds: Array<Scalars['Int']['output']>;
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  thru: Scalars['String']['output'];
  thruSort: Scalars['Int']['output'];
  tooltipText?: Maybe<Scalars['String']['output']>;
  tooltipTitle?: Maybe<Scalars['String']['output']>;
  total: Scalars['String']['output'];
  totalSort: Scalars['Int']['output'];
  /**
   *   null to hide value
   *  SCORING
   */
  totalStrokes: Scalars['String']['output'];
  totalStrokesSort?: Maybe<Scalars['Int']['output']>;
};

export type LeaderboardStatItem = {
  __typename?: 'LeaderboardStatItem';
  color: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  sortValue: Scalars['Float']['output'];
  statId: Scalars['String']['output'];
  supportValues?: Maybe<Array<LeaderboardStatSupportValues>>;
  value: Scalars['String']['output'];
};

export type LeaderboardStatSupportValues = LeaderboardOddsSwing | LeaderboardSupportingString;

export type LeaderboardStats = {
  __typename?: 'LeaderboardStats';
  id: Scalars['String']['output'];
  players: Array<LeaderboardStatsPlayer>;
  rounds?: Maybe<Array<LeaderboardRoundStats>>;
  statIds?: Maybe<Array<Scalars['String']['output']>>;
  titles: Array<Scalars['String']['output']>;
  type: LeaderboardStatsType;
};

export type LeaderboardStatsPlayer = {
  __typename?: 'LeaderboardStatsPlayer';
  playerId: Scalars['String']['output'];
  stats: Array<LeaderboardStatItem>;
};

export type LeaderboardStatsType =
  | 'ODDS'
  | 'PROBABILITY'
  | 'STROKES_GAINED';

export type LeaderboardStroke = {
  __typename?: 'LeaderboardStroke';
  currentHole: Scalars['Int']['output'];
  currentHoleDisplay: Scalars['String']['output'];
  currentHoleValueDisplay: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  currentShot: Scalars['Int']['output'];
  currentShotDisplay: Scalars['String']['output'];
  finalStroke: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  par: Scalars['String']['output'];
  parSort: Scalars['Int']['output'];
  playByPlay: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  playoffHole: Scalars['Int']['output'];
  playoffHoleDisplay: Scalars['String']['output'];
  scoreStatus: HoleScoreStatus;
  strokeId: Scalars['String']['output'];
  yardage: Scalars['String']['output'];
  yardageSort: Scalars['Int']['output'];
};

export type LeaderboardStrokes = {
  __typename?: 'LeaderboardStrokes';
  id: Scalars['ID']['output'];
  playoffs?: Maybe<Array<LeaderboardStroke>>;
  strokes: Array<LeaderboardStroke>;
};

export type LeaderboardStrokesCompressed = {
  __typename?: 'LeaderboardStrokesCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type LeaderboardSupportingString = {
  __typename?: 'LeaderboardSupportingString';
  data: Scalars['String']['output'];
};

export type LeaderboardUpdateCompressed = {
  __typename?: 'LeaderboardUpdateCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type LeaderboardUpdateCompressedV3 = {
  __typename?: 'LeaderboardUpdateCompressedV3';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type LeaderboardUpdatePlayerV3 = {
  __typename?: 'LeaderboardUpdatePlayerV3';
  id: Scalars['ID']['output'];
  leaderboardSortOrder: Scalars['Int']['output'];
  scoringData: LeaderboardScoringDataV3;
};

export type LeaderboardUpdateRowV3 = InformationRow | LeaderboardUpdatePlayerV3;

export type LeaderboardUpdateV3 = {
  __typename?: 'LeaderboardUpdateV3';
  cutLineProbabilities?: Maybe<CutLineInfo>;
  id: Scalars['ID']['output'];
  isPlayoffActive: Scalars['Boolean']['output'];
  leaderboardRoundHeader: Scalars['String']['output'];
  messages: Array<LeaderboardMessage>;
  players: Array<LeaderboardUpdateRowV3>;
  rounds: Array<LbRound>;
  subEvent: Scalars['Boolean']['output'];
  tournamentStatus: TournamentStatus;
  winner?: Maybe<Winner>;
  winners?: Maybe<Array<Winner>>;
};

export type LeaderboardV2 = {
  __typename?: 'LeaderboardV2';
  courses: Array<Course>;
  disableLeaderboard: Scalars['Boolean']['output'];
  /** @deprecated use leaderboardFeatures */
  features?: Maybe<Array<LeaderboardFeature>>;
  formatType: FormatType;
  id: Scalars['ID']['output'];
  /** @deprecated Use the leaderboard legend query */
  informationSections: Array<InformationSection>;
  isPlayoffActive: Scalars['Boolean']['output'];
  leaderboardFeatures?: Maybe<Array<FeatureItem>>;
  leaderboardRoundHeader: Scalars['String']['output'];
  messages: Array<LeaderboardMessage>;
  players: Array<LeaderboardRowV2>;
  profileEnabled: Scalars['Boolean']['output'];
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
  rounds: Array<LbRound>;
  scorecardEnabled: Scalars['Boolean']['output'];
  standingsEnabled: Scalars['Boolean']['output'];
  standingsHeader: Scalars['String']['output'];
  subEvent: Scalars['Boolean']['output'];
  timezone: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentStatus: TournamentStatus;
  winner?: Maybe<Winner>;
};

export type LeaderboardV3 = {
  __typename?: 'LeaderboardV3';
  bubblePill?: Maybe<BubblePill>;
  courses: Array<Course>;
  cutLineProbabilities?: Maybe<CutLineInfo>;
  disableBettingProfileColumn: Scalars['Boolean']['output'];
  disableLeaderboard: Scalars['Boolean']['output'];
  disableOdds: Scalars['Boolean']['output'];
  formatType: FormatType;
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isPlayoffActive: Scalars['Boolean']['output'];
  leaderboardFeatures?: Maybe<Array<FeatureItem>>;
  leaderboardRoundHeader: Scalars['String']['output'];
  messages: Array<LeaderboardMessage>;
  players: Array<LeaderboardRowV3>;
  profileEnabled: Scalars['Boolean']['output'];
  rounds: Array<LbRound>;
  scorecardEnabled: Scalars['Boolean']['output'];
  standingsEnabled: Scalars['Boolean']['output'];
  standingsHeader: Scalars['String']['output'];
  subEvent: Scalars['Boolean']['output'];
  timezone: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['String']['output'];
  tournamentStatus: TournamentStatus;
  /** @deprecated use winners */
  winner?: Maybe<Winner>;
  winners?: Maybe<Array<Winner>>;
};

export type Legend = {
  __typename?: 'Legend';
  accessibilityText?: Maybe<Scalars['String']['output']>;
  icon: Icon;
  iconUrl?: Maybe<Scalars['String']['output']>;
  subText?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type ListItem = {
  __typename?: 'ListItem';
  segments: Array<Maybe<ListNodeItems>>;
};

export type ListNodeItems = NewsArticleContentSegment | NewsArticleParagraph | NewsArticlePlayerTournamentOdds | UnorderedListNode;

export type LiveOverride =
  | 'FORCE_OFF'
  | 'FORCE_ON'
  | 'NORMAL';

export type LiveStatus =
  | 'LIVE'
  | 'NONE'
  | 'UPCOMING';

export type LiveVideoOverride = {
  __typename?: 'LiveVideoOverride';
  simulcast?: Maybe<BroadcastFullTelecast>;
  tourCode: TourCode;
  videos: Array<Video>;
};

export type MpHolePlayer = {
  __typename?: 'MPHolePlayer';
  holePoints?: Maybe<Scalars['String']['output']>;
  holeScore?: Maybe<Scalars['String']['output']>;
  /**   used for four ball type scoring */
  holeScoreStatus?: Maybe<HoleScoreStatus>;
  holeScores?: Maybe<Array<MatchHoleScore>>;
  playerId: Scalars['ID']['output'];
};

export type MpLeaderboard = {
  __typename?: 'MPLeaderboard';
  courses: Array<Course>;
  currentRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  formatType: FormatType;
  id: Scalars['ID']['output'];
  infoWebUrl: Scalars['String']['output'];
  informationSections: Array<InformationSection>;
  messages: Array<LeaderboardMessage>;
  roundFilters: Array<RoundFilter>;
  rounds: Array<MpLeaderboardRound>;
  shortTimezone: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrlWeb?: Maybe<Scalars['String']['output']>;
  winner?: Maybe<MpLeaderboardPlayer>;
};

export type MpLeaderboardBracket = {
  __typename?: 'MPLeaderboardBracket';
  bracketHeader: Scalars['String']['output'];
  bracketNum?: Maybe<Scalars['Int']['output']>;
  matches: Array<MpLeaderboardMatch>;
  upcomingMatches?: Maybe<Array<UpcomingMatch>>;
};

export type MpLeaderboardMatch = {
  __typename?: 'MPLeaderboardMatch';
  bracketPlayerSwap?: Maybe<Scalars['Boolean']['output']>;
  matchId: Scalars['ID']['output'];
  matchScore?: Maybe<Scalars['String']['output']>;
  matchScoreColor?: Maybe<Scalars['String']['output']>;
  matchScoreColorDark?: Maybe<Scalars['String']['output']>;
  matchStatus: MatchStatus;
  players: Array<MpLeaderboardPlayer>;
  teeTime: Scalars['AWSTimestamp']['output'];
  thru?: Maybe<Scalars['String']['output']>;
  thruNumberOfHoles?: Maybe<Scalars['Int']['output']>;
};

export type MpLeaderboardPlayer = {
  __typename?: 'MPLeaderboardPlayer';
  activeInPlayoff?: Maybe<Scalars['Boolean']['output']>;
  bracketSeed: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  displayColor: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  isAmateur: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  matchStatus?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  record?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  tournamentSeed: Scalars['String']['output'];
};

export type MpLeaderboardRound = {
  __typename?: 'MPLeaderboardRound';
  brackets: Array<MpLeaderboardBracket>;
  round: Scalars['Int']['output'];
  roundHeader: Scalars['String']['output'];
  roundStatusSubHead: Scalars['String']['output'];
  roundTypeSubHead: Scalars['String']['output'];
};

export type MpMatchTeeTimes = {
  __typename?: 'MPMatchTeeTimes';
  matchId: Scalars['ID']['output'];
  players: Array<MpTeeTimePlayer>;
  status: Scalars['String']['output'];
  tee: Scalars['String']['output'];
  teeTime: Scalars['AWSTimestamp']['output'];
  timezone: Scalars['String']['output'];
};

export type MpPlayoffScorecard = {
  __typename?: 'MPPlayoffScorecard';
  currentHole?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  infoWebUrl?: Maybe<Scalars['String']['output']>;
  playoff: Playoff;
  scorecardTitle: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrlWeb?: Maybe<Scalars['String']['output']>;
};

export type MpRoundTeeTimes = {
  __typename?: 'MPRoundTeeTimes';
  matchTeeTimes: Array<MpMatchTeeTimes>;
  roundNumber: Scalars['Int']['output'];
};

export type MpScorecard = {
  __typename?: 'MPScorecard';
  currentHole?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  infoWebUrl?: Maybe<Scalars['String']['output']>;
  matchHoleScores: Array<MatchHole>;
  matchName: Scalars['String']['output'];
  matchPlayers: Array<MpScorecardPlayer>;
  messages: Array<Message>;
  scorecardTitle: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrlWeb?: Maybe<Scalars['String']['output']>;
};

export type MpScorecardPlayer = {
  __typename?: 'MPScorecardPlayer';
  countryFlag: Scalars['String']['output'];
  displayColor: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  isAmateur: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  seed: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
};

export type MpScorecardResults = {
  __typename?: 'MPScorecardResults';
  matchId: Scalars['String']['output'];
  messages?: Maybe<Array<Message>>;
  players: Array<MpScorecardResultsPlayer>;
  roundNum: Scalars['Int']['output'];
  tournamentId: Scalars['String']['output'];
};

export type MpScorecardResultsPlayer = {
  __typename?: 'MPScorecardResultsPlayer';
  displayName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  previousRounds: Array<PreviousRounds>;
};

export type MpTeeTimePlayer = {
  __typename?: 'MPTeeTimePlayer';
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  shortName: Scalars['String']['output'];
};

export type MpTeeTimes = {
  __typename?: 'MPTeeTimes';
  defaultRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  roundFilters: Array<RoundFilter>;
  rounds: Array<MpRoundTeeTimes>;
  teeTimeHeaders: Array<TeeTimeHeader>;
  title: Scalars['String']['output'];
};

export type MajorResultsTournament = {
  __typename?: 'MajorResultsTournament';
  courseName: Scalars['String']['output'];
  date: Scalars['String']['output'];
  money: Scalars['String']['output'];
  position: Scalars['String']['output'];
  roundScores: Array<RoundScoreItem>;
  toPar: Scalars['String']['output'];
  total: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type MajorTimeline = {
  __typename?: 'MajorTimeline';
  finishes: Array<Scalars['String']['output']>;
  tournamentName: Scalars['String']['output'];
  tournamentNum: Scalars['String']['output'];
};

export type Market = {
  __typename?: 'Market';
  header: Scalars['String']['output'];
  /**   used for switching between submarkets like "Group A" */
  marketType: OddsMarketType;
  /**   Tournament Winner */
  subMarketPills?: Maybe<Array<Scalars['String']['output']>>;
  subMarkets: Array<SubMarket>;
};

export type MarketPill = {
  __typename?: 'MarketPill';
  displayText: Scalars['String']['output'];
  marketType: OddsMarketType;
};

export type MatchCard = {
  __typename?: 'MatchCard';
  matchId?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  round?: Maybe<Scalars['String']['output']>;
  tourcastWebview?: Maybe<Scalars['String']['output']>;
  tournamentId?: Maybe<Scalars['String']['output']>;
};

export type MatchHole = {
  __typename?: 'MatchHole';
  courseHoleNumber: Scalars['String']['output'];
  holeNumber: Scalars['String']['output'];
  holeNumberColor: Scalars['String']['output'];
  holeOutlineColor?: Maybe<Scalars['String']['output']>;
  holePlayedStatus: HolePlayedStatus;
  matchHolePlayers: Array<MpHolePlayer>;
  matchScore?: Maybe<Scalars['String']['output']>;
  matchScoreColor: Scalars['String']['output'];
  parValue: Scalars['String']['output'];
};

export type MatchHoleScore = {
  __typename?: 'MatchHoleScore';
  holeScore?: Maybe<Scalars['String']['output']>;
  holeScoreStatus?: Maybe<HoleScoreStatus>;
  playerId: Scalars['ID']['output'];
};

export type MatchStatus =
  | 'COMPLETE'
  | 'IN_PROGRESS'
  | 'UPCOMING';

export type MatchupOptionV2 = BaseOddsOption & {
  __typename?: 'MatchupOptionV2';
  entity: OddsEntity;
  isTie: Scalars['Boolean']['output'];
  odds: OddsValues;
};

export type MatchupsPlayer = {
  __typename?: 'MatchupsPlayer';
  countryFlag?: Maybe<Scalars['String']['output']>;
  currentRound?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  matchId?: Maybe<Scalars['Int']['output']>;
  odds: Scalars['String']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  optionsId: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
};

export type MediaGallery = {
  __typename?: 'MediaGallery';
  contentDescription?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  cta?: Maybe<HomepageCta>;
  mediaGallery?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  mediaGalleryObjs?: Maybe<Array<Maybe<MediaGalleryItems>>>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
};

export type MediaGalleryItem = {
  __typename?: 'MediaGalleryItem';
  orientation?: Maybe<Orientation>;
  path?: Maybe<Scalars['String']['output']>;
};

export type MediaGalleryItems = MediaGalleryItem | Video;

export type Message = {
  __typename?: 'Message';
  body: Array<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type MessageBanner = {
  __typename?: 'MessageBanner';
  messageLink?: Maybe<Scalars['String']['output']>;
  messageText?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
};

export type MobileCategoryPill = {
  __typename?: 'MobileCategoryPill';
  category?: Maybe<StatCategory>;
  displayName: Scalars['String']['output'];
};

export type MobileStat = {
  __typename?: 'MobileStat';
  statId: Scalars['String']['output'];
  statTitle: Scalars['String']['output'];
};

export type MobileStatCategoryLeaders = {
  __typename?: 'MobileStatCategoryLeaders';
  category: StatCategory;
  categoryHeader: Scalars['String']['output'];
  leaders: Array<LeaderStat>;
  stats: Array<MobileStat>;
};

export type MobileStatLeaders = {
  __typename?: 'MobileStatLeaders';
  categories: Array<MobileStatCategoryLeaders>;
  categoryPills: Array<MobileCategoryPill>;
  tourCode: TourCode;
  year: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFavoriteTour: FavoriteTourResponse;
  addFavorites: Array<FavoritePlayer>;
  addNotificationTags: NotificationTagResponse;
  deleteAccount: DeleteAccountResponse;
  deleteFavorites: Array<FavoritePlayer>;
  deleteNotificationTags: NotificationTagResponse;
  unsubscribe: UnsubscribeResponse;
  updateBubble?: Maybe<BubbleWatch>;
  updateBubbleWatch?: Maybe<TourCupRankingEvent>;
  updateCourseStats?: Maybe<TournamentHoleStats>;
  updateCoverage?: Maybe<BroadcastCoverage>;
  updateCupOverviewLeaderboard?: Maybe<CupTournamentStatus>;
  updateCupRoundLeaderboard?: Maybe<CupTournamentLeaderboard>;
  updateCupRoundLeaderboardCompressed?: Maybe<CupTournamentLeaderboardCompressed>;
  updateCupScorecard?: Maybe<CupScorecard>;
  updateCurrentLeadersCompressed?: Maybe<CurrentLeadersCompressed>;
  updateGroupLocations?: Maybe<GroupLocationCourse>;
  updateGroupLocationsEnhanced?: Maybe<GroupLocationCourse>;
  updateHoleDetails?: Maybe<HoleDetail>;
  updateLeaderboardCompressedV2?: Maybe<LeaderboardCompressedV2>;
  updateLeaderboardCompressedV3?: Maybe<LeaderboardUpdateCompressedV3>;
  updateLeaderboardStrokes?: Maybe<LeaderboardStrokes>;
  updateLeaderboardStrokesCompressed?: Maybe<LeaderboardStrokesCompressed>;
  updateLeaderboardV2?: Maybe<LeaderboardV2>;
  updateMatchOutcomeIq?: Maybe<RyderCupMatchOutcomeIq>;
  updateMatchPlayLeaderboard?: Maybe<MpLeaderboard>;
  updateMatchPlayLeaderboardCompressed?: Maybe<LeaderboardCompressed>;
  updateMatchPlayPlayoffScorecard?: Maybe<MpPlayoffScorecard>;
  updateMatchPlayScorecard?: Maybe<MpScorecard>;
  updateMatchPlayTeeTimes: MpTeeTimes;
  updateMatchPlayTeeTimesCompressed?: Maybe<TeeTimesCompressed>;
  updateOddsToWinMarket?: Maybe<OddsToWinMarket>;
  updateOddsToWinMarketCompressed?: Maybe<OddsToWinMarketCompressed>;
  updatePlayerHub?: Maybe<PlayerHubPlayerCompressed>;
  updatePlayerTournamentStatus?: Maybe<PlayerTournamentStatus>;
  updatePlayoffScorecard?: Maybe<PlayoffScorecard>;
  updatePlayoffScorecardV2: Array<PlayoffScorecard>;
  updatePlayoffScorecardV3: TournamentPlayoffScorecards;
  updatePlayoffShotDetails: GroupShotDetails;
  updatePlayoffShotDetailsCompressed: GroupShotDetailsCompressed;
  updateScorecardCompressedV3?: Maybe<ScorecardUpdateCompressedV3>;
  updateScorecardStats?: Maybe<PlayerScorecardStats>;
  updateScorecardStatsCompressedV3?: Maybe<PlayerScorecardStatsCompressed>;
  updateScorecardV2?: Maybe<LeaderboardDrawerV2>;
  updateShotCommentary?: Maybe<ShotCommentary>;
  updateShotDetailsCompressedV3?: Maybe<ShotDetailsCompressedV3>;
  /**   V4 Shot Details Mutation - Uses simplified coordinates */
  updateShotDetailsV4Compressed?: Maybe<ShotDetailsV4Compressed>;
  updateTGLMatch?: Maybe<TglMatch>;
  updateTSPPlayoffShotDetails: TeamShotDetails;
  updateTSPPlayoffShotDetailsCompressed: TeamShotDetailsCompressed;
  updateTeamPlayLeaderboard?: Maybe<TspLeaderboard>;
  updateTeamPlayLeaderboardCompressed?: Maybe<LeaderboardCompressed>;
  updateTeamPlayScorecard?: Maybe<TspScorecard>;
  updateTeamPlayScorecardRounds?: Maybe<TspScorecardRounds>;
  updateTeamStrokePlayTeeTimes?: Maybe<TspTeeTimes>;
  updateTeamStrokePlayTeeTimesCompressed?: Maybe<TeeTimesCompressed>;
  updateTeeTimes?: Maybe<TeeTimes>;
  updateTeeTimesCompressed?: Maybe<TeeTimesCompressed>;
  updateTeeTimesCompressedV2?: Maybe<TeeTimesCompressed>;
  updateTeeTimesV2?: Maybe<TeeTimesV2>;
  updateTourCup?: Maybe<TourCupRankingEvent>;
  updateTourcastTable?: Maybe<TourcastTable>;
  updateTournament?: Maybe<Tournament>;
  updateTournamentGroupLocations?: Maybe<TournamentGroupLocation>;
  updateUpcomingSchedule?: Maybe<ScheduleUpcoming>;
};


export type MutationAddFavoriteTourArgs = {
  tourCode: TourCode;
};


export type MutationAddFavoritesArgs = {
  favorites: Array<FavoritePlayerInput>;
};


export type MutationAddNotificationTagsArgs = {
  notificationTags: Array<NotificationTagInput>;
};


export type MutationDeleteFavoritesArgs = {
  favorites: Array<FavoritePlayerInput>;
};


export type MutationDeleteNotificationTagsArgs = {
  notificationTags: Array<NotificationTagInput>;
};


export type MutationUnsubscribeArgs = {
  email: Scalars['String']['input'];
  subscriptionIds: Array<InputMaybe<Scalars['String']['input']>>;
};


export type MutationUpdateBubbleArgs = {
  bubbleId: Scalars['ID']['input'];
};


export type MutationUpdateBubbleWatchArgs = {
  tourCode: TourCode;
};


export type MutationUpdateCourseStatsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateCoverageArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateCupOverviewLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCupRoundLeaderboardArgs = {
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type MutationUpdateCupRoundLeaderboardCompressedArgs = {
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type MutationUpdateCupScorecardArgs = {
  matchId: Scalars['Int']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateCurrentLeadersCompressedArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateGroupLocationsArgs = {
  courseId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateGroupLocationsEnhancedArgs = {
  courseId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateHoleDetailsArgs = {
  courseId: Scalars['ID']['input'];
  hole: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateLeaderboardCompressedV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateLeaderboardCompressedV3Args = {
  odds?: InputMaybe<OddsUpdateInput>;
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateLeaderboardStrokesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateLeaderboardStrokesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateLeaderboardV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMatchOutcomeIqArgs = {
  matchId: Scalars['Int']['input'];
  roundNumber?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateMatchPlayLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMatchPlayLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMatchPlayPlayoffScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMatchPlayScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMatchPlayTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMatchPlayTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateOddsToWinMarketArgs = {
  oddsToWinId: Scalars['ID']['input'];
};


export type MutationUpdateOddsToWinMarketCompressedArgs = {
  oddsToWinId: Scalars['ID']['input'];
};


export type MutationUpdatePlayerHubArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlayerTournamentStatusArgs = {
  playerId: Scalars['ID']['input'];
  tournamentId: Scalars['String']['input'];
};


export type MutationUpdatePlayoffScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlayoffScorecardV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlayoffScorecardV3Args = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdatePlayoffShotDetailsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdatePlayoffShotDetailsCompressedArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateScorecardCompressedV3Args = {
  id: Scalars['ID']['input'];
  rounds?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type MutationUpdateScorecardStatsArgs = {
  id: Scalars['ID']['input'];
  playerId: Scalars['String']['input'];
};


export type MutationUpdateScorecardStatsCompressedV3Args = {
  id: Scalars['ID']['input'];
  playerId: Scalars['String']['input'];
  rounds: Array<Scalars['Int']['input']>;
};


export type MutationUpdateScorecardV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateShotCommentaryArgs = {
  commentary: Array<ShotCommentaryItemInput>;
  playerId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['String']['input'];
};


export type MutationUpdateShotDetailsCompressedV3Args = {
  holes: Array<Scalars['Int']['input']>;
  isUs: Scalars['Boolean']['input'];
  playerId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tourcast: Scalars['Boolean']['input'];
  tournamentId: Scalars['String']['input'];
};


export type MutationUpdateShotDetailsV4CompressedArgs = {
  holes: Array<Scalars['Int']['input']>;
  isUs: Scalars['Boolean']['input'];
  playerId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tourcast: Scalars['Boolean']['input'];
  tournamentId: Scalars['String']['input'];
};


export type MutationUpdateTglMatchArgs = {
  matchID: Scalars['ID']['input'];
};


export type MutationUpdateTspPlayoffShotDetailsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateTspPlayoffShotDetailsCompressedArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateTeamPlayLeaderboardArgs = {
  id: Scalars['ID']['input'];
  provider: Scalars['String']['input'];
};


export type MutationUpdateTeamPlayLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
  provider: Scalars['String']['input'];
};


export type MutationUpdateTeamPlayScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeamPlayScorecardRoundsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeamStrokePlayTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeamStrokePlayTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeeTimesCompressedV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTeeTimesV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTourCupArgs = {
  id: Scalars['ID']['input'];
  type?: InputMaybe<TourCupType>;
};


export type MutationUpdateTourcastTableArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTournamentGroupLocationsArgs = {
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateUpcomingScheduleArgs = {
  tourCode: Scalars['String']['input'];
  year?: InputMaybe<Scalars['String']['input']>;
};

export type NewsArticle = {
  __typename?: 'NewsArticle';
  aiGenerated?: Maybe<Scalars['Boolean']['output']>;
  analyticsTags?: Maybe<Array<Scalars['String']['output']>>;
  articleFormType?: Maybe<ArticleFormType>;
  /** @deprecated Use articleImageAsset */
  articleImage?: Maybe<Scalars['String']['output']>;
  articleImageAlt: Scalars['String']['output'];
  articleImageAsset?: Maybe<ImageAsset>;
  articleLabel?: Maybe<Scalars['String']['output']>;
  author?: Maybe<NewsArticleAuthor>;
  brightcoveId?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use contentTournamentIds */
  contentTournamentId?: Maybe<Scalars['String']['output']>;
  contentTournamentIds?: Maybe<Array<Scalars['String']['output']>>;
  dateTextOverride?: Maybe<Scalars['String']['output']>;
  externalLinkOverride?: Maybe<Scalars['String']['output']>;
  franchise: Scalars['String']['output'];
  franchiseDisplayName: Scalars['String']['output'];
  franchiseTags?: Maybe<Array<Scalars['String']['output']>>;
  headline?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isBreakingNews?: Maybe<Scalars['Boolean']['output']>;
  isLive: Scalars['Boolean']['output'];
  photoGalleryPath?: Maybe<Scalars['String']['output']>;
  pinned: Scalars['Boolean']['output'];
  players?: Maybe<Array<ArticlePlayer>>;
  publishDate?: Maybe<Scalars['AWSTimestamp']['output']>;
  shareURL: Scalars['String']['output'];
  sponsor?: Maybe<NewsArticleSponsor>;
  team?: Maybe<RyderCupTeamType>;
  teaserContent?: Maybe<Scalars['String']['output']>;
  teaserHeadline?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use teaserImageOverrideAsset */
  teaserImageOverride?: Maybe<Scalars['String']['output']>;
  teaserImageOverrideAsset?: Maybe<ImageAsset>;
  topics?: Maybe<Array<ContentTopics>>;
  updateDate?: Maybe<Scalars['AWSTimestamp']['output']>;
  url: Scalars['String']['output'];
};

export type NewsArticleAuthor = {
  __typename?: 'NewsArticleAuthor';
  byLine?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use byLineIconAsset */
  byLineIcon?: Maybe<Scalars['String']['output']>;
  byLineIconAsset?: Maybe<ImageAsset>;
  byLineLink?: Maybe<Scalars['String']['output']>;
  byLineLinkDisplay?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  /** @deprecated Use headshotAsset */
  headshot?: Maybe<Scalars['String']['output']>;
  headshotAsset?: Maybe<ImageAsset>;
  lastName: Scalars['String']['output'];
  twitter?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleBlockQuote = {
  __typename?: 'NewsArticleBlockQuote';
  class?: Maybe<Scalars['String']['output']>;
  otherAttribute?: Maybe<Scalars['String']['output']>;
  playerId?: Maybe<Scalars['String']['output']>;
  playerName?: Maybe<Scalars['String']['output']>;
  quote?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleContentSegment = {
  __typename?: 'NewsArticleContentSegment';
  data?: Maybe<Scalars['String']['output']>;
  format?: Maybe<NewsArticleFormat>;
  id?: Maybe<Scalars['String']['output']>;
  imageAsset?: Maybe<ImageAsset>;
  imageDescription?: Maybe<Scalars['String']['output']>;
  imageOrientation?: Maybe<Orientation>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
  webViewLink?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleDetails = {
  __typename?: 'NewsArticleDetails';
  aiGenerated?: Maybe<Scalars['Boolean']['output']>;
  analyticsTags?: Maybe<Array<Scalars['String']['output']>>;
  articleImageAlt: Scalars['String']['output'];
  articleLabel?: Maybe<Scalars['String']['output']>;
  articleSponsor?: Maybe<Scalars['String']['output']>;
  authorReference?: Maybe<NewsArticleAuthor>;
  brandedContent: Scalars['Boolean']['output'];
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tournaments.contentTournamentId */
  contentTournamentId?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CallToAction>;
  datePublished: Scalars['AWSTimestamp']['output'];
  disableAds: Scalars['Boolean']['output'];
  franchise: Scalars['String']['output'];
  franchiseDisplayName: Scalars['String']['output'];
  headline: Scalars['String']['output'];
  hero?: Maybe<NewsArticleHero>;
  isBreakingNews?: Maybe<Scalars['Boolean']['output']>;
  isLive: Scalars['Boolean']['output'];
  leadVideoId?: Maybe<Scalars['String']['output']>;
  leadVideoTitle?: Maybe<Scalars['String']['output']>;
  longForm?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<NewsArticleMetadata>;
  moreNewsItems: Array<NewsArticle>;
  moreNewsTitle?: Maybe<Scalars['String']['output']>;
  nodes: Array<NewsArticleNode>;
  overviewNodes?: Maybe<Array<NewsArticleNode>>;
  path: Scalars['String']['output'];
  photoPosition?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use players field that contains name and id */
  playerNames?: Maybe<Array<Scalars['String']['output']>>;
  players?: Maybe<Array<ArticlePlayer>>;
  readTime: Scalars['String']['output'];
  relatedFacts?: Maybe<Array<Scalars['String']['output']>>;
  shareURL: Scalars['String']['output'];
  sponsor?: Maybe<NewsArticleSponsor>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  team?: Maybe<RyderCupTeamType>;
  teaserAsset?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<ContentTopics>>;
  /** @deprecated Use tournaments.tourName */
  tourName?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tournaments.tournamentName */
  tournamentName?: Maybe<Scalars['String']['output']>;
  tournaments?: Maybe<Array<NewsArticleDetailsTournament>>;
  url: Scalars['String']['output'];
};

export type NewsArticleDetailsCompressed = {
  __typename?: 'NewsArticleDetailsCompressed';
  path: Scalars['String']['output'];
  payload: Scalars['String']['output'];
};

export type NewsArticleDetailsTournament = {
  __typename?: 'NewsArticleDetailsTournament';
  contentTournamentId: Scalars['String']['output'];
  tourName: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type NewsArticleDivider = {
  __typename?: 'NewsArticleDivider';
  value?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleEmbedded = {
  __typename?: 'NewsArticleEmbedded';
  class?: Maybe<Scalars['String']['output']>;
  frameborder?: Maybe<Scalars['Boolean']['output']>;
  height?: Maybe<Scalars['String']['output']>;
  mobileHeight?: Maybe<Scalars['String']['output']>;
  scroll?: Maybe<Scalars['Boolean']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleFormat = {
  __typename?: 'NewsArticleFormat';
  styles?: Maybe<Array<Style>>;
  variants?: Maybe<Array<Scalars['String']['output']>>;
};

export type NewsArticleHeader = {
  __typename?: 'NewsArticleHeader';
  headerSegments?: Maybe<Array<NewsArticleHeaderSegment>>;
  id?: Maybe<Scalars['String']['output']>;
  style?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleHeaderSegment = {
  __typename?: 'NewsArticleHeaderSegment';
  class?: Maybe<Scalars['String']['output']>;
  headerType: Scalars['String']['output'];
  segments?: Maybe<Array<NewsArticleContentSegment>>;
};

export type NewsArticleHero = {
  __typename?: 'NewsArticleHero';
  /** @deprecated Use imageAsset */
  image?: Maybe<Scalars['String']['output']>;
  imageAsset?: Maybe<ImageAsset>;
  imageDescription?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Video>;
};

export type NewsArticleHowToWatch = {
  __typename?: 'NewsArticleHowToWatch';
  class?: Maybe<Scalars['String']['output']>;
  round?: Maybe<Scalars['Int']['output']>;
  season?: Maybe<Scalars['String']['output']>;
  tournamentId?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleImage = {
  __typename?: 'NewsArticleImage';
  segments: Array<NewsArticleContentSegment>;
};

export type NewsArticleInlineOdds = {
  __typename?: 'NewsArticleInlineOdds';
  marketId: HistoricalOddsId;
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  timeStamp?: Maybe<Scalars['AWSDateTime']['output']>;
  tournamentId: Scalars['String']['output'];
};

export type NewsArticleInstagram = {
  __typename?: 'NewsArticleInstagram';
  class?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleLineBreak = {
  __typename?: 'NewsArticleLineBreak';
  breakValue?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleLink = {
  __typename?: 'NewsArticleLink';
  segments: Array<NewsArticleContentSegment>;
};

export type NewsArticleMetadata = {
  __typename?: 'NewsArticleMetadata';
  metadata?: Maybe<Array<NewsArticleMetadataSegment>>;
};

export type NewsArticleMetadataSegment = {
  __typename?: 'NewsArticleMetadataSegment';
  name: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleNode = ArticleOddsTableQuery | CerosEmbedPlugin | ExpertPicksNode | NewsArticleBlockQuote | NewsArticleDivider | NewsArticleEmbedded | NewsArticleHeader | NewsArticleHowToWatch | NewsArticleImage | NewsArticleInstagram | NewsArticleLineBreak | NewsArticleLink | NewsArticleOddsGraph | NewsArticleOddsParagraph | NewsArticleParagraph | NewsArticlePhotoGallery | NewsArticlePlayerComparison | NewsArticleScoreCard | NewsArticleStats | NewsArticleText | NewsArticleTweetNode | NewsArticleVideo | NewsArticleWeather | RelatedFactsNode | TglBoxScore | TableFragment | UnorderedListNode;

export type NewsArticleOddsGraph = {
  __typename?: 'NewsArticleOddsGraph';
  marketId?: Maybe<HistoricalOddsId>;
  oddsTimeType?: Maybe<OddsTimeType>;
  playerIds?: Maybe<Array<Scalars['String']['output']>>;
  round?: Maybe<Scalars['Int']['output']>;
  tournamentId: Scalars['String']['output'];
};

export type NewsArticleOddsParagraph = {
  __typename?: 'NewsArticleOddsParagraph';
  content: Array<OddsParagraphContent>;
};

export type NewsArticleParagraph = {
  __typename?: 'NewsArticleParagraph';
  id?: Maybe<Scalars['String']['output']>;
  segments: Array<NewsArticleContentSegment>;
};

export type NewsArticlePhotoGallery = {
  __typename?: 'NewsArticlePhotoGallery';
  images: Array<NewsArticleImage>;
};

export type NewsArticlePlayerComparison = {
  __typename?: 'NewsArticlePlayerComparison';
  class?: Maybe<Scalars['String']['output']>;
  playerIds?: Maybe<Array<Scalars['String']['output']>>;
  playerNames?: Maybe<Array<Scalars['String']['output']>>;
  season?: Maybe<Scalars['String']['output']>;
  statCategory?: Maybe<Scalars['String']['output']>;
  tournamentId?: Maybe<Scalars['String']['output']>;
  type: PlayerComparisonDisplay;
};

export type NewsArticlePlayerTournamentOdds = {
  __typename?: 'NewsArticlePlayerTournamentOdds';
  playerId: Scalars['String']['output'];
  timeStamp?: Maybe<Scalars['AWSDateTime']['output']>;
  tournamentId: Scalars['String']['output'];
  tournamentMarketType?: Maybe<OddsMarketType>;
};

export type NewsArticleScoreCard = {
  __typename?: 'NewsArticleScoreCard';
  class?: Maybe<Scalars['String']['output']>;
  playerId?: Maybe<Scalars['String']['output']>;
  playerName?: Maybe<Scalars['String']['output']>;
  round?: Maybe<Scalars['String']['output']>;
  season?: Maybe<Scalars['String']['output']>;
  tournamentId?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleSponsor = {
  __typename?: 'NewsArticleSponsor';
  description?: Maybe<Scalars['String']['output']>;
  gam?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use imageAsset */
  image?: Maybe<Scalars['String']['output']>;
  imageAsset?: Maybe<ImageAsset>;
  /** @deprecated Use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated Use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
  name: Scalars['String']['output'];
  sponsorPrefix?: Maybe<Scalars['String']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleStatType =
  | 'BY_NUMBERS'
  | 'DOT_CHART'
  | 'LINE_CHART';

export type NewsArticleStats = {
  __typename?: 'NewsArticleStats';
  playerId?: Maybe<Scalars['String']['output']>;
  playerName?: Maybe<Scalars['String']['output']>;
  season?: Maybe<Scalars['String']['output']>;
  statType: NewsArticleStatType;
  stats: Array<ContentStat>;
  tournamentId?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleTeaserAsset = {
  __typename?: 'NewsArticleTeaserAsset';
  value?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleText = {
  __typename?: 'NewsArticleText';
  value?: Maybe<Scalars['String']['output']>;
};

export type NewsArticleTweetNode = {
  __typename?: 'NewsArticleTweetNode';
  tweetId: Scalars['String']['output'];
};

export type NewsArticleVideo = {
  __typename?: 'NewsArticleVideo';
  video?: Maybe<Video>;
};

export type NewsArticleWeather = {
  __typename?: 'NewsArticleWeather';
  class?: Maybe<Scalars['String']['output']>;
  season?: Maybe<Scalars['String']['output']>;
  tour?: Maybe<Scalars['String']['output']>;
  tournamentId?: Maybe<Scalars['String']['output']>;
};

export type NewsArticles = {
  __typename?: 'NewsArticles';
  articles: Array<NewsArticle>;
  franchiseSponsors?: Maybe<Array<NewsSponsor>>;
  /** @deprecated not needed */
  integratedComponents: Array<IntegratedComponent>;
};

export type NewsFranchise = {
  __typename?: 'NewsFranchise';
  franchise: Scalars['String']['output'];
  franchiseLabel: Scalars['String']['output'];
};

export type NewsLetterType =
  | 'GLOBAL'
  | 'TOURNAMENT';

export type NewsSponsor = {
  __typename?: 'NewsSponsor';
  accessibilityText: Scalars['String']['output'];
  backgroundColor: Scalars['String']['output'];
  franchise: Scalars['String']['output'];
  /** @deprecated Use imageAsset */
  image: Scalars['String']['output'];
  imageAsset: ImageAsset;
  label: Scalars['String']['output'];
};

export type Newsletter = {
  __typename?: 'Newsletter';
  ctaText: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  gigyaSubscriptionId: Scalars['String']['output'];
  image: Scalars['String']['output'];
  newsLetterType: NewsLetterType;
  title: Scalars['String']['output'];
  tourCode?: Maybe<TourCode>;
};

export type NotificationTag = {
  __typename?: 'NotificationTag';
  tag: Scalars['String']['output'];
};

export type NotificationTagInput = {
  tag: Scalars['String']['input'];
};

export type NotificationTagResponse = {
  __typename?: 'NotificationTagResponse';
  ok: Scalars['Boolean']['output'];
  tags: Array<Maybe<NotificationTag>>;
};

export type OddsBanner = {
  __typename?: 'OddsBanner';
  cta?: Maybe<CallToAction>;
  disclaimer: Scalars['String']['output'];
  image: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type OddsCutsOption = {
  __typename?: 'OddsCutsOption';
  entity: OddsEntity;
  noOdds: OddsValues;
  yesOdds: OddsValues;
};

export type OddsCutsPlayers = {
  __typename?: 'OddsCutsPlayers';
  countryFlag?: Maybe<Scalars['String']['output']>;
  currentRound?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  matchId?: Maybe<Scalars['Int']['output']>;
  noOdds: Scalars['String']['output'];
  noOddsSwing?: Maybe<OddsSwing>;
  noOptionsId: Scalars['String']['output'];
  position: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
  total: Scalars['String']['output'];
  yesOdds: Scalars['String']['output'];
  yesOddsSwing?: Maybe<OddsSwing>;
  yesOptionsId: Scalars['String']['output'];
};

/**   Odds Primitives */
export type OddsEntity = {
  __typename?: 'OddsEntity';
  color?: Maybe<Scalars['String']['output']>;
  entityFlagUrl?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['ID']['output'];
  flagSurroundColor?: Maybe<Scalars['String']['output']>;
  flagSurroundColorDark?: Maybe<Scalars['String']['output']>;
  groupNum: Scalars['Int']['output'];
  maxRound: Scalars['Int']['output'];
  players: Array<OddsPlayer>;
  position: Scalars['String']['output'];
  score: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
  thru?: Maybe<Scalars['String']['output']>;
  total: Scalars['String']['output'];
  totalSort: Scalars['Int']['output'];
};

export type OddsFinishes = {
  __typename?: 'OddsFinishes';
  countryFlag?: Maybe<Scalars['String']['output']>;
  currentRound?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  matchId?: Maybe<Scalars['Int']['output']>;
  odds: Scalars['String']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  optionsId: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
};

export type OddsFinishesOption = BaseOddsOption & {
  __typename?: 'OddsFinishesOption';
  entity: OddsEntity;
  odds: OddsValues;
};

export type OddsFormat =
  | 'DECIMAL'
  | 'FRACTIONAL'
  | 'MONEYLINE';

export type OddsGroup = {
  __typename?: 'OddsGroup';
  id: Scalars['ID']['output'];
  matchupPlayers: Array<MatchupsPlayer>;
  subMarket: Scalars['String']['output'];
};

export type OddsGroupOptionV2 = BaseOddsOption & {
  __typename?: 'OddsGroupOptionV2';
  entity: OddsEntity;
  odds: OddsValues;
};

export type OddsLeadersOption = BaseOddsOption & {
  __typename?: 'OddsLeadersOption';
  entity: OddsEntity;
  odds: OddsValues;
};

export type OddsLeadersPlayers = {
  __typename?: 'OddsLeadersPlayers';
  countryFlag?: Maybe<Scalars['String']['output']>;
  currentRound?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  matchId?: Maybe<Scalars['Int']['output']>;
  odds: Scalars['String']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  optionsId: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
};

/**   End Market Abstractions */
export type OddsMarketType =
  | 'FINISHES'
  | 'GROUP_WINNER'
  | 'MATCHUP'
  | 'NATIONALITY'
  | 'PLAYER_PROPS'
  | 'WINNER';

export type OddsMatchupOptionGroup = {
  __typename?: 'OddsMatchupOptionGroup';
  options: Array<MatchupOptionV2>;
};

export type OddsMatchups = {
  __typename?: 'OddsMatchups';
  id: Scalars['ID']['output'];
  matchupPlayers: Array<MatchupsPlayer>;
  subMarket: Scalars['String']['output'];
};

export type OddsMessage = {
  __typename?: 'OddsMessage';
  body: Scalars['String']['output'];
  header: Scalars['String']['output'];
};

export type OddsNationality = {
  __typename?: 'OddsNationality';
  countryFlag?: Maybe<Scalars['String']['output']>;
  currentRound?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  matchId?: Maybe<Scalars['Int']['output']>;
  odds: Scalars['String']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  optionsId: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
};

export type OddsNationalityOption = BaseOddsOption & {
  __typename?: 'OddsNationalityOption';
  entity: OddsEntity;
  odds: OddsValues;
};

export type OddsOption = OddsCutsPlayers | OddsFinishes | OddsGroup | OddsLeadersPlayers | OddsMatchups | OddsNationality | OddsToWin;

export type OddsOptionV2 = OddsCutsOption | OddsFinishesOption | OddsGroupOptionV2 | OddsLeadersOption | OddsMatchupOptionGroup | OddsNationalityOption | OddsToWinV2;

export type OddsParagraphContent = NewsArticleInlineOdds | NewsArticleText;

export type OddsPlayer = {
  __typename?: 'OddsPlayer';
  color?: Maybe<Scalars['String']['output']>;
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  overrideFlagUrl?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  shortName: Scalars['String']['output'];
};

export type OddsProvider =
  | 'BET365'
  | 'DRAFTKINGS'
  | 'ESPNBET'
  | 'FANDUEL'
  | 'MGM';

export type OddsSwing =
  | 'CONSTANT'
  | 'DOWN'
  | 'UP';

/**   Odds Table */
export type OddsTable = {
  __typename?: 'OddsTable';
  markets: Array<ArticleOddsMarkets>;
  players: Array<PlayerMarketsRow>;
  provider?: Maybe<OddsProvider>;
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

/**  Odds Graph */
export type OddsTimeType =
  | 'HOLE';

export type OddsTimeline = {
  __typename?: 'OddsTimeline';
  countryCode: Scalars['String']['output'];
  oddsProvider: OddsProvider;
  players: Array<OddsTimelinePlayer>;
  round: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
};

export type OddsTimelinePlayer = {
  __typename?: 'OddsTimelinePlayer';
  data: Array<OddsTimelinePoint>;
  playerColor: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
};

export type OddsTimelinePoint = {
  __typename?: 'OddsTimelinePoint';
  holeNumber?: Maybe<Scalars['Int']['output']>;
  holeSequence?: Maybe<Scalars['Int']['output']>;
  odds: Scalars['String']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  round?: Maybe<Scalars['Int']['output']>;
  time: Scalars['AWSTimestamp']['output'];
};

export type OddsToWin = {
  __typename?: 'OddsToWin';
  countryFlag?: Maybe<Scalars['String']['output']>;
  currentRound?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  matchId?: Maybe<Scalars['Int']['output']>;
  odds: Scalars['String']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  optionsId: Scalars['String']['output'];
  position: Scalars['String']['output'];
  score: Scalars['String']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
  thru?: Maybe<Scalars['String']['output']>;
  total: Scalars['String']['output'];
};

export type OddsToWinMarket = {
  __typename?: 'OddsToWinMarket';
  message?: Maybe<OddsMessage>;
  oddsEnabled: Scalars['Boolean']['output'];
  oddsToWinId: Scalars['ID']['output'];
  players: Array<OddsToWinPlayer>;
};

/**  Odds V3 */
export type OddsToWinMarketCompressed = {
  __typename?: 'OddsToWinMarketCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type OddsToWinPlayer = {
  __typename?: 'OddsToWinPlayer';
  odds: Scalars['String']['output'];
  oddsDirection: OddsSwing;
  oddsSort: Scalars['Float']['output'];
  optionId?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type OddsToWinTracker = {
  __typename?: 'OddsToWinTracker';
  title: Scalars['String']['output'];
  /** @deprecated use new tournamentIds array */
  tournamentId?: Maybe<Scalars['String']['output']>;
  tournamentIds?: Maybe<Array<Scalars['String']['output']>>;
};

export type OddsToWinV2 = BaseOddsOption & {
  __typename?: 'OddsToWinV2';
  entity: OddsEntity;
  odds: OddsValues;
};

export type OddsUpdateInput = {
  oddsFormat: OddsFormat;
  provider: OddsProvider;
};

export type OddsValues = {
  __typename?: 'OddsValues';
  odds: Scalars['String']['output'];
  oddsSwing: OddsSwing;
  optionId: Scalars['ID']['output'];
};

export type Orientation =
  | 'Landscape'
  | 'Portrait';

export type OutComeIqHole = {
  __typename?: 'OutComeIQHole';
  euMatchWin: Scalars['Float']['output'];
  holeNum: Scalars['Int']['output'];
  matchDraw: Scalars['Float']['output'];
  usMatchWin: Scalars['Float']['output'];
};

export type OverviewStat = {
  __typename?: 'OverviewStat';
  players: Array<LeaderStat>;
  statId: Scalars['String']['output'];
  statName: Scalars['String']['output'];
  tourAvg?: Maybe<Scalars['String']['output']>;
};

export type OverviewStats = {
  __typename?: 'OverviewStats';
  categories: Array<StatCategoryConfig>;
  stats: Array<OverviewStat>;
  tourCode: TourCode;
  year: Scalars['Int']['output'];
};

export type PageMetadata = {
  __typename?: 'PageMetadata';
  metadata: Array<PageMetadataSegment>;
};

export type PageMetadataSegment = {
  __typename?: 'PageMetadataSegment';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type PaginationDetails = {
  __typename?: 'PaginationDetails';
  limit?: Maybe<Scalars['Int']['output']>;
  offset?: Maybe<Scalars['Int']['output']>;
};

export type Platform =
  | 'ANDROID'
  | 'IOS'
  | 'WEB';

export type Player = {
  __typename?: 'Player';
  abbreviations: Scalars['String']['output'];
  abbreviationsAccessibilityText: Scalars['String']['output'];
  amateur: Scalars['Boolean']['output'];
  assets?: Maybe<Array<PlayerAsset>>;
  bettingProfile?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  lineColor: Scalars['String']['output'];
  playerBioOverrideLink?: Maybe<Scalars['String']['output']>;
  seed?: Maybe<Scalars['String']['output']>;
  shortName: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  tourBound?: Maybe<Scalars['Boolean']['output']>;
};

export type PlayerAsset = TourBoundAsset;

export type PlayerBio = {
  __typename?: 'PlayerBio';
  age?: Maybe<Scalars['String']['output']>;
  birthplace: PlayerBioLocation;
  born?: Maybe<Scalars['String']['output']>;
  bornAccessibilityText?: Maybe<Scalars['String']['output']>;
  careerEarnings?: Maybe<Scalars['String']['output']>;
  deceased: Scalars['Boolean']['output'];
  deceasedDate?: Maybe<Scalars['String']['output']>;
  degree?: Maybe<Scalars['String']['output']>;
  exemptions?: Maybe<Array<PlayerBioExemption>>;
  family?: Maybe<Scalars['String']['output']>;
  graduationYear?: Maybe<Scalars['String']['output']>;
  heightImperial?: Maybe<Scalars['String']['output']>;
  heightImperialAccessibilityText?: Maybe<Scalars['String']['output']>;
  heightMeters?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  personal?: Maybe<Array<Scalars['String']['output']>>;
  playsFrom: PlayerBioLocation;
  primaryTour?: Maybe<Scalars['String']['output']>;
  pronunciation?: Maybe<Scalars['String']['output']>;
  residence: PlayerBioLocation;
  school?: Maybe<Scalars['String']['output']>;
  social?: Maybe<Array<PlayerBioSocial>>;
  /** @deprecated No data for this field, use primaryTour */
  tours: Array<TourCode>;
  turnedPro?: Maybe<Scalars['String']['output']>;
  websiteURL?: Maybe<Scalars['String']['output']>;
  weightImperial?: Maybe<Scalars['String']['output']>;
  weightKilograms?: Maybe<Scalars['String']['output']>;
};

export type PlayerBioExemption = {
  __typename?: 'PlayerBioExemption';
  description?: Maybe<Scalars['String']['output']>;
  expirationDate?: Maybe<Scalars['String']['output']>;
  tour?: Maybe<TourCode>;
};

export type PlayerBioLocation = {
  __typename?: 'PlayerBioLocation';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  stateCode?: Maybe<Scalars['String']['output']>;
};

export type PlayerBioSocial = {
  __typename?: 'PlayerBioSocial';
  type: SocialType;
  url: Scalars['String']['output'];
};

export type PlayerBioWrapper = {
  __typename?: 'PlayerBioWrapper';
  bioLink: Scalars['String']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  owgr?: Maybe<Scalars['Int']['output']>;
  playerBio?: Maybe<PlayerBio>;
  rank?: Maybe<BioRank>;
};

export type PlayerComparison = {
  __typename?: 'PlayerComparison';
  category: PlayerComparisonCategory;
  categoryPills: Array<PlayerComparisonCategoryPill>;
  displaySeason: Scalars['String']['output'];
  noDataMessage: Scalars['String']['output'];
  seasonPills: Array<StatYearPills>;
  table: PlayerComparisonTable;
  tourCode: TourCode;
  tournamentId?: Maybe<Scalars['String']['output']>;
  year: Scalars['Int']['output'];
};

export type PlayerComparisonCategory =
  | 'APPROACH_GREEN'
  | 'AROUND_GREEN'
  | 'OFF_TEE'
  | 'PUTTING'
  | 'SCORING'
  | 'STROKES_GAINED';

export type PlayerComparisonCategoryPill = {
  __typename?: 'PlayerComparisonCategoryPill';
  category: PlayerComparisonCategory;
  displayText: Scalars['String']['output'];
};

export type PlayerComparisonDisplay =
  | 'GRAPH'
  | 'TABLE';

export type PlayerComparisonHeader = {
  __typename?: 'PlayerComparisonHeader';
  country?: Maybe<Scalars['String']['output']>;
  displayText: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  yearData: Scalars['Boolean']['output'];
};

export type PlayerComparisonOdds = {
  __typename?: 'PlayerComparisonOdds';
  color: Scalars['String']['output'];
  country: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  oddsSwing: OddsSwing;
  oddsToWin: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  provider: OddsProvider;
};

export type PlayerComparisonRow = {
  __typename?: 'PlayerComparisonRow';
  statId: Scalars['String']['output'];
  statName: Scalars['String']['output'];
  values: Array<PlayerComparisonValue>;
};

export type PlayerComparisonTable = {
  __typename?: 'PlayerComparisonTable';
  header: Scalars['String']['output'];
  headerRow: Array<PlayerComparisonHeader>;
  rows: Array<PlayerComparisonRow>;
};

export type PlayerComparisonValue = {
  __typename?: 'PlayerComparisonValue';
  bold: Scalars['Boolean']['output'];
  displayValue: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  rankDeviation?: Maybe<Scalars['Float']['output']>;
};

export type PlayerCourse = {
  __typename?: 'PlayerCourse';
  courseCity: Scalars['String']['output'];
  courseCountry: Scalars['String']['output'];
  courseCountryCode: Scalars['String']['output'];
  courseId: Scalars['String']['output'];
  courseImage: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  courseState?: Maybe<Scalars['String']['output']>;
  cupEyebrowText: Scalars['String']['output'];
  overview: Array<PlayerProfileOverviewItem>;
  overviewInfo?: Maybe<CourseOverviewInfo>;
  tournaments: Array<CourseResultsTournament>;
};

export type PlayerDirectory = {
  __typename?: 'PlayerDirectory';
  players: Array<PlayerDirectoryPlayer>;
  tourCode: TourCode;
};

export type PlayerDirectoryBio = {
  __typename?: 'PlayerDirectoryBio';
  age?: Maybe<Scalars['String']['output']>;
  education?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  turnedPro?: Maybe<Scalars['String']['output']>;
};

export type PlayerDirectoryPlayer = {
  __typename?: 'PlayerDirectoryPlayer';
  alphaSort: Scalars['String']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  playerBio: PlayerDirectoryBio;
  shortName: Scalars['String']['output'];
};

export type PlayerField = {
  __typename?: 'PlayerField';
  alphaSort: Scalars['String']['output'];
  alternate: Scalars['Boolean']['output'];
  amateur: Scalars['Boolean']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  favorite: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  owgr?: Maybe<Scalars['String']['output']>;
  qualifier?: Maybe<Scalars['String']['output']>;
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  rankingPoints?: Maybe<Scalars['String']['output']>;
  shortName: Scalars['String']['output'];
  status: Scalars['String']['output'];
  teammate?: Maybe<PlayerFieldTeammate>;
  withdrawn: Scalars['Boolean']['output'];
};

export type PlayerFieldTeammate = {
  __typename?: 'PlayerFieldTeammate';
  alphaSort: Scalars['String']['output'];
  alternate: Scalars['Boolean']['output'];
  amateur: Scalars['Boolean']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  favorite: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  owgr?: Maybe<Scalars['String']['output']>;
  qualifier?: Maybe<Scalars['String']['output']>;
  qualifierId?: Maybe<Scalars['String']['output']>;
  rankingPoints?: Maybe<Scalars['String']['output']>;
  shortName: Scalars['String']['output'];
  status: Scalars['String']['output'];
  withdrawn: Scalars['Boolean']['output'];
};

export type PlayerFinishStats = {
  __typename?: 'PlayerFinishStats';
  countryCode: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  playerAvg: Scalars['String']['output'];
  playerAvgLabel: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  rank: Scalars['String']['output'];
  statId: Scalars['String']['output'];
  statName: Scalars['String']['output'];
  statValues: Array<FinishStatValue>;
  tourAvg: Scalars['String']['output'];
};

export type PlayerGroup = {
  __typename?: 'PlayerGroup';
  fieldGroups: Array<FieldGroup>;
  title: Scalars['String']['output'];
};

export type PlayerHubArticleLink = {
  __typename?: 'PlayerHubArticleLink';
  aiGenerated?: Maybe<Scalars['Boolean']['output']>;
  analyticsTags?: Maybe<Array<Scalars['String']['output']>>;
  /**   AEM ID */
  contentId: Scalars['String']['output'];
  contentTournamentIds?: Maybe<Array<Scalars['String']['output']>>;
  franchise: Scalars['String']['output'];
  franchiseDisplayName: Scalars['String']['output'];
  players?: Maybe<Array<ArticlePlayer>>;
  /**   Optional sponsor for sponsored articles */
  sponsor?: Maybe<NewsArticleSponsor>;
  thumbnail?: Maybe<ImageAsset>;
  title: Scalars['String']['output'];
  webviewUrl: Scalars['String']['output'];
};

export type PlayerHubArticlesWidget = {
  __typename?: 'PlayerHubArticlesWidget';
  articles: Array<PlayerHubArticleLink>;
  icon: PlayerHubWidgetIcon;
  /**   Optional widget sponsor */
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  subTitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type PlayerHubDetailData = {
  __typename?: 'PlayerHubDetailData';
  data: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PlayerHubFooter = {
  __typename?: 'PlayerHubFooter';
  logoAsset: ImageAsset;
  logoAssetDark: ImageAsset;
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
};

export type PlayerHubHeader = {
  __typename?: 'PlayerHubHeader';
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  text: Scalars['String']['output'];
};

export type PlayerHubHoleDetailShotTrail = {
  __typename?: 'PlayerHubHoleDetailShotTrail';
  color: Scalars['String']['output'];
  finalShot: Scalars['Boolean']['output'];
  from: PlayerHubHoleDetailShotTrailCoordinates;
  markerText: Scalars['String']['output'];
  shotNumber: Scalars['Int']['output'];
  showMarker: Scalars['Boolean']['output'];
  strokeType: HoleStrokeType;
  to: PlayerHubHoleDetailShotTrailCoordinates;
};

export type PlayerHubHoleDetailShotTrailCoordinates = {
  __typename?: 'PlayerHubHoleDetailShotTrailCoordinates';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type PlayerHubHoleDetailWidget = {
  __typename?: 'PlayerHubHoleDetailWidget';
  dataElements: Array<PlayerHubDetailData>;
  flagCoords?: Maybe<PlayerHubHoleDetailShotTrailCoordinates>;
  holePickleAsset: ImageAsset;
  icon: PlayerHubWidgetIcon;
  shots: Array<PlayerHubHoleDetailShotTrail>;
  /**   Optional widget sponsor */
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  subTitle?: Maybe<Scalars['String']['output']>;
  tourcastURL?: Maybe<Scalars['String']['output']>;
};

export type PlayerHubLeaderboardWidget = {
  __typename?: 'PlayerHubLeaderboardWidget';
  action: PlayerHubMessageBannerAction;
  earnings?: Maybe<Scalars['String']['output']>;
  /**   Used to show if there are player stories available for this player or not */
  hasStoryContent: Scalars['Boolean']['output'];
  icon: PlayerHubWidgetIcon;
  movementAmount: Scalars['String']['output'];
  /**   Leaderboard movement amount */
  movementDirection: LeaderboardMovement;
  /**   Player Icon used for Hot Streak identification */
  playerIcon?: Maybe<LeaderboardPlayerIcon>;
  /**   Standard leaderboard position data */
  position: Scalars['String']['output'];
  rankLogos?: Maybe<SignatureEventsRankLogos>;
  round?: Maybe<Scalars['String']['output']>;
  roundDisplay: Scalars['String']['output'];
  roundHeader: Scalars['String']['output'];
  roundNum: Scalars['Int']['output'];
  /**   Final scores by round */
  roundScores: Array<Scalars['String']['output']>;
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  /**   Round Status and display information */
  roundStatusDisplay: Scalars['String']['output'];
  subTitle: Scalars['String']['output'];
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  thru?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['String']['output']>;
  /**   Tells the widget what structure to display in */
  widgetDisplay: PlayerHubLeaderboardWidgetDisplay;
};

export type PlayerHubLeaderboardWidgetDisplay =
  | 'INACTIVE'
  | 'IN_PROGRESS'
  | 'TOURNAMENT_OFFICIAL';

/**   Possible message banner targets */
export type PlayerHubMessageBannerAction =
  | 'LEADERBOARD'
  | 'NONE'
  | 'PROFILE'
  | 'SCORECARD';

export type PlayerHubMessageBannerWidget = {
  __typename?: 'PlayerHubMessageBannerWidget';
  /**   optional action should the message have a click target */
  action: PlayerHubMessageBannerAction;
  /**   optional background color override */
  background?: Maybe<Scalars['String']['output']>;
  /**   Message to display */
  message: Scalars['String']['output'];
  /**   optional text color override */
  textColor?: Maybe<Scalars['String']['output']>;
};

export type PlayerHubPlayer = {
  __typename?: 'PlayerHubPlayer';
  country: Scalars['String']['output'];
  countryCode: Scalars['String']['output'];
  footer?: Maybe<PlayerHubFooter>;
  header?: Maybe<PlayerHubHeader>;
  playerId: Scalars['ID']['output'];
  playerName: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
  widgets: Array<PlayerHubWidget>;
};

/**  PLAYER HUB */
export type PlayerHubPlayerCompressed = {
  __typename?: 'PlayerHubPlayerCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type PlayerHubRecapWidget = {
  __typename?: 'PlayerHubRecapWidget';
  icon: PlayerHubWidgetIcon;
  recap: Scalars['String']['output'];
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  /**   Round Status and display information */
  roundStatusDisplay: Scalars['String']['output'];
  /**   Optional widget sponsor */
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  subTitle?: Maybe<Scalars['String']['output']>;
};

export type PlayerHubShotCommentaryWidget = {
  __typename?: 'PlayerHubShotCommentaryWidget';
  commentary: Scalars['String']['output'];
  icon: PlayerHubWidgetIcon;
  shotTitle: Scalars['String']['output'];
  shotTitleBackgroundColor: Scalars['String']['output'];
  /**   Optional widget sponsor */
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  subTitle: Scalars['String']['output'];
  tourcastURL?: Maybe<Scalars['String']['output']>;
};

export type PlayerHubStatisticsWidget = {
  __typename?: 'PlayerHubStatisticsWidget';
  icon: PlayerHubWidgetIcon;
  /**   Optional widget sponsor */
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  stats: Array<PlayerHubDetailData>;
  subTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PlayerHubTeeTimesWidget = {
  __typename?: 'PlayerHubTeeTimesWidget';
  currentLocation?: Maybe<Scalars['String']['output']>;
  displayTeeTime: Scalars['Boolean']['output'];
  icon: PlayerHubWidgetIcon;
  /**   Players and the group tee time */
  players: Array<Player>;
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  /**   Round Status and display information */
  roundStatusDisplay: Scalars['String']['output'];
  /**   Optional widget sponsor */
  sponsor?: Maybe<PlayerHubWidgetSponsor>;
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  timezone: Scalars['String']['output'];
};

export type PlayerHubTournamentWidget = {
  __typename?: 'PlayerHubTournamentWidget';
  course: Scalars['String']['output'];
  icon: PlayerHubWidgetIcon;
  logoAsset?: Maybe<ImageAsset>;
  logoAssetDark?: Maybe<ImageAsset>;
  name: Scalars['String']['output'];
};

export type PlayerHubWidget = PlayerHubArticlesWidget | PlayerHubHoleDetailWidget | PlayerHubLeaderboardWidget | PlayerHubMessageBannerWidget | PlayerHubRecapWidget | PlayerHubShotCommentaryWidget | PlayerHubStatisticsWidget | PlayerHubTeeTimesWidget | PlayerHubTournamentWidget | PlayerStoriesWidget;

export type PlayerHubWidgetIcon =
  | 'AI'
  | 'CALENDAR'
  | 'CLOCK'
  | 'LEADERBOARD'
  | 'NEWS'
  | 'NONE'
  | 'PIE_CHART'
  | 'PROFILE'
  | 'SCORECARD'
  | 'TOURCAST';

export type PlayerHubWidgetSponsor = {
  __typename?: 'PlayerHubWidgetSponsor';
  logoAsset: ImageAsset;
  logoAssetDark: ImageAsset;
  name: Scalars['String']['output'];
  websiteUrl: Scalars['String']['output'];
};

export type PlayerInfo = {
  __typename?: 'PlayerInfo';
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type PlayerMarketsRow = {
  __typename?: 'PlayerMarketsRow';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  markets: Array<HistoricalPlayerOdds>;
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
};

export type PlayerOddsMarket = {
  __typename?: 'PlayerOddsMarket';
  id: Scalars['ID']['output'];
  market: Scalars['String']['output'];
  playerOddsOptions: Array<OddsOption>;
  subMarket?: Maybe<Scalars['String']['output']>;
};

export type PlayerOverviewStandings = {
  __typename?: 'PlayerOverviewStandings';
  displaySeason: Scalars['String']['output'];
  standings: Array<ProfileStandings>;
  tour: TourCode;
};

export type PlayerProfileAchievement = {
  __typename?: 'PlayerProfileAchievement';
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type PlayerProfileCareer = {
  __typename?: 'PlayerProfileCareer';
  achievements: Array<PlayerProfileAchievement>;
  cutsMade?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Scalars['String']['output']>;
  internationalWins?: Maybe<Scalars['String']['output']>;
  majorWins?: Maybe<Scalars['String']['output']>;
  officialMoney?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  runnerUp?: Maybe<Scalars['String']['output']>;
  second?: Maybe<Scalars['String']['output']>;
  tables: Array<PlayerProfileTable>;
  third?: Maybe<Scalars['String']['output']>;
  top5?: Maybe<Scalars['String']['output']>;
  top10?: Maybe<Scalars['String']['output']>;
  top25?: Maybe<Scalars['String']['output']>;
  tourCode?: Maybe<TourCode>;
  tourPills: Array<TourPills>;
  wins?: Maybe<Scalars['String']['output']>;
  winsTitle?: Maybe<Scalars['String']['output']>;
  years: Array<PlayerProfileCareerYear>;
};

export type PlayerProfileCareerResults = {
  __typename?: 'PlayerProfileCareerResults';
  playerId: Scalars['ID']['output'];
  tourPills: Array<TourPills>;
  yearResults: Array<PlayerProfileCareerYear>;
};

export type PlayerProfileCareerYear = {
  __typename?: 'PlayerProfileCareerYear';
  cutsMade?: Maybe<Scalars['String']['output']>;
  cutsMissed?: Maybe<Scalars['String']['output']>;
  displaySeason: Scalars['String']['output'];
  events?: Maybe<Scalars['String']['output']>;
  officialMoney?: Maybe<Scalars['String']['output']>;
  second?: Maybe<Scalars['String']['output']>;
  standingsPoints?: Maybe<Scalars['String']['output']>;
  standingsRank?: Maybe<Scalars['String']['output']>;
  third?: Maybe<Scalars['String']['output']>;
  top5?: Maybe<Scalars['String']['output']>;
  top10?: Maybe<Scalars['String']['output']>;
  top25?: Maybe<Scalars['String']['output']>;
  tourCode: TourCode;
  wins?: Maybe<Scalars['String']['output']>;
  withdrawn?: Maybe<Scalars['String']['output']>;
  year: Scalars['Int']['output'];
};

export type PlayerProfileCourseResults = {
  __typename?: 'PlayerProfileCourseResults';
  coursePills: Array<CoursePills>;
  courses: Array<PlayerCourse>;
  playerId: Scalars['String']['output'];
  tourCode: TourCode;
  tourPills: Array<TourCode>;
};

/**   Player Profile Tournament Results */
export type PlayerProfileInfoItem = {
  __typename?: 'PlayerProfileInfoItem';
  logo?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
  wide: Scalars['Boolean']['output'];
};

export type PlayerProfileMajors = {
  __typename?: 'PlayerProfileMajors';
  playerId: Scalars['String']['output'];
  timelineHeaders: Array<Scalars['String']['output']>;
  timelineTournaments: Array<MajorTimeline>;
  tournaments: Array<MajorResultsTournament>;
};

export type PlayerProfileMessage = {
  __typename?: 'PlayerProfileMessage';
  message?: Maybe<Scalars['String']['output']>;
};

export type PlayerProfileOverviewItem = {
  __typename?: 'PlayerProfileOverviewItem';
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type PlayerProfileRows = {
  __typename?: 'PlayerProfileRows';
  rowContent: Array<Scalars['String']['output']>;
  rowTitle: Scalars['String']['output'];
  rowTitleDetail?: Maybe<Scalars['String']['output']>;
  secondContent?: Maybe<Array<Scalars['String']['output']>>;
};

export type PlayerProfileStat = {
  __typename?: 'PlayerProfileStat';
  categories: Array<PlayerProfileStatCategory>;
  stats: Array<PlayerProfileStatItem>;
  tour: TourCode;
};

export type PlayerProfileStatCategory = {
  __typename?: 'PlayerProfileStatCategory';
  category: PlayerProfileStatCategoryItem;
  displayTitle: Scalars['String']['output'];
};

export type PlayerProfileStatCategoryItem =
  | 'ALL'
  | 'APPROACH'
  | 'AROUND_GREEN'
  | 'DRIVING'
  | 'MONEY_FINISHES'
  | 'PACE_OF_PLAY'
  | 'POINTS_RANKINGS'
  | 'PUTTING'
  | 'SCORING'
  | 'STREAKS'
  | 'STROKES_GAINED';

export type PlayerProfileStatFull = {
  __typename?: 'PlayerProfileStatFull';
  categories: Array<PlayerProfileStatCategory>;
  displaySeason: Scalars['String']['output'];
  overview: Array<PlayerProfileStatItem>;
  season: Scalars['String']['output'];
  stats: Array<PlayerProfileStatItem>;
  topStats: Array<PlayerProfileStatItem>;
  tour: TourCode;
};

export type PlayerProfileStatItem = {
  __typename?: 'PlayerProfileStatItem';
  aboveOrBelow: ScoringTendency;
  category: Array<PlayerProfileStatCategoryItem>;
  fieldAverage: Scalars['String']['output'];
  noDetail?: Maybe<Scalars['Boolean']['output']>;
  rank: Scalars['String']['output'];
  rankDeviation?: Maybe<Scalars['Float']['output']>;
  statId: Scalars['String']['output'];
  supportingStat?: Maybe<PlayerProfileStatItemDetail>;
  supportingValue?: Maybe<PlayerProfileStatItemDetail>;
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type PlayerProfileStatItemDetail = {
  __typename?: 'PlayerProfileStatItemDetail';
  description: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type PlayerProfileStatYear = {
  __typename?: 'PlayerProfileStatYear';
  season: Scalars['String']['output'];
  tours: Array<TourCode>;
  year: Scalars['Int']['output'];
};

export type PlayerProfileStatsFullV2 = {
  __typename?: 'PlayerProfileStatsFullV2';
  messages?: Maybe<Array<PlayerProfileMessage>>;
  playerProfileStatsFull: Array<PlayerProfileStatFull>;
};

export type PlayerProfileTable = {
  __typename?: 'PlayerProfileTable';
  rows: Array<PlayerProfileRows>;
  tableDetail?: Maybe<Scalars['String']['output']>;
  tableName: Scalars['String']['output'];
};

export type PlayerProfileTournamentResults = {
  __typename?: 'PlayerProfileTournamentResults';
  playerId: Scalars['ID']['output'];
  tourPills: Array<TourPills>;
  tournamentPills: Array<TournamentResultPill>;
  tournaments: Array<TournamentResults>;
};

export type PlayerProfileTournamentRow = {
  __typename?: 'PlayerProfileTournamentRow';
  courseName: Scalars['String']['output'];
  date: Scalars['String']['output'];
  fedexFallPoints: Scalars['String']['output'];
  fedexFallRank: Scalars['String']['output'];
  points: Scalars['String']['output'];
  pointsRank: Scalars['String']['output'];
  position: Scalars['String']['output'];
  roundScores: Array<RoundScoreItem>;
  startDate: Scalars['String']['output'];
  toPar: Scalars['String']['output'];
  total: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
  tournamentName: Scalars['String']['output'];
  winnings: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type PlayerRecord = {
  __typename?: 'PlayerRecord';
  losses: Scalars['String']['output'];
  points: Scalars['String']['output'];
  ties: Scalars['String']['output'];
  wins: Scalars['String']['output'];
};

export type PlayerResultTournament = {
  __typename?: 'PlayerResultTournament';
  courseId: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  fedexFallPoints?: Maybe<Scalars['String']['output']>;
  fedexFallRank?: Maybe<Scalars['String']['output']>;
  finishPosition: Scalars['String']['output'];
  linkable: Scalars['Boolean']['output'];
  money: Scalars['String']['output'];
  points?: Maybe<Scalars['String']['output']>;
  pointsRank?: Maybe<Scalars['String']['output']>;
  r1: Scalars['String']['output'];
  r2: Scalars['String']['output'];
  r3: Scalars['String']['output'];
  r4: Scalars['String']['output'];
  r5: Scalars['String']['output'];
  toPar: Scalars['String']['output'];
  total: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentEndDate: Scalars['String']['output'];
  tournamentId: Scalars['ID']['output'];
  tournamentName: Scalars['String']['output'];
  tournamentStartDate: Scalars['String']['output'];
};

export type PlayerResults = {
  __typename?: 'PlayerResults';
  amateurHighlights?: Maybe<Array<Scalars['String']['output']>>;
  /** @deprecated use standingsDetails */
  cupLogo?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  cupLogoAccessibilityText?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  cupLogoDark?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  cupName?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  cupPoints?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  cupRank?: Maybe<Scalars['String']['output']>;
  cutsMade?: Maybe<Scalars['String']['output']>;
  displayYear: Scalars['String']['output'];
  disqualified?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Scalars['String']['output']>;
  missedCuts?: Maybe<Scalars['String']['output']>;
  officialMoney?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['String']['output'];
  /** @deprecated use standingsDetails */
  rankLogo?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  rankLogoAccessibilityText?: Maybe<Scalars['String']['output']>;
  /** @deprecated use standingsDetails */
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  runnerUp?: Maybe<Scalars['String']['output']>;
  seasonPills: Array<PlayerResultsSeasonPills>;
  seasonRecap?: Maybe<SeasonRecap>;
  /** @deprecated use standingsDetails */
  secondaryCup?: Maybe<SecondaryCupDetails>;
  standingsDetails: Array<ResultsStandingsDetail>;
  thirds?: Maybe<Scalars['String']['output']>;
  top5?: Maybe<Scalars['String']['output']>;
  top10?: Maybe<Scalars['String']['output']>;
  top25?: Maybe<Scalars['String']['output']>;
  tour: TourCode;
  tourcastEligible: Scalars['Boolean']['output'];
  tournaments: Array<PlayerResultTournament>;
  wins?: Maybe<Scalars['String']['output']>;
  withdrew?: Maybe<Scalars['String']['output']>;
  year: Scalars['Int']['output'];
};

export type PlayerResultsSeasonPills = {
  __typename?: 'PlayerResultsSeasonPills';
  tourCode: TourCode;
  years: Array<StatYearPills>;
};

export type PlayerRowHoleByHole = {
  __typename?: 'PlayerRowHoleByHole';
  courseCode: Scalars['String']['output'];
  courseId: Scalars['String']['output'];
  in?: Maybe<Scalars['String']['output']>;
  out?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['String']['output'];
  scores: Array<HoleScore>;
  total?: Maybe<Scalars['String']['output']>;
  totalToPar: Scalars['String']['output'];
};

export type PlayerRowV2 = {
  __typename?: 'PlayerRowV2';
  backNine: Scalars['Boolean']['output'];
  courseId: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  groupNumber: Scalars['Int']['output'];
  hasStoryContent: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  leaderboardSortOrder: Scalars['Int']['output'];
  movementAmount: Scalars['String']['output'];
  movementDirection: LeaderboardMovement;
  oddsOptionId?: Maybe<Scalars['String']['output']>;
  oddsSort?: Maybe<Scalars['Float']['output']>;
  oddsSwing?: Maybe<OddsSwing>;
  oddsToWin?: Maybe<Scalars['String']['output']>;
  oddsUrl?: Maybe<Scalars['String']['output']>;
  official: Scalars['String']['output'];
  officialSort: Scalars['Int']['output'];
  player: Player;
  playerState: PlayerState;
  position: Scalars['String']['output'];
  projected: Scalars['String']['output'];
  projectedSort: Scalars['Int']['output'];
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  rankingMovement: CupRankMovementDirection;
  rankingMovementAmount: Scalars['String']['output'];
  rankingMovementAmountSort: Scalars['Int']['output'];
  roundHeader: Scalars['String']['output'];
  roundStatus: Scalars['String']['output'];
  rounds: Array<Scalars['String']['output']>;
  score: Scalars['String']['output'];
  scoreSort: Scalars['Int']['output'];
  storyContentRound?: Maybe<Scalars['Int']['output']>;
  storyContentRounds: Array<Scalars['Int']['output']>;
  teeTime: Scalars['AWSTimestamp']['output'];
  thru: Scalars['String']['output'];
  thruSort: Scalars['Int']['output'];
  total: Scalars['String']['output'];
  totalSort: Scalars['Int']['output'];
  totalStrokes: Scalars['String']['output'];
};

export type PlayerRowV3 = {
  __typename?: 'PlayerRowV3';
  id: Scalars['ID']['output'];
  leaderboardSortOrder: Scalars['Int']['output'];
  /**   PLAYER INFO */
  player: Player;
  scoringData: LeaderboardScoringDataV3;
};

export type PlayerScorecardRoundStats = {
  __typename?: 'PlayerScorecardRoundStats';
  displayName: Scalars['String']['output'];
  performance: Array<ScorecardStatsItem>;
  round: Scalars['String']['output'];
  roundStatus: RoundStatus;
  scoring: Array<ScorecardStatsItem>;
  strokesGained: Array<StrokesGainedStats>;
};

export type PlayerScorecardStats = {
  __typename?: 'PlayerScorecardStats';
  id: Scalars['ID']['output'];
  rounds: Array<PlayerScorecardRoundStats>;
};

export type PlayerScorecardStatsCompressed = {
  __typename?: 'PlayerScorecardStatsCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type PlayerSponsorBrand =
  | 'ACE'
  | 'ADAM_SCOTT'
  | 'ADIDAS'
  | 'ADP'
  | 'AMAZON'
  | 'AON'
  | 'BONOBOS'
  | 'BRANDT_SNEDEKER'
  | 'BRIDGESTONE_GOLF'
  | 'CALLAWAY'
  | 'CALLAWAY_FEED'
  | 'CAMERON_PERCY'
  | 'CLEVELANDGOLF'
  | 'CLEVELANDGOLF_FEED'
  | 'COBRA'
  | 'COBRAPUMA'
  | 'CONCUR'
  | 'COUNTRYINNS'
  | 'EMPOWER_RETIREMENT'
  | 'FEDEX'
  | 'GOLDMAN_SACHS'
  | 'GOLFFOREVER'
  | 'GREYGOOSE'
  | 'HONMA'
  | 'IAN_POULTER'
  | 'JORDAN_SPIETH'
  | 'LEVELWEAR'
  | 'MASSAGE_ENVY'
  | 'MASTERCARD'
  | 'MATT_KUCHAR'
  | 'MERCEDES'
  | 'METLIFE'
  | 'MIZUNO'
  | 'NIKE'
  | 'NIKE_FEED'
  | 'OAKLEY'
  | 'OSTEO_BIFLEX'
  | 'PACIFICLIFE'
  | 'PERRY_ELLIS'
  | 'PGATOURLIVEFRI'
  | 'PGATOURLIVETHURS'
  | 'PHIL_MICKELSON'
  | 'PING'
  | 'PUMA'
  | 'PUTNAM'
  | 'PUTNAM_BRADLEY'
  | 'PUTNAM_CURRAN'
  | 'PUTNAM_STEELE'
  | 'QUICKENLOANS'
  | 'RICKIE_FOWLER'
  | 'RORY_MCILROY'
  | 'SERGIO_GARCIA'
  | 'SIKGOLF'
  | 'SKECHERS'
  | 'STRYKER_FRED'
  | 'STRYKER_HAL'
  | 'SUPERSTROKE'
  | 'TAYLORMADE'
  | 'TEST1'
  | 'TEST2'
  | 'TGLTEAMATL'
  | 'TGLTEAMBOS'
  | 'TGLTEAMJUP'
  | 'TGLTEAMLA'
  | 'TGLTEAMNY'
  | 'TGLTEAMSF'
  | 'TIGER_WOODS'
  | 'TITLEIST'
  | 'TITLEIST_BALL'
  | 'TITLEIST_FULL'
  | 'TMAG'
  | 'TP5'
  | 'UNITED_RENTALS'
  | 'VERITEX'
  | 'ZACH_JOHNSON'
  | 'ZURICH';

export type PlayerSponsors = {
  __typename?: 'PlayerSponsors';
  defaultSponsor?: Maybe<Sponsor>;
  playerId: Scalars['String']['output'];
  sponsors: Array<Sponsor>;
};

export type PlayerSponsorship = {
  __typename?: 'PlayerSponsorship';
  playerId: Scalars['String']['output'];
  sponsor?: Maybe<PlayerSponsorBrand>;
};

export type PlayerState =
  | 'ACTIVE'
  | 'BETWEEN_ROUNDS'
  | 'COMPLETE'
  | 'CUT'
  | 'DISQUALIFIED'
  | 'NOT_STARTED'
  | 'WITHDRAWN';

export type PlayerStoriesWidget = {
  __typename?: 'PlayerStoriesWidget';
  playerSponsorships?: Maybe<Array<PlayerStorySponsorship>>;
  storyRounds: Array<Scalars['String']['output']>;
  subTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
};

export type PlayerStorySponsorship = {
  __typename?: 'PlayerStorySponsorship';
  logoDarkUrl: Scalars['String']['output'];
  logoUrl: Scalars['String']['output'];
  sponsor: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type PlayerTournamentStatus = {
  __typename?: 'PlayerTournamentStatus';
  displayMode: PlayerTournamentStatusDisplayMode;
  playerId: Scalars['ID']['output'];
  position: Scalars['String']['output'];
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
  score: Scalars['String']['output'];
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  thru: Scalars['String']['output'];
  total: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type PlayerTournamentStatusDisplayMode =
  | 'IN_PROGRESS'
  | 'OFFICIAL'
  | 'TEE_TIMES';

export type PlayerVideo = {
  __typename?: 'PlayerVideo';
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
};

export type Playoff = {
  __typename?: 'Playoff';
  currentHole: Scalars['Int']['output'];
  holes: Array<PlayoffHole>;
  players: Array<PlayoffPlayer>;
  thru?: Maybe<Scalars['String']['output']>;
};

export type PlayoffDisplayType =
  | 'ALL'
  | 'NONE'
  | 'PLAY_BY_PLAY'
  | 'SCORECARD';

export type PlayoffHole = {
  __typename?: 'PlayoffHole';
  courseHole: Scalars['String']['output'];
  format?: Maybe<Scalars['String']['output']>;
  isTotal?: Maybe<Scalars['Boolean']['output']>;
  par: Scalars['String']['output'];
  playoffHole: Scalars['String']['output'];
};

export type PlayoffPlayer = {
  __typename?: 'PlayoffPlayer';
  active: Scalars['Boolean']['output'];
  player: Player;
  position: Scalars['String']['output'];
  scores: Array<SimpleScore>;
};

export type PlayoffScorecard = {
  __typename?: 'PlayoffScorecard';
  courseId: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  detailViewEnabled: Scalars['Boolean']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  holeDetail: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  locationDetail: Scalars['String']['output'];
  players: Array<ScorecardHeaderPlayer>;
  playoff: Playoff;
  playoffScoredType: PlayoffScoredType;
  title: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type PlayoffScoredType =
  | 'AGGREGATE'
  | 'SUDDEN_DEATH';

export type PlayoffTeams = {
  __typename?: 'PlayoffTeams';
  active: Scalars['Boolean']['output'];
  players: Array<TspScPlayer>;
  position: Scalars['String']['output'];
  scores: Array<SimpleScore>;
  teamId: Scalars['String']['output'];
};

export type PointOfInterestCoords = {
  __typename?: 'PointOfInterestCoords';
  bottomToTopCoords: StrokeCoordinates;
  leftToRightCoords: StrokeCoordinates;
};

export type PointOfInterestCoordsV4 = {
  __typename?: 'PointOfInterestCoordsV4';
  bottomToTopCoords: StrokeCoordinatesV4;
  leftToRightCoords: StrokeCoordinatesV4;
};

export type PowerRankings = {
  __typename?: 'PowerRankings';
  ascendingOrder: Scalars['Boolean']['output'];
  powerRankingsTableRow: Array<PowerRankingsTableRow>;
  tableTitle: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
  unorderedList: Scalars['Boolean']['output'];
};

export type PowerRankingsTableRow = {
  __typename?: 'PowerRankingsTableRow';
  comment: Scalars['String']['output'];
  commentNodes?: Maybe<Array<TourSponsorDescription>>;
  player?: Maybe<PlayerInfo>;
  rank?: Maybe<Scalars['Int']['output']>;
};

export type PresentedByConfig = {
  __typename?: 'PresentedByConfig';
  presentedBy: Sponsor;
  splashScreen: Sponsor;
};

export type PreviousMatch = {
  __typename?: 'PreviousMatch';
  matchId: Scalars['ID']['output'];
  matchResult: Scalars['String']['output'];
  matchScore: Scalars['String']['output'];
  matchStatus: Scalars['String']['output'];
  opponent: PreviousMatchOpponent;
  roundDisplayText: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
};

export type PreviousMatchOpponent = {
  __typename?: 'PreviousMatchOpponent';
  bracketSeed: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  headshot: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  shortName: Scalars['String']['output'];
  tournamentSeed: Scalars['String']['output'];
};

export type PreviousMatches = {
  __typename?: 'PreviousMatches';
  header: Scalars['String']['output'];
  matches?: Maybe<Array<PreviousMatch>>;
  messages?: Maybe<Array<Message>>;
};

export type PreviousRounds = {
  __typename?: 'PreviousRounds';
  matches?: Maybe<Array<PreviousMatch>>;
  roundHeader: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
};

export type PriorityCategory = {
  __typename?: 'PriorityCategory';
  detail?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  players: Array<PriorityPlayer>;
};

export type PriorityPlayer = {
  __typename?: 'PriorityPlayer';
  displayName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
};

export type PriorityRankings = {
  __typename?: 'PriorityRankings';
  categories: Array<PriorityCategory>;
  displayYear: Scalars['String']['output'];
  throughText: Scalars['String']['output'];
  tourCode: TourCode;
  year: Scalars['Int']['output'];
  yearPills: Array<StatYearPills>;
};

export type ProfileFedExFallStandings = {
  __typename?: 'ProfileFedExFallStandings';
  description: Scalars['String']['output'];
  detailCopy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** @deprecated Use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated Use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
  rank: Scalars['String']['output'];
  /** @deprecated Use rankLogoAsset */
  rankLogo?: Maybe<Scalars['String']['output']>;
  rankLogoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use rankLogoDarkAsset */
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoDarkAsset?: Maybe<ImageAsset>;
  title: Scalars['String']['output'];
  total: Scalars['String']['output'];
  totalLabel: Scalars['String']['output'];
  totals?: Maybe<Array<ProfileStandingsTotal>>;
  webview?: Maybe<Scalars['String']['output']>;
  webviewBrowserControls?: Maybe<Scalars['Boolean']['output']>;
};

export type ProfileHeadshot = {
  __typename?: 'ProfileHeadshot';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  image: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type ProfileOverview = {
  __typename?: 'ProfileOverview';
  /** @deprecated use profileStandings */
  fedexFallStandings?: Maybe<ProfileFedExFallStandings>;
  headshot: ProfileHeadshot;
  id: Scalars['ID']['output'];
  performance: Array<ProfilePerformance>;
  profileStandings: Array<ProfileStandings>;
  snapshot: Array<ProfileSnapshotItem>;
  /** @deprecated use profileStandings */
  standings: ProfileStandings;
  tglTeamLogo?: Maybe<Scalars['String']['output']>;
  tglTeamName?: Maybe<Scalars['String']['output']>;
};

export type ProfilePerformance = {
  __typename?: 'ProfilePerformance';
  displaySeason: Scalars['String']['output'];
  season: Scalars['String']['output'];
  stats: Array<ProfilePerformanceStat>;
  tour: TourCode;
};

export type ProfilePerformanceStat = {
  __typename?: 'ProfilePerformanceStat';
  career?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
  wide?: Maybe<Scalars['Boolean']['output']>;
};

export type ProfileSnapshotItem = {
  __typename?: 'ProfileSnapshotItem';
  description?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ProfileStandings = {
  __typename?: 'ProfileStandings';
  description: Scalars['String']['output'];
  detailCopy?: Maybe<Scalars['String']['output']>;
  detailUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** @deprecated Use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated Use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
  owgr?: Maybe<Scalars['String']['output']>;
  rank: Scalars['String']['output'];
  /** @deprecated Use rankLogoAsset */
  rankLogo?: Maybe<Scalars['String']['output']>;
  rankLogoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use rankLogoDarkAsset */
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoDarkAsset?: Maybe<ImageAsset>;
  title: Scalars['String']['output'];
  total: Scalars['String']['output'];
  totalLabel: Scalars['String']['output'];
  totals?: Maybe<Array<ProfileStandingsTotal>>;
  webview?: Maybe<Scalars['String']['output']>;
  webviewBrowserControls?: Maybe<Scalars['Boolean']['output']>;
};

export type ProfileStandingsTotal = {
  __typename?: 'ProfileStandingsTotal';
  total: Scalars['String']['output'];
  totalLabel: Scalars['String']['output'];
};

export type ProgramStat = {
  __typename?: 'ProgramStat';
  statName?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PromoItem = FieldPromoSection | PromoSection | PromoSectionNewsSection;

export type PromoSection = {
  __typename?: 'PromoSection';
  items: Array<PromoSectionItem>;
  title: Scalars['String']['output'];
};

export type PromoSectionContainer = {
  __typename?: 'PromoSectionContainer';
  sections: Array<PromoItem>;
};

export type PromoSectionItem = {
  __typename?: 'PromoSectionItem';
  accessibilityText: Scalars['String']['output'];
  backgroundColor: Scalars['String']['output'];
  externalLaunch: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  labelColor: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  webview: Scalars['String']['output'];
  webviewBrowserControls: Scalars['Boolean']['output'];
  webviewTitle: Scalars['String']['output'];
};

export type PromoSectionNewsSection = {
  __typename?: 'PromoSectionNewsSection';
  franchises: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type PromoSectionType =
  | 'GAMING'
  | 'MORE'
  | 'WEBGOLFBET';

export type Query = {
  __typename?: 'Query';
  /**
   *   Returns the AdConfig for the given optionally supplied tour and/or tournament
   * @deprecated use REST API
   */
  adTagConfig: AdConfig;
  allTimeRecordCategories: AllTimeRecordCategories;
  allTimeRecordStat: AllTimeRecordStat;
  alltoursponsors: Array<Maybe<TourSponsor>>;
  aon: Aon;
  /** @deprecated use REST API */
  articleAdConfig: AdTagConfig;
  /** @deprecated Use articleDetailsCompressed */
  articleDetails: NewsArticleDetails;
  articleDetailsCompressed: NewsArticleDetailsCompressed;
  broadcastTimes: BroadcastCoverage;
  /**   Note this is optional on purpose */
  bubble?: Maybe<BubbleWatch>;
  /** @deprecated use bubble */
  bubbleWatch?: Maybe<TourCupRankingEvent>;
  completeSchedule: Array<Schedule>;
  contentFragmentTabs: ContentFragmentTabs;
  contentFragmentType?: Maybe<ContentFragmentType>;
  contentFragmentsCompressed: ContentFragmentsCompressed;
  courseHolesStats: Array<HoleStatSummary>;
  courseStats: TournamentHoleStats;
  courseStatsDetails: CourseStatsDetails;
  courseStatsOverview: CourseStatsOverview;
  coverage: BroadcastCoverage;
  cupPastResults: CupPastResults;
  cupPlayOverviewLeaderboard: CupTournamentStatus;
  cupRoundLeaderboard: CupTournamentLeaderboard;
  cupRoundLeaderboardCompressed: CupTournamentLeaderboardCompressed;
  cupScorecard: CupScorecard;
  cupTeamRoster: CupTeamRosters;
  cupTeeTimes: CupTeeTimes;
  currentLeadersCompressed?: Maybe<CurrentLeadersCompressed>;
  defaultTourCup: TourCupRankingEvent;
  eaglesForImpact: EaglesForImpact;
  eventGuideConfig: EventGuideConfig;
  field: Field;
  fieldStats: FieldStats;
  franchises: Array<Scalars['String']['output']>;
  genericContent: GenericContent;
  genericContentCompressed: GenericContentCompressed;
  getExpertPicksTable: ExpertPicks;
  getPowerRankingsTable: PowerRankings;
  getRCPhotoGallery: RcPhotoGallery;
  getRelatedFact: RelatedFact;
  getShotCommentary: ShotCommentary;
  /**   Returns full details for a match based on supplied matchId */
  groupLocations: GroupLocation;
  groupStageRankings: GroupStageRankings;
  groupedField: GroupedField;
  historicalOdds?: Maybe<HistoricalPlayerOdds>;
  historicalScorecardStats: HistoricalPlayerScorecards;
  historicalTournamentsOdds?: Maybe<HistoricalTournamentOdds>;
  holeDetails: HoleDetail;
  leaderboardCompressedV2: LeaderboardCompressedV2;
  /**   Get the leaderboard for a tournament by tournamentID. The data in the payload property will be Base64 encoded. */
  leaderboardCompressedV3: LeaderboardCompressedV3;
  leaderboardHoleByHole: LeaderboardHoleByHole;
  leaderboardLegend: LeaderboardInfo;
  leaderboardStats: LeaderboardStats;
  leaderboardStrokes: LeaderboardStrokes;
  leaderboardStrokesCompressed: LeaderboardStrokesCompressed;
  leaderboardV2: LeaderboardV2;
  leaderboardV3: LeaderboardV3;
  legalDocsCompressed: GenericContentCompressed;
  liveAudioStream: AudioStream;
  liveVideoOverride: LiveVideoOverride;
  matchOutcomeIq: RyderCupMatchOutcomeIq;
  matchPlayLeaderboard: MpLeaderboard;
  matchPlayLeaderboardCompressed: LeaderboardCompressed;
  matchPlayPlayoffScorecard: MpPlayoffScorecard;
  matchPlayScorecard: MpScorecard;
  matchPlayScorecardResults: MpScorecardResults;
  matchPlayTeeTimes: MpTeeTimes;
  matchPlayTeeTimesCompressed: TeeTimesCompressed;
  networks: BroadcastNetworks;
  newletterSubscriptions: Array<Newsletter>;
  newsArticles: NewsArticles;
  newsFranchises: Array<NewsFranchise>;
  oddsGraph: OddsTimeline;
  oddsTable: OddsTable;
  oddsToWin: OddsToWinMarket;
  oddsToWinCompressed: OddsToWinMarketCompressed;
  player: PlayerBioWrapper;
  playerComparison: PlayerComparison;
  playerDirectory: PlayerDirectory;
  playerFinishStats?: Maybe<PlayerFinishStats>;
  playerHub?: Maybe<PlayerHubPlayerCompressed>;
  /** @deprecated use REST API */
  playerProfileCareer: PlayerProfileCareer;
  /** @deprecated use REST API */
  playerProfileCareerResults: PlayerProfileCareerResults;
  playerProfileCourseResults?: Maybe<PlayerProfileCourseResults>;
  playerProfileMajorResults?: Maybe<PlayerProfileMajors>;
  /** @deprecated use REST API */
  playerProfileOverview: ProfileOverview;
  playerProfileScorecards: HistoricalPlayerScorecards;
  /** @deprecated use REST API */
  playerProfileSeasonResults: PlayerResults;
  /** @deprecated use REST API */
  playerProfileStandings: Array<PlayerOverviewStandings>;
  playerProfileStats: Array<PlayerProfileStat>;
  /** @deprecated use REST API */
  playerProfileStatsFull: Array<PlayerProfileStatFull>;
  /** @deprecated use REST API */
  playerProfileStatsFullV2: PlayerProfileStatsFullV2;
  /** @deprecated use REST API */
  playerProfileStatsYears: Array<PlayerProfileStatYear>;
  playerProfileTournamentResults: PlayerProfileTournamentResults;
  /** @deprecated use REST API */
  playerSponsorships: Array<PlayerSponsorship>;
  playerTournamentStatus?: Maybe<PlayerTournamentStatus>;
  players: Array<PlayerBioWrapper>;
  playersOddsComparison: Array<PlayerComparisonOdds>;
  playoffScorecard: PlayoffScorecard;
  /** @deprecated use v3 */
  playoffScorecardV2?: Maybe<Array<PlayoffScorecard>>;
  playoffScorecardV3: TournamentPlayoffScorecards;
  playoffShotDetails: GroupShotDetails;
  playoffShotDetailsCompressed: GroupShotDetailsCompressed;
  podcastEpisodes: Array<Episode>;
  podcasts: Array<Audio>;
  presentedBy: PresentedByConfig;
  priorityRankings: PriorityRankings;
  promoSection: PromoSectionContainer;
  rankingsWinners: Array<RankingsPastWinner>;
  rsm: RsmStandings;
  rsmLeaderboard: RsmLeaderboard;
  ryderCupArticleDetailsCompressed: NewsArticleDetailsCompressed;
  ryderCupBroadcastCoverage: RyderCupBroadcastCoverage;
  ryderCupContentFragmentsCompressed: ContentFragmentsCompressed;
  ryderCupContentOptions: RyderCupMediaSearchOptions;
  ryderCupContentPageTabs: ContentFragmentTabs;
  ryderCupMixedMedia: Array<RyderCupContent>;
  ryderCupMixedMediaCompressed: RyderCupContentCompressed;
  ryderCupPlayerProfileCompressed: RyderCupPlayerProfileCompressed;
  /** @deprecated use ryderCupTeamRankingsV2 */
  ryderCupTeamRankings?: Maybe<RyderCupTeamRankings>;
  /** @deprecated use ryderCupTeamRankingsCompressedV2 */
  ryderCupTeamRankingsCompressed?: Maybe<RyderCupTeamRankingsCompressed>;
  ryderCupTeamRankingsCompressedV2?: Maybe<RyderCupTeamRankingsCompressed>;
  ryderCupTeamRankingsV2?: Maybe<RyderCupRankingsV2>;
  ryderCupTournament?: Maybe<RyderCupTournament>;
  ryderCupTournaments: Array<RyderCupTournamentOverview>;
  ryderCupVideoById?: Maybe<RcVideoPage>;
  scatterData: ScatterData;
  scatterDataCompressed: ScatterDataCompressed;
  schedule: Schedule;
  scheduleYears: ScheduleYears;
  scorecardCompressedV3: ScorecardCompressedV3;
  scorecardStats: PlayerScorecardStats;
  scorecardStatsComparison?: Maybe<ScorecardStatsComparison>;
  scorecardStatsV3: PlayerScorecardStats;
  scorecardStatsV3Compressed: PlayerScorecardStatsCompressed;
  scorecardV2: LeaderboardDrawerV2;
  scorecardV3: ScorecardV3;
  searchBarFeatures: SearchBarFeatures;
  /** @deprecated No longer supported */
  searchPlayers: Array<Player>;
  shotDetailsCompressedV3: ShotDetailsCompressedV3;
  shotDetailsV3: ShotDetails;
  /**   V4 Shot Details Query - Uses simplified coordinates and ImageAsset hole pickles (compressed only) */
  shotDetailsV4Compressed: ShotDetailsV4Compressed;
  signatureStandings: SignatureStandings;
  sponsoredArticles: Array<NewsArticle>;
  sponsoredArticlesV2: SponsoredArticles;
  /** @deprecated use REST API */
  sponsorships: PlayerSponsors;
  statDetails: StatDetails;
  statLeaders: StatLeaderCategory;
  statOverview: OverviewStats;
  statsLeadersMobile: MobileStatLeaders;
  teamStrokePlayLeaderboard: TspLeaderboard;
  teamStrokePlayLeaderboardCompressed: LeaderboardCompressed;
  teamStrokePlayScorecard: TspScorecard;
  teamStrokePlayScorecardRounds: TspScorecardRounds;
  teamStrokePlayTeeTimes: TspTeeTimes;
  teamStrokePlayTeeTimesCompressed: TeeTimesCompressed;
  teeTimes: TeeTimes;
  teeTimesCompressed: TeeTimesCompressed;
  teeTimesCompressedV2: TeeTimesCompressed;
  teeTimesV2: TeeTimesV2;
  /**   Returns full details for matches based on supplied matchIds */
  tglMatch?: Maybe<TglMatch>;
  /**   return a season from TGL based on supplied year, if year is ommitted current year returned, used by AEM */
  tglMatches: Array<TglMatch>;
  /**  ## TGL queries */
  tglSchedule: TglSchedule;
  tourCup: TourCupRankingEvent;
  tourCupCombined: TourCupCombined;
  tourCupSplit?: Maybe<TourCupSplit>;
  tourCups: Array<TourCupRankingEvent>;
  tourcastTable: TourcastTable;
  tourcastVideos: Array<Video>;
  tournamentGroupLocations: TournamentGroupLocation;
  tournamentHistory?: Maybe<TournamentHistory>;
  /** @deprecated DOES NOT WORK USE oddsWin / REST APIs */
  tournamentOddsCompressedV2: TournamentOddsCompressedV2;
  tournamentOddsToWin: TournamentOddsToWin;
  /** @deprecated DOES NOT WORK USE oddsToWin / REST APIs */
  tournamentOddsV2: TournamentOddsV2;
  tournamentOverview: TournamentOverview;
  tournamentPastResults: HistoricalLeaderboard;
  tournamentRecap: TournamentRecap;
  /**   Get tournament information for the given tournament IDs */
  tournaments: Array<Tournament>;
  tspPlayoffShotDetails: TeamShotDetails;
  tspPlayoffShotDetailsCompressed: TeamShotDetailsCompressed;
  universityRankings: UniversityRankings;
  universityTotalPoints: UniversityTotalPoints;
  upcomingNetworks: UpcomingBroadcastNetworks;
  upcomingSchedule: ScheduleUpcoming;
  videoById?: Maybe<Video>;
  videoFranchises?: Maybe<TourCategories>;
  videoHero: VideoHero;
  videoLandingPage?: Maybe<WatchLanding>;
  videoNavigation?: Maybe<VideoNavigation>;
  videoRecommendations: Array<Video>;
  videos: Array<Video>;
  weather: WeatherSummary;
  yourTour: YourTourStory;
  yourTourNews: Array<YourTourNews>;
};


export type QueryAdTagConfigArgs = {
  tour?: InputMaybe<TourCode>;
  tournamentId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllTimeRecordCategoriesArgs = {
  tourCode: TourCode;
};


export type QueryAllTimeRecordStatArgs = {
  recordId: Scalars['String']['input'];
  tourCode: TourCode;
};


export type QueryAlltoursponsorsArgs = {
  tourCode: TourCode;
};


export type QueryAonArgs = {
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryArticleAdConfigArgs = {
  franchise?: InputMaybe<Scalars['String']['input']>;
};


export type QueryArticleDetailsArgs = {
  path: Scalars['String']['input'];
};


export type QueryArticleDetailsCompressedArgs = {
  path: Scalars['String']['input'];
};


export type QueryBroadcastTimesArgs = {
  pastResults?: InputMaybe<Scalars['Boolean']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryBubbleArgs = {
  tourCode: TourCode;
  tournamentId: Scalars['ID']['input'];
};


export type QueryBubbleWatchArgs = {
  tourCode: TourCode;
};


export type QueryCompleteScheduleArgs = {
  filter?: InputMaybe<TournamentCategory>;
  tourCode: TourCode;
};


export type QueryContentFragmentTabsArgs = {
  path: Scalars['String']['input'];
};


export type QueryContentFragmentTypeArgs = {
  path: Scalars['String']['input'];
};


export type QueryContentFragmentsCompressedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  tourCode: TourCode;
};


export type QueryCourseHolesStatsArgs = {
  courseId: Scalars['ID']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryCourseStatsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryCourseStatsDetailsArgs = {
  queryType: CourseStatsId;
  round?: InputMaybe<ToughestRound>;
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCourseStatsOverviewArgs = {
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCoverageArgs = {
  pastResults?: InputMaybe<Scalars['Boolean']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryCupPastResultsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryCupPlayOverviewLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCupRoundLeaderboardArgs = {
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryCupRoundLeaderboardCompressedArgs = {
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryCupScorecardArgs = {
  matchId: Scalars['Int']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryCupTeamRosterArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryCupTeeTimesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryCurrentLeadersCompressedArgs = {
  tourCode?: InputMaybe<TourCode>;
  tournamentId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDefaultTourCupArgs = {
  tour: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEaglesForImpactArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryEventGuideConfigArgs = {
  tournamentId: Scalars['String']['input'];
};


export type QueryFieldArgs = {
  changesOnly?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  includeWithdrawn?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFieldStatsArgs = {
  fieldStatType?: InputMaybe<FieldStatType>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryFranchisesArgs = {
  tourCode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGenericContentArgs = {
  path: Scalars['String']['input'];
};


export type QueryGenericContentCompressedArgs = {
  path: Scalars['String']['input'];
};


export type QueryGetExpertPicksTableArgs = {
  path: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPowerRankingsTableArgs = {
  path: Scalars['String']['input'];
};


export type QueryGetRcPhotoGalleryArgs = {
  path: Scalars['String']['input'];
};


export type QueryGetRelatedFactArgs = {
  path: Scalars['String']['input'];
};


export type QueryGetShotCommentaryArgs = {
  playerId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['String']['input'];
};


export type QueryGroupLocationsArgs = {
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryGroupStageRankingsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryGroupedFieldArgs = {
  changesOnly?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  includeWithdrawn?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryHistoricalOddsArgs = {
  marketId: HistoricalOddsId;
  playerId: Scalars['String']['input'];
  timeStamp?: InputMaybe<Scalars['AWSDateTime']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryHistoricalScorecardStatsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryHistoricalTournamentsOddsArgs = {
  marketId: OddsMarketType;
  timeStamp?: InputMaybe<Scalars['AWSDateTime']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryHoleDetailsArgs = {
  courseId: Scalars['ID']['input'];
  hole: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryLeaderboardCompressedV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryLeaderboardCompressedV3Args = {
  id: Scalars['ID']['input'];
};


export type QueryLeaderboardHoleByHoleArgs = {
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryLeaderboardLegendArgs = {
  odds: Scalars['Boolean']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryLeaderboardStatsArgs = {
  id: Scalars['ID']['input'];
  statsType?: InputMaybe<LeaderboardStatsType>;
};


export type QueryLeaderboardStrokesArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaderboardStrokesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaderboardV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryLeaderboardV3Args = {
  id: Scalars['ID']['input'];
};


export type QueryLegalDocsCompressedArgs = {
  path: Scalars['String']['input'];
};


export type QueryLiveAudioStreamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLiveVideoOverrideArgs = {
  tourCode: TourCode;
  tournamentId: Scalars['String']['input'];
};


export type QueryMatchOutcomeIqArgs = {
  matchId: Scalars['Int']['input'];
  roundNumber?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryMatchPlayLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMatchPlayLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMatchPlayPlayoffScorecardArgs = {
  matchId: Scalars['ID']['input'];
  roundNum: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryMatchPlayScorecardArgs = {
  matchId: Scalars['ID']['input'];
  roundNum: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryMatchPlayScorecardResultsArgs = {
  matchId: Scalars['ID']['input'];
  roundNum: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryMatchPlayTeeTimesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryMatchPlayTeeTimesCompressedArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryNetworksArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryNewletterSubscriptionsArgs = {
  includeTournaments?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryNewsArticlesArgs = {
  franchise?: InputMaybe<Scalars['String']['input']>;
  franchises?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  playerId?: InputMaybe<Scalars['ID']['input']>;
  playerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  sectionName?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  targetYear?: InputMaybe<Scalars['String']['input']>;
  tour?: InputMaybe<TourCode>;
  tournamentNum?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewsFranchisesArgs = {
  allFranchises?: InputMaybe<Scalars['Boolean']['input']>;
  tourCode?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOddsGraphArgs = {
  marketId?: InputMaybe<HistoricalOddsId>;
  oddsTimeType?: InputMaybe<OddsTimeType>;
  playerIds: Array<Scalars['String']['input']>;
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryOddsTableArgs = {
  markets?: InputMaybe<Array<ArticleOddsMarketsInput>>;
  players?: InputMaybe<Array<ArticleOddsPlayerInput>>;
  timeStamp?: InputMaybe<Scalars['String']['input']>;
  tournamentId: Scalars['String']['input'];
  tournamentName: Scalars['String']['input'];
};


export type QueryOddsToWinArgs = {
  oddsToWinId: Scalars['ID']['input'];
};


export type QueryOddsToWinCompressedArgs = {
  oddsToWinId: Scalars['ID']['input'];
};


export type QueryPlayerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlayerComparisonArgs = {
  category?: InputMaybe<PlayerComparisonCategory>;
  playerIds: Array<Scalars['String']['input']>;
  tourCode: TourCode;
  tournamentId?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPlayerDirectoryArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  tourCode: TourCode;
};


export type QueryPlayerFinishStatsArgs = {
  playerId: Scalars['ID']['input'];
  statId: Scalars['String']['input'];
  tourCode: TourCode;
};


export type QueryPlayerHubArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileCareerArgs = {
  playerId: Scalars['String']['input'];
  tourCode?: InputMaybe<TourCode>;
};


export type QueryPlayerProfileCareerResultsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileCourseResultsArgs = {
  playerId: Scalars['String']['input'];
  tourCode?: InputMaybe<TourCode>;
};


export type QueryPlayerProfileMajorResultsArgs = {
  playerId: Scalars['String']['input'];
};


export type QueryPlayerProfileOverviewArgs = {
  currentTour?: InputMaybe<TourCode>;
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileScorecardsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileSeasonResultsArgs = {
  playerId: Scalars['ID']['input'];
  tourCode?: InputMaybe<TourCode>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPlayerProfileStandingsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileStatsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileStatsFullArgs = {
  playerId: Scalars['ID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPlayerProfileStatsFullV2Args = {
  playerId: Scalars['ID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPlayerProfileStatsYearsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayerProfileTournamentResultsArgs = {
  playerId: Scalars['ID']['input'];
  tourCode?: InputMaybe<TourCode>;
};


export type QueryPlayerSponsorshipsArgs = {
  sponsors?: InputMaybe<Array<PlayerSponsorBrand>>;
  tour: TourCode;
};


export type QueryPlayerTournamentStatusArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryPlayersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryPlayersOddsComparisonArgs = {
  playerIds: Array<Scalars['String']['input']>;
};


export type QueryPlayoffScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlayoffScorecardV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryPlayoffScorecardV3Args = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryPlayoffShotDetailsArgs = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryPlayoffShotDetailsCompressedArgs = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryPodcastEpisodesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  podcastId: Scalars['String']['input'];
};


export type QueryPriorityRankingsArgs = {
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPromoSectionArgs = {
  section: PromoSectionType;
};


export type QueryRankingsWinnersArgs = {
  tourCode?: InputMaybe<TourCode>;
};


export type QueryRsmArgs = {
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRsmLeaderboardArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  tournamentId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryRyderCupArticleDetailsCompressedArgs = {
  path: Scalars['String']['input'];
};


export type QueryRyderCupBroadcastCoverageArgs = {
  eventRegion?: InputMaybe<EventRegion>;
};


export type QueryRyderCupContentFragmentsCompressedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  tourCode: TourCode;
};


export type QueryRyderCupContentPageTabsArgs = {
  path: Scalars['String']['input'];
};


export type QueryRyderCupMixedMediaArgs = {
  articleTags?: InputMaybe<Array<Scalars['String']['input']>>;
  ascending: Scalars['Boolean']['input'];
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  currentContentId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  playerIds?: InputMaybe<Array<Scalars['String']['input']>>;
  team?: InputMaybe<RyderCupTeamType>;
  topic?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<RyderCupContentType>;
  videoTags?: InputMaybe<Array<Scalars['String']['input']>>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRyderCupMixedMediaCompressedArgs = {
  articleTags?: InputMaybe<Array<Scalars['String']['input']>>;
  ascending: Scalars['Boolean']['input'];
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  currentContentId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  playerIds?: InputMaybe<Array<Scalars['String']['input']>>;
  team?: InputMaybe<RyderCupTeamType>;
  topic?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<RyderCupContentType>;
  videoTags?: InputMaybe<Array<Scalars['String']['input']>>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRyderCupPlayerProfileCompressedArgs = {
  playerId: Scalars['String']['input'];
};


export type QueryRyderCupTeamRankingsArgs = {
  eventQuery?: InputMaybe<RyderCupRankingsQueryInput>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRyderCupTeamRankingsCompressedArgs = {
  eventQuery?: InputMaybe<RyderCupRankingsQueryInput>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRyderCupTeamRankingsCompressedV2Args = {
  eventQuery?: InputMaybe<RyderCupRankingsQueryInput>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRyderCupTeamRankingsV2Args = {
  eventQuery?: InputMaybe<RyderCupRankingsQueryInput>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRyderCupTournamentArgs = {
  year: Scalars['Int']['input'];
};


export type QueryRyderCupVideoByIdArgs = {
  brightcoveId: Scalars['ID']['input'];
};


export type QueryScatterDataArgs = {
  course: Scalars['Int']['input'];
  hole: Scalars['Int']['input'];
  tournamentId: Scalars['String']['input'];
};


export type QueryScatterDataCompressedArgs = {
  course: Scalars['Int']['input'];
  hole: Scalars['Int']['input'];
  tournamentId: Scalars['String']['input'];
};


export type QueryScheduleArgs = {
  filter?: InputMaybe<TournamentCategory>;
  tourCode: Scalars['String']['input'];
  year?: InputMaybe<Scalars['String']['input']>;
};


export type QueryScheduleYearsArgs = {
  tourCode: TourCode;
};


export type QueryScorecardCompressedV3Args = {
  officialEventData?: InputMaybe<Scalars['Boolean']['input']>;
  playerId: Scalars['ID']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryScorecardStatsArgs = {
  id: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
};


export type QueryScorecardStatsComparisonArgs = {
  category: PlayerComparisonCategory;
  playerIds: Array<Scalars['String']['input']>;
  round?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryScorecardStatsV3Args = {
  id: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
};


export type QueryScorecardStatsV3CompressedArgs = {
  id: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
};


export type QueryScorecardV2Args = {
  id: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
};


export type QueryScorecardV3Args = {
  officialEventData?: InputMaybe<Scalars['Boolean']['input']>;
  playerId: Scalars['ID']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QuerySearchBarFeaturesArgs = {
  tourCode?: InputMaybe<TourCode>;
};


export type QuerySearchPlayersArgs = {
  lastName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShotDetailsCompressedV3Args = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  playerId: Scalars['ID']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryShotDetailsV3Args = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  playerId: Scalars['ID']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryShotDetailsV4CompressedArgs = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  playerId: Scalars['ID']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QuerySignatureStandingsArgs = {
  tourCode: TourCode;
};


export type QuerySponsoredArticlesArgs = {
  sponsor: ArticleSponsor;
};


export type QuerySponsoredArticlesV2Args = {
  sponsor: ArticleSponsor;
};


export type QuerySponsorshipsArgs = {
  playerId: Scalars['ID']['input'];
};


export type QueryStatDetailsArgs = {
  eventQuery?: InputMaybe<StatDetailEventQuery>;
  statId: Scalars['String']['input'];
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStatLeadersArgs = {
  category: StatCategory;
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStatOverviewArgs = {
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStatsLeadersMobileArgs = {
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTeamStrokePlayLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeamStrokePlayLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeamStrokePlayScorecardArgs = {
  roundNum: Scalars['Int']['input'];
  teamId: Scalars['ID']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryTeamStrokePlayScorecardRoundsArgs = {
  teamId: Scalars['ID']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryTeamStrokePlayTeeTimesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTeamStrokePlayTeeTimesCompressedArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeeTimesCompressedV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryTeeTimesV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryTglMatchArgs = {
  matchId: Scalars['ID']['input'];
};


export type QueryTglMatchesArgs = {
  matchIds: Array<Scalars['ID']['input']>;
};


export type QueryTglScheduleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTourCupArgs = {
  id: Scalars['ID']['input'];
  type?: InputMaybe<TourCupType>;
};


export type QueryTourCupCombinedArgs = {
  eventQuery?: InputMaybe<StatDetailEventQuery>;
  id?: InputMaybe<Scalars['String']['input']>;
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTourCupSplitArgs = {
  eventQuery?: InputMaybe<StatDetailEventQuery>;
  id?: InputMaybe<Scalars['String']['input']>;
  tourCode: TourCode;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTourCupsArgs = {
  tour: TourCode;
  year: Scalars['Int']['input'];
};


export type QueryTourcastTableArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTourcastVideosArgs = {
  hole?: InputMaybe<Scalars['Int']['input']>;
  playerId: Scalars['ID']['input'];
  round: Scalars['Int']['input'];
  shot?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentGroupLocationsArgs = {
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentHistoryArgs = {
  tournamentId: Scalars['String']['input'];
};


export type QueryTournamentOddsCompressedV2Args = {
  oddsFormat?: InputMaybe<OddsFormat>;
  provider?: InputMaybe<OddsProvider>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentOddsToWinArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentOddsV2Args = {
  oddsFormat?: InputMaybe<OddsFormat>;
  provider?: InputMaybe<OddsProvider>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentOverviewArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentPastResultsArgs = {
  id: Scalars['ID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTournamentRecapArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  tournamentId: Scalars['String']['input'];
};


export type QueryTournamentsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QueryTspPlayoffShotDetailsArgs = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTspPlayoffShotDetailsCompressedArgs = {
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryUniversityRankingsArgs = {
  tourCode?: InputMaybe<TourCode>;
  week?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUniversityTotalPointsArgs = {
  season?: InputMaybe<Scalars['Int']['input']>;
  week?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUpcomingNetworksArgs = {
  tourCode?: InputMaybe<TourCode>;
  tournamentIds: Array<Scalars['ID']['input']>;
};


export type QueryUpcomingScheduleArgs = {
  filter?: InputMaybe<TournamentCategory>;
  tourCode: Scalars['String']['input'];
  year?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVideoByIdArgs = {
  brightcoveId: Scalars['ID']['input'];
  tourcast: Scalars['Boolean']['input'];
};


export type QueryVideoFranchisesArgs = {
  tourCode?: InputMaybe<TourCode>;
};


export type QueryVideoHeroArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
  tourCode: TourCode;
};


export type QueryVideoLandingPageArgs = {
  tourCode: TourCode;
};


export type QueryVideoNavigationArgs = {
  tourCode: TourCode;
};


export type QueryVideoRecommendationsArgs = {
  brightcoveId?: InputMaybe<Scalars['ID']['input']>;
  franchise?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<VideoLanguage>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  playerId?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<Scalars['String']['input']>;
  tour?: InputMaybe<Scalars['String']['input']>;
  tourCode?: InputMaybe<TourCode>;
  tournamentId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVideosArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  franchise?: InputMaybe<Scalars['String']['input']>;
  franchises?: InputMaybe<Array<Scalars['String']['input']>>;
  holeNumber?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<VideoLanguage>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  playerId?: InputMaybe<Scalars['String']['input']>;
  playerIds?: InputMaybe<Array<Scalars['String']['input']>>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  season?: InputMaybe<Scalars['String']['input']>;
  tour?: InputMaybe<Scalars['String']['input']>;
  tourCode?: InputMaybe<TourCode>;
  tournamentId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWeatherArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryYourTourArgs = {
  tourCode: TourCode;
};


export type QueryYourTourNewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  tourCode: TourCode;
};

export type RcContentTypeParent = {
  __typename?: 'RCContentTypeParent';
  displayValue: Scalars['String']['output'];
  queryValue: RyderCupContentType;
};

export type RcHomepageAssets = NewsArticle | RcPhotoGallery | Video;

export type RcPhotoGallery = {
  __typename?: 'RCPhotoGallery';
  authorReference?: Maybe<NewsArticleAuthor>;
  cta?: Maybe<CallToAction>;
  date?: Maybe<Scalars['AWSTimestamp']['output']>;
  eventYears?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<Image>>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  shareUrl?: Maybe<Scalars['String']['output']>;
  sponsor?: Maybe<NewsArticleSponsor>;
  subhead?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  team?: Maybe<RyderCupTeamType>;
  teaserImageOverride?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<ContentTopics>>;
  url?: Maybe<Scalars['String']['output']>;
};

/**
 *   type RCPlayerProfileContent {
 *      header: String!
 *      content: [NewsArticleNode]
 *  }
 */
export type RcPlayerTournamentRecord = {
  __typename?: 'RCPlayerTournamentRecord';
  fourBallPoints: Scalars['Int']['output'];
  foursomesPoints: Scalars['Int']['output'];
  matchesPlayed: Scalars['Int']['output'];
  pointsEarned: Scalars['Int']['output'];
  sectionTitle?: Maybe<Scalars['String']['output']>;
  singlesPoints: Scalars['Int']['output'];
};

export type RcTeamTypeParent = {
  __typename?: 'RCTeamTypeParent';
  displayValue: Scalars['String']['output'];
  queryValue: RyderCupTeamType;
};

export type RcVideoPage = {
  __typename?: 'RCVideoPage';
  upNextVideos?: Maybe<Array<Video>>;
  video?: Maybe<Video>;
};

export type RsmEventWinner = {
  __typename?: 'RSMEventWinner';
  birdies: Scalars['String']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
  tournamentName: Scalars['String']['output'];
};

export type RsmHistoricalWinner = {
  __typename?: 'RSMHistoricalWinner';
  displaySeason: Scalars['String']['output'];
  winners: Array<RsmEventWinner>;
  year: Scalars['Int']['output'];
};

export type RsmLeaderboard = {
  __typename?: 'RSMLeaderboard';
  dateText?: Maybe<Scalars['String']['output']>;
  isLive?: Maybe<Scalars['Boolean']['output']>;
  livePlayers: Array<RsmLeaderboardPlayer>;
  players: Array<RsmLeaderboardPlayer>;
  round?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
  tournamentName: Scalars['String']['output'];
};

export type RsmLeaderboardPlayer = {
  __typename?: 'RSMLeaderboardPlayer';
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  eventRank?: Maybe<Scalars['Int']['output']>;
  eventTotal: Scalars['String']['output'];
  eventTotalSort: Scalars['Int']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  projectedRank: Scalars['String']['output'];
  projectedRankSort: Scalars['Int']['output'];
  total: Scalars['String']['output'];
  totalSort: Scalars['Int']['output'];
};

export type RsmPlayer = {
  __typename?: 'RSMPlayer';
  birdies: Scalars['String']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  leading: Scalars['Boolean']['output'];
  playerId: Scalars['String']['output'];
  rank: Scalars['String']['output'];
};

export type RsmStandings = {
  __typename?: 'RSMStandings';
  currentLeaderboard: Array<RsmPlayer>;
  previousWinners: Array<RsmHistoricalWinner>;
  weeklyWinners: Array<RsmEventWinner>;
};

export type Ryder_Cup_Ranking_Tooltip =
  | 'CAPTAIN_PICK'
  | 'OUTCOME_IQ'
  | 'QUALIFICATION_INFO'
  | 'QUALIFIED_LOGO';

export type RadarBallTracjectory = {
  __typename?: 'RadarBallTracjectory';
  kind: Scalars['String']['output'];
  measuredTimeInterval: Array<Scalars['Float']['output']>;
  spinRateFit: Array<Scalars['Float']['output']>;
  timeInterval: Array<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  validTimeInterval: Array<Scalars['Float']['output']>;
  xFit: Array<Scalars['Float']['output']>;
  yFit: Array<Scalars['Float']['output']>;
  zFit: Array<Scalars['Float']['output']>;
};

export type RadarData = {
  __typename?: 'RadarData';
  actualFlightTime: Scalars['Int']['output'];
  apexHeight: Scalars['Float']['output'];
  apexRange: Scalars['Float']['output'];
  apexSide: Scalars['Float']['output'];
  ballImpactMeasured?: Maybe<Scalars['String']['output']>;
  ballSpeed: Scalars['Float']['output'];
  ballTrajectory: Array<RadarBallTracjectory>;
  clubSpeed: Scalars['Float']['output'];
  horizontalLaunchAngle: Scalars['Float']['output'];
  launchSpin: Scalars['Float']['output'];
  /** @deprecated use normalizedTrajectoryV2 */
  normalizedTrajectory: Array<RadarNormalizedTrajectory>;
  normalizedTrajectoryV2: Array<RadarNormalizedTrajectoryV2>;
  smashFactor: Scalars['Float']['output'];
  spinAxis: Scalars['Float']['output'];
  verticalLaunchAngle: Scalars['Float']['output'];
};

export type RadarNormalizedTrajectory = {
  __typename?: 'RadarNormalizedTrajectory';
  carry?: Maybe<Scalars['Int']['output']>;
  carrySide?: Maybe<Scalars['Int']['output']>;
  curve?: Maybe<Scalars['Int']['output']>;
  maxHeight?: Maybe<Scalars['Int']['output']>;
  spinAxis?: Maybe<Scalars['Float']['output']>;
  timeInterval?: Maybe<Array<Scalars['Float']['output']>>;
  valid: Scalars['Boolean']['output'];
  validTimeInterval?: Maybe<Array<Scalars['Float']['output']>>;
  windVelocity?: Maybe<Array<Scalars['Float']['output']>>;
  xFit?: Maybe<Array<Scalars['Float']['output']>>;
  yFit?: Maybe<Array<Scalars['Float']['output']>>;
  zFit?: Maybe<Array<Scalars['Float']['output']>>;
};

export type RadarNormalizedTrajectoryV2 = {
  __typename?: 'RadarNormalizedTrajectoryV2';
  carry?: Maybe<Scalars['Float']['output']>;
  carrySide?: Maybe<Scalars['Float']['output']>;
  curve?: Maybe<Scalars['Float']['output']>;
  maxHeight?: Maybe<Scalars['Float']['output']>;
  spinAxis?: Maybe<Scalars['Float']['output']>;
  timeInterval?: Maybe<Array<Scalars['Float']['output']>>;
  valid: Scalars['Boolean']['output'];
  validTimeInterval?: Maybe<Array<Scalars['Float']['output']>>;
  windVelocity?: Maybe<Array<Scalars['Float']['output']>>;
  xFit?: Maybe<Array<Scalars['Float']['output']>>;
  yFit?: Maybe<Array<Scalars['Float']['output']>>;
  zFit?: Maybe<Array<Scalars['Float']['output']>>;
};

export type RangeWeatherTemp = {
  __typename?: 'RangeWeatherTemp';
  maxTempC: Scalars['String']['output'];
  maxTempF: Scalars['String']['output'];
  minTempC: Scalars['String']['output'];
  minTempF: Scalars['String']['output'];
};

export type RankingsPastWinner = {
  __typename?: 'RankingsPastWinner';
  description: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  /** @deprecated Use imageAsset */
  image: Scalars['String']['output'];
  imageAsset: ImageAsset;
  playerId: Scalars['ID']['output'];
  season: Scalars['String']['output'];
};

export type RankingsTeams =
  | 'EUROPE'
  | 'USA';

export type RcBroadcastPrograms = {
  __typename?: 'RcBroadcastPrograms';
  broadcastDate: Scalars['String']['output'];
  programs: Array<RcProgram>;
};

export type RcBroadcastType =
  | 'AUDIO'
  | 'VIDEO';

export type RcProducts = {
  __typename?: 'RcProducts';
  cta?: Maybe<CallToAction>;
  header?: Maybe<Scalars['String']['output']>;
  imageGallery?: Maybe<Array<Scalars['String']['output']>>;
  path: Scalars['String']['output'];
  productDescription?: Maybe<Array<Maybe<NewsArticleNode>>>;
};

export type RcProgram = {
  __typename?: 'RcProgram';
  androidLink?: Maybe<Scalars['String']['output']>;
  appleAppStore?: Maybe<Scalars['String']['output']>;
  brightcoveId?: Maybe<Scalars['String']['output']>;
  broadcastType: RcBroadcastType;
  cta1?: Maybe<CallToAction>;
  cta2?: Maybe<CallToAction>;
  endTime?: Maybe<Scalars['String']['output']>;
  endTimeUtc?: Maybe<Scalars['AWSTimestamp']['output']>;
  featuredMatchPlayers?: Maybe<Array<Scalars['String']['output']>>;
  googlePlayStore?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  iosLink?: Maybe<Scalars['String']['output']>;
  isLive?: Maybe<Scalars['Boolean']['output']>;
  matchId?: Maybe<Scalars['String']['output']>;
  networkBackgroundColor?: Maybe<Scalars['String']['output']>;
  networkFontColor?: Maybe<Scalars['String']['output']>;
  networkLogo?: Maybe<Scalars['String']['output']>;
  networkLogoAsset?: Maybe<ImageAsset>;
  networkLogoDark?: Maybe<Scalars['String']['output']>;
  networkLogoDarkAsset?: Maybe<ImageAsset>;
  networkName?: Maybe<Scalars['String']['output']>;
  posterImage?: Maybe<Scalars['String']['output']>;
  posterImageAsset?: Maybe<ImageAsset>;
  regions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  roundNum?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
  startTimeUtc?: Maybe<Scalars['AWSTimestamp']['output']>;
  streamUrl?: Maybe<Scalars['String']['output']>;
  thumbnailImage?: Maybe<Scalars['String']['output']>;
  thumbnailImageAsset?: Maybe<ImageAsset>;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type RelatedFact = {
  __typename?: 'RelatedFact';
  factText?: Maybe<Array<TourSponsorDescription>>;
  photo?: Maybe<Scalars['String']['output']>;
};

export type RelatedFactsNode = {
  __typename?: 'RelatedFactsNode';
  path: Scalars['String']['output'];
};

export type ResultsStandingsDetail = {
  __typename?: 'ResultsStandingsDetail';
  /** @deprecated Use cupLogoAsset */
  cupLogo?: Maybe<Scalars['String']['output']>;
  cupLogoAccessibilityText?: Maybe<Scalars['String']['output']>;
  cupLogoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use cupLogoDarkAsset */
  cupLogoDark?: Maybe<Scalars['String']['output']>;
  cupLogoDarkAsset?: Maybe<ImageAsset>;
  cupName?: Maybe<Scalars['String']['output']>;
  cupPoints?: Maybe<Scalars['String']['output']>;
  cupRank?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use rankLogoAsset */
  rankLogo?: Maybe<Scalars['String']['output']>;
  rankLogoAccessibilityText?: Maybe<Scalars['String']['output']>;
  rankLogoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use rankLogoDarkAsset */
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoDarkAsset?: Maybe<ImageAsset>;
};

export type ResultsYears = {
  __typename?: 'ResultsYears';
  tour: TourCode;
  years: Array<Scalars['String']['output']>;
};

export type RolexClock = {
  __typename?: 'RolexClock';
  height?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type RoundFilter = {
  __typename?: 'RoundFilter';
  displayText: Scalars['String']['output'];
  roundNumbers: Array<Scalars['Int']['output']>;
};

export type RoundFormat =
  | 'ALTERNATE_SHOT'
  | 'BEST_BALL';

export type RoundScore = {
  __typename?: 'RoundScore';
  complete: Scalars['Boolean']['output'];
  courseAbbreviation?: Maybe<Scalars['String']['output']>;
  courseId?: Maybe<Scalars['String']['output']>;
  courseName: Scalars['String']['output'];
  currentHole: Scalars['Int']['output'];
  currentRound: Scalars['Boolean']['output'];
  firstNine: ScorecardRow;
  groupNumber: Scalars['Int']['output'];
  parTotal: Scalars['Int']['output'];
  roundNumber: Scalars['Int']['output'];
  scoreToPar: Scalars['String']['output'];
  secondNine: ScorecardRow;
  total: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type RoundScoreItem = {
  __typename?: 'RoundScoreItem';
  roundDisplay: Scalars['String']['output'];
  roundNum: Scalars['Int']['output'];
  roundScore: Scalars['String']['output'];
};

export type RoundStatus =
  | 'COMPLETE'
  | 'GROUPINGS_OFFICIAL'
  | 'IN_PROGRESS'
  | 'OFFICIAL'
  | 'SUSPENDED'
  | 'UPCOMING';

export type RoundStatusColor =
  | 'BLUE'
  | 'GRAY'
  | 'GREEN'
  | 'RED'
  | 'YELLOW';

export type RyderCupBio = {
  __typename?: 'RyderCupBio';
  bio?: Maybe<Array<Maybe<NewsArticleNode>>>;
};

export type RyderCupBroadcastCoverage = {
  __typename?: 'RyderCupBroadcastCoverage';
  broadcastPrograms: Array<RcBroadcastPrograms>;
};

export type RyderCupCaptain = {
  __typename?: 'RyderCupCaptain';
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
};

export type RyderCupContent = NewsArticle | RcPhotoGallery | Video;

export type RyderCupContentCategories = {
  __typename?: 'RyderCupContentCategories';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type RyderCupContentCompressed = {
  __typename?: 'RyderCupContentCompressed';
  input?: Maybe<PaginationDetails>;
  payload: Scalars['String']['output'];
};

export type RyderCupContentFragment = {
  __typename?: 'RyderCupContentFragment';
  fragments: Array<RyderCupContentFragments>;
  pageMetadata: PageMetadata;
  totalLength: Scalars['Int']['output'];
};

export type RyderCupContentFragments = BroadcastTableFragment | ContentFragmentTabs | ContentStory | ContentVideoCarousel | CourseInfo | DropdownFragment | EventHub | EventHubTable | FutureVenuesFragment | FutureVenuesTableFragment | GenericContent | HeroCarousel | HistoryInfo | HistoryScore | HomepageLead | HomepageNews | HomepageProgramStanding | HomepageScoring | HospitalityCard | ImageBlock | JumpToSection | KopHeader | KopSignUp | KopStandingsList | KopSubheader | KopUpcomingTournament | KopUserProfile | KopZigZag | MatchCard | MediaGallery | MessageBanner | OddsToWinTracker | RcProducts | RolexClock | RyderCupCourseModel | RyderCupLatestNewsSection | RyderCupPlayerBios | SecondaryHero | TeamRankings | ThreeUpPhoto | ThreeUpStats | TicketSectionContainer | TwoColumn | VideoHero;

export type RyderCupContentPlayer = {
  __typename?: 'RyderCupContentPlayer';
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type RyderCupContentTags = {
  __typename?: 'RyderCupContentTags';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type RyderCupContentType =
  | 'ALL'
  | 'ARTICLES'
  | 'PHOTO_GALLERY'
  | 'VIDEOS'
  | 'VIDEO_ARTICLES';

export type RyderCupCourse = {
  __typename?: 'RyderCupCourse';
  countryCode?: Maybe<Scalars['String']['output']>;
  courseCity?: Maybe<Scalars['String']['output']>;
  courseCountry?: Maybe<Scalars['String']['output']>;
  courseName?: Maybe<Scalars['String']['output']>;
  courseState?: Maybe<Scalars['String']['output']>;
};

export type RyderCupCourseModel = {
  __typename?: 'RyderCupCourseModel';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  courseDescription?: Maybe<Array<Maybe<NewsArticleNode>>>;
  courseId?: Maybe<Scalars['String']['output']>;
  courseName?: Maybe<Scalars['String']['output']>;
  courseYardage?: Maybe<Scalars['String']['output']>;
  holes?: Maybe<Array<RyderCupCourseModelHole>>;
  par?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type RyderCupCourseModelHole = {
  __typename?: 'RyderCupCourseModelHole';
  holeBeautyImage?: Maybe<Scalars['String']['output']>;
  holeDescription?: Maybe<Array<Maybe<NewsArticleNode>>>;
  holeFlyoverVideo?: Maybe<Video>;
  holeNumber: Scalars['Int']['output'];
  holePickleImage?: Maybe<Scalars['String']['output']>;
  par: Scalars['Int']['output'];
  yardage: Scalars['Int']['output'];
};

/**  ## Ryder Cup */
export type RyderCupEventState =
  | 'LIVE_WEEK'
  | 'LIVE_WEEKEND'
  | 'OFF_SEASON'
  | 'POINTS_RACE'
  | 'POST_EVENT'
  | 'PRE_EVENT';

export type RyderCupLatestNewsSection = {
  __typename?: 'RyderCupLatestNewsSection';
  bottomCta?: Maybe<CallToAction>;
  content?: Maybe<Array<RcHomepageAssets>>;
  franchiseTags?: Maybe<Array<Scalars['String']['output']>>;
  limit?: Maybe<Scalars['Int']['output']>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  topCta?: Maybe<CallToAction>;
};

export type RyderCupMatchOutcomeIq = {
  __typename?: 'RyderCupMatchOutcomeIQ';
  euMatchWin: Scalars['Float']['output'];
  holes: Array<OutComeIqHole>;
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  matchDraw: Scalars['Float']['output'];
  matchId: Scalars['Int']['output'];
  roundNum: Scalars['Int']['output'];
  toolTip?: Maybe<ToolTipComponent>;
  usMatchWin: Scalars['Float']['output'];
};

export type RyderCupMediaSearchOptions = {
  __typename?: 'RyderCupMediaSearchOptions';
  contentTypes: Array<RcContentTypeParent>;
  playerOptions: Array<RyderCupPlayerOption>;
  teamOptions: Array<RcTeamTypeParent>;
  topicOptions: Array<RyderCupTopicOption>;
  yearOptions: Array<Scalars['String']['output']>;
};

export type RyderCupPlayer = {
  __typename?: 'RyderCupPlayer';
  countryCode?: Maybe<Scalars['String']['output']>;
  countryName?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
};

export type RyderCupPlayerBios = {
  __typename?: 'RyderCupPlayerBios';
  bios?: Maybe<Array<Maybe<RyderCupBio>>>;
  headshots?: Maybe<Array<Scalars['String']['output']>>;
};

export type RyderCupPlayerOption = {
  __typename?: 'RyderCupPlayerOption';
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type RyderCupPlayerProfile = {
  __typename?: 'RyderCupPlayerProfile';
  playerId: Scalars['String']['output'];
  playerProfileHeader: RyderCupPlayerProfileHeader;
  profileContentSections: Array<RyderCupPlayerProfileSection>;
  team: RankingsTeams;
};

export type RyderCupPlayerProfileCompressed = {
  __typename?: 'RyderCupPlayerProfileCompressed';
  payload: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
};

export type RyderCupPlayerProfileHeader = {
  __typename?: 'RyderCupPlayerProfileHeader';
  age?: Maybe<Scalars['String']['output']>;
  appearances?: Maybe<Scalars['Int']['output']>;
  headshot: ProfileHeadshot;
  wins?: Maybe<Scalars['Int']['output']>;
};

export type RyderCupPlayerProfileSection = GenericContent | RcPlayerTournamentRecord | RolexClock | RyderCupLatestNewsSection | ThreeUpStats;

export type RyderCupRankingsQueryInput = {
  team: RankingsTeams;
  tournamentId: Scalars['String']['input'];
};

export type RyderCupRankingsRow = InformationRow | StatDetailsPlayer;

export type RyderCupRankingsTeam = {
  __typename?: 'RyderCupRankingsTeam';
  banner?: Maybe<Scalars['String']['output']>;
  captain?: Maybe<Scalars['String']['output']>;
  captainLabel?: Maybe<Scalars['String']['output']>;
  displaySeason?: Maybe<Scalars['String']['output']>;
  europeCaptain?: Maybe<Scalars['String']['output']>;
  europeInfoBlurb?: Maybe<Scalars['String']['output']>;
  europeViceCaptain?: Maybe<Scalars['String']['output']>;
  header?: Maybe<Scalars['String']['output']>;
  lastUpdated?: Maybe<Scalars['String']['output']>;
  qualifiedIndex?: Maybe<Scalars['Int']['output']>;
  rankings: Array<RyderCupRankingsRow>;
  teamName: Scalars['String']['output'];
  toolTips: Array<ToolTipComponent>;
  tournamentPills: Array<StatTournamentPill>;
  usInfoBlurb?: Maybe<Scalars['String']['output']>;
  viceCaptain?: Maybe<Scalars['String']['output']>;
  viceCaptainLabel?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
  years: Array<StatYearPills>;
};

export type RyderCupRankingsV2 = {
  __typename?: 'RyderCupRankingsV2';
  defaultUS: Scalars['Boolean']['output'];
  teams: Array<RyderCupRankingsTeam>;
};

export type RyderCupTeam = {
  __typename?: 'RyderCupTeam';
  captain: RyderCupCaptain;
  players: Array<RyderCupPlayer>;
  teamLogo: Scalars['String']['output'];
  teamName: Scalars['String']['output'];
};

export type RyderCupTeamRankings = {
  __typename?: 'RyderCupTeamRankings';
  defaultUS: Scalars['Boolean']['output'];
  euroBanner: Scalars['String']['output'];
  euroCaptainLabel?: Maybe<Scalars['String']['output']>;
  euroDisplaySeason?: Maybe<Scalars['String']['output']>;
  euroHeader: Scalars['String']['output'];
  euroLastUpdated: Scalars['String']['output'];
  euroRankings: Array<RyderCupRankingsRow>;
  euroToolTips?: Maybe<Array<ToolTipComponent>>;
  euroTournamentPills?: Maybe<Array<StatTournamentPill>>;
  euroViceCaptainLabel?: Maybe<Scalars['String']['output']>;
  euroYear?: Maybe<Scalars['Int']['output']>;
  euroYears?: Maybe<Array<StatYearPills>>;
  europeCaptain?: Maybe<Scalars['String']['output']>;
  europeInfoBlurb?: Maybe<Scalars['String']['output']>;
  europeQualifiedIndex?: Maybe<Scalars['Int']['output']>;
  europeViceCaptain?: Maybe<Scalars['String']['output']>;
  usBanner: Scalars['String']['output'];
  usCaptain?: Maybe<Scalars['String']['output']>;
  usCaptainLabel?: Maybe<Scalars['String']['output']>;
  usDisplaySeason?: Maybe<Scalars['String']['output']>;
  usHeader: Scalars['String']['output'];
  usInfoBlurb?: Maybe<Scalars['String']['output']>;
  usLastUpdated: Scalars['String']['output'];
  usQualifiedIndex?: Maybe<Scalars['Int']['output']>;
  usRankings: Array<RyderCupRankingsRow>;
  usToolTips?: Maybe<Array<ToolTipComponent>>;
  usTournamentPills?: Maybe<Array<StatTournamentPill>>;
  usViceCaptain?: Maybe<Scalars['String']['output']>;
  usViceCaptainLabel?: Maybe<Scalars['String']['output']>;
  usYear?: Maybe<Scalars['Int']['output']>;
  usYears?: Maybe<Array<StatYearPills>>;
};

export type RyderCupTeamRankingsCompressed = {
  __typename?: 'RyderCupTeamRankingsCompressed';
  payload: Scalars['String']['output'];
};

export type RyderCupTeamType =
  | 'BOTH'
  | 'EUROPE'
  | 'USA';

export type RyderCupTopicOption = {
  __typename?: 'RyderCupTopicOption';
  displayValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type RyderCupTournament = {
  __typename?: 'RyderCupTournament';
  course?: Maybe<RyderCupCourse>;
  euroScore: Scalars['String']['output'];
  euroTeam: RyderCupTeam;
  historyInfo?: Maybe<HistoryInfo>;
  usScore: Scalars['String']['output'];
  usTeam: RyderCupTeam;
  winner: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type RyderCupTournamentOverview = {
  __typename?: 'RyderCupTournamentOverview';
  course?: Maybe<RyderCupCourse>;
  endDate?: Maybe<Scalars['String']['output']>;
  euroScore: Scalars['String']['output'];
  euroTeamLogo: Scalars['String']['output'];
  /** @deprecated logoAsset */
  logo?: Maybe<Scalars['String']['output']>;
  logoAsset: ImageAsset;
  startDate?: Maybe<Scalars['String']['output']>;
  tournamentName: Scalars['String']['output'];
  usScore: Scalars['String']['output'];
  usTeamLogo: Scalars['String']['output'];
  winner?: Maybe<Scalars['String']['output']>;
  year: Scalars['Int']['output'];
};

export type Story_Type =
  | 'MOMENTS'
  | 'PLAYER_STORIES'
  | 'TOPIC_STORIES';

export type ScatterCoord = {
  __typename?: 'ScatterCoord';
  player: ScatterPlayer;
  result: HoleScoreStatus;
  shotCoords: ScatterShotData;
};

export type ScatterData = {
  __typename?: 'ScatterData';
  courseId: Scalars['Int']['output'];
  hole: Scalars['Int']['output'];
  holePickle?: Maybe<HolePickle>;
  id: Scalars['ID']['output'];
  rounds: Array<ScatterRound>;
  /**   Recommend combo of tournamentID, course and hole */
  tournamentId: Scalars['String']['output'];
};

export type ScatterDataCompressed = {
  __typename?: 'ScatterDataCompressed';
  courseId: Scalars['Int']['output'];
  hole: Scalars['Int']['output'];
  payload: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
};

export type ScatterPlayer = {
  __typename?: 'ScatterPlayer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ScatterRound = {
  __typename?: 'ScatterRound';
  display?: Maybe<Scalars['String']['output']>;
  num: Scalars['Int']['output'];
  pinCoords: ScatterShotData;
  strokes: Array<ScatterStroke>;
};

export type ScatterShotCoordData = {
  __typename?: 'ScatterShotCoordData';
  landscapeCoords?: Maybe<ScattterXyData>;
  portraitCoords?: Maybe<ScattterXyData>;
};

export type ScatterShotData = {
  __typename?: 'ScatterShotData';
  green: ScatterShotCoordData;
  overview: ScatterShotCoordData;
};

export type ScatterStroke = {
  __typename?: 'ScatterStroke';
  playerShots: Array<ScatterCoord>;
  strokeNumber: Scalars['Int']['output'];
};

export type ScattterXyData = {
  __typename?: 'ScattterXYData';
  enhancedX: Scalars['Float']['output'];
  /**   New field, -1 if no data */
  enhancedY: Scalars['Float']['output'];
  tourcastX: Scalars['Float']['output'];
  tourcastY: Scalars['Float']['output'];
  tourcastZ: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type Schedule = {
  __typename?: 'Schedule';
  completed: Array<ScheduleMonth>;
  filters?: Maybe<Array<ScheduleTournamentFilter>>;
  seasonYear: Scalars['String']['output'];
  tour: Scalars['String']['output'];
  upcoming: Array<ScheduleMonth>;
};

export type ScheduleChampion = {
  __typename?: 'ScheduleChampion';
  displayName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
};

export type ScheduleDisplay =
  | 'SHOW'
  | 'SHOW_NO_LINK';

export type ScheduleMonth = {
  __typename?: 'ScheduleMonth';
  month: Scalars['String']['output'];
  monthSort?: Maybe<Scalars['Int']['output']>;
  tournaments: Array<ScheduleTournament>;
  year: Scalars['String']['output'];
};

export type ScheduleTournament = {
  __typename?: 'ScheduleTournament';
  androidTicketmasterApiKey?: Maybe<Scalars['String']['output']>;
  androidTicketmasterScheme?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use beautyImageAsset */
  beautyImage?: Maybe<Scalars['String']['output']>;
  beautyImageAsset?: Maybe<ImageAsset>;
  champion: Scalars['String']['output'];
  championEarnings?: Maybe<Scalars['String']['output']>;
  championId: Scalars['String']['output'];
  champions: Array<ScheduleChampion>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  countryCode: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  date: Scalars['String']['output'];
  dateAccessibilityText: Scalars['String']['output'];
  display: ScheduleDisplay;
  id: Scalars['ID']['output'];
  iosTicketmasterApiKey?: Maybe<Scalars['String']['output']>;
  purse?: Maybe<Scalars['String']['output']>;
  sequenceNumber: Scalars['Int']['output'];
  sortDate?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['AWSTimestamp']['output'];
  state: Scalars['String']['output'];
  stateCode: Scalars['String']['output'];
  status?: Maybe<ScheduleTournamentStatus>;
  /** @deprecated Name does not reflect intent, use ticketmasterAttractionId */
  ticketmasterApiKey?: Maybe<Scalars['String']['output']>;
  ticketmasterAttractionId?: Maybe<Scalars['String']['output']>;
  ticketsEnabled: Scalars['Boolean']['output'];
  ticketsURL?: Maybe<Scalars['String']['output']>;
  tourStandingHeading?: Maybe<Scalars['String']['output']>;
  tourStandingValue?: Maybe<Scalars['String']['output']>;
  tournamentCategoryInfo?: Maybe<TournamentCategoryInfo>;
  /** @deprecated use tournamentLogoAsset */
  tournamentLogo: Scalars['String']['output'];
  tournamentLogoAsset: ImageAsset;
  tournamentName: Scalars['String']['output'];
  tournamentSiteURL?: Maybe<Scalars['String']['output']>;
  tournamentStatus: TournamentStatus;
  useTournamentSiteURL: Scalars['Boolean']['output'];
};

export type ScheduleTournamentFilter = {
  __typename?: 'ScheduleTournamentFilter';
  name: Scalars['String']['output'];
  type: TournamentCategory;
};

export type ScheduleTournamentStatus = {
  __typename?: 'ScheduleTournamentStatus';
  leaderboardTakeover: Scalars['Boolean']['output'];
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
};

export type ScheduleUpcoming = {
  __typename?: 'ScheduleUpcoming';
  filters?: Maybe<Array<ScheduleTournamentFilter>>;
  id: Scalars['ID']['output'];
  tournaments: Array<ScheduleTournament>;
};

export type ScheduleYear = {
  __typename?: 'ScheduleYear';
  default: Scalars['Boolean']['output'];
  displayValue: Scalars['String']['output'];
  queryValue: Scalars['String']['output'];
};

export type ScheduleYears = {
  __typename?: 'ScheduleYears';
  years: Array<ScheduleYear>;
};

export type ScorecardCompressedV3 = {
  __typename?: 'ScorecardCompressedV3';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type ScorecardHeaderPlayer = {
  __typename?: 'ScorecardHeaderPlayer';
  active: Scalars['Boolean']['output'];
  finalRoundTotal: Scalars['String']['output'];
  player: Player;
  position: Scalars['String']['output'];
  roundDisplay: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type ScorecardRow = {
  __typename?: 'ScorecardRow';
  holes: Array<HoleScore>;
  parTotal: Scalars['Int']['output'];
  total: Scalars['String']['output'];
  totalLabel: Scalars['String']['output'];
};

export type ScorecardStandings = {
  __typename?: 'ScorecardStandings';
  logo?: Maybe<ImageAsset>;
  logoDark?: Maybe<ImageAsset>;
  points: Scalars['String']['output'];
};

export type ScorecardStatsComparison = {
  __typename?: 'ScorecardStatsComparison';
  category: PlayerComparisonCategory;
  categoryPills: Array<PlayerComparisonCategoryPill>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  noDataMessage: Scalars['String']['output'];
  roundDisplay?: Maybe<Scalars['String']['output']>;
  roundNum?: Maybe<Scalars['Int']['output']>;
  table: PlayerComparisonTable;
  tournamentId: Scalars['ID']['output'];
};

export type ScorecardStatsItem = {
  __typename?: 'ScorecardStatsItem';
  label: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  statId: Scalars['String']['output'];
  total: Scalars['String']['output'];
  yearToDate: Scalars['String']['output'];
};

export type ScorecardTabFeature =
  | 'EQUIPMENT'
  | 'HIGHLIGHTS'
  | 'ODDS'
  | 'SCORECARD'
  | 'STATS';

export type ScorecardUpdateCompressedV3 = {
  __typename?: 'ScorecardUpdateCompressedV3';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type ScorecardUpdateV3 = {
  __typename?: 'ScorecardUpdateV3';
  backNine: Scalars['Boolean']['output'];
  currentHole?: Maybe<Scalars['Int']['output']>;
  currentHoleDisplay: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  currentShotDisplay?: Maybe<Scalars['String']['output']>;
  drawerDisplayState: DrawerDisplayState;
  groupNumber: Scalars['Int']['output'];
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  playByPlay?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['String']['output'];
  playerState?: Maybe<PlayerState>;
  profileEnabled: Scalars['Boolean']['output'];
  roundScores: Array<RoundScore>;
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  tournamentName: Scalars['String']['output'];
};

export type ScorecardV3 = {
  __typename?: 'ScorecardV3';
  backNine: Scalars['Boolean']['output'];
  currentHole?: Maybe<Scalars['Int']['output']>;
  currentHoleDisplay: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  currentShotDisplay?: Maybe<Scalars['String']['output']>;
  drawerDisplayState: DrawerDisplayState;
  groupNumber: Scalars['Int']['output'];
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  playByPlay?: Maybe<Scalars['String']['output']>;
  player: Player;
  playerState?: Maybe<PlayerState>;
  profileEnabled: Scalars['Boolean']['output'];
  roundScores: Array<RoundScore>;
  standings?: Maybe<ScorecardStandings>;
  teeTime?: Maybe<Scalars['AWSTimestamp']['output']>;
  totalStrokes?: Maybe<Scalars['String']['output']>;
  tournamentName: Scalars['String']['output'];
};

export type ScoringLevel =
  | 'BASIC'
  | 'STATS'
  | 'TOURCAST';

export type ScoringTendency =
  | 'ABOVE'
  | 'BELOW'
  | 'EVEN';

export type SearchBarFeatures = {
  __typename?: 'SearchBarFeatures';
  playerFeatures: SearchBarPlayerFeatures;
};

export type SearchBarPlayer = {
  __typename?: 'SearchBarPlayer';
  displayName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
};

export type SearchBarPlayerFeatures = {
  __typename?: 'SearchBarPlayerFeatures';
  playerHeader: Scalars['String']['output'];
  players: Array<SearchBarPlayer>;
};

export type SeasonDisplayHeader = {
  __typename?: 'SeasonDisplayHeader';
  endYear?: Maybe<Scalars['Int']['output']>;
  startYear: Scalars['Int']['output'];
};

export type SeasonRecap = {
  __typename?: 'SeasonRecap';
  displayMostRecentSeason?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<SeasonRecapSeason>>;
  mostRecentRecapYear?: Maybe<Scalars['Int']['output']>;
  tourCode: TourCode;
};

export type SeasonRecapItems = {
  __typename?: 'SeasonRecapItems';
  body: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type SeasonRecapSeason = {
  __typename?: 'SeasonRecapSeason';
  displaySeason: Scalars['String']['output'];
  items: Array<SeasonRecapItems>;
  year: Scalars['Int']['output'];
};

export type SecondaryCupDetails = {
  __typename?: 'SecondaryCupDetails';
  cupLogo?: Maybe<Scalars['String']['output']>;
  cupLogoAccessibilityText?: Maybe<Scalars['String']['output']>;
  cupLogoDark?: Maybe<Scalars['String']['output']>;
  cupName?: Maybe<Scalars['String']['output']>;
  cupPoints?: Maybe<Scalars['String']['output']>;
  cupRank?: Maybe<Scalars['String']['output']>;
  rankLogo?: Maybe<Scalars['String']['output']>;
  rankLogoAccessibilityText?: Maybe<Scalars['String']['output']>;
  rankLogoDark?: Maybe<Scalars['String']['output']>;
};

export type SecondaryHero = {
  __typename?: 'SecondaryHero';
  backgroundPhoto?: Maybe<Scalars['String']['output']>;
  photoPosition?: Maybe<Scalars['String']['output']>;
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  subheader?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SegmentedCupRanking = {
  __typename?: 'SegmentedCupRanking';
  defaultSelection: Scalars['Boolean']['output'];
  rankings: Array<CupRankingPlayer>;
  title: Scalars['String']['output'];
};

export type SegmentedCupRankingWrapper = {
  __typename?: 'SegmentedCupRankingWrapper';
  segments?: Maybe<Array<Maybe<SegmentedCupRanking>>>;
};

export type ShotCommentary = {
  __typename?: 'ShotCommentary';
  commentary: Array<ShotCommentaryItem>;
  playerId: Scalars['String']['output'];
  round: Scalars['Int']['output'];
  tournamentId: Scalars['String']['output'];
};

export type ShotCommentaryItem = {
  __typename?: 'ShotCommentaryItem';
  active: Scalars['Boolean']['output'];
  commentary: Scalars['String']['output'];
  hole: Scalars['Int']['output'];
  shot: Scalars['Int']['output'];
  strokeId: Scalars['Int']['output'];
};

export type ShotCommentaryItemInput = {
  active: Scalars['Boolean']['input'];
  commentary: Scalars['String']['input'];
  hole: Scalars['Int']['input'];
  shot: Scalars['Int']['input'];
  strokeId: Scalars['Int']['input'];
};

export type ShotDetailHole = {
  __typename?: 'ShotDetailHole';
  displayHoleNumber: Scalars['String']['output'];
  enhancedPickle?: Maybe<HolePickle>;
  fairwayCenter: StrokeCoordinates;
  green: Scalars['Boolean']['output'];
  holeNumber: Scalars['Int']['output'];
  /** @deprecated Use holePickleBottomToTopAsset */
  holePickleBottomToTop: Scalars['String']['output'];
  holePickleBottomToTopAsset: ImageAsset;
  /** @deprecated Use holePickleGreenBottomToTopAsset */
  holePickleGreenBottomToTop: Scalars['String']['output'];
  holePickleGreenBottomToTopAsset: ImageAsset;
  /** @deprecated Use holePickleGreenLeftToRightAsset */
  holePickleGreenLeftToRight: Scalars['String']['output'];
  holePickleGreenLeftToRightAsset: ImageAsset;
  /** @deprecated Use holePickleLeftToRightAsset */
  holePickleLeftToRight: Scalars['String']['output'];
  holePickleLeftToRightAsset: ImageAsset;
  par: Scalars['Int']['output'];
  pinGreen: PointOfInterestCoords;
  pinOverview: PointOfInterestCoords;
  rank?: Maybe<Scalars['String']['output']>;
  score: Scalars['String']['output'];
  status: HoleScoreStatus;
  strokes: Array<HoleStroke>;
  teeGreen: PointOfInterestCoords;
  teeOverview: PointOfInterestCoords;
  yardage: Scalars['Int']['output'];
};

export type ShotDetailHoleV4 = {
  __typename?: 'ShotDetailHoleV4';
  displayHoleNumber: Scalars['String']['output'];
  enhancedPickle?: Maybe<HolePickle>;
  fairwayCenter: StrokeCoordinatesV4;
  green: Scalars['Boolean']['output'];
  holeNumber: Scalars['Int']['output'];
  holePickleBottomToTopAsset: ImageAsset;
  holePickleGreenBottomToTopAsset: ImageAsset;
  holePickleGreenLeftToRightAsset: ImageAsset;
  holePickleLeftToRightAsset: ImageAsset;
  par: Scalars['Int']['output'];
  pinGreen: PointOfInterestCoordsV4;
  pinOverview: PointOfInterestCoordsV4;
  rank?: Maybe<Scalars['String']['output']>;
  score: Scalars['String']['output'];
  status: HoleScoreStatus;
  strokes: Array<HoleStrokeV4>;
  teeGreen: PointOfInterestCoordsV4;
  teeOverview: PointOfInterestCoordsV4;
  yardage: Scalars['Int']['output'];
};

export type ShotDetailVideo = {
  __typename?: 'ShotDetailVideo';
  duration: Scalars['Int']['output'];
  holeNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pubDate: Scalars['AWSTimestamp']['output'];
  shotNumber: Scalars['String']['output'];
  /** @deprecated Use thumbnailAsset */
  thumbnail: Scalars['String']['output'];
  thumbnailAsset: ImageAsset;
  title: Scalars['String']['output'];
};

export type ShotDetails = {
  __typename?: 'ShotDetails';
  defaultHolePickle: HolePickleType;
  displayType: ShotDetailsDisplayType;
  groupPlayers: Array<Scalars['String']['output']>;
  holes: Array<ShotDetailHole>;
  id: Scalars['ID']['output'];
  lineColor: Scalars['String']['output'];
  message: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  round: Scalars['Int']['output'];
  /** @deprecated Use tourcastVideos */
  shotVideo?: Maybe<Video>;
  /** @deprecated Use tourcastVideos */
  shotVideos?: Maybe<Array<Video>>;
  textColor?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
};

export type ShotDetailsCompressed = {
  __typename?: 'ShotDetailsCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type ShotDetailsCompressedV3 = {
  __typename?: 'ShotDetailsCompressedV3';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type ShotDetailsDisplayType =
  | 'ALL'
  | 'NONE'
  | 'PLAY_BY_PLAY';

export type ShotDetailsV4 = {
  __typename?: 'ShotDetailsV4';
  displayType: ShotDetailsDisplayType;
  groupPlayers: Array<Scalars['String']['output']>;
  holePickleType: HolePickleType;
  holes: Array<ShotDetailHoleV4>;
  id: Scalars['ID']['output'];
  lineColor: Scalars['String']['output'];
  message: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  round: Scalars['Int']['output'];
  textColor?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['ID']['output'];
};

export type ShotDetailsV4Compressed = {
  __typename?: 'ShotDetailsV4Compressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type ShotLinkCoordWrapper = {
  __typename?: 'ShotLinkCoordWrapper';
  bottomToTopCoords: ShotLinkCoordinates;
  leftToRightCoords: ShotLinkCoordinates;
};

export type ShotLinkCoordWrapperV4 = {
  __typename?: 'ShotLinkCoordWrapperV4';
  bottomToTopCoords: ShotLinkCoordinatesV4;
  leftToRightCoords: ShotLinkCoordinatesV4;
};

export type ShotLinkCoordinates = {
  __typename?: 'ShotLinkCoordinates';
  fromCoords: StrokeCoordinates;
  toCoords: StrokeCoordinates;
};

export type ShotLinkCoordinatesV4 = {
  __typename?: 'ShotLinkCoordinatesV4';
  fromCoords: StrokeCoordinatesV4;
  toCoords: StrokeCoordinatesV4;
};

export type SignatureEventsRankLogos = {
  __typename?: 'SignatureEventsRankLogos';
  dark: Scalars['String']['output'];
  darkAsset: ImageAsset;
  light: Scalars['String']['output'];
  lightAsset: ImageAsset;
  tooltipText: Scalars['String']['output'];
  tooltipTitle: Scalars['String']['output'];
};

export type SignatureInfoLine = {
  __typename?: 'SignatureInfoLine';
  text: Scalars['String']['output'];
};

export type SignaturePlayer = {
  __typename?: 'SignaturePlayer';
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  movementAmount: Scalars['String']['output'];
  movementDirection: LeaderboardMovement;
  playerId: Scalars['ID']['output'];
  projected: Scalars['String']['output'];
  projectedPoints: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
  started: Scalars['String']['output'];
};

export type SignaturePlayerRow = SignatureInfoLine | SignaturePlayer;

export type SignatureStandings = {
  __typename?: 'SignatureStandings';
  infoDescription: Scalars['String']['output'];
  infoTitle: Scalars['String']['output'];
  interim: SignatureStandingsData;
  linktoField: Scalars['Boolean']['output'];
  /** @deprecated Use mobileLogoAsset */
  mobileLogo: Scalars['String']['output'];
  mobileLogoAsset: ImageAsset;
  noFieldText?: Maybe<Scalars['String']['output']>;
  noFieldToolTipText?: Maybe<Scalars['String']['output']>;
  noFieldToolTipTitle?: Maybe<Scalars['String']['output']>;
  official: SignatureStandingsData;
  tournamentID: Scalars['ID']['output'];
  tournamentInfo: SignatureStandingsTournamentInfo;
};

export type SignatureStandingsData = {
  __typename?: 'SignatureStandingsData';
  description?: Maybe<Scalars['String']['output']>;
  emptyTableDescription?: Maybe<Scalars['String']['output']>;
  emptyTableTitle?: Maybe<Scalars['String']['output']>;
  eyebrowText?: Maybe<Scalars['String']['output']>;
  players: Array<SignaturePlayerRow>;
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  sponsorName?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  tooltipText?: Maybe<Scalars['String']['output']>;
};

export type SignatureStandingsTournamentInfo = {
  __typename?: 'SignatureStandingsTournamentInfo';
  displayDate: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
  /** @deprecated use tournamentLogoAsset */
  tournamentLogo: Array<Scalars['String']['output']>;
  tournamentLogoAsset: Array<ImageAsset>;
  tournamentName: Scalars['String']['output'];
  tournamentStatus: TournamentStatus;
};

export type SimpleScore = {
  __typename?: 'SimpleScore';
  holeNumber: Scalars['Int']['output'];
  isTotal?: Maybe<Scalars['Boolean']['output']>;
  score: Scalars['String']['output'];
  status: HoleScoreStatus;
};

export type SocialType =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'youtube';

export type Sponsor = {
  __typename?: 'Sponsor';
  accessibilityText: Scalars['String']['output'];
  /** @deprecated use logoAsset */
  logo?: Maybe<Scalars['String']['output']>;
  logoAsset: ImageAsset;
  /** @deprecated use logoDarkAsset */
  logoDark?: Maybe<Scalars['String']['output']>;
  logoDarkAsset: ImageAsset;
  /** @deprecated use logoTabletAsset */
  logoTablet?: Maybe<Scalars['String']['output']>;
  logoTabletAsset: ImageAsset;
  /** @deprecated use logoTabletDarkAsset */
  logoTabletDark?: Maybe<Scalars['String']['output']>;
  logoTabletDarkAsset: ImageAsset;
  sponsor: PlayerSponsorBrand;
};

export type SponsorImage = {
  __typename?: 'SponsorImage';
  accessibilityText: Scalars['String']['output'];
  link?: Maybe<Scalars['String']['output']>;
  /** @deprecated use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
};

export type SponsoredArticles = {
  __typename?: 'SponsoredArticles';
  articleSponsor: ArticleSponsor;
  articles: Array<NewsArticle>;
  cta?: Maybe<CallToAction>;
  moreNewsTitle?: Maybe<Scalars['String']['output']>;
};

export type StandardCupRanking = {
  __typename?: 'StandardCupRanking';
  rankings: Array<CupRankingPlayer>;
};

export type StandardWeatherTemp = {
  __typename?: 'StandardWeatherTemp';
  tempC: Scalars['String']['output'];
  tempF: Scalars['String']['output'];
};

export type StandingStat = {
  __typename?: 'StandingStat';
  statName: Scalars['String']['output'];
  statValue: Scalars['String']['output'];
};

export type StatCategory =
  | 'APPROACH_GREEN'
  | 'AROUND_GREEN'
  | 'FACTS_AND_FIGURES'
  | 'MONEY_FINISHES'
  | 'OFF_TEE'
  | 'POINTS_RANKINGS'
  | 'PUTTING'
  | 'SCORING'
  | 'STREAKS'
  | 'STROKES_GAINED';

export type StatCategoryConfig = {
  __typename?: 'StatCategoryConfig';
  category: Scalars['String']['output'];
  categoryType?: Maybe<StatCategoryConfigType>;
  displayName: Scalars['String']['output'];
  subCategories: Array<StatSubCategory>;
};

export type StatCategoryConfigType =
  | 'ALL_TIME_RECORDS'
  | 'TRADITIONAL_STAT';

export type StatCategoryStat = {
  __typename?: 'StatCategoryStat';
  statId: Scalars['String']['output'];
  statTitle: Scalars['String']['output'];
};

export type StatColor =
  | 'BLACK'
  | 'GRAY'
  | 'GREEN'
  | 'RED';

export type StatDetailEventQuery = {
  queryType: StatDetailQueryType;
  tournamentId: Scalars['String']['input'];
};

export type StatDetailQueryType =
  | 'EVENT_ONLY'
  | 'THROUGH_EVENT';

export type StatDetailTourAvg = {
  __typename?: 'StatDetailTourAvg';
  displayName: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type StatDetails = {
  __typename?: 'StatDetails';
  cutOffButtonText?: Maybe<Scalars['String']['output']>;
  cutOffNumber?: Maybe<Scalars['Int']['output']>;
  displaySeason: Scalars['String']['output'];
  lastProcessed: Scalars['String']['output'];
  rows: Array<StatDetailsRow>;
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  statCategories: Array<StatCategoryConfig>;
  statDescription: Scalars['String']['output'];
  statHeaders: Array<Scalars['String']['output']>;
  statId: Scalars['String']['output'];
  statTitle: Scalars['String']['output'];
  statType: CategoryStatType;
  tourAvg?: Maybe<Scalars['String']['output']>;
  tourCode: TourCode;
  tournamentPills: Array<StatTournamentPill>;
  year: Scalars['Int']['output'];
  yearPills: Array<StatYearPills>;
};

export type StatDetailsPlayer = {
  __typename?: 'StatDetailsPlayer';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  filter?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  rankChangeTendency?: Maybe<StatRankMovement>;
  rankDiff: Scalars['String']['output'];
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  stats: Array<CategoryPlayerStat>;
};

export type StatDetailsRow = StatDetailTourAvg | StatDetailsPlayer;

export type StatLeaderCategory = {
  __typename?: 'StatLeaderCategory';
  categoryHeader: Scalars['String']['output'];
  displayYear: Scalars['String']['output'];
  otherCategories: Array<StatCategoryConfig>;
  statCategory: StatCategory;
  subCategories: Array<StatLeaderSubCategory>;
  tourCode: TourCode;
  year: Scalars['Int']['output'];
};

export type StatLeaderSubCategory = {
  __typename?: 'StatLeaderSubCategory';
  stats: Array<LeaderStat>;
  subCatPromo?: Maybe<StatLeaderSubCategoryPromo>;
  subCategoryName: Scalars['String']['output'];
};

export type StatLeaderSubCategoryPromo = {
  __typename?: 'StatLeaderSubCategoryPromo';
  image: Scalars['String']['output'];
  link: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type StatRankMovement =
  | 'CONSTANT'
  | 'DOWN'
  | 'UP';

export type StatSubCategory = {
  __typename?: 'StatSubCategory';
  displayName?: Maybe<Scalars['String']['output']>;
  stats: Array<StatCategoryStat>;
};

export type StatTournamentPill = {
  __typename?: 'StatTournamentPill';
  displayName: Scalars['String']['output'];
  endDateDisplay?: Maybe<Scalars['String']['output']>;
  tournamentId: Scalars['String']['output'];
};

export type StatWeekPill = {
  __typename?: 'StatWeekPill';
  displayWeek: Scalars['String']['output'];
  week: Scalars['Int']['output'];
};

export type StatYearPills = {
  __typename?: 'StatYearPills';
  displaySeason: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type Stats = {
  __typename?: 'Stats';
  id: Scalars['ID']['output'];
  statAvg?: Maybe<Scalars['String']['output']>;
  statName: Scalars['String']['output'];
  statRank: Scalars['Int']['output'];
  statValue: Scalars['String']['output'];
};

export type StreamUrls = {
  __typename?: 'StreamUrls';
  applePodcast: Scalars['String']['output'];
  googlePodcast: Scalars['String']['output'];
  spotify: Scalars['String']['output'];
  stitcher: Scalars['String']['output'];
  tuneIn: Scalars['String']['output'];
};

export type StrokeCoordinates = {
  __typename?: 'StrokeCoordinates';
  enhancedX: Scalars['Float']['output'];
  enhancedY: Scalars['Float']['output'];
  tourcastX: Scalars['Float']['output'];
  tourcastY: Scalars['Float']['output'];
  tourcastZ: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};

/**
 *   V4 Shot Details Types - Simplified coordinates without z/enhanced fields
 *  Note: ImageAsset type is already defined elsewhere in schema
 */
export type StrokeCoordinatesV4 = {
  __typename?: 'StrokeCoordinatesV4';
  tourcastX: Scalars['Float']['output'];
  tourcastY: Scalars['Float']['output'];
  tourcastZ: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type StrokesGainedStats = {
  __typename?: 'StrokesGainedStats';
  graph: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  shortLabel: Scalars['String']['output'];
  statId: Scalars['String']['output'];
  total: Scalars['String']['output'];
  totalNum: Scalars['Float']['output'];
  yearToDate: Scalars['String']['output'];
  yearToDateNum: Scalars['Float']['output'];
};

export type Style = {
  __typename?: 'Style';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type SubMarket = {
  __typename?: 'SubMarket';
  header: Scalars['String']['output'];
  id: Scalars['String']['output'];
  options: Array<OddsOptionV2>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onUpdateBubble?: Maybe<BubbleWatch>;
  onUpdateBubbleWatch?: Maybe<TourCupRankingEvent>;
  onUpdateCourseStats?: Maybe<TournamentHoleStats>;
  onUpdateCoverage?: Maybe<BroadcastCoverage>;
  onUpdateCupOverviewLeaderboard?: Maybe<CupTournamentStatus>;
  onUpdateCupRoundLeaderboard?: Maybe<CupTournamentLeaderboard>;
  onUpdateCupRoundLeaderboardCompressed?: Maybe<CupTournamentLeaderboardCompressed>;
  onUpdateCupScorecard?: Maybe<CupScorecard>;
  onUpdateCurrentLeadersCompressed?: Maybe<CurrentLeadersCompressed>;
  onUpdateGroupLocations?: Maybe<GroupLocationCourse>;
  onUpdateGroupLocationsEnhanced?: Maybe<GroupLocationCourse>;
  onUpdateHoleDetails?: Maybe<HoleDetail>;
  onUpdateLeaderboardCompressedV2?: Maybe<LeaderboardCompressedV2>;
  onUpdateLeaderboardCompressedV3?: Maybe<LeaderboardUpdateCompressedV3>;
  onUpdateLeaderboardStrokes?: Maybe<LeaderboardStrokes>;
  onUpdateLeaderboardStrokesCompresssed?: Maybe<LeaderboardStrokesCompressed>;
  onUpdateLeaderboardV2?: Maybe<LeaderboardV2>;
  onUpdateMatchOutcomeIq?: Maybe<RyderCupMatchOutcomeIq>;
  onUpdateMatchPlayLeaderboard?: Maybe<MpLeaderboard>;
  onUpdateMatchPlayLeaderboardCompressed?: Maybe<LeaderboardCompressed>;
  onUpdateMatchPlayPlayoffScorecard?: Maybe<MpPlayoffScorecard>;
  onUpdateMatchPlayScorecard?: Maybe<MpScorecard>;
  onUpdateMatchPlayTeeTimes?: Maybe<MpTeeTimes>;
  onUpdateMatchPlayTeeTimesCompressed?: Maybe<TeeTimesCompressed>;
  onUpdateOddsToWinMarket?: Maybe<OddsToWinMarket>;
  onUpdateOddsToWinMarketCompressed?: Maybe<OddsToWinMarketCompressed>;
  onUpdatePlayerHub?: Maybe<PlayerHubPlayerCompressed>;
  onUpdatePlayerTournamentStatus?: Maybe<PlayerTournamentStatus>;
  onUpdatePlayoffScorecard?: Maybe<PlayoffScorecard>;
  /** @deprecated Use onUpdatePlayoffScorecardV3. This sub does not work */
  onUpdatePlayoffScorecardV2?: Maybe<Array<Maybe<PlayoffScorecard>>>;
  onUpdatePlayoffScorecardV3?: Maybe<TournamentPlayoffScorecards>;
  onUpdatePlayoffShotDetails?: Maybe<GroupShotDetails>;
  onUpdatePlayoffShotDetailsCompressed?: Maybe<GroupShotDetailsCompressed>;
  onUpdateScorecardCompressedV3?: Maybe<ScorecardUpdateCompressedV3>;
  onUpdateScorecardStatsCompressedV3?: Maybe<PlayerScorecardStatsCompressed>;
  onUpdateScorecardV2?: Maybe<LeaderboardDrawerV2>;
  onUpdateShotCommentary?: Maybe<ShotCommentary>;
  /**    V2 version that only sends updated holes */
  onUpdateShotDetailsCompressedV3?: Maybe<ShotDetailsCompressedV3>;
  /**   V4 Shot Details Subscription - Uses simplified coordinates */
  onUpdateShotDetailsV4Compressed?: Maybe<ShotDetailsV4Compressed>;
  onUpdateTGLMatch?: Maybe<TglMatch>;
  onUpdateTSPPlayoffShotDetails?: Maybe<TeamShotDetails>;
  onUpdateTSPPlayoffShotDetailsCompressed?: Maybe<TeamShotDetailsCompressed>;
  onUpdateTeamPlayLeaderboard?: Maybe<TspLeaderboard>;
  onUpdateTeamPlayLeaderboardCompressed?: Maybe<LeaderboardCompressed>;
  onUpdateTeamPlayScorecard?: Maybe<TspScorecard>;
  onUpdateTeamPlayScorecardRounds?: Maybe<TspScorecardRounds>;
  onUpdateTeamStrokePlayTeeTimes?: Maybe<TspTeeTimes>;
  onUpdateTeamStrokePlayTeeTimesCompressed?: Maybe<TeeTimesCompressed>;
  onUpdateTeeTimes?: Maybe<TeeTimes>;
  onUpdateTeeTimesCompressed?: Maybe<TeeTimesCompressed>;
  onUpdateTeeTimesCompressedV2?: Maybe<TeeTimesCompressed>;
  onUpdateTeeTimesV2?: Maybe<TeeTimesV2>;
  onUpdateTourCup?: Maybe<TourCupRankingEvent>;
  onUpdateTourcastTable?: Maybe<TourcastTable>;
  onUpdateTournament?: Maybe<Tournament>;
  onUpdateTournamentGroupLocations?: Maybe<TournamentGroupLocation>;
  onUpdateUpcomingSchedule?: Maybe<ScheduleUpcoming>;
};


export type SubscriptionOnUpdateBubbleArgs = {
  bubbleId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateBubbleWatchArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCourseStatsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCoverageArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCupOverviewLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCupRoundLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCupRoundLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCupScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateCurrentLeadersCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateGroupLocationsArgs = {
  courseId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateGroupLocationsEnhancedArgs = {
  courseId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateHoleDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateLeaderboardCompressedV2Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateLeaderboardCompressedV3Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateLeaderboardStrokesArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateLeaderboardStrokesCompresssedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateLeaderboardV2Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchOutcomeIqArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchPlayLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchPlayLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchPlayPlayoffScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchPlayScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchPlayTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateMatchPlayTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateOddsToWinMarketArgs = {
  oddsToWinId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateOddsToWinMarketCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayerHubArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayerTournamentStatusArgs = {
  playerId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayoffScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayoffScorecardV2Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayoffScorecardV3Args = {
  tournamentId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayoffShotDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdatePlayoffShotDetailsCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateScorecardCompressedV3Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateScorecardStatsCompressedV3Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateScorecardV2Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateShotCommentaryArgs = {
  playerId: Scalars['String']['input'];
  round: Scalars['Int']['input'];
  tournamentId: Scalars['String']['input'];
};


export type SubscriptionOnUpdateShotDetailsCompressedV3Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateShotDetailsV4CompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTglMatchArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTspPlayoffShotDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTspPlayoffShotDetailsCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeamPlayLeaderboardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeamPlayLeaderboardCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeamPlayScorecardArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeamPlayScorecardRoundsArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeamStrokePlayTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeamStrokePlayTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeeTimesArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeeTimesCompressedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeeTimesCompressedV2Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTeeTimesV2Args = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTourCupArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTourcastTableArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateTournamentGroupLocationsArgs = {
  round: Scalars['Int']['input'];
  tournamentId: Scalars['ID']['input'];
};


export type SubscriptionOnUpdateUpcomingScheduleArgs = {
  id: Scalars['ID']['input'];
};

export type SummaryRow = {
  __typename?: 'SummaryRow';
  averagePaceOfPlay?: Maybe<Scalars['String']['output']>;
  birdies?: Maybe<Scalars['Int']['output']>;
  bogeys?: Maybe<Scalars['Int']['output']>;
  doubleBogey?: Maybe<Scalars['Int']['output']>;
  eagles?: Maybe<Scalars['Int']['output']>;
  paceOfPlay?: Maybe<CourseHoleStatsPaceData>;
  par: Scalars['Int']['output'];
  pars?: Maybe<Scalars['Int']['output']>;
  rowType: SummaryRowType;
  scoringAverage: Scalars['String']['output'];
  scoringAverageDiff: Scalars['String']['output'];
  scoringDiffTendency: ScoringTendency;
  yardage: Scalars['Int']['output'];
};

export type SummaryRowType =
  | 'IN'
  | 'OUT'
  | 'TOTAL';

export type TcWinner = MpLeaderboardPlayer | TspWinner | Winner;

export type TglBoxScore = {
  __typename?: 'TGLBoxScore';
  matchId: Scalars['String']['output'];
};

export type TglBoxScoreFragment = {
  __typename?: 'TGLBoxScoreFragment';
  matchIds?: Maybe<Array<Scalars['String']['output']>>;
};

export type TglMatch = {
  __typename?: 'TGLMatch';
  currentHole?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isOvertime: Scalars['Boolean']['output'];
  matchDate: Scalars['AWSTimestamp']['output'];
  matchStatus: TglMatchStatus;
  matchStatusColor: Scalars['String']['output'];
  matchStatusDisplay: Scalars['String']['output'];
  matchUrl?: Maybe<Scalars['String']['output']>;
  subscriptionsActive: Scalars['Boolean']['output'];
  teams: Array<TglTeam>;
  tglLogo?: Maybe<Scalars['String']['output']>;
  tglLogoDark?: Maybe<Scalars['String']['output']>;
  tglLogoFallback: Scalars['String']['output'];
  watchLabel?: Maybe<Scalars['String']['output']>;
  watchLogo?: Maybe<Scalars['String']['output']>;
  watchUrl?: Maybe<Scalars['String']['output']>;
};

/**  ## TGL Types */
export type TglMatchStatus =
  | 'COMPLETE'
  | 'IN_PROGRESS'
  | 'UNKNOWN'
  | 'UPCOMING';

export type TglPlayer = {
  __typename?: 'TGLPlayer';
  displayName: Scalars['String']['output'];
  playerHeadshot: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
};

export type TglSchedule = {
  __typename?: 'TGLSchedule';
  matches: Array<TglMatch>;
  season: Scalars['Int']['output'];
};

export type TglTeam = {
  __typename?: 'TGLTeam';
  losses: Scalars['Int']['output'];
  matchWinner?: Maybe<Scalars['Boolean']['output']>;
  players: Array<TglPlayer>;
  score: Scalars['String']['output'];
  teamLogo: Scalars['String']['output'];
  teamName: Scalars['String']['output'];
  wins: Scalars['Int']['output'];
};

export type TspLeaderboard = {
  __typename?: 'TSPLeaderboard';
  currentRound: Scalars['Int']['output'];
  currentRoundScoringFormat?: Maybe<Scalars['String']['output']>;
  disableOdds: Scalars['Boolean']['output'];
  formatType: FormatType;
  id: Scalars['ID']['output'];
  infoUrl: Scalars['String']['output'];
  informationSections: Array<InformationSection>;
  leaderboard: Array<TspLeaderboardRow>;
  messages: Array<LeaderboardMessage>;
  playoff?: Maybe<TspPlayoff>;
  rounds: Array<TspLeaderboardRound>;
  scorecardEnabled: Scalars['Boolean']['output'];
  shortTimezone: Scalars['String']['output'];
  timezone?: Maybe<Scalars['String']['output']>;
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrlWeb?: Maybe<Scalars['String']['output']>;
  tournamentStatus: TournamentStatus;
  winner?: Maybe<TspWinner>;
};

export type TspLeaderboardRound = {
  __typename?: 'TSPLeaderboardRound';
  round: Scalars['Int']['output'];
  roundHeader: Scalars['String']['output'];
  roundHeaderShort: Scalars['String']['output'];
  roundStatusSubHead: Scalars['String']['output'];
  roundTypeSubHead: Scalars['String']['output'];
};

export type TspLeaderboardRow = InformationRow | TspTeamRow;

export type TspScorecard = {
  __typename?: 'TSPScorecard';
  backNine: Scalars['Boolean']['output'];
  courseId?: Maybe<Scalars['Int']['output']>;
  currentHole?: Maybe<Scalars['Int']['output']>;
  currentRound: Scalars['Int']['output'];
  currentRoundTotal: Scalars['String']['output'];
  firstNine?: Maybe<TeamPlayScoreCardRow>;
  groupNumber: Scalars['Int']['output'];
  groupState: PlayerState;
  id: Scalars['ID']['output'];
  locationDetail: Scalars['String']['output'];
  parTotal: Scalars['Int']['output'];
  players: Array<TspScPlayer>;
  position: Scalars['String']['output'];
  roundDisplay: Scalars['String']['output'];
  roundFormat: RoundFormat;
  roundNumber: Scalars['Int']['output'];
  scorecardTitle: Scalars['String']['output'];
  secondNine?: Maybe<TeamPlayScoreCardRow>;
  teeTime: Scalars['AWSTimestamp']['output'];
  thru: Scalars['String']['output'];
  total: Scalars['String']['output'];
  totalStrokes: Scalars['String']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastUrlWeb?: Maybe<Scalars['String']['output']>;
};

export type TspScorecardRounds = {
  __typename?: 'TSPScorecardRounds';
  id: Scalars['ID']['output'];
  scorecards: Array<TspScorecard>;
};

export type TspTeeTimeGroup = {
  __typename?: 'TSPTeeTimeGroup';
  courseId?: Maybe<Scalars['String']['output']>;
  groupNumber: Scalars['Int']['output'];
  groupState: PlayerState;
  groupStatus: Scalars['String']['output'];
  holeLocation?: Maybe<Scalars['String']['output']>;
  startTee: Scalars['Int']['output'];
  teams: Array<TspTeeTimeTeam>;
  teeTime: Scalars['AWSTimestamp']['output'];
};

export type TspTeeTimeHeaders = {
  __typename?: 'TSPTeeTimeHeaders';
  status: Scalars['String']['output'];
  team: Scalars['String']['output'];
  tee: Scalars['String']['output'];
  time: Scalars['String']['output'];
};

export type TspTeeTimePlayer = {
  __typename?: 'TSPTeeTimePlayer';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAmateur: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
};

export type TspTeeTimeRound = {
  __typename?: 'TSPTeeTimeRound';
  groups: Array<TspTeeTimeGroup>;
  roundFormat: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
};

export type TspTeeTimeTeam = {
  __typename?: 'TSPTeeTimeTeam';
  players: Array<TspTeeTimePlayer>;
  teamId: Scalars['ID']['output'];
};

export type TspTeeTimes = {
  __typename?: 'TSPTeeTimes';
  courseFilters: Array<CourseFilter>;
  courses: Array<Course>;
  defaultRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  informationSections: Array<InformationSection>;
  roundFilters: Array<RoundFilter>;
  rounds: Array<TspTeeTimeRound>;
  teeTimeHeaders: TspTeeTimeHeaders;
  timezone: Scalars['String']['output'];
};

export type TableBody = {
  __typename?: 'TableBody';
  rows: Array<TableRows>;
};

export type TableColumn = {
  __typename?: 'TableColumn';
  class?: Maybe<Scalars['String']['output']>;
  colspan?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['String']['output']>;
  rowspan?: Maybe<Scalars['String']['output']>;
  valign?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Array<TableColumnValue>>;
  width?: Maybe<Scalars['String']['output']>;
};

export type TableColumnSegment = {
  __typename?: 'TableColumnSegment';
  data?: Maybe<Scalars['String']['output']>;
  format?: Maybe<NewsArticleFormat>;
  oddsSwing?: Maybe<OddsSwing>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type TableColumnValue = TableColumnSegment | UnorderedListNode;

export type TableDataRow = {
  __typename?: 'TableDataRow';
  class?: Maybe<Scalars['String']['output']>;
  columns?: Maybe<Array<Maybe<TableColumn>>>;
};

export type TableFragment = {
  __typename?: 'TableFragment';
  border?: Maybe<Scalars['String']['output']>;
  cellpadding?: Maybe<Scalars['String']['output']>;
  cellspacing?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  table?: Maybe<TableBody>;
  width?: Maybe<Scalars['String']['output']>;
};

export type TableHeaderRow = {
  __typename?: 'TableHeaderRow';
  class?: Maybe<Scalars['String']['output']>;
  columns?: Maybe<Array<Maybe<TableColumn>>>;
};

export type TableRows = TableDataRow | TableHeaderRow;

export type TeamHoleGroups = {
  __typename?: 'TeamHoleGroups';
  groupLocation: Scalars['String']['output'];
  groupLocationCode: Scalars['String']['output'];
  groupNumber: Scalars['Int']['output'];
  teams: Array<HoleGroupTeam>;
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type TeamPlayHole = {
  __typename?: 'TeamPlayHole';
  holeNumber: Scalars['String']['output'];
  parValue: Scalars['String']['output'];
  playerScores: Array<TspPlayerHole>;
  round: Scalars['Int']['output'];
  teamplayHoleScore: TspTeamHole;
  yardage: Scalars['String']['output'];
};

export type TeamPlayScoreCardRow = {
  __typename?: 'TeamPlayScoreCardRow';
  holes: Array<TeamPlayHole>;
  parTotal: Scalars['Int']['output'];
  total: Scalars['String']['output'];
  totalLabel: Scalars['String']['output'];
};

export type TeamRankings = {
  __typename?: 'TeamRankings';
  defaultEuropeRankings: Scalars['Boolean']['output'];
  defaultUsRankings: Scalars['Boolean']['output'];
  displayRoster: Scalars['Boolean']['output'];
  euroCaptainLabel?: Maybe<Scalars['String']['output']>;
  euroHeader: Scalars['String']['output'];
  euroViceCaptainLabel?: Maybe<Scalars['String']['output']>;
  europeCaptain?: Maybe<Scalars['String']['output']>;
  europeCta?: Maybe<CallToAction>;
  europeInfoBlurb?: Maybe<Scalars['String']['output']>;
  europeViceCaptain?: Maybe<Scalars['String']['output']>;
  sectionHeader: Scalars['String']['output'];
  usCaptain?: Maybe<Scalars['String']['output']>;
  usCaptainLabel?: Maybe<Scalars['String']['output']>;
  usCta?: Maybe<CallToAction>;
  usHeader: Scalars['String']['output'];
  usInfoBlurb?: Maybe<Scalars['String']['output']>;
  usViceCaptain?: Maybe<Scalars['String']['output']>;
  usViceCaptainLabel?: Maybe<Scalars['String']['output']>;
};

export type TeamShotDetails = {
  __typename?: 'TeamShotDetails';
  defaultHolePickle: HolePickleType;
  displayType: ShotDetailsDisplayType;
  groupNumber: Scalars['Int']['output'];
  holes: Array<GroupShotDetailsHole>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  round: Scalars['Int']['output'];
  shotVideo?: Maybe<Video>;
  shotVideos?: Maybe<Array<Video>>;
  teams: Array<GroupShotDetailsTeam>;
  tournamentId: Scalars['String']['output'];
};

export type TeamShotDetailsCompressed = {
  __typename?: 'TeamShotDetailsCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type TeamStoryContentInfo = {
  __typename?: 'TeamStoryContentInfo';
  hasStoryContent: Scalars['Boolean']['output'];
  playerId: Scalars['String']['output'];
  storyContentRound?: Maybe<Scalars['Int']['output']>;
  storyContentRounds: Array<Scalars['Int']['output']>;
};

export type TeamplayHolePlayer = {
  __typename?: 'TeamplayHolePlayer';
  holeScore?: Maybe<Scalars['String']['output']>;
  holeScoreStatus?: Maybe<HoleScoreStatus>;
  playerId: Scalars['ID']['output'];
};

export type TeeTimeHeader = {
  __typename?: 'TeeTimeHeader';
  players: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tee: Scalars['String']['output'];
  time: Scalars['String']['output'];
};

export type TeeTimeRound = {
  __typename?: 'TeeTimeRound';
  groups: Array<Group>;
  id: Scalars['ID']['output'];
  roundDisplay: Scalars['String']['output'];
  roundInt: Scalars['Int']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
};

export type TeeTimeRoundV2 = {
  __typename?: 'TeeTimeRoundV2';
  groups: Array<GroupV2>;
  id: Scalars['ID']['output'];
  roundDisplay: Scalars['String']['output'];
  roundInt: Scalars['Int']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
};

export type TeeTimes = {
  __typename?: 'TeeTimes';
  courses: Array<Course>;
  defaultRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  informationSections: Array<InformationSection>;
  rounds: Array<TeeTimeRound>;
  timezone: Scalars['String']['output'];
};

export type TeeTimesCompressed = {
  __typename?: 'TeeTimesCompressed';
  id: Scalars['ID']['output'];
  payload: Scalars['String']['output'];
};

export type TeeTimesFeature =
  | 'GROUPINGS'
  | 'GROUP_TRACKER';

export type TeeTimesV2 = {
  __typename?: 'TeeTimesV2';
  courses: Array<Course>;
  defaultRound: Scalars['Int']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  hideSov: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  informationSections: Array<InformationSection>;
  rounds: Array<TeeTimeRoundV2>;
  teeTimesFeatures: Array<TeeTimesFeature>;
  timezone: Scalars['String']['output'];
};

export type ThreeUpPhoto = {
  __typename?: 'ThreeUpPhoto';
  darkMobileImageFour?: Maybe<Scalars['String']['output']>;
  darkMobileImageOne?: Maybe<Scalars['String']['output']>;
  darkMobileImageThree?: Maybe<Scalars['String']['output']>;
  darkMobileImageTwo?: Maybe<Scalars['String']['output']>;
  mobileImageFour?: Maybe<Scalars['String']['output']>;
  mobileImageOne?: Maybe<Scalars['String']['output']>;
  mobileImageThree?: Maybe<Scalars['String']['output']>;
  mobileImageTwo?: Maybe<Scalars['String']['output']>;
  photoFour?: Maybe<Scalars['String']['output']>;
  photoFourAccessibilityText?: Maybe<Scalars['String']['output']>;
  photoFourUrl?: Maybe<Scalars['String']['output']>;
  photoOne?: Maybe<Scalars['String']['output']>;
  photoOneAccessibilityText?: Maybe<Scalars['String']['output']>;
  photoOneCtaTarget?: Maybe<Scalars['String']['output']>;
  photoOneUrl?: Maybe<Scalars['String']['output']>;
  photoThree?: Maybe<Scalars['String']['output']>;
  photoThreeAccessibilityText?: Maybe<Scalars['String']['output']>;
  photoThreeCtaTarget?: Maybe<Scalars['String']['output']>;
  photoThreeUrl?: Maybe<Scalars['String']['output']>;
  photoTwo?: Maybe<Scalars['String']['output']>;
  photoTwoAccessibilityText?: Maybe<Scalars['String']['output']>;
  photoTwoCtaTarget?: Maybe<Scalars['String']['output']>;
  photoTwoUrl?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type ThreeUpStats = {
  __typename?: 'ThreeUpStats';
  header?: Maybe<Scalars['String']['output']>;
  statsDescriptionOne?: Maybe<Scalars['String']['output']>;
  statsDescriptionThree?: Maybe<Scalars['String']['output']>;
  statsDescriptionTwo?: Maybe<Scalars['String']['output']>;
  valueOne?: Maybe<Scalars['String']['output']>;
  valueThree?: Maybe<Scalars['String']['output']>;
  valueTwo?: Maybe<Scalars['String']['output']>;
};

export type TicketCards = {
  __typename?: 'TicketCards';
  blueBackground: Scalars['Boolean']['output'];
  cardLabel?: Maybe<Scalars['String']['output']>;
  cardPhoto?: Maybe<Scalars['String']['output']>;
  cardSubhead?: Maybe<Scalars['String']['output']>;
  cardTitle?: Maybe<Scalars['String']['output']>;
  ctaIcon?: Maybe<Scalars['String']['output']>;
  ctaLink?: Maybe<Scalars['String']['output']>;
  ctaTarget?: Maybe<Scalars['String']['output']>;
  ctaText?: Maybe<Scalars['String']['output']>;
  webViewLink?: Maybe<Scalars['String']['output']>;
};

export type TicketSectionContainer = {
  __typename?: 'TicketSectionContainer';
  bottomCta?: Maybe<CallToAction>;
  cards?: Maybe<Array<TicketCards>>;
  layout?: Maybe<Scalars['String']['output']>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  topCta?: Maybe<CallToAction>;
};

export type ToolTipComponent = {
  __typename?: 'ToolTipComponent';
  detailCopy?: Maybe<Scalars['String']['output']>;
  detailCopyRichText?: Maybe<Array<Maybe<NewsArticleNode>>>;
  header: Scalars['String']['output'];
  id?: Maybe<Ryder_Cup_Ranking_Tooltip>;
  logo: Scalars['String']['output'];
};

export type TopicStoriesPillConfig = {
  __typename?: 'TopicStoriesPillConfig';
  label: Scalars['String']['output'];
};

export type ToughestCourseRoundPills = {
  __typename?: 'ToughestCourseRoundPills';
  display: Scalars['String']['output'];
  queryVal: ToughestRound;
};

export type ToughestRound =
  | 'ALL'
  | 'FOUR'
  | 'ONE'
  | 'THREE'
  | 'TWO';

export type TourBoundAsset = {
  __typename?: 'TourBoundAsset';
  tourBoundLogo?: Maybe<Scalars['String']['output']>;
  tourBoundLogoDark?: Maybe<Scalars['String']['output']>;
};

export type TourCategories = {
  __typename?: 'TourCategories';
  categories: Array<Category>;
  tourCode: TourCode;
};

export type TourCode =
  | 'C'
  | 'E'
  | 'H'
  | 'I'
  | 'M'
  | 'R'
  | 'S'
  | 'U'
  | 'Y';

export type TourCupCombined = {
  __typename?: 'TourCupCombined';
  bannerMessage?: Maybe<LeaderboardMessage>;
  columnHeaders: Array<Scalars['String']['output']>;
  cutOffButtonText?: Maybe<Scalars['String']['output']>;
  cutOffNumber?: Maybe<Scalars['Int']['output']>;
  description: Scalars['String']['output'];
  detailCopy: Scalars['String']['output'];
  fixedHeaders: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  /** @deprecated Use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  message?: Maybe<Scalars['String']['output']>;
  options: TourCupType;
  partner?: Maybe<Scalars['String']['output']>;
  partnerLink?: Maybe<Scalars['String']['output']>;
  players: Array<TourCupCombinedRow>;
  pointsEyebrow?: Maybe<Scalars['String']['output']>;
  projectedLive: Scalars['Boolean']['output'];
  projectedTitle: Scalars['String']['output'];
  rankEyebrow?: Maybe<Scalars['String']['output']>;
  rankingsHeader: Scalars['String']['output'];
  season: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tournamentPills: Array<StatTournamentPill>;
  winner?: Maybe<TourCupCombinedWinner>;
  yearPills: Array<StatYearPills>;
};

export type TourCupCombinedData = {
  __typename?: 'TourCupCombinedData';
  event: Scalars['String']['output'];
  /** @deprecated Use logoAsset */
  logo?: Maybe<Scalars['String']['output']>;
  logoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use logoDarkAsset */
  logoDark?: Maybe<Scalars['String']['output']>;
  logoDarkAsset?: Maybe<ImageAsset>;
  movement: CupRankMovementDirection;
  movementAmount: Scalars['String']['output'];
  official: Scalars['String']['output'];
  projected: Scalars['String']['output'];
};

export type TourCupCombinedInfo = {
  __typename?: 'TourCupCombinedInfo';
  /** @deprecated Use logoAsset */
  logo?: Maybe<Scalars['String']['output']>;
  logoAsset?: Maybe<ImageAsset>;
  /** @deprecated Use logoDarkAsset */
  logoDark?: Maybe<Scalars['String']['output']>;
  logoDarkAsset?: Maybe<ImageAsset>;
  sortValue: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  toolTip?: Maybe<Scalars['String']['output']>;
};

export type TourCupCombinedPlayer = {
  __typename?: 'TourCupCombinedPlayer';
  columnData: Array<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  officialSort: Scalars['Int']['output'];
  pointData?: Maybe<TourCupCombinedData>;
  previousWeekRank: Scalars['String']['output'];
  projectedSort: Scalars['Int']['output'];
  /** @deprecated Use rankLogoDarkAsset */
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoDarkAsset?: Maybe<ImageAsset>;
  /** @deprecated Use rankLogoLightAsset */
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  rankLogoLightAsset?: Maybe<ImageAsset>;
  rankingData?: Maybe<TourCupCombinedData>;
  shortName: Scalars['String']['output'];
  thisWeekRank: Scalars['String']['output'];
  tourBound?: Maybe<Scalars['Boolean']['output']>;
};

export type TourCupCombinedRow = TourCupCombinedInfo | TourCupCombinedPlayer;

export type TourCupCombinedTotal = {
  __typename?: 'TourCupCombinedTotal';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type TourCupCombinedWinner = {
  __typename?: 'TourCupCombinedWinner';
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  earnings: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
  totals: Array<TourCupCombinedTotal>;
};

export type TourCupRankingData = SegmentedCupRankingWrapper | StandardCupRanking;

export type TourCupRankingEvent = {
  __typename?: 'TourCupRankingEvent';
  bannerMessage?: Maybe<LeaderboardMessage>;
  description: Scalars['String']['output'];
  detailCopy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  live: Scalars['Boolean']['output'];
  /** @deprecated Use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated Use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
  options: TourCupType;
  partner?: Maybe<Scalars['String']['output']>;
  partnerLink?: Maybe<Scalars['String']['output']>;
  rankings: Array<CupRankingPlayerWrapper>;
  rankingsHeader: Scalars['String']['output'];
  showInLeaderboard: Scalars['Boolean']['output'];
  standings: TourCupRankingData;
  title: Scalars['String']['output'];
  webviewBrowserControls?: Maybe<Scalars['Boolean']['output']>;
  webviewUrl?: Maybe<Scalars['String']['output']>;
  winner?: Maybe<TourCupWinner>;
};

export type TourCupSplit = {
  __typename?: 'TourCupSplit';
  bannerMessage?: Maybe<LeaderboardMessage>;
  columnHeaders: Array<Scalars['String']['output']>;
  cutOffButtonText?: Maybe<Scalars['String']['output']>;
  cutOffNumber?: Maybe<Scalars['Int']['output']>;
  description: Scalars['String']['output'];
  detailCopy: Scalars['String']['output'];
  fixedHeaders: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  /** @deprecated Use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  message?: Maybe<Scalars['String']['output']>;
  officialPlayers: Array<TourCupCombinedRow>;
  options: TourCupType;
  partner?: Maybe<Scalars['String']['output']>;
  partnerLink?: Maybe<Scalars['String']['output']>;
  pointsEyebrow?: Maybe<Scalars['String']['output']>;
  projectedLive: Scalars['Boolean']['output'];
  projectedPlayers: Array<TourCupCombinedRow>;
  projectedTitle: Scalars['String']['output'];
  rankEyebrow?: Maybe<Scalars['String']['output']>;
  rankingsHeader: Scalars['String']['output'];
  season: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tournamentPills: Array<StatTournamentPill>;
  winner?: Maybe<TourCupCombinedWinner>;
  yearPills: Array<StatYearPills>;
};

export type TourCupType =
  | 'OFFICIAL'
  | 'OFFICIAL_AND_PROJECTED'
  | 'PROJECTED';

export type TourCupWinner = {
  __typename?: 'TourCupWinner';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  playerCountry: Scalars['String']['output'];
  totalLabel: Scalars['String']['output'];
  totalValue: Scalars['String']['output'];
};

export type TourPills = {
  __typename?: 'TourPills';
  displayName: Scalars['String']['output'];
  tourCode?: Maybe<TourCode>;
};

export type TourSponsor = {
  __typename?: 'TourSponsor';
  _path?: Maybe<Scalars['String']['output']>;
  sponsorDescription: Array<TourSponsorDescription>;
  sponsorImage?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  sponsorName?: Maybe<Scalars['String']['output']>;
  sponsorWebsiteUrl?: Maybe<Scalars['String']['output']>;
};

export type TourSponsorDescription = NewsArticleImage | NewsArticleLineBreak | NewsArticleLink | NewsArticleParagraph | NewsArticleText;

export type TourcastCourse = {
  __typename?: 'TourcastCourse';
  courseId: Scalars['String']['output'];
  holes: Array<TourcastHole>;
  playoff?: Maybe<TourcastPlayoff>;
};

export type TourcastGroup = {
  __typename?: 'TourcastGroup';
  groupName: Scalars['String']['output'];
  groupNum: Scalars['Int']['output'];
  location: Scalars['String']['output'];
  players: Array<TourcastPlayer>;
  roundNum: Scalars['Int']['output'];
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type TourcastHole = {
  __typename?: 'TourcastHole';
  cupMatches?: Maybe<Array<CupLeaderboardMatch>>;
  displayRank: Scalars['String']['output'];
  groups: Array<TourcastGroup>;
  holeNum: Scalars['Int']['output'];
  matches: Array<HoleMatch>;
  par: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  round: Scalars['String']['output'];
  scoringAvg: Scalars['String']['output'];
  teamGroups: Array<TourcastTeamGroup>;
  yardage: Scalars['String']['output'];
};

export type TourcastPlayer = {
  __typename?: 'TourcastPlayer';
  amateur: Scalars['Boolean']['output'];
  backNine: Scalars['Boolean']['output'];
  country: Scalars['String']['output'];
  countryCode: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  roundScore: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
  thru: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type TourcastPlayoff = {
  __typename?: 'TourcastPlayoff';
  holeNum: Scalars['Int']['output'];
  playOffHole: Scalars['Int']['output'];
  players: Array<TourcastPlayoffPlayer>;
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type TourcastPlayoffPlayer = {
  __typename?: 'TourcastPlayoffPlayer';
  countryCode: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
  shortName: Scalars['String']['output'];
};

export type TourcastTable = {
  __typename?: 'TourcastTable';
  courses: Array<TourcastCourse>;
  informationSections: Array<InformationSection>;
  tournamentId: Scalars['ID']['output'];
  winner?: Maybe<TcWinner>;
};

export type TourcastTeam = {
  __typename?: 'TourcastTeam';
  backNine: Scalars['Boolean']['output'];
  players: Array<TourcastPlayer>;
  roundScore: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  thru: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type TourcastTeamGroup = {
  __typename?: 'TourcastTeamGroup';
  groupName: Scalars['String']['output'];
  groupNum: Scalars['Int']['output'];
  location: Scalars['String']['output'];
  roundNum: Scalars['Int']['output'];
  teams: Array<TourcastTeam>;
  teeTime: Scalars['AWSTimestamp']['output'];
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
};

export type Tournament = {
  __typename?: 'Tournament';
  /** @deprecated Use beautyImageAsset */
  beautyImage: Scalars['String']['output'];
  beautyImageAsset: ImageAsset;
  city: Scalars['String']['output'];
  conductedByLabel?: Maybe<Scalars['String']['output']>;
  conductedByLink?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  courses: Array<Course>;
  currentRound: Scalars['Int']['output'];
  disabledScorecardTabs: Array<ScorecardTabFeature>;
  displayDate: Scalars['String']['output'];
  events: Array<Event>;
  features?: Maybe<Array<TournamentFeature>>;
  formatType: FormatType;
  headshotBaseUrl?: Maybe<Scalars['String']['output']>;
  hideRolexClock: Scalars['Boolean']['output'];
  hideSov: Scalars['Boolean']['output'];
  howItWorks?: Maybe<Scalars['String']['output']>;
  howItWorksPill?: Maybe<Scalars['String']['output']>;
  howItWorksWebview?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** @deprecated use howItWorks */
  infoPath?: Maybe<Scalars['String']['output']>;
  /** @deprecated use howItWorksWebview */
  infoPathWebview?: Maybe<Scalars['String']['output']>;
  leaderboardTakeover: Scalars['Boolean']['output'];
  pdfUrl?: Maybe<Scalars['String']['output']>;
  rightRailConfig?: Maybe<TournamentRightRailConfig>;
  roundDisplay: Scalars['String']['output'];
  roundStatus: RoundStatus;
  roundStatusColor: RoundStatusColor;
  roundStatusDisplay: Scalars['String']['output'];
  scoredLevel: ScoringLevel;
  seasonYear: Scalars['String']['output'];
  shouldSubscribe?: Maybe<Scalars['Boolean']['output']>;
  state: Scalars['String']['output'];
  ticketsEnabled: Scalars['Boolean']['output'];
  ticketsURL?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
  tournamentCategoryInfo?: Maybe<TournamentCategoryInfo>;
  tournamentLocation: Scalars['String']['output'];
  /** @deprecated use tournamentLogoAsset */
  tournamentLogo: Array<Scalars['String']['output']>;
  tournamentLogoAsset: Array<ImageAsset>;
  tournamentName: Scalars['String']['output'];
  tournamentSiteURL?: Maybe<Scalars['String']['output']>;
  tournamentStatus: TournamentStatus;
  useTournamentSiteURL: Scalars['Boolean']['output'];
  weather?: Maybe<TournamentWeather>;
};

export type TournamentActivation = {
  __typename?: 'TournamentActivation';
  data: Scalars['String']['output'];
  description: Scalars['String']['output'];
  detail?: Maybe<Scalars['String']['output']>;
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo: Scalars['String']['output'];
  sponsorLogoAsset: ImageAsset;
  /** @deprecated use sponsorLogoDarkAsset */
  sponsorLogoDark: Scalars['String']['output'];
  sponsorLogoDarkAsset: ImageAsset;
  title: Scalars['String']['output'];
};

export type TournamentCategory =
  | 'PLAYOFF'
  | 'SIGNATURE';

export type TournamentCategoryInfo = {
  __typename?: 'TournamentCategoryInfo';
  label: Scalars['String']['output'];
  /** @deprecated use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
  /** @deprecated use logoLightAsset */
  logoLight: Scalars['String']['output'];
  logoLightAsset: ImageAsset;
  type: TournamentCategory;
};

export type TournamentChampion = {
  __typename?: 'TournamentChampion';
  countryCode: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  displaySeason: Scalars['String']['output'];
  headshot?: Maybe<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  score: Scalars['String']['output'];
  seed?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  total: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type TournamentCourse = {
  __typename?: 'TournamentCourse';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  overview: Array<InformationData>;
  state?: Maybe<Scalars['String']['output']>;
};

export type TournamentFeature =
  | 'COURSE_STATS'
  | 'CUP_TEAMS'
  | 'FEDEXFALL_STANDINGS'
  | 'FIELD'
  | 'GROUP_STAGE'
  | 'LEADERBOARD'
  | 'ODDS'
  | 'OVERVIEW'
  | 'PAST_RESULTS'
  | 'RECAP'
  | 'SIGNATURE_STANDINGS'
  | 'STANDINGS'
  | 'TEE_TIMES'
  | 'TOURCAST';

export type TournamentGroupLocation = {
  __typename?: 'TournamentGroupLocation';
  groupLocations: Array<GroupLocationData>;
  round: Scalars['Int']['output'];
  tournamentId: Scalars['String']['output'];
};

export type TournamentHistory = {
  __typename?: 'TournamentHistory';
  courses: TournamentHistoryCourseTable;
  defendingChampion: TournamentHistoryPlayerTable;
  pastChampions: TournamentHistoryPlayerTable;
  tourCode: TourCode;
  tournamentName: Scalars['String']['output'];
  tournamentNum: Scalars['String']['output'];
};

export type TournamentHistoryCourse = {
  __typename?: 'TournamentHistoryCourse';
  courseId: Scalars['String']['output'];
  courseImage: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  displaySeason: Scalars['String']['output'];
  par: Scalars['String']['output'];
  yardage: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type TournamentHistoryCourseTable = {
  __typename?: 'TournamentHistoryCourseTable';
  courses: Array<TournamentHistoryCourse>;
  header: Scalars['String']['output'];
};

export type TournamentHistoryPlayer = {
  __typename?: 'TournamentHistoryPlayer';
  countryFlag: Scalars['String']['output'];
  displaySeason: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  relativeToPar: Scalars['String']['output'];
  totalScore: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type TournamentHistoryPlayerTable = {
  __typename?: 'TournamentHistoryPlayerTable';
  header: Scalars['String']['output'];
  players: Array<TournamentHistoryPlayer>;
};

export type TournamentHoleStats = {
  __typename?: 'TournamentHoleStats';
  courses: Array<CourseStat>;
  tournamentId: Scalars['ID']['output'];
};

export type TournamentLocation = {
  __typename?: 'TournamentLocation';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type TournamentOdds = {
  __typename?: 'TournamentOdds';
  availableMarkets: Array<AvailableMarket>;
  country: Scalars['String']['output'];
  drawersEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** @deprecated Use banners from config these values are incorrect */
  oddsBanner: OddsBanner;
  oddsMessage?: Maybe<OddsMessage>;
  oddsProvider: OddsProvider;
};

export type TournamentOddsCompressed = {
  __typename?: 'TournamentOddsCompressed';
  id: Scalars['ID']['output'];
  tournamentOddsPayload: Scalars['String']['output'];
};

export type TournamentOddsCompressedV2 = {
  __typename?: 'TournamentOddsCompressedV2';
  id: Scalars['ID']['output'];
  oddsPayload: Scalars['String']['output'];
};

export type TournamentOddsPlayer = {
  __typename?: 'TournamentOddsPlayer';
  oddsOptionId?: Maybe<Scalars['String']['output']>;
  oddsSort: Scalars['Float']['output'];
  oddsSwing?: Maybe<OddsSwing>;
  oddsToWin: Scalars['String']['output'];
  playerId: Scalars['ID']['output'];
};

export type TournamentOddsToWin = {
  __typename?: 'TournamentOddsToWin';
  players: Array<TournamentOddsPlayer>;
  tournamentId: Scalars['ID']['output'];
  /** @deprecated use tournamentLogoAsset */
  tournamentLogo: Scalars['String']['output'];
  tournamentLogoAsset: ImageAsset;
  tournamentName: Scalars['String']['output'];
};

export type TournamentOddsV2 = {
  __typename?: 'TournamentOddsV2';
  drawersEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  marketPills: Array<MarketPill>;
  markets: Array<Market>;
  message?: Maybe<OddsMessage>;
  /**   tournamentId-provider */
  provider: OddsProvider;
  /**   other markets you can */
  round: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
};

export type TournamentOverview = {
  __typename?: 'TournamentOverview';
  activation?: Maybe<TournamentActivation>;
  androidTicketmasterApiKey?: Maybe<Scalars['String']['output']>;
  androidTicketmasterScheme?: Maybe<Scalars['String']['output']>;
  augmentedReality?: Maybe<AugmentedRealityConfig>;
  /** @deprecated Use beautyImageAsset */
  beautyImage: Scalars['String']['output'];
  beautyImageAsset: ImageAsset;
  courses: Array<TournamentCourse>;
  defendingChampion?: Maybe<TournamentChampion>;
  defendingTeamChampion?: Maybe<Array<Maybe<TournamentChampion>>>;
  eventGuideURL?: Maybe<Scalars['String']['output']>;
  formatType: FormatType;
  iosTicketmasterApiKey?: Maybe<Scalars['String']['output']>;
  overview: Array<InformationData>;
  pastChampions: Array<TournamentChampion>;
  pastTeamChampions?: Maybe<Array<Maybe<TournamentTeamChampion>>>;
  shareURL?: Maybe<Scalars['String']['output']>;
  ticketmasterAttractionId?: Maybe<Scalars['String']['output']>;
  ticketsURL?: Maybe<Scalars['String']['output']>;
  tourcastURI?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURL?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use tourcastURI */
  tourcastURLWeb?: Maybe<Scalars['String']['output']>;
  tournamentCategoryInfo?: Maybe<TournamentCategoryInfo>;
  tournamentResultsMessage?: Maybe<TournamentResultsMessage>;
  webviewBrowserControls: Scalars['Boolean']['output'];
};

export type TournamentOverviewInfo = {
  __typename?: 'TournamentOverviewInfo';
  cutsMade: Scalars['Int']['output'];
  cutsMissed: Scalars['Int']['output'];
  disqualified: Scalars['Int']['output'];
  events: Scalars['Int']['output'];
  money: Scalars['Int']['output'];
  runnerUp: Scalars['Int']['output'];
  second: Scalars['Int']['output'];
  third: Scalars['Int']['output'];
  top5: Scalars['Int']['output'];
  top10: Scalars['Int']['output'];
  top25: Scalars['Int']['output'];
  wins: Scalars['Int']['output'];
  withdrew: Scalars['Int']['output'];
};

export type TournamentPlayoffScorecards = {
  __typename?: 'TournamentPlayoffScorecards';
  playoffs: Array<PlayoffScorecard>;
  tournamentId: Scalars['ID']['output'];
};

export type TournamentRecap = {
  __typename?: 'TournamentRecap';
  courses: Array<TournamentRecapCourse>;
  durationDate: Scalars['String']['output'];
  newsArticles: Array<NewsArticle>;
  tournamentId: Scalars['String']['output'];
  videos: Array<Video>;
};

export type TournamentRecapCourse = {
  __typename?: 'TournamentRecapCourse';
  city: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  par: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  yardage: Scalars['String']['output'];
};

export type TournamentResultOverview = {
  __typename?: 'TournamentResultOverview';
  courseCity: Scalars['String']['output'];
  courseCountry: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  courseState?: Maybe<Scalars['String']['output']>;
  displaySeason: Scalars['String']['output'];
  tournamentId: Scalars['String']['output'];
  tournamentLogo: Scalars['String']['output'];
  tournamentLogoAsset: ImageAsset;
  tournamentName: Scalars['String']['output'];
};

export type TournamentResultPill = {
  __typename?: 'TournamentResultPill';
  tournamentName: Scalars['String']['output'];
  tournamentNum: Scalars['ID']['output'];
};

export type TournamentResults = {
  __typename?: 'TournamentResults';
  cupEyebrowText: Scalars['String']['output'];
  overview: Array<PlayerProfileInfoItem>;
  overviewInfo?: Maybe<TournamentOverviewInfo>;
  tournamentNum: Scalars['ID']['output'];
  tournamentOverview?: Maybe<TournamentResultOverview>;
  tournaments: Array<PlayerProfileTournamentRow>;
};

export type TournamentResultsMessage = {
  __typename?: 'TournamentResultsMessage';
  message?: Maybe<Scalars['String']['output']>;
};

export type TournamentRightRailConfig = {
  __typename?: 'TournamentRightRailConfig';
  buttonLink?: Maybe<Scalars['String']['output']>;
  buttonText?: Maybe<Scalars['String']['output']>;
  imageAltText: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
};

export type TournamentStatus =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'NOT_STARTED';

export type TournamentTeamChampion = {
  __typename?: 'TournamentTeamChampion';
  players: Array<TournamentChampion>;
};

export type TournamentWeather = {
  __typename?: 'TournamentWeather';
  condition: WeatherCondition;
  humidity: Scalars['String']['output'];
  /** @deprecated use logoAsset */
  logo?: Maybe<Scalars['String']['output']>;
  logoAccessibility: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated use logoDarkAsset */
  logoDark?: Maybe<Scalars['String']['output']>;
  logoDarkAsset: ImageAsset;
  precipitation: Scalars['String']['output'];
  tempC: Scalars['String']['output'];
  tempF: Scalars['String']['output'];
  windDirection: WindDirection;
  windSpeedKPH: Scalars['String']['output'];
  windSpeedMPH: Scalars['String']['output'];
};

export type TournamentsPillConfig = {
  __typename?: 'TournamentsPillConfig';
  currentSeason: Scalars['Int']['output'];
};

export type TspPlayer = {
  __typename?: 'TspPlayer';
  abbreviations: Scalars['String']['output'];
  abbreviationsAccessibilityText: Scalars['String']['output'];
  amateur: Scalars['Boolean']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  lineColor: Scalars['String']['output'];
  official: Scalars['String']['output'];
  projected: Scalars['String']['output'];
  rankLogoDark?: Maybe<Scalars['String']['output']>;
  rankLogoLight?: Maybe<Scalars['String']['output']>;
  rankingMovement: CupRankMovementDirection;
  rankingMovementAmount: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
};

export type TspPlayerHole = {
  __typename?: 'TspPlayerHole';
  inTheHoleTimestamp?: Maybe<Scalars['AWSTimestamp']['output']>;
  playComplete?: Maybe<Scalars['Boolean']['output']>;
  playerId: Scalars['ID']['output'];
  playerTotal?: Maybe<Scalars['String']['output']>;
  statsScoreId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<HoleScoreStatus>;
  strokes: Scalars['Int']['output'];
  strokesValue: Scalars['String']['output'];
};

export type TspPlayoff = {
  __typename?: 'TspPlayoff';
  currentHole: Scalars['Int']['output'];
  holes: Array<PlayoffHole>;
  location?: Maybe<Scalars['String']['output']>;
  teams: Array<PlayoffTeams>;
  thru?: Maybe<Scalars['String']['output']>;
};

export type TspScPlayer = {
  __typename?: 'TspSCPlayer';
  abbreviations: Scalars['String']['output'];
  abbreviationsAccessibilityText: Scalars['String']['output'];
  amateur: Scalars['Boolean']['output'];
  country: Scalars['String']['output'];
  countryFlag: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  lineColor: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
  superShortName?: Maybe<Scalars['String']['output']>;
};

export type TspStrokePlayer = {
  __typename?: 'TspStrokePlayer';
  color?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  playerId?: Maybe<Scalars['Int']['output']>;
  playerIdString?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
};

export type TspTeamHole = {
  __typename?: 'TspTeamHole';
  inTheHoleTimestamp?: Maybe<Scalars['AWSTimestamp']['output']>;
  playComplete?: Maybe<Scalars['Boolean']['output']>;
  statsScoreId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<HoleScoreStatus>;
  strokes: Scalars['Int']['output'];
  strokesValue: Scalars['String']['output'];
  teamId: Scalars['ID']['output'];
  teamTotal?: Maybe<Scalars['String']['output']>;
};

export type TspTeamRow = {
  __typename?: 'TspTeamRow';
  backNine: Scalars['Boolean']['output'];
  courseId: Scalars['String']['output'];
  currentRound: Scalars['Int']['output'];
  groupNumber: Scalars['Int']['output'];
  leaderboardSortOrder: Scalars['Int']['output'];
  movementAmount: Scalars['String']['output'];
  movementDirection: LeaderboardMovement;
  oddsOptionId?: Maybe<Scalars['String']['output']>;
  oddsSort?: Maybe<Scalars['Float']['output']>;
  oddsSwing?: Maybe<OddsSwing>;
  oddsToWin?: Maybe<Scalars['String']['output']>;
  players: Array<TspPlayer>;
  position: Scalars['String']['output'];
  rounds: Array<Scalars['String']['output']>;
  score: Scalars['String']['output'];
  scoreSort: Scalars['Int']['output'];
  startHole?: Maybe<Scalars['String']['output']>;
  status?: Maybe<PlayerState>;
  teamId: Scalars['ID']['output'];
  teamName: Scalars['String']['output'];
  teamStoryContentInfo: Array<TeamStoryContentInfo>;
  teeTime: Scalars['AWSTimestamp']['output'];
  thru: Scalars['String']['output'];
  thruSort: Scalars['Int']['output'];
  total: Scalars['String']['output'];
  totalSort: Scalars['Int']['output'];
  totalStrokes: Scalars['String']['output'];
};

export type TspWinner = {
  __typename?: 'TspWinner';
  points?: Maybe<Scalars['String']['output']>;
  purse?: Maybe<Scalars['String']['output']>;
  teamId: Scalars['ID']['output'];
  totalScore: Scalars['String']['output'];
  totalStrokes: Scalars['Int']['output'];
  winningTeam: Array<TspWinningPlayer>;
};

export type TspWinningPlayer = {
  __typename?: 'TspWinningPlayer';
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** @deprecated URL should be built using player ID */
  headshot: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type TwoColumn = {
  __typename?: 'TwoColumn';
  sectionOne?: Maybe<Array<Maybe<NewsArticleNode>>>;
  sectionOneTitle?: Maybe<Scalars['String']['output']>;
  sectionTwo?: Maybe<Array<Maybe<NewsArticleNode>>>;
  sectionTwoTitle?: Maybe<Scalars['String']['output']>;
};

export type UniversityRankColor =
  | 'BLACK'
  | 'BLUE'
  | 'GOLD'
  | 'GRAY';

export type UniversityRankingPlayer = {
  __typename?: 'UniversityRankingPlayer';
  avg: Scalars['String']['output'];
  country: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  events: Scalars['Int']['output'];
  playerId: Scalars['ID']['output'];
  rank: Scalars['Int']['output'];
  rankColor: UniversityRankColor;
  rankingMovement: CupRankMovementDirection;
  rankingMovementAmount: Scalars['String']['output'];
  rankingMovementAmountSort: Scalars['Int']['output'];
  schoolName: Scalars['String']['output'];
  top10: Scalars['Int']['output'];
  tournaments: Array<UniversityRankingsTournament>;
  wins: Scalars['Int']['output'];
};

export type UniversityRankings = {
  __typename?: 'UniversityRankings';
  description: Scalars['String']['output'];
  disclaimer?: Maybe<Scalars['String']['output']>;
  displayYear: Scalars['String']['output'];
  players: Array<UniversityRankingPlayer>;
  sponsorImage?: Maybe<Scalars['String']['output']>;
  sponsorName: Scalars['String']['output'];
  throughText: Scalars['String']['output'];
  title: Scalars['String']['output'];
  weekNum: Scalars['Int']['output'];
  weekPills: Array<StatWeekPill>;
  year: Scalars['Int']['output'];
  yearPills: Array<StatYearPills>;
};

export type UniversityRankingsTournament = {
  __typename?: 'UniversityRankingsTournament';
  finishPosition: Scalars['String']['output'];
  name: Scalars['String']['output'];
  playedYear: Scalars['Int']['output'];
  points: Scalars['String']['output'];
  week: Scalars['Int']['output'];
};

export type UniversityTotalPoints = {
  __typename?: 'UniversityTotalPoints';
  description: Scalars['String']['output'];
  footerInfo?: Maybe<NewsArticleParagraph>;
  headerInfo?: Maybe<NewsArticleParagraph>;
  headers: Array<Scalars['String']['output']>;
  players: Array<UniversityTotalPointsPlayer>;
  season: Scalars['Int']['output'];
  seasonNavigation: Array<UniversityTotalPointsPill>;
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  sponsorText?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  week: Scalars['Int']['output'];
  weekNavigation: Array<UniversityTotalPointsPill>;
};

export type UniversityTotalPointsPill = {
  __typename?: 'UniversityTotalPointsPill';
  displayText: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type UniversityTotalPointsPlayer = {
  __typename?: 'UniversityTotalPointsPlayer';
  data: Array<Scalars['String']['output']>;
  playerId: Scalars['ID']['output'];
  playerName: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  rankSort: Scalars['Int']['output'];
  rankingMovement: CupRankMovementDirection;
  rankingMovementAmount: Scalars['String']['output'];
  rankingMovementAmountSort: Scalars['Int']['output'];
  tournaments: Array<UniversityRankingsTournament>;
};

export type UnorderedListNode = {
  __typename?: 'UnorderedListNode';
  historicalTournamentOddsArgs?: Maybe<HistoricalTournamentOddsArgs>;
  items: Array<ListItem>;
  ordered?: Maybe<Scalars['Boolean']['output']>;
};

export type UnsubscribeResponse = {
  __typename?: 'UnsubscribeResponse';
  ok: Scalars['Boolean']['output'];
};

export type UpcomingBroadcastNetwork = {
  __typename?: 'UpcomingBroadcastNetwork';
  networks: Array<BroadcastNetwork>;
  tournamentId: Scalars['String']['output'];
};

export type UpcomingBroadcastNetworks = {
  __typename?: 'UpcomingBroadcastNetworks';
  upcomingNetworks: Array<UpcomingBroadcastNetwork>;
};

export type UpcomingMatch = {
  __typename?: 'UpcomingMatch';
  isConsolationMatch: Scalars['Boolean']['output'];
  matchId: Scalars['String']['output'];
  potentialPlayers: Array<UpcomingMatchPotentialPlayer>;
};

export type UpcomingMatchPotentialPlayer = {
  __typename?: 'UpcomingMatchPotentialPlayer';
  isKnown: Scalars['Boolean']['output'];
  nameLabel: Scalars['String']['output'];
  players: Array<MpLeaderboardPlayer>;
  relationshipLabel?: Maybe<Scalars['String']['output']>;
};

export type Video = {
  __typename?: 'Video';
  /** @deprecated No longer supported */
  accountId?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<RyderCupContentCategories>>;
  category: Scalars['String']['output'];
  categoryDisplayName: Scalars['String']['output'];
  contentTournamentId?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['AWSTimestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  descriptionNode?: Maybe<Array<VideoDescription>>;
  duration: Scalars['Int']['output'];
  endsAt?: Maybe<Scalars['AWSTimestamp']['output']>;
  franchise: Scalars['String']['output'];
  franchiseDisplayName: Scalars['String']['output'];
  gamAccountId?: Maybe<Scalars['String']['output']>;
  guid?: Maybe<Scalars['String']['output']>;
  highestRatedOnHole?: Maybe<Scalars['Boolean']['output']>;
  holeNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  pinned: Scalars['Boolean']['output'];
  playerVideos?: Maybe<Array<PlayerVideo>>;
  players?: Maybe<Array<RyderCupContentPlayer>>;
  poster: Scalars['String']['output'];
  pubdate: Scalars['AWSTimestamp']['output'];
  publishDate?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  roundNumber?: Maybe<Scalars['String']['output']>;
  seqHoleNumber?: Maybe<Scalars['String']['output']>;
  shareUrl?: Maybe<Scalars['String']['output']>;
  shotNumber?: Maybe<Scalars['String']['output']>;
  sponsor?: Maybe<VideoSponsor>;
  startsAt?: Maybe<Scalars['AWSTimestamp']['output']>;
  tags?: Maybe<Array<RyderCupContentTags>>;
  team?: Maybe<RyderCupTeamType>;
  /** @deprecated Use thumbnailAsset */
  thumbnail: Scalars['String']['output'];
  thumbnailAsset: ImageAsset;
  title: Scalars['String']['output'];
  topics?: Maybe<Array<ContentTopics>>;
  tourCode: Scalars['String']['output'];
  tournamentId?: Maybe<Scalars['String']['output']>;
  videoAccountId?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
  years?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type VideoDescription = NewsArticleLink | NewsArticleText;

export type VideoFilterPillConfig = {
  __typename?: 'VideoFilterPillConfig';
  franchises: Array<Franchise>;
  pinnedFranchises: Array<Franchise>;
};

export type VideoHero = {
  __typename?: 'VideoHero';
  gtmAssetKey?: Maybe<Scalars['String']['output']>;
  partnershipAsset?: Maybe<Scalars['String']['output']>;
  partnershipText?: Maybe<Scalars['String']['output']>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
  tourcastWebviewLink?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Video>;
  videos: Array<Video>;
};

export type VideoLanguage =
  | 'ENGLISH'
  | 'FRENCH';

export type VideoNavigation = {
  __typename?: 'VideoNavigation';
  items: Array<VideoPill>;
  liveOverride: LiveOverride;
  tourCode: TourCode;
};

export type VideoPill = {
  __typename?: 'VideoPill';
  defaultView: Scalars['Boolean']['output'];
  displayText: Scalars['String']['output'];
  enabledCompanionPills?: Maybe<Array<VideoPillType>>;
  pillConfig?: Maybe<VideoPillConfig>;
  videoPillType: VideoPillType;
};

export type VideoPillConfig = FranchisePillConfig | TopicStoriesPillConfig | TournamentsPillConfig | VideoFilterPillConfig;

export type VideoPillType =
  | 'ALL'
  | 'FAVORITES'
  | 'FEATURES'
  | 'FILTER'
  | 'INTERVIEWS'
  | 'PLAYER_SEARCH'
  | 'PLAYER_STORIES'
  | 'TOPIC_STORIES'
  | 'TOP_SHOTS'
  | 'TOURNAMENTS'
  | 'TRENDING';

export type VideoSponsor = {
  __typename?: 'VideoSponsor';
  description?: Maybe<Scalars['String']['output']>;
  gam?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  /** @deprecated use logoAsset */
  logo: Scalars['String']['output'];
  logoAsset: ImageAsset;
  /** @deprecated use logoDarkAsset */
  logoDark: Scalars['String']['output'];
  logoDarkAsset: ImageAsset;
  logoPrefix?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type WatchLanding = {
  __typename?: 'WatchLanding';
  /** @deprecated Use featuredVideos array */
  featuredVideo?: Maybe<Video>;
  featuredVideos?: Maybe<Array<Video>>;
  landingSections: Array<WatchLandingSection>;
  mobileVideos?: Maybe<Array<Video>>;
  mobileWebVideoLimit: Scalars['Int']['output'];
  tourCode: TourCode;
};

export type WatchLandingSection = {
  __typename?: 'WatchLandingSection';
  pillConfig?: Maybe<VideoPillConfig>;
  title: Scalars['String']['output'];
  videoPillType: VideoPillType;
  videos: Array<Video>;
};

export type WeatherCondition =
  | 'DAY_CLOUDY'
  | 'DAY_FOG_MIST'
  | 'DAY_MOSTLY_CLOUDY'
  | 'DAY_MOSTLY_SUNNY'
  | 'DAY_PARTLY_CLOUDY'
  | 'DAY_RAINY'
  | 'DAY_SCATTERED_SHOWERS'
  | 'DAY_SNOW'
  | 'DAY_SUNNY'
  | 'DAY_THUNDERSTORMS'
  | 'NIGHT_CLEAR'
  | 'NIGHT_ISOLATED_CLOUDS'
  | 'NIGHT_MOSTLY_CLOUDY'
  | 'NIGHT_PARTLY_CLOUDY';

export type WeatherDetails = {
  __typename?: 'WeatherDetails';
  condition: WeatherCondition;
  humidity: Scalars['String']['output'];
  precipitation: Scalars['String']['output'];
  temperature: WeatherTemp;
  title: Scalars['String']['output'];
  windDirection: WindDirection;
  windSpeedKPH: Scalars['String']['output'];
  windSpeedMPH: Scalars['String']['output'];
};

export type WeatherNotes = {
  __typename?: 'WeatherNotes';
  notes: Array<Scalars['String']['output']>;
  weather: Array<DayWeather>;
};

export type WeatherSummary = {
  __typename?: 'WeatherSummary';
  accessibilityText?: Maybe<Scalars['String']['output']>;
  daily: Array<WeatherDetails>;
  hourly: Array<WeatherDetails>;
  /** @deprecated use modalSponsorLogoAsset */
  modalSponsorLogo?: Maybe<Scalars['String']['output']>;
  modalSponsorLogoAsset: ImageAsset;
  /** @deprecated use modalSponsorLogoDarkAsset */
  modalSponsorLogoDark?: Maybe<Scalars['String']['output']>;
  modalSponsorLogoDarkAsset: ImageAsset;
  sponsorDescription?: Maybe<Scalars['String']['output']>;
  sponsorLink?: Maybe<Scalars['String']['output']>;
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  /** @deprecated use sponsorLogoDarkAsset */
  sponsorLogoDark?: Maybe<Scalars['String']['output']>;
  sponsorLogoDarkAsset: ImageAsset;
  title: Scalars['String']['output'];
};

export type WeatherTemp = RangeWeatherTemp | StandardWeatherTemp;

export type WindDirection =
  | 'EAST'
  | 'NORTH'
  | 'NORTH_EAST'
  | 'NORTH_WEST'
  | 'SOUTH'
  | 'SOUTH_EAST'
  | 'SOUTH_WEST'
  | 'WEST';

export type Winner = {
  __typename?: 'Winner';
  countryFlag: Scalars['String']['output'];
  countryName: Scalars['String']['output'];
  displayPoints: Scalars['Boolean']['output'];
  displayPurse: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  points?: Maybe<Scalars['String']['output']>;
  pointsLabel?: Maybe<Scalars['String']['output']>;
  purse?: Maybe<Scalars['String']['output']>;
  roundScores?: Maybe<Array<WinnerRoundScore>>;
  seed?: Maybe<Scalars['String']['output']>;
  totalScore: Scalars['String']['output'];
  totalStrokes: Scalars['Int']['output'];
  winnerIcon?: Maybe<WinnerIcon>;
};

export type WinnerIcon = {
  __typename?: 'WinnerIcon';
  color: Scalars['String']['output'];
  label: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: WinnerIconType;
};

export type WinnerIconType =
  | 'BRONZE'
  | 'GOLD'
  | 'SILVER';

export type WinnerRoundScore = {
  __typename?: 'WinnerRoundScore';
  label: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type YtActivationData = {
  __typename?: 'YTActivationData';
  data: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type YtAdInterstitialCard = {
  __typename?: 'YTAdInterstitialCard';
  adUrl: Scalars['String']['output'];
  props: YtCardProps;
};

export type YtArticleCard = {
  __typename?: 'YTArticleCard';
  props: YtCardProps;
  title: Scalars['String']['output'];
};

export type YtCardCtaProps = {
  __typename?: 'YTCardCtaProps';
  color?: Maybe<Scalars['String']['output']>;
  isTourCastCta: Scalars['Boolean']['output'];
  link: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

export type YtCardProps = {
  __typename?: 'YTCardProps';
  backgroundColor?: Maybe<Scalars['String']['output']>;
  cardFranchise?: Maybe<Array<Scalars['String']['output']>>;
  cardHeading?: Maybe<Scalars['String']['output']>;
  cardName?: Maybe<Scalars['String']['output']>;
  cardSubHead?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<YtCardCtaProps>;
  ctaText?: Maybe<Scalars['String']['output']>;
  date: Scalars['AWSTimestamp']['output'];
  deepLink: Scalars['String']['output'];
  deepLinkCard: Scalars['Boolean']['output'];
  disableSlowZoom: Scalars['Boolean']['output'];
  /** @deprecated use imageAsset */
  image?: Maybe<Scalars['String']['output']>;
  imageAsset?: Maybe<ImageAsset>;
  link: Scalars['String']['output'];
  opacity: Scalars['Float']['output'];
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo?: Maybe<Scalars['String']['output']>;
  sponsorLogoAsset: ImageAsset;
  sponsorText?: Maybe<Scalars['String']['output']>;
  textColor: Scalars['String']['output'];
  textPosition: YtTextPosition;
  tourCastCta: Scalars['Boolean']['output'];
  videoId?: Maybe<Scalars['String']['output']>;
};

export type YtCardSponsorProps = {
  __typename?: 'YTCardSponsorProps';
  activationData: Array<YtActivationData>;
  activationSubtitle: Scalars['String']['output'];
  activationTitle: Scalars['String']['output'];
  /** @deprecated use sponsorLogoAsset */
  sponsorLogo: Scalars['String']['output'];
  sponsorLogoAsset: ImageAsset;
  /** @deprecated use tournamentLogoAsset */
  tournamentLogo: Scalars['String']['output'];
  tournamentLogoAsset: ImageAsset;
  tournamentName: Scalars['String']['output'];
};

export type YtCoverCard = {
  __typename?: 'YTCoverCard';
  props: YtCardProps;
  subTitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type YtHighlightCard = {
  __typename?: 'YTHighlightCard';
  hole?: Maybe<Scalars['String']['output']>;
  props: YtCardProps;
  title: Scalars['String']['output'];
};

export type YtLeaderboardCard = {
  __typename?: 'YTLeaderboardCard';
  players: Array<YtPlayer>;
  props: YtCardProps;
  title: Scalars['String']['output'];
  tournament: YtTournament;
};

export type YtNuggetCard = {
  __typename?: 'YTNuggetCard';
  props: YtCardProps;
  subText: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type YtPlayer = {
  __typename?: 'YTPlayer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type YtRound = {
  __typename?: 'YTRound';
  roundDisplay: Scalars['String']['output'];
  roundNumber: Scalars['Int']['output'];
};

export type YtScorecardCard = {
  __typename?: 'YTScorecardCard';
  player: YtPlayer;
  props: YtCardProps;
  title: Scalars['String']['output'];
  tournament: YtTournament;
};

export type YtSponsorActivationCard = {
  __typename?: 'YTSponsorActivationCard';
  props: YtCardProps;
  sponsorProps: YtCardSponsorProps;
  subTitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type YtTextPosition =
  | 'BOTTOM'
  | 'TOP';

export type YtTournament = {
  __typename?: 'YTTournament';
  id: Scalars['String']['output'];
  round: YtRound;
};

export type YtTournamentUpdateCard = {
  __typename?: 'YTTournamentUpdateCard';
  props: YtCardProps;
  title: Scalars['String']['output'];
};

export type YourTourCard = YtAdInterstitialCard | YtArticleCard | YtCoverCard | YtHighlightCard | YtLeaderboardCard | YtNuggetCard | YtScorecardCard | YtSponsorActivationCard | YtTournamentUpdateCard;

export type YourTourNews = NewsArticle | Video;

export type YourTourStory = {
  __typename?: 'YourTourStory';
  cardTopic?: Maybe<Scalars['String']['output']>;
  cards: Array<YourTourCard>;
  homeCard?: Maybe<YourTourCard>;
  id: Scalars['ID']['output'];
  tglMatchIds?: Maybe<Array<Scalars['String']['output']>>;
  videoStories: Array<YtVideoStory>;
};

export type YtVideoStory = {
  __typename?: 'YtVideoStory';
  topicLabel?: Maybe<Scalars['String']['output']>;
  type: YtVideoStoryType;
};

export type YtVideoStoryType =
  | 'PLAYER_STORIES'
  | 'TOPIC_STORIES';

export type LeaderboardCompressedV3QueryVariables = Exact<{
  leaderboardCompressedV3Id: Scalars['ID']['input'];
}>;


export type LeaderboardCompressedV3Query = { __typename?: 'Query', leaderboardCompressedV3: { __typename?: 'LeaderboardCompressedV3', id: string, payload: string } };

export type LeaderboardHoleByHoleQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
  round?: InputMaybe<Scalars['Int']['input']>;
}>;


export type LeaderboardHoleByHoleQuery = { __typename?: 'Query', leaderboardHoleByHole: { __typename?: 'LeaderboardHoleByHole', tournamentId: string, tournamentName: string, currentRound: number, courseHoleHeaders: Array<{ __typename?: 'CourseHoleHeader', courseId: string, holeHeaders: Array<{ __typename?: 'HoleHeaderV2', holeNumber?: number | null, par: string }> }>, playerData: Array<{ __typename?: 'PlayerRowHoleByHole', playerId: string, courseId: string, in?: string | null, out?: string | null, total?: string | null, totalToPar: string, scores: Array<{ __typename?: 'HoleScore', holeNumber: number, par: number, score: string, roundScore: string, status: HoleScoreStatus, sequenceNumber: number, yardage: number }> }> } };

export type ScheduleQueryVariables = Exact<{
  tourCode: Scalars['String']['input'];
  year?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<TournamentCategory>;
}>;


export type ScheduleQuery = { __typename?: 'Query', schedule: { __typename?: 'Schedule', seasonYear: string, tour: string, completed: Array<{ __typename?: 'ScheduleMonth', month: string, year: string, monthSort?: number | null, tournaments: Array<{ __typename?: 'ScheduleTournament', tournamentName: string, id: string, beautyImage?: string | null, champion: string, championEarnings?: string | null, championId: string, city: string, country: string, countryCode: string, courseName: string, date: string, dateAccessibilityText: string, purse?: string | null, startDate: unknown, state: string, stateCode: string, tournamentLogo: string, tourStandingHeading?: string | null, tourStandingValue?: string | null }> }>, filters?: Array<{ __typename?: 'ScheduleTournamentFilter', type: TournamentCategory, name: string }> | null, upcoming: Array<{ __typename?: 'ScheduleMonth', month: string, year: string, monthSort?: number | null, tournaments: Array<{ __typename?: 'ScheduleTournament', tournamentName: string, id: string, beautyImage?: string | null, champion: string, championEarnings?: string | null, championId: string, city: string, country: string, countryCode: string, courseName: string, date: string, dateAccessibilityText: string, purse?: string | null, startDate: unknown, state: string, stateCode: string, tournamentLogo: string, tourStandingHeading?: string | null, tourStandingValue?: string | null }> }> } };

export type ScheduleTournamentFragment = { __typename?: 'ScheduleMonth', tournaments: Array<{ __typename?: 'ScheduleTournament', tournamentName: string, id: string, beautyImage?: string | null, champion: string, championEarnings?: string | null, championId: string, city: string, country: string, countryCode: string, courseName: string, date: string, dateAccessibilityText: string, purse?: string | null, startDate: unknown, state: string, stateCode: string, tournamentLogo: string, tourStandingHeading?: string | null, tourStandingValue?: string | null }> };

export type ShotDetailsV3QueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
  round: Scalars['Int']['input'];
  includeRadar?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ShotDetailsV3Query = { __typename?: 'Query', shotDetailsV3: { __typename?: 'ShotDetails', id: string, tournamentId: string, playerId: string, round: number, displayType: ShotDetailsDisplayType, holes: Array<{ __typename?: 'ShotDetailHole', holeNumber: number, par: number, score: string, status: HoleScoreStatus, yardage: number, strokes: Array<{ __typename?: 'HoleStroke', strokeNumber: number, distance: string, distanceRemaining: string, fromLocation: string, fromLocationCode: string, toLocation: string, toLocationCode: string, strokeType: HoleStrokeType, playByPlay: string, finalStroke: boolean, radarData?: { __typename?: 'RadarData', ballSpeed: number, clubSpeed: number, smashFactor: number, verticalLaunchAngle: number, launchSpin: number, spinAxis: number, apexHeight: number } | null, overview: { __typename?: 'ShotLinkCoordWrapper', bottomToTopCoords: { __typename?: 'ShotLinkCoordinates', fromCoords: { __typename?: 'StrokeCoordinates', x: number, y: number }, toCoords: { __typename?: 'StrokeCoordinates', x: number, y: number } } } }> }> } };

export type TourCupSplitQueryVariables = Exact<{
  tourCode: TourCode;
  id?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
  eventQuery?: InputMaybe<StatDetailEventQuery>;
}>;


export type TourCupSplitQuery = { __typename?: 'Query', tourCupSplit?: { __typename?: 'TourCupSplit', projectedPlayers: Array<
      | { __typename: 'TourCupCombinedInfo' }
      | { __typename: 'TourCupCombinedPlayer', id: string, firstName: string, lastName: string, pointData?: { __typename?: 'TourCupCombinedData', event: string } | null }
    > } | null };

export type TournamentsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type TournamentsQuery = { __typename?: 'Query', tournaments: Array<{ __typename?: 'Tournament', id: string, tournamentName: string, tournamentLogo: Array<string>, tournamentLocation: string, tournamentStatus: TournamentStatus, roundStatusDisplay: string, roundDisplay: string, roundStatus: RoundStatus, roundStatusColor: RoundStatusColor, currentRound: number, timezone: string, seasonYear: string, displayDate: string, country: string, state: string, city: string, scoredLevel: ScoringLevel, infoPath?: string | null, formatType: FormatType, features?: Array<TournamentFeature> | null, events: Array<{ __typename?: 'Event', id: string, eventName: string, leaderboardId: string }>, courses: Array<{ __typename?: 'Course', id: string, courseName: string, courseCode: string, hostCourse: boolean, scoringLevel: ScoringLevel }>, weather?: { __typename?: 'TournamentWeather', logo?: string | null, logoDark?: string | null, logoAccessibility: string, tempF: string, tempC: string, condition: WeatherCondition, windDirection: WindDirection, windSpeedMPH: string, windSpeedKPH: string, precipitation: string, humidity: string } | null }> };

export type TournamentFragmentFragment = { __typename?: 'Tournament', id: string, tournamentName: string, tournamentLogo: Array<string>, tournamentLocation: string, tournamentStatus: TournamentStatus, roundStatusDisplay: string, roundDisplay: string, roundStatus: RoundStatus, roundStatusColor: RoundStatusColor, currentRound: number, timezone: string, seasonYear: string, displayDate: string, country: string, state: string, city: string, scoredLevel: ScoringLevel, infoPath?: string | null, formatType: FormatType, features?: Array<TournamentFeature> | null, events: Array<{ __typename?: 'Event', id: string, eventName: string, leaderboardId: string }>, courses: Array<{ __typename?: 'Course', id: string, courseName: string, courseCode: string, hostCourse: boolean, scoringLevel: ScoringLevel }>, weather?: { __typename?: 'TournamentWeather', logo?: string | null, logoDark?: string | null, logoAccessibility: string, tempF: string, tempC: string, condition: WeatherCondition, windDirection: WindDirection, windSpeedMPH: string, windSpeedKPH: string, precipitation: string, humidity: string } | null };

export const ScheduleTournamentFragmentDoc = gql`
    fragment ScheduleTournament on ScheduleMonth {
  tournaments {
    tournamentName
    id
    beautyImage
    champion
    championEarnings
    championId
    city
    country
    countryCode
    courseName
    date
    dateAccessibilityText
    purse
    startDate
    state
    stateCode
    tournamentLogo
    tourStandingHeading
    tourStandingValue
  }
}
    `;
export const TournamentFragmentFragmentDoc = gql`
    fragment TournamentFragment on Tournament {
  id
  tournamentName
  tournamentLogo
  tournamentLocation
  tournamentStatus
  roundStatusDisplay
  roundDisplay
  roundStatus
  roundStatusColor
  currentRound
  timezone
  seasonYear
  displayDate
  country
  state
  city
  scoredLevel
  infoPath
  events {
    id
    eventName
    leaderboardId
  }
  courses {
    id
    courseName
    courseCode
    hostCourse
    scoringLevel
  }
  weather {
    logo
    logoDark
    logoAccessibility
    tempF
    tempC
    condition
    windDirection
    windSpeedMPH
    windSpeedKPH
    precipitation
    humidity
  }
  formatType
  features
}
    `;
export const LeaderboardCompressedV3Document = gql`
    query LeaderboardCompressedV3($leaderboardCompressedV3Id: ID!) {
  leaderboardCompressedV3(id: $leaderboardCompressedV3Id) {
    id
    payload
  }
}
    `;
export const LeaderboardHoleByHoleDocument = gql`
    query LeaderboardHoleByHole($tournamentId: ID!, $round: Int) {
  leaderboardHoleByHole(tournamentId: $tournamentId, round: $round) {
    tournamentId
    tournamentName
    currentRound
    courseHoleHeaders {
      courseId
      holeHeaders {
        holeNumber
        par
      }
    }
    playerData {
      playerId
      courseId
      in
      out
      total
      totalToPar
      scores {
        holeNumber
        par
        score
        roundScore
        status
        sequenceNumber
        yardage
      }
    }
  }
}
    `;
export const ScheduleDocument = gql`
    query Schedule($tourCode: String!, $year: String, $filter: TournamentCategory) {
  schedule(tourCode: $tourCode, year: $year, filter: $filter) {
    completed {
      month
      year
      monthSort
      ...ScheduleTournament
    }
    filters {
      type
      name
    }
    seasonYear
    tour
    upcoming {
      month
      year
      monthSort
      ...ScheduleTournament
    }
  }
}
    ${ScheduleTournamentFragmentDoc}`;
export const ShotDetailsV3Document = gql`
    query ShotDetailsV3($tournamentId: ID!, $playerId: ID!, $round: Int!, $includeRadar: Boolean) {
  shotDetailsV3(
    tournamentId: $tournamentId
    playerId: $playerId
    round: $round
    includeRadar: $includeRadar
  ) {
    id
    tournamentId
    playerId
    round
    displayType
    holes {
      holeNumber
      par
      score
      status
      yardage
      strokes {
        strokeNumber
        distance
        distanceRemaining
        fromLocation
        fromLocationCode
        toLocation
        toLocationCode
        strokeType
        playByPlay
        finalStroke
        radarData {
          ballSpeed
          clubSpeed
          smashFactor
          verticalLaunchAngle
          launchSpin
          spinAxis
          apexHeight
        }
        overview {
          bottomToTopCoords {
            fromCoords {
              x
              y
            }
            toCoords {
              x
              y
            }
          }
        }
      }
    }
  }
}
    `;
export const TourCupSplitDocument = gql`
    query TourCupSplit($tourCode: TourCode!, $id: String, $year: Int, $eventQuery: StatDetailEventQuery) {
  tourCupSplit(tourCode: $tourCode, id: $id, year: $year, eventQuery: $eventQuery) {
    projectedPlayers {
      __typename
      ... on TourCupCombinedPlayer {
        id
        firstName
        lastName
        pointData {
          event
        }
      }
    }
  }
}
    `;
export const TournamentsDocument = gql`
    query Tournaments($ids: [ID!]) {
  tournaments(ids: $ids) {
    ...TournamentFragment
  }
}
    ${TournamentFragmentFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    LeaderboardCompressedV3(variables: LeaderboardCompressedV3QueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LeaderboardCompressedV3Query> {
      return withWrapper((wrappedRequestHeaders) => client.request<LeaderboardCompressedV3Query>({ document: LeaderboardCompressedV3Document, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'LeaderboardCompressedV3', 'query', variables);
    },
    LeaderboardHoleByHole(variables: LeaderboardHoleByHoleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LeaderboardHoleByHoleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LeaderboardHoleByHoleQuery>({ document: LeaderboardHoleByHoleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'LeaderboardHoleByHole', 'query', variables);
    },
    Schedule(variables: ScheduleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ScheduleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ScheduleQuery>({ document: ScheduleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Schedule', 'query', variables);
    },
    ShotDetailsV3(variables: ShotDetailsV3QueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ShotDetailsV3Query> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShotDetailsV3Query>({ document: ShotDetailsV3Document, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ShotDetailsV3', 'query', variables);
    },
    TourCupSplit(variables: TourCupSplitQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TourCupSplitQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TourCupSplitQuery>({ document: TourCupSplitDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'TourCupSplit', 'query', variables);
    },
    Tournaments(variables?: TournamentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TournamentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TournamentsQuery>({ document: TournamentsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Tournaments', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;