export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const TweetPartsFragmentDoc = gql`
    fragment TweetParts on Tweet {
  title
  body
}
    `;
export const TweetDocument = gql`
    query tweet($relativePath: String!) {
  tweet(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...TweetParts
  }
}
    ${TweetPartsFragmentDoc}`;
export const TweetConnectionDocument = gql`
    query tweetConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: TweetFilter) {
  tweetConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...TweetParts
      }
    }
  }
}
    ${TweetPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    tweet(variables, options) {
      return requester(TweetDocument, variables, options);
    },
    tweetConnection(variables, options) {
      return requester(TweetConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, _options) => {
    const data = await client.request({
      query: doc,
      variables: vars
    });
    return { data: data?.data, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(createClient({ url: "http://localhost:4001/graphql", queries }))
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
