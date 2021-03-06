import AWS from 'aws-sdk';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import AWSAppSyncClient from 'aws-appsync'
import gql from 'graphql-tag';

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
    write('Got user token');

    AWS.config.region = config.REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId : config.IDENTITY_POOL_ID,
      Logins : {
        [`cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`]: result.getIdToken().getJwtToken(),
      }
    });

    AWS.config.credentials.refresh((error) => {
      if (error) {
        write(error);
      } else {
        write('Logged in');
        console.log(AWS.config.credentials);

        const client = new AWSAppSyncClient({
          url: config.API_ENDPOINT,
          region: config.REGION,
          auth: {
            type: config.AUTH_TYPE,
            credentials: AWS.config.credentials,
          },
        });
    
        client.query({
          query: gql`
            {
              getBooks { title }
            }
          `
        }).then((response) => {
          write('Pantone API data:');
          write(response.data.getBooks.map(x => x.title).join(', '));
        });
      };
    });
  },

  onFailure: (error) => {
    write(error);
  },
});
