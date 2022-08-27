import { gql } from '@trophoria/test/e2e/e2e-utils';

export const pingQuery = gql`
  query Ping {
    ping
  }
`;
