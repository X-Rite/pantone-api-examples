import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";

import write from './write';
import config from '../../config';

const authenticationDetails = new AuthenticationDetails({
  Username : config.USERNAME,
  Password : config.PASSWORD,
});
const userPool = new CognitoUserPool({
  UserPoolId : config.USER_POOL_ID,
  ClientId : config.CLIENT_ID,
});
const cognitoUser = new CognitoUser({
  Username : config.USERNAME,
  Pool : userPool,
});

write('Logging');
cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess: (result) => {
      var accessToken = result.getAccessToken().getJwtToken();
      
      /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
      var idToken = result.idToken.jwtToken;
  
      console.log(result);
      write('Got user token');
  },

  onFailure: (error) => {
    write(error);
  },
});
