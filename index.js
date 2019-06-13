const KeyVault = require('azure-keyvault');
const AdalNode = require('adal-node');
var client;

//Set environment specific values
let clientID = '';
let clientSecret = '';
//Azure key vault URL
var vaultUri = '';
//Add secret names and values
let secrets = [];

/**
 * Add secrets to azure key vault
 *
 * @param {*} appClientID - Application client ID
 * @param {*} appClientSecret - Application client secret 
 * @param {*} keyVaultURL - Azure key vault URL
 * @param {*} secretsToAdd - Array of secrets to add
 *                         - Example - [{Name: 'SecretName', Value: 'SecretValue'}]
 */
async function addSecrets(appClientID, appClientSecret, keyVaultURL, secretsToAdd) {
    clientID = appClientID;
    clientSecret = appClientSecret;
    vaultUri = keyVaultURL;
    secrets = secretsToAdd;
    //Authenticate by provided client ID and client secret and get credentials to access key vault
    var credentials = new KeyVault.KeyVaultCredentials(secretAuthenticator);
    client = new KeyVault.KeyVaultClient(credentials);
    for (let index = 0; index < secrets.length; index++) {
        await setClientSecret(secrets[index].Name, secrets[index].Value);
    }
    console.log('Secrets added successfully.');
    process.exit(0);
}

function secretAuthenticator(challenge, callback) {
    var context = new AdalNode.AuthenticationContext(challenge.authorization);
    return context.acquireTokenWithClientCredentials(
        challenge.resource,
        clientID,
        clientSecret,
        function (err, tokenResponse) {
            if (err) {
                throw err;
            }
            var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
            return callback(null, authorizationValue);
        });
}

/**
 * Add value to key vault
 *
 * @param {*} secretName - Secret name
 * @param {*} secretValue - Secret value
 */
async function setClientSecret(secretName, secretValue) {
    try {
        // Setting the secret value
        let response = await client.setSecret(vaultUri, secretName, secretValue, {})
        console.dir(response);
    } catch (err) {
        console.error(`Failed to add secrete ${secretName}`);
        console.error(err);
    }
}

module.exports = {
    addSecrets
}