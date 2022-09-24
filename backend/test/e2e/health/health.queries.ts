import { gql } from '@trophoria/test/utils/e2e-utils';

export const pingQuery = gql`
  query Ping {
    ping
  }
`;
