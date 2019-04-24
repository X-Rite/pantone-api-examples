import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';

import write from './write.js';
import config from '../../config';

Amplify.configure({
  Auth: {
    identityPoolId: config.IDENTITY_POOL_ID,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.CLIENT_ID,
  },
  aws_appsync_graphqlEndpoint: config.API_ENDPOINT,
  aws_appsync_region: config.REGION,
  aws_appsync_authenticationType: config.AUTH_TYPE,
});

write('Logging in');

Auth.signIn(config.USERNAME, config.PASSWORD).then(data => {
  write(`Logged in: ${data.signInUserSession.idToken.payload.email}`);
  console.log(data);

  /*
    AWS Amplify manages the token refresh by itself,
    as explained in the official documentation: https://aws-amplify.github.io/docs/js/authentication#managing-security-tokens
    If you are using aws-amplify server side, you need to implement your own "storage", as shown in the link.
  */

  write('Querying Pantone API');
  API.graphql(graphqlOperation(`{
    getBooks {
      title
    }
  }`)).then((response) => {
    write('Pantone API data:');
    write(response.data.getBooks.map(x => x.title).join(', '));
  });
});

