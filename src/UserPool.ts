import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: <string>`${process.env.REACT_APP_USER_POOL_ID}`,
  ClientId: <string>`${process.env.REACT_APP_CLIENT_ID}`,
}

export default new CognitoUserPool(poolData)
