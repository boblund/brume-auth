import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
export { refreshTokenAuth };

const client = new CognitoIdentityProviderClient( { region: 'us-east-1' } );

async function refreshTokenAuth( ClientId, REFRESH_TOKEN ) {
	const params = { 
		ClientId,
		AuthFlow: "REFRESH_TOKEN_AUTH",
		AuthParameters: { REFRESH_TOKEN }
	};

	try {
		const command = new InitiateAuthCommand( params );
		const r = await client.send( command );
		return r.AuthenticationResult;
	} catch( e ){
		throw( e );
	}
};
