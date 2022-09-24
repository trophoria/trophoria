import { gql } from '@trophoria/test/utils/e2e-utils';

export const confirmEmailQuery = gql`
  mutation ConfirmEmail($token: String!) {
    confirmEmail(token: $token) {
      ...BasicResponse
    }
  }

  fragment BasicResponse on BasicResponse {
    message
    statusCode
  }
`;

export const resendLinkQuery = gql`
  mutation ResendConfirmationLink {
    resendConfirmationLink {
      ...BasicResponse
    }
  }

  fragment BasicResponse on BasicResponse {
    message
    statusCode
  }
`;
