/**
 * Model to return a freshly generated token pair. The refresh token id
 * is a uuid which is automatically generated and added to the refresh
 * token payload.
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
}
