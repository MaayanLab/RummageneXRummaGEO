import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigFloat: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

/** All input for the `addUserGeneSet` mutation. */
export type AddUserGeneSetInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** The output of our `addUserGeneSet` mutation. */
export type AddUserGeneSetPayload = {
  __typename?: 'AddUserGeneSetPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  userGeneSet?: Maybe<UserGeneSet>;
  /** An edge for our `UserGeneSet`. May be used by Relay 1. */
  userGeneSetEdge?: Maybe<UserGeneSetsEdge>;
};


/** The output of our `addUserGeneSet` mutation. */
export type AddUserGeneSetPayloadUserGeneSetEdgeArgs = {
  orderBy?: InputMaybe<Array<UserGeneSetsOrderBy>>;
};

export type Background = Node & {
  __typename?: 'Background';
  created?: Maybe<Scalars['Datetime']['output']>;
  enrich?: Maybe<PaginatedEnrichResult>;
  geneIds: Scalars['JSON']['output'];
  id: Scalars['UUID']['output'];
  nGeneIds: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  overlap: BackgroundOverlapConnection;
};


export type BackgroundEnrichArgs = {
  adjPvalueLe?: InputMaybe<Scalars['Float']['input']>;
  filterTerm?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  genes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  overlapGe?: InputMaybe<Scalars['Int']['input']>;
  pvalueLe?: InputMaybe<Scalars['Float']['input']>;
};


