import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: <string>'us-west-2_LlnlSjT2D',
  ClientId: <string>'5q3hlt7rtub5sm5rrlvegu126l',
}

export default new CognitoUserPool(poolData)
