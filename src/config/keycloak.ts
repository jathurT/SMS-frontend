import Keycloak from 'keycloak-js';

/**
 * Keycloak configuration for the University System application.
 * This configuration is used to initialize the Keycloak instance for authentication.
 */

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
if (!keycloakUrl) {
    throw new Error('VITE_KEYCLOAK_URL environment variable is not set');
}

const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM;
if (!keycloakRealm) {
    throw new Error('VITE_KEYCLOAK_REALM environment variable is not set');
}

const keycloakClientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
if (!keycloakClientId) {
    throw new Error('VITE_KEYCLOAK_CLIENT_ID environment variable is not set');
}

const keycloakConfig = {
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: keycloakClientId,
};

// Initialize Keycloak instance with additional options for debugging
const keycloak = new Keycloak(keycloakConfig);

// Add debug logging
keycloak.onAuthSuccess = () => {
    console.log('✅ Keycloak authentication successful');
    console.log('Token preview:', keycloak.token?.substring(0, 50) + '...');
    console.log('Realm roles:', keycloak.realmAccess?.roles || []);
};

keycloak.onAuthError = (error) => {
    console.error('❌ Keycloak authentication error:', error);
};

keycloak.onTokenExpired = () => {
    console.log('⚠️ Keycloak token expired, attempting refresh...');
    keycloak.updateToken(30).catch((error) => {
        console.error('Token refresh failed:', error);
        keycloak.login();
    });
};

export default keycloak;