export type BackgroundOverlapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  genes: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  overlapGreaterThan?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * A condition to be used against `Background` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type BackgroundCondition = {
  /** Checks for equality with the object’s `geneIds` field. */
  geneIds?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `BackgroundOverlapRecord` values. */
export type BackgroundOverlapConnection = {
  __typename?: 'BackgroundOverlapConnection';
  /** A list of edges which contains the `BackgroundOverlapRecord` and cursor to aid in pagination. */
  edges: Array<BackgroundOverlapEdge>;
  /** A list of `BackgroundOverlapRecord` objects. */
  nodes: Array<BackgroundOverlapRecord>;
  /** The count of *all* `BackgroundOverlapRecord` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `BackgroundOverlapRecord` edge in the connection. */
export type BackgroundOverlapEdge = {
  __typename?: 'BackgroundOverlapEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `BackgroundOverlapRecord` at the end of the edge. */
  node: BackgroundOverlapRecord;
};

/** The return type of our `overlap` query. */
export type BackgroundOverlapRecord = {
  __typename?: 'BackgroundOverlapRecord';
  geneSetId?: Maybe<Scalars['UUID']['output']>;
  nGsGeneIds?: Maybe<Scalars['Int']['output']>;
  nOverlapGeneIds?: Maybe<Scalars['Int']['output']>;
};

/** A connection to a list of `Background` values. */
export type BackgroundsConnection = {
  __typename?: 'BackgroundsConnection';
  /** A list of edges which contains the `Background` and cursor to aid in pagination. */
  edges: Array<BackgroundsEdge>;
  /** A list of `Background` objects. */
  nodes: Array<Background>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Background` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Background` edge in the connection. */
export type BackgroundsEdge = {
  __typename?: 'BackgroundsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Background` at the end of the edge. */
  node: Background;
};

/** Methods to use when ordering `Background`. */
export enum BackgroundsOrderBy {
  GeneIdsAsc = 'GENE_IDS_ASC',
  GeneIdsDesc = 'GENE_IDS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type CounterTable = Node & {
  __typename?: 'CounterTable';
  count?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/**
 * A condition to be used against `CounterTable` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CounterTableCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** A connection to a list of `CounterTable` values. */
export type CounterTablesConnection = {
  __typename?: 'CounterTablesConnection';
  /** A list of edges which contains the `CounterTable` and cursor to aid in pagination. */
  edges: Array<CounterTablesEdge>;
  /** A list of `CounterTable` objects. */
  nodes: Array<CounterTable>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CounterTable` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CounterTable` edge in the connection. */
export type CounterTablesEdge = {
  __typename?: 'CounterTablesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CounterTable` at the end of the edge. */
  node: CounterTable;
};

/** Methods to use when ordering `CounterTable`. */
export enum CounterTablesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type EnrichResult = {
  __typename?: 'EnrichResult';
  adjPvalue?: Maybe<Scalars['Float']['output']>;
  geneSetHash?: Maybe<Scalars['UUID']['output']>;
  /** Reads and enables pagination through a set of `GeneSet`. */
  geneSets: GeneSetsConnection;
  nOverlap?: Maybe<Scalars['Int']['output']>;
  oddsRatio?: Maybe<Scalars['Float']['output']>;
  pvalue?: Maybe<Scalars['Float']['output']>;
};


export type EnrichResultGeneSetsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Gene = Node & {
  __typename?: 'Gene';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  ncbiGeneId?: Maybe<Scalars['Int']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
  synonyms?: Maybe<Scalars['JSON']['output']>;
};

/** A condition to be used against `Gene` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type GeneCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `symbol` field. */
  symbol?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `synonyms` field. */
  synonyms?: InputMaybe<Scalars['JSON']['input']>;
};

export type GeneMapping = {
  __typename?: 'GeneMapping';
  gene?: Maybe<Scalars['String']['output']>;
  geneId?: Maybe<Scalars['UUID']['output']>;
  geneInfo?: Maybe<Gene>;
};

/** A connection to a list of `GeneMapping` values. */
export type GeneMappingsConnection = {
  __typename?: 'GeneMappingsConnection';
  /** A list of edges which contains the `GeneMapping` and cursor to aid in pagination. */
  edges: Array<GeneMappingsEdge>;
  /** A list of `GeneMapping` objects. */
  nodes: Array<GeneMapping>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GeneMapping` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GeneMapping` edge in the connection. */
export type GeneMappingsEdge = {
  __typename?: 'GeneMappingsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GeneMapping` at the end of the edge. */
  node: GeneMapping;
};

export type GeneSet = Node & {
  __typename?: 'GeneSet';
  created: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  geneIds: Scalars['JSON']['output'];
  /** Reads and enables pagination through a set of `Gene`. */
  genes: GenesConnection;
  gse?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `GseInfo`. */
  gseInfosByGse: GseInfosConnection;
  hash: Scalars['UUID']['output'];
  hypothesis?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  nGeneIds: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  odds?: Maybe<Scalars['Float']['output']>;
  /** Reads and enables pagination through a set of `Gene`. */
  overlap: GenesConnection;
  pmc?: Maybe<Scalars['String']['output']>;
  /** Reads a single `PmcInfo` that is related to this `GeneSet`. */
  pmcInfoByPmc?: Maybe<PmcInfo>;
  pvalue?: Maybe<Scalars['Float']['output']>;
  /** Reads and enables pagination through a set of `RankedGeneSet`. */
  rankedGeneSetsById: RankedGeneSetsConnection;
  rummageneSize?: Maybe<Scalars['Int']['output']>;
  rummageoSize?: Maybe<Scalars['Int']['output']>;
  species: Scalars['String']['output'];
  term: Scalars['String']['output'];
};


export type GeneSetGenesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type GeneSetGseInfosByGseArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GseInfoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GseInfosOrderBy>>;
};


export type GeneSetOverlapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  genes: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type GeneSetRankedGeneSetsByIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<RankedGeneSetCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RankedGeneSetsOrderBy>>;
};

/** A condition to be used against `GeneSet` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type GeneSetCondition = {
  /** Checks for equality with the object’s `geneIds` field. */
  geneIds?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `gse` field. */
  gse?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `hash` field. */
  hash?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `pmc` field. */
  pmc?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `pvalue` field. */
  pvalue?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `term` field. */
  term?: InputMaybe<Scalars['String']['input']>;
};

/** Aggregates ids by gse and species */
export type GeneSetGse = {
  __typename?: 'GeneSetGse';
  gse?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Gse`. */
  gsesByGse: GsesConnection;
  species?: Maybe<Scalars['String']['output']>;
};


/** Aggregates ids by gse and species */
export type GeneSetGseGsesByGseArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GsesOrderBy>>;
};

/**
 * A condition to be used against `GeneSetGse` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GeneSetGseCondition = {
  /** Checks for equality with the object’s `gse` field. */
  gse?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `species` field. */
  species?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `GeneSetGse` values. */
export type GeneSetGsesConnection = {
  __typename?: 'GeneSetGsesConnection';
  /** A list of edges which contains the `GeneSetGse` and cursor to aid in pagination. */
  edges: Array<GeneSetGsesEdge>;
  /** A list of `GeneSetGse` objects. */
  nodes: Array<GeneSetGse>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GeneSetGse` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GeneSetGse` edge in the connection. */
export type GeneSetGsesEdge = {
  __typename?: 'GeneSetGsesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GeneSetGse` at the end of the edge. */
  node: GeneSetGse;
};

/** Methods to use when ordering `GeneSetGse`. */
export enum GeneSetGsesOrderBy {
  GseAsc = 'GSE_ASC',
  GseDesc = 'GSE_DESC',
  Natural = 'NATURAL',
  SpeciesAsc = 'SPECIES_ASC',
  SpeciesDesc = 'SPECIES_DESC'
}

export type GeneSetPmc = {
  __typename?: 'GeneSetPmc';
  pmc?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Pmc`. */
  pmcsByPmc: PmcsConnection;
};


export type GeneSetPmcPmcsByPmcArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmcsOrderBy>>;
};

/**
 * A condition to be used against `GeneSetPmc` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GeneSetPmcCondition = {
  /** Checks for equality with the object’s `pmc` field. */
  pmc?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `GeneSetPmc` values. */
export type GeneSetPmcsConnection = {
  __typename?: 'GeneSetPmcsConnection';
  /** A list of edges which contains the `GeneSetPmc` and cursor to aid in pagination. */
  edges: Array<GeneSetPmcsEdge>;
  /** A list of `GeneSetPmc` objects. */
  nodes: Array<GeneSetPmc>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GeneSetPmc` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GeneSetPmc` edge in the connection. */
export type GeneSetPmcsEdge = {
  __typename?: 'GeneSetPmcsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GeneSetPmc` at the end of the edge. */
  node: GeneSetPmc;
};

/** Methods to use when ordering `GeneSetPmc`. */
export enum GeneSetPmcsOrderBy {
  Natural = 'NATURAL',
  PmcAsc = 'PMC_ASC',
  PmcDesc = 'PMC_DESC'
}

export type GeneSetPmid = {
  __typename?: 'GeneSetPmid';
  gse?: Maybe<Scalars['String']['output']>;
  gseId?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `GseInfo` that is related to this `GeneSetPmid`. */
  gseInfoByGse?: Maybe<GseInfo>;
  platform?: Maybe<Scalars['String']['output']>;
  pmid?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Pmid`. */
  pmidsByPmid: PmidsConnection;
  publishedDate?: Maybe<Scalars['Date']['output']>;
  sampleGroups?: Maybe<Scalars['JSON']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type GeneSetPmidPmidsByPmidArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmidsOrderBy>>;
};

/**
 * A condition to be used against `GeneSetPmid` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GeneSetPmidCondition = {
  /** Checks for equality with the object’s `gse` field. */
  gse?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `gseId` field. */
  gseId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `GeneSetPmid` values. */
export type GeneSetPmidsConnection = {
  __typename?: 'GeneSetPmidsConnection';
  /** A list of edges which contains the `GeneSetPmid` and cursor to aid in pagination. */
  edges: Array<GeneSetPmidsEdge>;
  /** A list of `GeneSetPmid` objects. */
  nodes: Array<GeneSetPmid>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GeneSetPmid` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GeneSetPmid` edge in the connection. */
export type GeneSetPmidsEdge = {
  __typename?: 'GeneSetPmidsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GeneSetPmid` at the end of the edge. */
  node: GeneSetPmid;
};

/** Methods to use when ordering `GeneSetPmid`. */
export enum GeneSetPmidsOrderBy {
  GseAsc = 'GSE_ASC',
  GseDesc = 'GSE_DESC',
  GseIdAsc = 'GSE_ID_ASC',
  GseIdDesc = 'GSE_ID_DESC',
  Natural = 'NATURAL'
}

/** A connection to a list of `GeneSet` values. */
export type GeneSetsConnection = {
  __typename?: 'GeneSetsConnection';
  /** A list of edges which contains the `GeneSet` and cursor to aid in pagination. */
  edges: Array<GeneSetsEdge>;
  /** A list of `GeneSet` objects. */
  nodes: Array<GeneSet>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GeneSet` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GeneSet` edge in the connection. */
export type GeneSetsEdge = {
  __typename?: 'GeneSetsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GeneSet` at the end of the edge. */
  node: GeneSet;
};

/** Methods to use when ordering `GeneSet`. */
export enum GeneSetsOrderBy {
  GeneIdsAsc = 'GENE_IDS_ASC',
  GeneIdsDesc = 'GENE_IDS_DESC',
  GseAsc = 'GSE_ASC',
  GseDesc = 'GSE_DESC',
  HashAsc = 'HASH_ASC',
  HashDesc = 'HASH_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PmcAsc = 'PMC_ASC',
  PmcDesc = 'PMC_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PvalueAsc = 'PVALUE_ASC',
  PvalueDesc = 'PVALUE_DESC',
  TermAsc = 'TERM_ASC',
  TermDesc = 'TERM_DESC'
}

/** A connection to a list of `Gene` values. */
export type GenesConnection = {
  __typename?: 'GenesConnection';
  /** A list of edges which contains the `Gene` and cursor to aid in pagination. */
  edges: Array<GenesEdge>;
  /** A list of `Gene` objects. */
  nodes: Array<Gene>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Gene` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Gene` edge in the connection. */
export type GenesEdge = {
  __typename?: 'GenesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Gene` at the end of the edge. */
  node: Gene;
};

/** Methods to use when ordering `Gene`. */
export enum GenesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SymbolAsc = 'SYMBOL_ASC',
  SymbolDesc = 'SYMBOL_DESC',
  SynonymsAsc = 'SYNONYMS_ASC',
  SynonymsDesc = 'SYNONYMS_DESC'
}

export type Gse = {
  __typename?: 'Gse';
  /** Reads a single `GeneSetGse` that is related to this `Gse`. */
  geneSetGseByGse?: Maybe<GeneSetGse>;
  gse?: Maybe<Scalars['String']['output']>;
};

export type GseInfo = Node & {
  __typename?: 'GseInfo';
  /** Reads a single `GeneSet` that is related to this `GseInfo`. */
  geneSetByGse?: Maybe<GeneSet>;
  /** Reads and enables pagination through a set of `GeneSetPmid`. */
  geneSetPmidsByGse: GeneSetPmidsConnection;
  gse?: Maybe<Scalars['String']['output']>;
  gseAttrs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  platform?: Maybe<Scalars['String']['output']>;
  pmid?: Maybe<Scalars['String']['output']>;
  publishedDate?: Maybe<Scalars['Date']['output']>;
  sampleGroups?: Maybe<Scalars['JSON']['output']>;
  silhouetteScore?: Maybe<Scalars['Float']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type GseInfoGeneSetPmidsByGseArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GeneSetPmidCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GeneSetPmidsOrderBy>>;
};

/** A condition to be used against `GseInfo` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type GseInfoCondition = {
  /** Checks for equality with the object’s `gse` field. */
  gse?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `GseInfo` values. */
export type GseInfosConnection = {
  __typename?: 'GseInfosConnection';
  /** A list of edges which contains the `GseInfo` and cursor to aid in pagination. */
  edges: Array<GseInfosEdge>;
  /** A list of `GseInfo` objects. */
  nodes: Array<GseInfo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GseInfo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GseInfo` edge in the connection. */
export type GseInfosEdge = {
  __typename?: 'GseInfosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GseInfo` at the end of the edge. */
  node: GseInfo;
};

/** Methods to use when ordering `GseInfo`. */
export enum GseInfosOrderBy {
  GseAsc = 'GSE_ASC',
  GseDesc = 'GSE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type GseStat = {
  __typename?: 'GseStat';
  nOccurrencesProcessed?: Maybe<Scalars['BigInt']['output']>;
  species?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of `GseStat` values. */
export type GseStatsConnection = {
  __typename?: 'GseStatsConnection';
  /** A list of edges which contains the `GseStat` and cursor to aid in pagination. */
  edges: Array<GseStatsEdge>;
  /** A list of `GseStat` objects. */
  nodes: Array<GseStat>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GseStat` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GseStat` edge in the connection. */
export type GseStatsEdge = {
  __typename?: 'GseStatsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GseStat` at the end of the edge. */
  node: GseStat;
};

/** Methods to use when ordering `GseStat`. */
export enum GseStatsOrderBy {
  Natural = 'NATURAL'
}

/** A connection to a list of `Gse` values. */
export type GsesConnection = {
  __typename?: 'GsesConnection';
  /** A list of edges which contains the `Gse` and cursor to aid in pagination. */
  edges: Array<GsesEdge>;
  /** A list of `Gse` objects. */
  nodes: Array<Gse>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Gse` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Gse` edge in the connection. */
export type GsesEdge = {
  __typename?: 'GsesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Gse` at the end of the edge. */
  node: Gse;
};

/** Methods to use when ordering `Gse`. */
export enum GsesOrderBy {
  Natural = 'NATURAL'
}

export type GsmMeta = Node & {
  __typename?: 'GsmMeta';
  characteristicsCh1?: Maybe<Scalars['String']['output']>;
  gse?: Maybe<Scalars['String']['output']>;
  gsm: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  sourceNameCh1?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** A condition to be used against `GsmMeta` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type GsmMetaCondition = {
  /** Checks for equality with the object’s `gsm` field. */
  gsm?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `GsmMeta` values. */
export type GsmMetasConnection = {
  __typename?: 'GsmMetasConnection';
  /** A list of edges which contains the `GsmMeta` and cursor to aid in pagination. */
  edges: Array<GsmMetasEdge>;
  /** A list of `GsmMeta` objects. */
  nodes: Array<GsmMeta>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GsmMeta` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GsmMeta` edge in the connection. */
export type GsmMetasEdge = {
  __typename?: 'GsmMetasEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GsmMeta` at the end of the edge. */
  node: GsmMeta;
};

/** Methods to use when ordering `GsmMeta`. */
export enum GsmMetasOrderBy {
  GsmAsc = 'GSM_ASC',
  GsmDesc = 'GSM_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** All input for the `incrementCounter` mutation. */
export type IncrementCounterInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our `incrementCounter` mutation. */
export type IncrementCounterPayload = {
  __typename?: 'IncrementCounterPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  integer?: Maybe<Scalars['Int']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  addUserGeneSet?: Maybe<AddUserGeneSetPayload>;
  incrementCounter?: Maybe<IncrementCounterPayload>;
  updateHypothesis?: Maybe<UpdateHypothesisPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAddUserGeneSetArgs = {
  input: AddUserGeneSetInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationIncrementCounterArgs = {
  input: IncrementCounterInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHypothesisArgs = {
  input: UpdateHypothesisInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type PaginatedEnrichResult = {
  __typename?: 'PaginatedEnrichResult';
  nodes?: Maybe<Array<Maybe<EnrichResult>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PaginatedRankedGeneSetsResult = {
  __typename?: 'PaginatedRankedGeneSetsResult';
  rankedSets?: Maybe<Array<Maybe<RankedGeneSet>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type Pmc = {
  __typename?: 'Pmc';
  /** Reads a single `GeneSetPmc` that is related to this `Pmc`. */
  geneSetPmcByPmc?: Maybe<GeneSetPmc>;
  pmc?: Maybe<Scalars['String']['output']>;
};

export type PmcInfo = Node & {
  __typename?: 'PmcInfo';
  abstract?: Maybe<Scalars['String']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  /** Reads a single `GeneSet` that is related to this `PmcInfo`. */
  geneSetByPmc?: Maybe<GeneSet>;
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  pmc: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  yr?: Maybe<Scalars['Int']['output']>;
};

/** A condition to be used against `PmcInfo` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PmcInfoCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `pmc` field. */
  pmc?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `PmcInfo` values. */
export type PmcInfosConnection = {
  __typename?: 'PmcInfosConnection';
  /** A list of edges which contains the `PmcInfo` and cursor to aid in pagination. */
  edges: Array<PmcInfosEdge>;
  /** A list of `PmcInfo` objects. */
  nodes: Array<PmcInfo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PmcInfo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PmcInfo` edge in the connection. */
export type PmcInfosEdge = {
  __typename?: 'PmcInfosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PmcInfo` at the end of the edge. */
  node: PmcInfo;
};

/** Methods to use when ordering `PmcInfo`. */
export enum PmcInfosOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PmcAsc = 'PMC_ASC',
  PmcDesc = 'PMC_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type PmcStat = {
  __typename?: 'PmcStat';
  nPublicationsProcessed?: Maybe<Scalars['BigFloat']['output']>;
};

export type PmcTermStat = {
  __typename?: 'PmcTermStat';
  uniqueTermPartsCount?: Maybe<Scalars['BigInt']['output']>;
};

/** A connection to a list of `PmcTermStat` values. */
export type PmcTermStatsConnection = {
  __typename?: 'PmcTermStatsConnection';
  /** A list of edges which contains the `PmcTermStat` and cursor to aid in pagination. */
  edges: Array<PmcTermStatsEdge>;
  /** A list of `PmcTermStat` objects. */
  nodes: Array<PmcTermStat>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PmcTermStat` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PmcTermStat` edge in the connection. */
export type PmcTermStatsEdge = {
  __typename?: 'PmcTermStatsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PmcTermStat` at the end of the edge. */
  node: PmcTermStat;
};

/** Methods to use when ordering `PmcTermStat`. */
export enum PmcTermStatsOrderBy {
  Natural = 'NATURAL'
}

/** A connection to a list of `Pmc` values. */
export type PmcsConnection = {
  __typename?: 'PmcsConnection';
  /** A list of edges which contains the `Pmc` and cursor to aid in pagination. */
  edges: Array<PmcsEdge>;
  /** A list of `Pmc` objects. */
  nodes: Array<Pmc>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pmc` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Pmc` edge in the connection. */
export type PmcsEdge = {
  __typename?: 'PmcsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pmc` at the end of the edge. */
  node: Pmc;
};

/** Methods to use when ordering `Pmc`. */
export enum PmcsOrderBy {
  Natural = 'NATURAL'
}

export type Pmid = {
  __typename?: 'Pmid';
  /** Reads a single `GeneSetPmid` that is related to this `Pmid`. */
  geneSetPmidByPmid?: Maybe<GeneSetPmid>;
  pmid?: Maybe<Scalars['String']['output']>;
};

export type PmidInfo = Node & {
  __typename?: 'PmidInfo';
  doi?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  pmcid?: Maybe<Scalars['String']['output']>;
  pmid: Scalars['String']['output'];
  pubDate?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `PmidInfo` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PmidInfoCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `pmid` field. */
  pmid?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `PmidInfo` values. */
export type PmidInfosConnection = {
  __typename?: 'PmidInfosConnection';
  /** A list of edges which contains the `PmidInfo` and cursor to aid in pagination. */
  edges: Array<PmidInfosEdge>;
  /** A list of `PmidInfo` objects. */
  nodes: Array<PmidInfo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PmidInfo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PmidInfo` edge in the connection. */
export type PmidInfosEdge = {
  __typename?: 'PmidInfosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PmidInfo` at the end of the edge. */
  node: PmidInfo;
};

/** Methods to use when ordering `PmidInfo`. */
export enum PmidInfosOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PmidAsc = 'PMID_ASC',
  PmidDesc = 'PMID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Pmid` values. */
export type PmidsConnection = {
  __typename?: 'PmidsConnection';
  /** A list of edges which contains the `Pmid` and cursor to aid in pagination. */
  edges: Array<PmidsEdge>;
  /** A list of `Pmid` objects. */
  nodes: Array<Pmid>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pmid` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Pmid` edge in the connection. */
export type PmidsEdge = {
  __typename?: 'PmidsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pmid` at the end of the edge. */
  node: Pmid;
};

/** Methods to use when ordering `Pmid`. */
export enum PmidsOrderBy {
  Natural = 'NATURAL'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  background?: Maybe<Background>;
  /** Reads a single `Background` using its globally unique `ID`. */
  backgroundByNodeId?: Maybe<Background>;
  /** Reads and enables pagination through a set of `Background`. */
  backgrounds?: Maybe<BackgroundsConnection>;
  counterTable?: Maybe<CounterTable>;
  /** Reads a single `CounterTable` using its globally unique `ID`. */
  counterTableByNodeId?: Maybe<CounterTable>;
  /** Reads and enables pagination through a set of `CounterTable`. */
  counterTables?: Maybe<CounterTablesConnection>;
  currentBackground?: Maybe<Background>;
  gene?: Maybe<Gene>;
  /** Reads a single `Gene` using its globally unique `ID`. */
  geneByNodeId?: Maybe<Gene>;
  geneBySymbol?: Maybe<Gene>;
  /** Reads and enables pagination through a set of `GeneMapping`. */
  geneMap?: Maybe<GeneMappingsConnection>;
  /** Reads and enables pagination through a set of `GeneMapping`. */
  geneMap2?: Maybe<GeneMappingsConnection>;
  geneSet?: Maybe<GeneSet>;
  /** Reads a single `GeneSet` using its globally unique `ID`. */
  geneSetByNodeId?: Maybe<GeneSet>;
  geneSetByTerm?: Maybe<GeneSet>;
  /** Reads and enables pagination through a set of `GeneSet`. */
  geneSetGeneSearch?: Maybe<GeneSetsConnection>;
  /** Reads and enables pagination through a set of `GeneSetGse`. */
  geneSetGses?: Maybe<GeneSetGsesConnection>;
  /** Reads and enables pagination through a set of `GeneSetPmc`. */
  geneSetPmcs?: Maybe<GeneSetPmcsConnection>;
  /** Reads and enables pagination through a set of `GeneSetPmid`. */
  geneSetPmids?: Maybe<GeneSetPmidsConnection>;
  /** Reads and enables pagination through a set of `GeneSet`. */
  geneSetTermSearch?: Maybe<GeneSetsConnection>;
  /** Reads and enables pagination through a set of `GeneSetPmid`. */
  geneSetTermSearch2?: Maybe<GeneSetPmidsConnection>;
  /** Reads and enables pagination through a set of `GeneSet`. */
  geneSets?: Maybe<GeneSetsConnection>;
  /** Reads and enables pagination through a set of `Gene`. */
  genes?: Maybe<GenesConnection>;
  /** Reads and enables pagination through a set of `GseInfo`. */
  getGseInfoByIds?: Maybe<GseInfosConnection>;
  /** Reads and enables pagination through a set of `GsmMeta`. */
  getGsmMeta?: Maybe<GsmMetasConnection>;
  getPaginatedRankedGeneSets2?: Maybe<PaginatedRankedGeneSetsResult>;
  /** Reads and enables pagination through a set of `GeneSetPmid`. */
  getPbInfoByIds?: Maybe<GeneSetPmidsConnection>;
  /** Reads and enables pagination through a set of `PmidInfo`. */
  getPbMetaByIds?: Maybe<PmidInfosConnection>;
  /** Reads and enables pagination through a set of `PmcInfo`. */
  getPmcInfoByIds?: Maybe<PmcInfosConnection>;
  gseInfo?: Maybe<GseInfo>;
  /** Reads a single `GseInfo` using its globally unique `ID`. */
  gseInfoByNodeId?: Maybe<GseInfo>;
  /** Reads and enables pagination through a set of `GseInfo`. */
  gseInfos?: Maybe<GseInfosConnection>;
  /** Reads and enables pagination through a set of `GseStat`. */
  gseStats?: Maybe<GseStatsConnection>;
  /** Reads and enables pagination through a set of `Gse`. */
  gses?: Maybe<GsesConnection>;
  gsmMeta?: Maybe<GsmMeta>;
  gsmMetaByGsm?: Maybe<GsmMeta>;
  /** Reads a single `GsmMeta` using its globally unique `ID`. */
  gsmMetaByNodeId?: Maybe<GsmMeta>;
  /** Reads and enables pagination through a set of `GsmMeta`. */
  gsmMetas?: Maybe<GsmMetasConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  pmcInfo?: Maybe<PmcInfo>;
  /** Reads a single `PmcInfo` using its globally unique `ID`. */
  pmcInfoByNodeId?: Maybe<PmcInfo>;
  pmcInfoByPmc?: Maybe<PmcInfo>;
  /** Reads and enables pagination through a set of `PmcInfo`. */
  pmcInfos?: Maybe<PmcInfosConnection>;
  pmcStats?: Maybe<PmcStat>;
  /** Reads and enables pagination through a set of `PmcTermStat`. */
  pmcTermStats?: Maybe<PmcTermStatsConnection>;
  /** Reads and enables pagination through a set of `Pmc`. */
  pmcs?: Maybe<PmcsConnection>;
  pmidInfo?: Maybe<PmidInfo>;
  /** Reads a single `PmidInfo` using its globally unique `ID`. */
  pmidInfoByNodeId?: Maybe<PmidInfo>;
  pmidInfoByPmid?: Maybe<PmidInfo>;
  /** Reads and enables pagination through a set of `PmidInfo`. */
  pmidInfos?: Maybe<PmidInfosConnection>;
  /** Reads and enables pagination through a set of `Pmid`. */
  pmids?: Maybe<PmidsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads and enables pagination through a set of `RankedGeneSet`. */
  rankedGeneSets?: Maybe<RankedGeneSetsConnection>;
  release?: Maybe<Release>;
  /** Reads a single `Release` using its globally unique `ID`. */
  releaseByNodeId?: Maybe<Release>;
  /** Reads and enables pagination through a set of `Release`. */
  releases?: Maybe<ReleasesConnection>;
  termsGsesArray?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  termsGsesCount?: Maybe<TermsGsesCountConnection>;
  termsPmcsArray?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  termsPmcsCount?: Maybe<TermsPmcsCountConnection>;
  /** Reads and enables pagination through a set of `UniqueTermCount`. */
  uniqueTermCounts?: Maybe<UniqueTermCountsConnection>;
  userGeneSet?: Maybe<UserGeneSet>;
  /** Reads a single `UserGeneSet` using its globally unique `ID`. */
  userGeneSetByNodeId?: Maybe<UserGeneSet>;
  /** Reads and enables pagination through a set of `UserGeneSet`. */
  userGeneSets?: Maybe<UserGeneSetsConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryBackgroundArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBackgroundByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBackgroundsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<BackgroundCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BackgroundsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCounterTableArgs = {
  id: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCounterTableByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCounterTablesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CounterTableCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CounterTablesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneBySymbolArgs = {
  symbol: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneMapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  genes: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneMap2Args = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  genes: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetByTermArgs = {
  term: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetGeneSearchArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  genes: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetGsesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GeneSetGseCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GeneSetGsesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetPmcsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GeneSetPmcCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GeneSetPmcsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetPmidsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GeneSetPmidCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GeneSetPmidsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetTermSearchArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  terms: Array<InputMaybe<Scalars['String']['input']>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetTermSearch2Args = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  terms: Array<InputMaybe<Scalars['String']['input']>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGeneSetsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GeneSetCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GeneSetsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGenesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GeneCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GenesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetGseInfoByIdsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  gseids: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetGsmMetaArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  gsms: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetPaginatedRankedGeneSets2Args = {
  pCaseSensitive?: InputMaybe<Scalars['Boolean']['input']>;
  pLimit: Scalars['Int']['input'];
  pOffset: Scalars['Int']['input'];
  pSpecies?: InputMaybe<Scalars['String']['input']>;
  pTerm?: InputMaybe<Scalars['String']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetPbInfoByIdsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pmids: Array<InputMaybe<Scalars['String']['input']>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetPbMetaByIdsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pmids: Array<InputMaybe<Scalars['String']['input']>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetPmcInfoByIdsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pmcids: Array<InputMaybe<Scalars['String']['input']>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGseInfoArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGseInfoByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGseInfosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GseInfoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GseInfosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGseStatsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GseStatsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGsesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GsesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGsmMetaArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGsmMetaByGsmArgs = {
  gsm: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGsmMetaByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGsmMetasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GsmMetaCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GsmMetasOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmcInfoArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmcInfoByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmcInfoByPmcArgs = {
  pmc: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmcInfosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PmcInfoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmcInfosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPmcTermStatsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmcTermStatsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPmcsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmcsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPmidInfoArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmidInfoByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmidInfoByPmidArgs = {
  pmid: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPmidInfosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PmidInfoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmidInfosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPmidsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PmidsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryRankedGeneSetsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<RankedGeneSetCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RankedGeneSetsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReleaseArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReleaseByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReleasesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ReleaseCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReleasesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTermsGsesArrayArgs = {
  term: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTermsGsesCountArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  gseids: Array<InputMaybe<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTermsPmcsArrayArgs = {
  term: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTermsPmcsCountArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pmcids: Array<InputMaybe<Scalars['String']['input']>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUniqueTermCountsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UniqueTermCountsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserGeneSetArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserGeneSetByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserGeneSetsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserGeneSetCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserGeneSetsOrderBy>>;
};

export type RankedGeneSet = {
  __typename?: 'RankedGeneSet';
  created?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  geneIds?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `GeneSet` that is related to this `RankedGeneSet`. */
  geneSetById?: Maybe<GeneSet>;
  gse?: Maybe<Scalars['String']['output']>;
  hash?: Maybe<Scalars['UUID']['output']>;
  hypothesis?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  nGeneIds?: Maybe<Scalars['Int']['output']>;
  odds?: Maybe<Scalars['Float']['output']>;
  pmc?: Maybe<Scalars['String']['output']>;
  pvalue?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['BigInt']['output']>;
  rummageneSize?: Maybe<Scalars['Int']['output']>;
  rummageoSize?: Maybe<Scalars['Int']['output']>;
  species?: Maybe<Scalars['String']['output']>;
  term?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `RankedGeneSet` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type RankedGeneSetCondition = {
  /** Checks for equality with the object’s `rank` field. */
  rank?: InputMaybe<Scalars['BigInt']['input']>;
};

/** A connection to a list of `RankedGeneSet` values. */
export type RankedGeneSetsConnection = {
  __typename?: 'RankedGeneSetsConnection';
  /** A list of edges which contains the `RankedGeneSet` and cursor to aid in pagination. */
  edges: Array<RankedGeneSetsEdge>;
  /** A list of `RankedGeneSet` objects. */
  nodes: Array<RankedGeneSet>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `RankedGeneSet` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `RankedGeneSet` edge in the connection. */
export type RankedGeneSetsEdge = {
  __typename?: 'RankedGeneSetsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `RankedGeneSet` at the end of the edge. */
  node: RankedGeneSet;
};

/** Methods to use when ordering `RankedGeneSet`. */
export enum RankedGeneSetsOrderBy {
  Natural = 'NATURAL',
  RankAsc = 'RANK_ASC',
  RankDesc = 'RANK_DESC'
}

export type Release = Node & {
  __typename?: 'Release';
  created?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  nPublicationsProcessed?: Maybe<Scalars['BigInt']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** A condition to be used against `Release` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReleaseCondition = {
  /** Checks for equality with the object’s `created` field. */
  created?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Release` values. */
export type ReleasesConnection = {
  __typename?: 'ReleasesConnection';
  /** A list of edges which contains the `Release` and cursor to aid in pagination. */
  edges: Array<ReleasesEdge>;
  /** A list of `Release` objects. */
  nodes: Array<Release>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Release` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Release` edge in the connection. */
export type ReleasesEdge = {
  __typename?: 'ReleasesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Release` at the end of the edge. */
  node: Release;
};

/** Methods to use when ordering `Release`. */
export enum ReleasesOrderBy {
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `TermsGsesCountRecord` values. */
export type TermsGsesCountConnection = {
  __typename?: 'TermsGsesCountConnection';
  /** A list of edges which contains the `TermsGsesCountRecord` and cursor to aid in pagination. */
  edges: Array<TermsGsesCountEdge>;
  /** A list of `TermsGsesCountRecord` objects. */
  nodes: Array<TermsGsesCountRecord>;
  /** The count of *all* `TermsGsesCountRecord` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TermsGsesCountRecord` edge in the connection. */
export type TermsGsesCountEdge = {
  __typename?: 'TermsGsesCountEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TermsGsesCountRecord` at the end of the edge. */
  node: TermsGsesCountRecord;
};

/** The return type of our `termsGsesCount` query. */
export type TermsGsesCountRecord = {
  __typename?: 'TermsGsesCountRecord';
  count?: Maybe<Scalars['Int']['output']>;
  gse?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  term?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of `TermsPmcsCountRecord` values. */
export type TermsPmcsCountConnection = {
  __typename?: 'TermsPmcsCountConnection';
  /** A list of edges which contains the `TermsPmcsCountRecord` and cursor to aid in pagination. */
  edges: Array<TermsPmcsCountEdge>;
  /** A list of `TermsPmcsCountRecord` objects. */
  nodes: Array<TermsPmcsCountRecord>;
  /** The count of *all* `TermsPmcsCountRecord` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TermsPmcsCountRecord` edge in the connection. */
export type TermsPmcsCountEdge = {
  __typename?: 'TermsPmcsCountEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TermsPmcsCountRecord` at the end of the edge. */
  node: TermsPmcsCountRecord;
};

/** The return type of our `termsPmcsCount` query. */
export type TermsPmcsCountRecord = {
  __typename?: 'TermsPmcsCountRecord';
  count?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  pmc?: Maybe<Scalars['String']['output']>;
  term?: Maybe<Scalars['String']['output']>;
};

export type UniqueTermCount = {
  __typename?: 'UniqueTermCount';
  uniqueTermCount?: Maybe<Scalars['BigInt']['output']>;
};

/** A connection to a list of `UniqueTermCount` values. */
export type UniqueTermCountsConnection = {
  __typename?: 'UniqueTermCountsConnection';
  /** A list of edges which contains the `UniqueTermCount` and cursor to aid in pagination. */
  edges: Array<UniqueTermCountsEdge>;
  /** A list of `UniqueTermCount` objects. */
  nodes: Array<UniqueTermCount>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UniqueTermCount` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `UniqueTermCount` edge in the connection. */
export type UniqueTermCountsEdge = {
  __typename?: 'UniqueTermCountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UniqueTermCount` at the end of the edge. */
  node: UniqueTermCount;
};

/** Methods to use when ordering `UniqueTermCount`. */
export enum UniqueTermCountsOrderBy {
  Natural = 'NATURAL'
}

/** All input for the `updateHypothesis` mutation. */
export type UpdateHypothesisInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  pHypothesis?: InputMaybe<Scalars['String']['input']>;
  pId?: InputMaybe<Scalars['UUID']['input']>;
};

/** The output of our `updateHypothesis` mutation. */
export type UpdateHypothesisPayload = {
  __typename?: 'UpdateHypothesisPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  geneSet?: Maybe<GeneSet>;
  /** An edge for our `GeneSet`. May be used by Relay 1. */
  geneSetEdge?: Maybe<GeneSetsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `updateHypothesis` mutation. */
export type UpdateHypothesisPayloadGeneSetEdgeArgs = {
  orderBy?: InputMaybe<Array<GeneSetsOrderBy>>;
};

export type UserGeneSet = Node & {
  __typename?: 'UserGeneSet';
  created: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  genes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/**
 * A condition to be used against `UserGeneSet` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type UserGeneSetCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `UserGeneSet` values. */
export type UserGeneSetsConnection = {
  __typename?: 'UserGeneSetsConnection';
  /** A list of edges which contains the `UserGeneSet` and cursor to aid in pagination. */
  edges: Array<UserGeneSetsEdge>;
  /** A list of `UserGeneSet` objects. */
  nodes: Array<UserGeneSet>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserGeneSet` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `UserGeneSet` edge in the connection. */
export type UserGeneSetsEdge = {
  __typename?: 'UserGeneSetsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UserGeneSet` at the end of the edge. */
  node: UserGeneSet;
};

/** Methods to use when ordering `UserGeneSet`. */
export enum UserGeneSetsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type StatsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsQuery = { __typename?: 'Query', userGeneSets?: { __typename?: 'UserGeneSetsConnection', totalCount: number } | null, geneSets?: { __typename?: 'GeneSetsConnection', totalCount: number } | null, pmcs?: { __typename?: 'PmcsConnection', totalCount: number } | null, pmcStats?: { __typename?: 'PmcStat', nPublicationsProcessed?: any | null } | null, gseStats?: { __typename?: 'GseStatsConnection', totalCount: number, nodes: Array<{ __typename?: 'GseStat', nOccurrencesProcessed?: any | null, species?: string | null }> } | null, pmcTermStats?: { __typename?: 'PmcTermStatsConnection', nodes: Array<{ __typename?: 'PmcTermStat', uniqueTermPartsCount?: any | null }> } | null, uniqueTermCounts?: { __typename?: 'UniqueTermCountsConnection', nodes: Array<{ __typename?: 'UniqueTermCount', uniqueTermCount?: any | null }> } | null, counterTable?: { __typename?: 'CounterTable', count?: number | null } | null };

export type FetchUserGeneSetQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type FetchUserGeneSetQuery = { __typename?: 'Query', userGeneSet?: { __typename?: 'UserGeneSet', genes?: Array<string | null> | null, description?: string | null } | null };

export type EnrichmentQueryQueryVariables = Exact<{
  genes: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  filterTerm?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type EnrichmentQueryQuery = { __typename?: 'Query', currentBackground?: { __typename?: 'Background', enrich?: { __typename?: 'PaginatedEnrichResult', totalCount?: number | null, nodes?: Array<{ __typename?: 'EnrichResult', geneSetHash?: any | null, pvalue?: number | null, adjPvalue?: number | null, oddsRatio?: number | null, nOverlap?: number | null, geneSets: { __typename?: 'GeneSetsConnection', totalCount: number, nodes: Array<{ __typename?: 'GeneSet', id: any, term: string, description?: string | null, nGeneIds: number, species: string, gseInfosByGse: { __typename?: 'GseInfosConnection', nodes: Array<{ __typename?: 'GseInfo', gse?: string | null, id: any, platform?: string | null, publishedDate?: any | null, sampleGroups?: any | null, title?: string | null, summary?: string | null }> }, pmcInfoByPmc?: { __typename?: 'PmcInfo', abstract?: string | null, doi?: string | null, id: any, pmc: string, title?: string | null, yr?: number | null } | null }> } } | null> | null } | null } | null };

export type GeneSearchQueryVariables = Exact<{
  genes: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GeneSearchQuery = { __typename?: 'Query', geneSetGeneSearch?: { __typename?: 'GeneSetsConnection', totalCount: number, nodes: Array<{ __typename?: 'GeneSet', term: string }> } | null };

export type TermSearchQueryVariables = Exact<{
  terms: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TermSearchQuery = { __typename?: 'Query', geneSetTermSearch?: { __typename?: 'GeneSetsConnection', totalCount: number, nodes: Array<{ __typename?: 'GeneSet', id: any, term: string, nGeneIds: number }> } | null };

export type TermSearch2QueryVariables = Exact<{
  terms?: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TermSearch2Query = { __typename?: 'Query', geneSetTermSearch2?: { __typename?: 'GeneSetPmidsConnection', totalCount: number, nodes: Array<{ __typename?: 'GeneSetPmid', gse?: string | null, gseId?: any | null, gseInfoByGse?: { __typename?: 'GseInfo', species?: string | null, gse?: string | null, platform?: string | null, pmid?: string | null, publishedDate?: any | null, sampleGroups?: any | null, title?: string | null, geneSetByGse?: { __typename?: 'GeneSet', term: string, id: any } | null } | null }> } | null };

export type AddUserGeneSetMutationVariables = Exact<{
  genes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddUserGeneSetMutation = { __typename?: 'Mutation', addUserGeneSet?: { __typename?: 'AddUserGeneSetPayload', userGeneSet?: { __typename?: 'UserGeneSet', id: any } | null } | null };

export type UpdateHypothesisMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  hypothesis: Scalars['String']['input'];
}>;


export type UpdateHypothesisMutation = { __typename?: 'Mutation', updateHypothesis?: { __typename?: 'UpdateHypothesisPayload', geneSet?: { __typename?: 'GeneSet', id: any, hypothesis?: string | null } | null } | null };

export type IncrementCounterMutationVariables = Exact<{ [key: string]: never; }>;


export type IncrementCounterMutation = { __typename?: 'Mutation', incrementCounter?: { __typename?: 'IncrementCounterPayload', integer?: number | null } | null };

export type ViewGeneSetQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type ViewGeneSetQuery = { __typename?: 'Query', geneSet?: { __typename?: 'GeneSet', hypothesis?: string | null, genes: { __typename?: 'GenesConnection', nodes: Array<{ __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null }> } } | null };

export type ViewGeneSet2QueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type ViewGeneSet2Query = { __typename?: 'Query', geneSet?: { __typename?: 'GeneSet', term: string, description?: string | null, species: string, genes: { __typename?: 'GenesConnection', nodes: Array<{ __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null }> } } | null };

export type ViewGeneSet3QueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type ViewGeneSet3Query = { __typename?: 'Query', geneSetByTerm?: { __typename?: 'GeneSet', term: string, description?: string | null, genes: { __typename?: 'GenesConnection', nodes: Array<{ __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null }> } } | null };

export type TermsPmcsQueryVariables = Exact<{
  pmcids: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type TermsPmcsQuery = { __typename?: 'Query', termsPmcsCount?: { __typename?: 'TermsPmcsCountConnection', nodes: Array<{ __typename?: 'TermsPmcsCountRecord', pmc?: string | null, id?: any | null, term?: string | null, count?: number | null }> } | null };

export type TermsPmcs4QueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type TermsPmcs4Query = { __typename?: 'Query', termsPmcsArray?: Array<string | null> | null };

export type TermsGsesQueryVariables = Exact<{
  gseids: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type TermsGsesQuery = { __typename?: 'Query', termsGsesCount?: { __typename?: 'TermsGsesCountConnection', nodes: Array<{ __typename?: 'TermsGsesCountRecord', count?: number | null, gse?: string | null, id?: any | null, term?: string | null }> } | null };

export type TermsGses4QueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type TermsGses4Query = { __typename?: 'Query', termsGsesArray?: Array<string | null> | null };

export type FetchGeneInfoQueryVariables = Exact<{
  genes: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type FetchGeneInfoQuery = { __typename?: 'Query', geneMap2?: { __typename?: 'GeneMappingsConnection', nodes: Array<{ __typename?: 'GeneMapping', gene?: string | null, geneInfo?: { __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null } | null }> } | null };

export type LatestReleaseQueryVariables = Exact<{ [key: string]: never; }>;


export type LatestReleaseQuery = { __typename?: 'Query', releases?: { __typename?: 'ReleasesConnection', nodes: Array<{ __typename?: 'Release', created?: any | null }> } | null };

export type ViewGeneSetsQueryVariables = Exact<{
  number: Scalars['Int']['input'];
}>;


export type ViewGeneSetsQuery = { __typename?: 'Query', geneSets?: { __typename?: 'GeneSetsConnection', totalCount: number, nodes: Array<{ __typename?: 'GeneSet', id: any, nGeneIds: number, term: string, species: string, description?: string | null, rummageneSize?: number | null, rummageoSize?: number | null, odds?: number | null, pvalue?: number | null, hypothesis?: string | null, genes: { __typename?: 'GenesConnection', nodes: Array<{ __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null }> }, gseInfosByGse: { __typename?: 'GseInfosConnection', nodes: Array<{ __typename?: 'GseInfo', gse?: string | null, id: any, title?: string | null, summary?: string | null, sampleGroups?: any | null }> }, pmcInfoByPmc?: { __typename?: 'PmcInfo', abstract?: string | null, id: any, title?: string | null, pmc: string } | null }> } | null };

export type QueryGsmMetaQueryVariables = Exact<{
  gsms?: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type QueryGsmMetaQuery = { __typename?: 'Query', getGsmMeta?: { __typename?: 'GsmMetasConnection', nodes: Array<{ __typename?: 'GsmMeta', gse?: string | null, gsm: string, title?: string | null, characteristicsCh1?: string | null, sourceNameCh1?: string | null }> } | null };

export type QueryGseSummaryQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type QueryGseSummaryQuery = { __typename?: 'Query', gseInfo?: { __typename?: 'GseInfo', title?: string | null, summary?: string | null, sampleGroups?: any | null } | null };

export type OverlapQueryQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
  genes: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type OverlapQueryQuery = { __typename?: 'Query', geneSet?: { __typename?: 'GeneSet', overlap: { __typename?: 'GenesConnection', nodes: Array<{ __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null }> } } | null };

export type ViewRankedSets3QueryVariables = Exact<{
  range: Scalars['Int']['input'];
  start: Scalars['Int']['input'];
  filterTerm?: InputMaybe<Scalars['String']['input']>;
  case?: InputMaybe<Scalars['Boolean']['input']>;
  species?: InputMaybe<Scalars['String']['input']>;
}>;


export type ViewRankedSets3Query = { __typename?: 'Query', getPaginatedRankedGeneSets2?: { __typename?: 'PaginatedRankedGeneSetsResult', totalCount?: number | null, rankedSets?: Array<{ __typename?: 'RankedGeneSet', id?: any | null, term?: string | null, description?: string | null, nGeneIds?: number | null, rank?: any | null, geneSetById?: { __typename?: 'GeneSet', rummageneSize?: number | null, rummageoSize?: number | null, odds?: number | null, pvalue?: number | null, hypothesis?: string | null, genes: { __typename?: 'GenesConnection', nodes: Array<{ __typename?: 'Gene', symbol: string, ncbiGeneId?: number | null, description?: string | null, summary?: string | null }> }, gseInfosByGse: { __typename?: 'GseInfosConnection', nodes: Array<{ __typename?: 'GseInfo', gse?: string | null, id: any, title?: string | null, summary?: string | null, sampleGroups?: any | null }> }, pmcInfoByPmc?: { __typename?: 'PmcInfo', abstract?: string | null, id: any, title?: string | null, pmc: string } | null } | null } | null> | null } | null };

export type QueryPmCSummaryQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type QueryPmCSummaryQuery = { __typename?: 'Query', pmcInfo?: { __typename?: 'PmcInfo', title?: string | null, abstract?: string | null, pmc: string } | null };

export type GetPmcInfoByIdsQueryVariables = Exact<{
  pmcids: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type GetPmcInfoByIdsQuery = { __typename?: 'Query', getPmcInfoByIds?: { __typename?: 'PmcInfosConnection', nodes: Array<{ __typename?: 'PmcInfo', pmc: string, title?: string | null, yr?: number | null, doi?: string | null }> } | null };

export type GetGseInfoByIdsQueryVariables = Exact<{
  gseids: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type GetGseInfoByIdsQuery = { __typename?: 'Query', getGseInfoByIds?: { __typename?: 'GseInfosConnection', nodes: Array<{ __typename?: 'GseInfo', gse?: string | null, id: any, platform?: string | null, pmid?: string | null, publishedDate?: any | null, sampleGroups?: any | null, silhouetteScore?: number | null, species?: string | null, summary?: string | null, title?: string | null }> } | null };

export type NumEnquiriesQueryVariables = Exact<{
  num: Scalars['Int']['input'];
}>;


export type NumEnquiriesQuery = { __typename?: 'Query', counterTable?: { __typename?: 'CounterTable', count?: number | null } | null };


export const StatsDocument = gql`
    query Stats {
  userGeneSets {
    totalCount
  }
  geneSets {
    totalCount
  }
  pmcs {
    totalCount
  }
  pmcStats {
    nPublicationsProcessed
  }
  gseStats {
    totalCount
    nodes {
      nOccurrencesProcessed
      species
    }
  }
  pmcTermStats {
    nodes {
      uniqueTermPartsCount
    }
  }
  uniqueTermCounts {
    nodes {
      uniqueTermCount
    }
  }
  counterTable(id: 1) {
    count
  }
}
    `;

/**
 * __useStatsQuery__
 *
 * To run a query within a React component, call `useStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStatsQuery(baseOptions?: Apollo.QueryHookOptions<StatsQuery, StatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
      }
export function useStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatsQuery, StatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
        }
export type StatsQueryHookResult = ReturnType<typeof useStatsQuery>;
export type StatsLazyQueryHookResult = ReturnType<typeof useStatsLazyQuery>;
export type StatsQueryResult = Apollo.QueryResult<StatsQuery, StatsQueryVariables>;
export const FetchUserGeneSetDocument = gql`
    query FetchUserGeneSet($id: UUID!) {
  userGeneSet(id: $id) {
    genes
    description
  }
}
    `;

/**
 * __useFetchUserGeneSetQuery__
 *
 * To run a query within a React component, call `useFetchUserGeneSetQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchUserGeneSetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchUserGeneSetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchUserGeneSetQuery(baseOptions: Apollo.QueryHookOptions<FetchUserGeneSetQuery, FetchUserGeneSetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchUserGeneSetQuery, FetchUserGeneSetQueryVariables>(FetchUserGeneSetDocument, options);
      }
export function useFetchUserGeneSetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchUserGeneSetQuery, FetchUserGeneSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchUserGeneSetQuery, FetchUserGeneSetQueryVariables>(FetchUserGeneSetDocument, options);
        }
export type FetchUserGeneSetQueryHookResult = ReturnType<typeof useFetchUserGeneSetQuery>;
export type FetchUserGeneSetLazyQueryHookResult = ReturnType<typeof useFetchUserGeneSetLazyQuery>;
export type FetchUserGeneSetQueryResult = Apollo.QueryResult<FetchUserGeneSetQuery, FetchUserGeneSetQueryVariables>;
export const EnrichmentQueryDocument = gql`
    query EnrichmentQuery($genes: [String]!, $filterTerm: String = "", $offset: Int = 0, $first: Int = 10) {
  currentBackground {
    enrich(genes: $genes, filterTerm: $filterTerm, offset: $offset, first: $first) {
      nodes {
        geneSetHash
        pvalue
        adjPvalue
        oddsRatio
        nOverlap
        geneSets {
          nodes {
            id
            term
            description
            nGeneIds
            gseInfosByGse(first: 1) {
              nodes {
                gse
                id
                platform
                publishedDate
                sampleGroups
                title
                summary
              }
            }
            pmcInfoByPmc {
              abstract
              doi
              id
              pmc
              title
              yr
            }
            species
          }
          totalCount
        }
      }
      totalCount
    }
  }
}
    `;

/**
 * __useEnrichmentQueryQuery__
 *
 * To run a query within a React component, call `useEnrichmentQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnrichmentQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnrichmentQueryQuery({
 *   variables: {
 *      genes: // value for 'genes'
 *      filterTerm: // value for 'filterTerm'
 *      offset: // value for 'offset'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useEnrichmentQueryQuery(baseOptions: Apollo.QueryHookOptions<EnrichmentQueryQuery, EnrichmentQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnrichmentQueryQuery, EnrichmentQueryQueryVariables>(EnrichmentQueryDocument, options);
      }
export function useEnrichmentQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnrichmentQueryQuery, EnrichmentQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnrichmentQueryQuery, EnrichmentQueryQueryVariables>(EnrichmentQueryDocument, options);
        }
export type EnrichmentQueryQueryHookResult = ReturnType<typeof useEnrichmentQueryQuery>;
export type EnrichmentQueryLazyQueryHookResult = ReturnType<typeof useEnrichmentQueryLazyQuery>;
export type EnrichmentQueryQueryResult = Apollo.QueryResult<EnrichmentQueryQuery, EnrichmentQueryQueryVariables>;
export const GeneSearchDocument = gql`
    query GeneSearch($genes: [String]!, $offset: Int = 0, $first: Int = 10) {
  geneSetGeneSearch(genes: $genes, offset: $offset, first: $first) {
    nodes {
      term
    }
    totalCount
  }
}
    `;

/**
 * __useGeneSearchQuery__
 *
 * To run a query within a React component, call `useGeneSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGeneSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGeneSearchQuery({
 *   variables: {
 *      genes: // value for 'genes'
 *      offset: // value for 'offset'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGeneSearchQuery(baseOptions: Apollo.QueryHookOptions<GeneSearchQuery, GeneSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GeneSearchQuery, GeneSearchQueryVariables>(GeneSearchDocument, options);
      }
export function useGeneSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GeneSearchQuery, GeneSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GeneSearchQuery, GeneSearchQueryVariables>(GeneSearchDocument, options);
        }
export type GeneSearchQueryHookResult = ReturnType<typeof useGeneSearchQuery>;
export type GeneSearchLazyQueryHookResult = ReturnType<typeof useGeneSearchLazyQuery>;
export type GeneSearchQueryResult = Apollo.QueryResult<GeneSearchQuery, GeneSearchQueryVariables>;
export const TermSearchDocument = gql`
    query TermSearch($terms: [String]!, $offset: Int = 0, $first: Int = 10) {
  geneSetTermSearch(terms: $terms, offset: $offset, first: $first) {
    nodes {
      id
      term
      nGeneIds
    }
    totalCount
  }
}
    `;

/**
 * __useTermSearchQuery__
 *
 * To run a query within a React component, call `useTermSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useTermSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermSearchQuery({
 *   variables: {
 *      terms: // value for 'terms'
 *      offset: // value for 'offset'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useTermSearchQuery(baseOptions: Apollo.QueryHookOptions<TermSearchQuery, TermSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermSearchQuery, TermSearchQueryVariables>(TermSearchDocument, options);
      }
export function useTermSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermSearchQuery, TermSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermSearchQuery, TermSearchQueryVariables>(TermSearchDocument, options);
        }
export type TermSearchQueryHookResult = ReturnType<typeof useTermSearchQuery>;
export type TermSearchLazyQueryHookResult = ReturnType<typeof useTermSearchLazyQuery>;
export type TermSearchQueryResult = Apollo.QueryResult<TermSearchQuery, TermSearchQueryVariables>;
export const TermSearch2Document = gql`
    query TermSearch2($terms: [String]! = ["neuron"], $offset: Int = 0, $first: Int = 10) {
  geneSetTermSearch2(terms: $terms, offset: $offset, first: $first) {
    nodes {
      gse
      gseId
      gseInfoByGse {
        species
        gse
        platform
        pmid
        publishedDate
        sampleGroups
        title
        geneSetByGse {
          term
          id
        }
      }
    }
    totalCount
  }
}
    `;

/**
 * __useTermSearch2Query__
 *
 * To run a query within a React component, call `useTermSearch2Query` and pass it any options that fit your needs.
 * When your component renders, `useTermSearch2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermSearch2Query({
 *   variables: {
 *      terms: // value for 'terms'
 *      offset: // value for 'offset'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useTermSearch2Query(baseOptions?: Apollo.QueryHookOptions<TermSearch2Query, TermSearch2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermSearch2Query, TermSearch2QueryVariables>(TermSearch2Document, options);
      }
export function useTermSearch2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermSearch2Query, TermSearch2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermSearch2Query, TermSearch2QueryVariables>(TermSearch2Document, options);
        }
export type TermSearch2QueryHookResult = ReturnType<typeof useTermSearch2Query>;
export type TermSearch2LazyQueryHookResult = ReturnType<typeof useTermSearch2LazyQuery>;
export type TermSearch2QueryResult = Apollo.QueryResult<TermSearch2Query, TermSearch2QueryVariables>;
export const AddUserGeneSetDocument = gql`
    mutation AddUserGeneSet($genes: [String], $description: String = "") {
  addUserGeneSet(input: {genes: $genes, description: $description}) {
    userGeneSet {
      id
    }
  }
}
    `;
export type AddUserGeneSetMutationFn = Apollo.MutationFunction<AddUserGeneSetMutation, AddUserGeneSetMutationVariables>;

/**
 * __useAddUserGeneSetMutation__
 *
 * To run a mutation, you first call `useAddUserGeneSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserGeneSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserGeneSetMutation, { data, loading, error }] = useAddUserGeneSetMutation({
 *   variables: {
 *      genes: // value for 'genes'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAddUserGeneSetMutation(baseOptions?: Apollo.MutationHookOptions<AddUserGeneSetMutation, AddUserGeneSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserGeneSetMutation, AddUserGeneSetMutationVariables>(AddUserGeneSetDocument, options);
      }
export type AddUserGeneSetMutationHookResult = ReturnType<typeof useAddUserGeneSetMutation>;
export type AddUserGeneSetMutationResult = Apollo.MutationResult<AddUserGeneSetMutation>;
export type AddUserGeneSetMutationOptions = Apollo.BaseMutationOptions<AddUserGeneSetMutation, AddUserGeneSetMutationVariables>;
export const UpdateHypothesisDocument = gql`
    mutation UpdateHypothesis($id: UUID!, $hypothesis: String!) {
  updateHypothesis(input: {pId: $id, pHypothesis: $hypothesis}) {
    geneSet {
      id
      hypothesis
    }
  }
}
    `;
export type UpdateHypothesisMutationFn = Apollo.MutationFunction<UpdateHypothesisMutation, UpdateHypothesisMutationVariables>;

/**
 * __useUpdateHypothesisMutation__
 *
 * To run a mutation, you first call `useUpdateHypothesisMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHypothesisMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHypothesisMutation, { data, loading, error }] = useUpdateHypothesisMutation({
 *   variables: {
 *      id: // value for 'id'
 *      hypothesis: // value for 'hypothesis'
 *   },
 * });
 */
export function useUpdateHypothesisMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHypothesisMutation, UpdateHypothesisMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHypothesisMutation, UpdateHypothesisMutationVariables>(UpdateHypothesisDocument, options);
      }
export type UpdateHypothesisMutationHookResult = ReturnType<typeof useUpdateHypothesisMutation>;
export type UpdateHypothesisMutationResult = Apollo.MutationResult<UpdateHypothesisMutation>;
export type UpdateHypothesisMutationOptions = Apollo.BaseMutationOptions<UpdateHypothesisMutation, UpdateHypothesisMutationVariables>;
export const IncrementCounterDocument = gql`
    mutation IncrementCounter {
  incrementCounter(input: {}) {
    integer
  }
}
    `;
export type IncrementCounterMutationFn = Apollo.MutationFunction<IncrementCounterMutation, IncrementCounterMutationVariables>;

/**
 * __useIncrementCounterMutation__
 *
 * To run a mutation, you first call `useIncrementCounterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIncrementCounterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [incrementCounterMutation, { data, loading, error }] = useIncrementCounterMutation({
 *   variables: {
 *   },
 * });
 */
export function useIncrementCounterMutation(baseOptions?: Apollo.MutationHookOptions<IncrementCounterMutation, IncrementCounterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IncrementCounterMutation, IncrementCounterMutationVariables>(IncrementCounterDocument, options);
      }
export type IncrementCounterMutationHookResult = ReturnType<typeof useIncrementCounterMutation>;
export type IncrementCounterMutationResult = Apollo.MutationResult<IncrementCounterMutation>;
export type IncrementCounterMutationOptions = Apollo.BaseMutationOptions<IncrementCounterMutation, IncrementCounterMutationVariables>;
export const ViewGeneSetDocument = gql`
    query ViewGeneSet($id: UUID!) {
  geneSet(id: $id) {
    genes {
      nodes {
        symbol
        ncbiGeneId
        description
        summary
      }
    }
    hypothesis
  }
}
    `;

/**
 * __useViewGeneSetQuery__
 *
 * To run a query within a React component, call `useViewGeneSetQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewGeneSetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewGeneSetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useViewGeneSetQuery(baseOptions: Apollo.QueryHookOptions<ViewGeneSetQuery, ViewGeneSetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewGeneSetQuery, ViewGeneSetQueryVariables>(ViewGeneSetDocument, options);
      }
export function useViewGeneSetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewGeneSetQuery, ViewGeneSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewGeneSetQuery, ViewGeneSetQueryVariables>(ViewGeneSetDocument, options);
        }
export type ViewGeneSetQueryHookResult = ReturnType<typeof useViewGeneSetQuery>;
export type ViewGeneSetLazyQueryHookResult = ReturnType<typeof useViewGeneSetLazyQuery>;
export type ViewGeneSetQueryResult = Apollo.QueryResult<ViewGeneSetQuery, ViewGeneSetQueryVariables>;
export const ViewGeneSet2Document = gql`
    query ViewGeneSet2($id: UUID!) {
  geneSet(id: $id) {
    term
    description
    species
    genes {
      nodes {
        symbol
        ncbiGeneId
        description
        summary
      }
    }
  }
}
    `;

/**
 * __useViewGeneSet2Query__
 *
 * To run a query within a React component, call `useViewGeneSet2Query` and pass it any options that fit your needs.
 * When your component renders, `useViewGeneSet2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewGeneSet2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useViewGeneSet2Query(baseOptions: Apollo.QueryHookOptions<ViewGeneSet2Query, ViewGeneSet2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewGeneSet2Query, ViewGeneSet2QueryVariables>(ViewGeneSet2Document, options);
      }
export function useViewGeneSet2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewGeneSet2Query, ViewGeneSet2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewGeneSet2Query, ViewGeneSet2QueryVariables>(ViewGeneSet2Document, options);
        }
export type ViewGeneSet2QueryHookResult = ReturnType<typeof useViewGeneSet2Query>;
export type ViewGeneSet2LazyQueryHookResult = ReturnType<typeof useViewGeneSet2LazyQuery>;
export type ViewGeneSet2QueryResult = Apollo.QueryResult<ViewGeneSet2Query, ViewGeneSet2QueryVariables>;
export const ViewGeneSet3Document = gql`
    query ViewGeneSet3($term: String!) {
  geneSetByTerm(term: $term) {
    term
    description
    genes {
      nodes {
        symbol
        ncbiGeneId
        description
        summary
      }
    }
  }
}
    `;

/**
 * __useViewGeneSet3Query__
 *
 * To run a query within a React component, call `useViewGeneSet3Query` and pass it any options that fit your needs.
 * When your component renders, `useViewGeneSet3Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewGeneSet3Query({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useViewGeneSet3Query(baseOptions: Apollo.QueryHookOptions<ViewGeneSet3Query, ViewGeneSet3QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewGeneSet3Query, ViewGeneSet3QueryVariables>(ViewGeneSet3Document, options);
      }
export function useViewGeneSet3LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewGeneSet3Query, ViewGeneSet3QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewGeneSet3Query, ViewGeneSet3QueryVariables>(ViewGeneSet3Document, options);
        }
export type ViewGeneSet3QueryHookResult = ReturnType<typeof useViewGeneSet3Query>;
export type ViewGeneSet3LazyQueryHookResult = ReturnType<typeof useViewGeneSet3LazyQuery>;
export type ViewGeneSet3QueryResult = Apollo.QueryResult<ViewGeneSet3Query, ViewGeneSet3QueryVariables>;
export const TermsPmcsDocument = gql`
    query TermsPmcs($pmcids: [String]!) {
  termsPmcsCount(pmcids: $pmcids) {
    nodes {
      pmc
      id
      term
      count
    }
  }
}
    `;

/**
 * __useTermsPmcsQuery__
 *
 * To run a query within a React component, call `useTermsPmcsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTermsPmcsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermsPmcsQuery({
 *   variables: {
 *      pmcids: // value for 'pmcids'
 *   },
 * });
 */
export function useTermsPmcsQuery(baseOptions: Apollo.QueryHookOptions<TermsPmcsQuery, TermsPmcsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermsPmcsQuery, TermsPmcsQueryVariables>(TermsPmcsDocument, options);
      }
export function useTermsPmcsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermsPmcsQuery, TermsPmcsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermsPmcsQuery, TermsPmcsQueryVariables>(TermsPmcsDocument, options);
        }
export type TermsPmcsQueryHookResult = ReturnType<typeof useTermsPmcsQuery>;
export type TermsPmcsLazyQueryHookResult = ReturnType<typeof useTermsPmcsLazyQuery>;
export type TermsPmcsQueryResult = Apollo.QueryResult<TermsPmcsQuery, TermsPmcsQueryVariables>;
export const TermsPmcs4Document = gql`
    query TermsPmcs4($term: String!) {
  termsPmcsArray(term: $term)
}
    `;

/**
 * __useTermsPmcs4Query__
 *
 * To run a query within a React component, call `useTermsPmcs4Query` and pass it any options that fit your needs.
 * When your component renders, `useTermsPmcs4Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermsPmcs4Query({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useTermsPmcs4Query(baseOptions: Apollo.QueryHookOptions<TermsPmcs4Query, TermsPmcs4QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermsPmcs4Query, TermsPmcs4QueryVariables>(TermsPmcs4Document, options);
      }
export function useTermsPmcs4LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermsPmcs4Query, TermsPmcs4QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermsPmcs4Query, TermsPmcs4QueryVariables>(TermsPmcs4Document, options);
        }
export type TermsPmcs4QueryHookResult = ReturnType<typeof useTermsPmcs4Query>;
export type TermsPmcs4LazyQueryHookResult = ReturnType<typeof useTermsPmcs4LazyQuery>;
export type TermsPmcs4QueryResult = Apollo.QueryResult<TermsPmcs4Query, TermsPmcs4QueryVariables>;
export const TermsGsesDocument = gql`
    query TermsGses($gseids: [String]!) {
  termsGsesCount(gseids: $gseids) {
    nodes {
      count
      gse
      id
      term
    }
  }
}
    `;

/**
 * __useTermsGsesQuery__
 *
 * To run a query within a React component, call `useTermsGsesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTermsGsesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermsGsesQuery({
 *   variables: {
 *      gseids: // value for 'gseids'
 *   },
 * });
 */
export function useTermsGsesQuery(baseOptions: Apollo.QueryHookOptions<TermsGsesQuery, TermsGsesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermsGsesQuery, TermsGsesQueryVariables>(TermsGsesDocument, options);
      }
export function useTermsGsesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermsGsesQuery, TermsGsesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermsGsesQuery, TermsGsesQueryVariables>(TermsGsesDocument, options);
        }
export type TermsGsesQueryHookResult = ReturnType<typeof useTermsGsesQuery>;
export type TermsGsesLazyQueryHookResult = ReturnType<typeof useTermsGsesLazyQuery>;
export type TermsGsesQueryResult = Apollo.QueryResult<TermsGsesQuery, TermsGsesQueryVariables>;
export const TermsGses4Document = gql`
    query TermsGses4($term: String!) {
  termsGsesArray(term: $term)
}
    `;

/**
 * __useTermsGses4Query__
 *
 * To run a query within a React component, call `useTermsGses4Query` and pass it any options that fit your needs.
 * When your component renders, `useTermsGses4Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermsGses4Query({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useTermsGses4Query(baseOptions: Apollo.QueryHookOptions<TermsGses4Query, TermsGses4QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermsGses4Query, TermsGses4QueryVariables>(TermsGses4Document, options);
      }
export function useTermsGses4LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermsGses4Query, TermsGses4QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermsGses4Query, TermsGses4QueryVariables>(TermsGses4Document, options);
        }
export type TermsGses4QueryHookResult = ReturnType<typeof useTermsGses4Query>;
export type TermsGses4LazyQueryHookResult = ReturnType<typeof useTermsGses4LazyQuery>;
export type TermsGses4QueryResult = Apollo.QueryResult<TermsGses4Query, TermsGses4QueryVariables>;
export const FetchGeneInfoDocument = gql`
    query FetchGeneInfo($genes: [String]!) {
  geneMap2(genes: $genes) {
    nodes {
      gene
      geneInfo {
        symbol
        ncbiGeneId
        description
        summary
      }
    }
  }
}
    `;

/**
 * __useFetchGeneInfoQuery__
 *
 * To run a query within a React component, call `useFetchGeneInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchGeneInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchGeneInfoQuery({
 *   variables: {
 *      genes: // value for 'genes'
 *   },
 * });
 */
export function useFetchGeneInfoQuery(baseOptions: Apollo.QueryHookOptions<FetchGeneInfoQuery, FetchGeneInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchGeneInfoQuery, FetchGeneInfoQueryVariables>(FetchGeneInfoDocument, options);
      }
export function useFetchGeneInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchGeneInfoQuery, FetchGeneInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchGeneInfoQuery, FetchGeneInfoQueryVariables>(FetchGeneInfoDocument, options);
        }
export type FetchGeneInfoQueryHookResult = ReturnType<typeof useFetchGeneInfoQuery>;
export type FetchGeneInfoLazyQueryHookResult = ReturnType<typeof useFetchGeneInfoLazyQuery>;
export type FetchGeneInfoQueryResult = Apollo.QueryResult<FetchGeneInfoQuery, FetchGeneInfoQueryVariables>;
export const LatestReleaseDocument = gql`
    query LatestRelease {
  releases(orderBy: CREATED_DESC, first: 1) {
    nodes {
      created
    }
  }
}
    `;

/**
 * __useLatestReleaseQuery__
 *
 * To run a query within a React component, call `useLatestReleaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestReleaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestReleaseQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestReleaseQuery(baseOptions?: Apollo.QueryHookOptions<LatestReleaseQuery, LatestReleaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LatestReleaseQuery, LatestReleaseQueryVariables>(LatestReleaseDocument, options);
      }
export function useLatestReleaseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LatestReleaseQuery, LatestReleaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LatestReleaseQuery, LatestReleaseQueryVariables>(LatestReleaseDocument, options);
        }
export type LatestReleaseQueryHookResult = ReturnType<typeof useLatestReleaseQuery>;
export type LatestReleaseLazyQueryHookResult = ReturnType<typeof useLatestReleaseLazyQuery>;
export type LatestReleaseQueryResult = Apollo.QueryResult<LatestReleaseQuery, LatestReleaseQueryVariables>;
export const ViewGeneSetsDocument = gql`
    query ViewGeneSets($number: Int!) {
  geneSets(first: $number) {
    nodes {
      id
      nGeneIds
      term
      species
      description
      genes {
        nodes {
          symbol
          ncbiGeneId
          description
          summary
        }
      }
      gseInfosByGse(first: 1) {
        nodes {
          gse
          id
          title
          summary
          sampleGroups
        }
      }
      pmcInfoByPmc {
        abstract
        id
        title
        pmc
      }
      rummageneSize
      rummageoSize
      odds
      pvalue
      hypothesis
    }
    totalCount
  }
}
    `;

/**
 * __useViewGeneSetsQuery__
 *
 * To run a query within a React component, call `useViewGeneSetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewGeneSetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewGeneSetsQuery({
 *   variables: {
 *      number: // value for 'number'
 *   },
 * });
 */
export function useViewGeneSetsQuery(baseOptions: Apollo.QueryHookOptions<ViewGeneSetsQuery, ViewGeneSetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewGeneSetsQuery, ViewGeneSetsQueryVariables>(ViewGeneSetsDocument, options);
      }
export function useViewGeneSetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewGeneSetsQuery, ViewGeneSetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewGeneSetsQuery, ViewGeneSetsQueryVariables>(ViewGeneSetsDocument, options);
        }
export type ViewGeneSetsQueryHookResult = ReturnType<typeof useViewGeneSetsQuery>;
export type ViewGeneSetsLazyQueryHookResult = ReturnType<typeof useViewGeneSetsLazyQuery>;
export type ViewGeneSetsQueryResult = Apollo.QueryResult<ViewGeneSetsQuery, ViewGeneSetsQueryVariables>;
export const QueryGsmMetaDocument = gql`
    query QueryGsmMeta($gsms: [String]! = ["GSM4648170", "GSM4648184", "GSM4648189"]) {
  getGsmMeta(gsms: $gsms) {
    nodes {
      gse
      gsm
      title
      characteristicsCh1
      sourceNameCh1
    }
  }
}
    `;

/**
 * __useQueryGsmMetaQuery__
 *
 * To run a query within a React component, call `useQueryGsmMetaQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryGsmMetaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryGsmMetaQuery({
 *   variables: {
 *      gsms: // value for 'gsms'
 *   },
 * });
 */
export function useQueryGsmMetaQuery(baseOptions?: Apollo.QueryHookOptions<QueryGsmMetaQuery, QueryGsmMetaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QueryGsmMetaQuery, QueryGsmMetaQueryVariables>(QueryGsmMetaDocument, options);
      }
export function useQueryGsmMetaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryGsmMetaQuery, QueryGsmMetaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QueryGsmMetaQuery, QueryGsmMetaQueryVariables>(QueryGsmMetaDocument, options);
        }
export type QueryGsmMetaQueryHookResult = ReturnType<typeof useQueryGsmMetaQuery>;
export type QueryGsmMetaLazyQueryHookResult = ReturnType<typeof useQueryGsmMetaLazyQuery>;
export type QueryGsmMetaQueryResult = Apollo.QueryResult<QueryGsmMetaQuery, QueryGsmMetaQueryVariables>;
export const QueryGseSummaryDocument = gql`
    query QueryGseSummary($id: UUID!) {
  gseInfo(id: $id) {
    title
    summary
    sampleGroups
  }
}
    `;

/**
 * __useQueryGseSummaryQuery__
 *
 * To run a query within a React component, call `useQueryGseSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryGseSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryGseSummaryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useQueryGseSummaryQuery(baseOptions: Apollo.QueryHookOptions<QueryGseSummaryQuery, QueryGseSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QueryGseSummaryQuery, QueryGseSummaryQueryVariables>(QueryGseSummaryDocument, options);
      }
export function useQueryGseSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryGseSummaryQuery, QueryGseSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QueryGseSummaryQuery, QueryGseSummaryQueryVariables>(QueryGseSummaryDocument, options);
        }
export type QueryGseSummaryQueryHookResult = ReturnType<typeof useQueryGseSummaryQuery>;
export type QueryGseSummaryLazyQueryHookResult = ReturnType<typeof useQueryGseSummaryLazyQuery>;
export type QueryGseSummaryQueryResult = Apollo.QueryResult<QueryGseSummaryQuery, QueryGseSummaryQueryVariables>;
export const OverlapQueryDocument = gql`
    query OverlapQuery($id: UUID!, $genes: [String]!) {
  geneSet(id: $id) {
    overlap(genes: $genes) {
      nodes {
        symbol
        ncbiGeneId
        description
        summary
      }
    }
  }
}
    `;

/**
 * __useOverlapQueryQuery__
 *
 * To run a query within a React component, call `useOverlapQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOverlapQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOverlapQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *      genes: // value for 'genes'
 *   },
 * });
 */
export function useOverlapQueryQuery(baseOptions: Apollo.QueryHookOptions<OverlapQueryQuery, OverlapQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OverlapQueryQuery, OverlapQueryQueryVariables>(OverlapQueryDocument, options);
      }
export function useOverlapQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OverlapQueryQuery, OverlapQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OverlapQueryQuery, OverlapQueryQueryVariables>(OverlapQueryDocument, options);
        }
export type OverlapQueryQueryHookResult = ReturnType<typeof useOverlapQueryQuery>;
export type OverlapQueryLazyQueryHookResult = ReturnType<typeof useOverlapQueryLazyQuery>;
export type OverlapQueryQueryResult = Apollo.QueryResult<OverlapQueryQuery, OverlapQueryQueryVariables>;
export const ViewRankedSets3Document = gql`
    query ViewRankedSets3($range: Int!, $start: Int!, $filterTerm: String, $case: Boolean, $species: String) {
  getPaginatedRankedGeneSets2(
    pLimit: $range
    pOffset: $start
    pTerm: $filterTerm
    pCaseSensitive: $case
    pSpecies: $species
  ) {
    rankedSets {
      id
      term
      description
      nGeneIds
      rank
      geneSetById {
        genes {
          nodes {
            symbol
            ncbiGeneId
            description
            summary
          }
        }
        gseInfosByGse(first: 1) {
          nodes {
            gse
            id
            title
            summary
            sampleGroups
          }
        }
        pmcInfoByPmc {
          abstract
          id
          title
          pmc
        }
        rummageneSize
        rummageoSize
        odds
        pvalue
        hypothesis
      }
    }
    totalCount
  }
}
    `;

/**
 * __useViewRankedSets3Query__
 *
 * To run a query within a React component, call `useViewRankedSets3Query` and pass it any options that fit your needs.
 * When your component renders, `useViewRankedSets3Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewRankedSets3Query({
 *   variables: {
 *      range: // value for 'range'
 *      start: // value for 'start'
 *      filterTerm: // value for 'filterTerm'
 *      case: // value for 'case'
 *      species: // value for 'species'
 *   },
 * });
 */
export function useViewRankedSets3Query(baseOptions: Apollo.QueryHookOptions<ViewRankedSets3Query, ViewRankedSets3QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewRankedSets3Query, ViewRankedSets3QueryVariables>(ViewRankedSets3Document, options);
      }
export function useViewRankedSets3LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewRankedSets3Query, ViewRankedSets3QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewRankedSets3Query, ViewRankedSets3QueryVariables>(ViewRankedSets3Document, options);
        }
export type ViewRankedSets3QueryHookResult = ReturnType<typeof useViewRankedSets3Query>;
export type ViewRankedSets3LazyQueryHookResult = ReturnType<typeof useViewRankedSets3LazyQuery>;
export type ViewRankedSets3QueryResult = Apollo.QueryResult<ViewRankedSets3Query, ViewRankedSets3QueryVariables>;
export const QueryPmCSummaryDocument = gql`
    query QueryPmCSummary($id: UUID!) {
  pmcInfo(id: $id) {
    title
    abstract
    pmc
  }
}
    `;

/**
 * __useQueryPmCSummaryQuery__
 *
 * To run a query within a React component, call `useQueryPmCSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryPmCSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryPmCSummaryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useQueryPmCSummaryQuery(baseOptions: Apollo.QueryHookOptions<QueryPmCSummaryQuery, QueryPmCSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QueryPmCSummaryQuery, QueryPmCSummaryQueryVariables>(QueryPmCSummaryDocument, options);
      }
export function useQueryPmCSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryPmCSummaryQuery, QueryPmCSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QueryPmCSummaryQuery, QueryPmCSummaryQueryVariables>(QueryPmCSummaryDocument, options);
        }
export type QueryPmCSummaryQueryHookResult = ReturnType<typeof useQueryPmCSummaryQuery>;
export type QueryPmCSummaryLazyQueryHookResult = ReturnType<typeof useQueryPmCSummaryLazyQuery>;
export type QueryPmCSummaryQueryResult = Apollo.QueryResult<QueryPmCSummaryQuery, QueryPmCSummaryQueryVariables>;
export const GetPmcInfoByIdsDocument = gql`
    query GetPmcInfoByIds($pmcids: [String]!) {
  getPmcInfoByIds(pmcids: $pmcids) {
    nodes {
      pmc
      title
      yr
      doi
    }
  }
}
    `;

/**
 * __useGetPmcInfoByIdsQuery__
 *
 * To run a query within a React component, call `useGetPmcInfoByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPmcInfoByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPmcInfoByIdsQuery({
 *   variables: {
 *      pmcids: // value for 'pmcids'
 *   },
 * });
 */
export function useGetPmcInfoByIdsQuery(baseOptions: Apollo.QueryHookOptions<GetPmcInfoByIdsQuery, GetPmcInfoByIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPmcInfoByIdsQuery, GetPmcInfoByIdsQueryVariables>(GetPmcInfoByIdsDocument, options);
      }
export function useGetPmcInfoByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPmcInfoByIdsQuery, GetPmcInfoByIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPmcInfoByIdsQuery, GetPmcInfoByIdsQueryVariables>(GetPmcInfoByIdsDocument, options);
        }
export type GetPmcInfoByIdsQueryHookResult = ReturnType<typeof useGetPmcInfoByIdsQuery>;
export type GetPmcInfoByIdsLazyQueryHookResult = ReturnType<typeof useGetPmcInfoByIdsLazyQuery>;
export type GetPmcInfoByIdsQueryResult = Apollo.QueryResult<GetPmcInfoByIdsQuery, GetPmcInfoByIdsQueryVariables>;
export const GetGseInfoByIdsDocument = gql`
    query GetGseInfoByIds($gseids: [String]!) {
  getGseInfoByIds(gseids: $gseids) {
    nodes {
      gse
      id
      platform
      pmid
      publishedDate
      sampleGroups
      silhouetteScore
      species
      summary
      title
    }
  }
}
    `;

/**
 * __useGetGseInfoByIdsQuery__
 *
 * To run a query within a React component, call `useGetGseInfoByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGseInfoByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGseInfoByIdsQuery({
 *   variables: {
 *      gseids: // value for 'gseids'
 *   },
 * });
 */
export function useGetGseInfoByIdsQuery(baseOptions: Apollo.QueryHookOptions<GetGseInfoByIdsQuery, GetGseInfoByIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGseInfoByIdsQuery, GetGseInfoByIdsQueryVariables>(GetGseInfoByIdsDocument, options);
      }
export function useGetGseInfoByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGseInfoByIdsQuery, GetGseInfoByIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGseInfoByIdsQuery, GetGseInfoByIdsQueryVariables>(GetGseInfoByIdsDocument, options);
        }
export type GetGseInfoByIdsQueryHookResult = ReturnType<typeof useGetGseInfoByIdsQuery>;
export type GetGseInfoByIdsLazyQueryHookResult = ReturnType<typeof useGetGseInfoByIdsLazyQuery>;
export type GetGseInfoByIdsQueryResult = Apollo.QueryResult<GetGseInfoByIdsQuery, GetGseInfoByIdsQueryVariables>;
export const NumEnquiriesDocument = gql`
    query numEnquiries($num: Int!) {
  counterTable(id: $num) {
    count
  }
}
    `;

/**
 * __useNumEnquiriesQuery__
 *
 * To run a query within a React component, call `useNumEnquiriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNumEnquiriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNumEnquiriesQuery({
 *   variables: {
 *      num: // value for 'num'
 *   },
 * });
 */
export function useNumEnquiriesQuery(baseOptions: Apollo.QueryHookOptions<NumEnquiriesQuery, NumEnquiriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NumEnquiriesQuery, NumEnquiriesQueryVariables>(NumEnquiriesDocument, options);
      }
export function useNumEnquiriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NumEnquiriesQuery, NumEnquiriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NumEnquiriesQuery, NumEnquiriesQueryVariables>(NumEnquiriesDocument, options);
        }
export type NumEnquiriesQueryHookResult = ReturnType<typeof useNumEnquiriesQuery>;
export type NumEnquiriesLazyQueryHookResult = ReturnType<typeof useNumEnquiriesLazyQuery>;
export type NumEnquiriesQueryResult = Apollo.QueryResult<NumEnquiriesQuery, NumEnquiriesQueryVariables>;