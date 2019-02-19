import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import write from './write.js';

const AUTH_TYPE = 'AWS_IAM';

// Values to update with Pantone API values
const REGION = 'eu-central-1';
const API_ENDPOINT = 'https://2kotxbvfc5dhfmdsywvntcjqnu.appsync-api.eu-central-1.amazonaws.com/graphql';
const IDENTITY_POOL_ID = 'eu-central-1:ed6e3ac3-eafd-44f9-97a0-0dd3ada6d3ae';
const USER_POOL_ID = 'eu-central-1_QyJ2z85xR';
const CLIENT_ID = '5rplgkpl99uor6hdsc6aidjlmq';

Amplify.configure({
  Auth: {
    identityPoolId: IDENTITY_POOL_ID,
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
  },
  aws_appsync_graphqlEndpoint: API_ENDPOINT,
  aws_appsync_region: REGION,
  aws_appsync_authenticationType: AUTH_TYPE,
});

write('Logging in');

Auth.signIn('gabrielenosso@gmail.com', 'Password0').then(data => {
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

