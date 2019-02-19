import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';

import write from './write.js';
import config from '../../config';

const AUTH_TYPE = 'AWS_IAM';

Amplify.configure({
  Auth: {
    identityPoolId: config.IDENTITY_POOL_ID,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.CLIENT_ID,
  },
  aws_appsync_graphqlEndpoint: config.API_ENDPOINT,
  aws_appsync_region: config.REGION,
  aws_appsync_authenticationType: AUTH_TYPE,
});

write('Logging in');

Auth.signIn(config.USERNAME, config.PASSWORD).then(data => {
  write(`Logged in: ${data.signInUserSession.idToken.payload.email}`);
  console.log(data);

  write('Querying Pantone API');
  API.graphql(graphqlOperation(`{
    getBooks {
      title
    }
  }`)).then(response => {
    write('Pantone API data:');
    write(response.data.getBooks.map(x => x.title).join(', '));
  });
});

