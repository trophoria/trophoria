/**
 * The data which is saved inside a jwt token signed by the jwt module.
 *
 * @param id    The unique id of the user the token got signed for
 * @param iat   (issued at) The timestamp the token got issued
 * @param exp   (expiration) The timestamp the token expires at
 * @param iss   (issuer) The issuer of the token
 * @param sub   (subject) The subject for which the token got signed for
 * @param jti   (jwt id) The unique id of the jwt token
 */
export type JwtPayload = {
  id: string;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  jti: string;
};
