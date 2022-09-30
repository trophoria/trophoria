import { gql } from '@trophoria/test/utils/e2e-utils';

export const deleteUserQuery = gql`
  mutation deleteUser {
    deleteUser {
      ...User
    }
  }

  fragment User on User {
    createdAt
    email
    payload
    updatedAt
    username
    isVerified
    avatar
    id
  }
`;

export const updateUserQuery = gql`
  mutation deleteUser($userInput: UserUpdateInput!) {
    updateUser(userInput: $userInput) {
      ...User
    }
  }

  fragment User on User {
    createdAt
    email
    payload
    updatedAt
    username
    isVerified
    avatar
    id
  }
`;
