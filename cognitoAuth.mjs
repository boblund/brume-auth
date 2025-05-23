export { userPassAuth, refreshTokenAuth };

let Cognito;
const { AuthenticationDetails, CognitoUserPool, CognitoUser } = typeof Window === 'undefined'
	? await import( 'amazon-cognito-identity-js' ) // nodejs
	: ( Cognito = await import( './amazon-cognito-identity.min.js' ) )?.__esModule
		? Cognito // Webpack
		: window.AmazonCognitoIdentity; // browser

const userPool = new CognitoUserPool( { UserPoolId: 'us-east-1_p5E3AsRc8', ClientId: '6dspdoqn9q00f0v42c12qvkh5l' } );

function userPassAuth( username, password ) {
	return new Promise( ( res, rej ) => {
		const authenticationDetails = new AuthenticationDetails( { Username: username, Password: password } );
		const cognitoUser = new CognitoUser( { Username: username, Pool: userPool } );

		cognitoUser.authenticateUser( authenticationDetails, {
			onSuccess: function( result ) {
				cognitoUser.getUserAttributes( ( e, r ) => {
					res( { IdToken: result.getIdToken().getJwtToken() } );
				} );
			},
			onFailure: function( err ) {
				res ( { error: err } );
			}
		} );
	} );
}

function refreshTokenAuth( refreshToken, user ) {
	return new Promise( ( res, rej ) => {
		try {
			const cognitoUser = new CognitoUser( { Username: user, Pool: userPool } );
			cognitoUser.refreshSession( { getToken(){ return refreshToken; } }, ( err, session ) => {
				err ? rej( err ) : res( { IdToken: session.getIdToken().getJwtToken() } );
			} );
		} catch( e ){
			rej( e );
		}
	} );
};
