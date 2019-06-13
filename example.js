let secretClient = require('add-secret');

async function configureKeyVaultValues(){
    let secrets = [
        {
            Name: 'database',
            Value: 'db-name'
        },
        {
            Name: 'database-password',
            Value: 'db-password'
        }
    ]
    let applicationID = '';
    let applicationSecret = '';
    let vaultURL = '';
    await secretClient.addSecrets(applicationID, applicationSecret, vaultURL, secrets);
}