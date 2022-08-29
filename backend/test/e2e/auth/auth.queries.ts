import { gql } from '@trophoria/test/e2e/e2e-utils';

export const signUpQuery = gql`
  mutation SignUp($user_input: UserCreateInput!) {
    sign_up(user_input: $user_input) {
      createdAt
      email
      payload
      updatedAt
      username
      isVerified
    }
  }
`;

export const signInQuery = gql`
  mutation SignUp($credentials: AuthenticationInput!) {
    sign_in(credentials: $credentials) {
      accessToken
      refreshToken
      reuseDetected
    }
  }
`;

export const refreshQuery = gql`
  mutation RefreshTokens {
    refresh_tokens {
      accessToken
      refreshToken
    }
  }
`;

export const meQuery = gql`
  query me {
    me {
      createdAt
      email
      isVerified
      payload
      updatedAt
      username
    }
  }
`;
