import { gql } from '@trophoria/test/utils/e2e-utils';

export const signUpQuery = gql`
  mutation SignUp($userInput: UserCreateInput!) {
    signUp(userInput: $userInput) {
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
    signIn(credentials: $credentials) {
      accessToken
      refreshToken
      reuseDetected
    }
  }
`;

export const refreshQuery = gql`
  mutation RefreshTokens {
    refreshTokens {
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

export const signOutQuery = gql`
  mutation SignOut {
    signOut {
      statusCode
      message
    }
  }
`;
