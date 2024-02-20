export const environment = {
    config: {
        jwtTokenKey: 'jwt-token',
        usernameKey: 'username',
        roleKey: 'role',
        baseDomain: 'http://localhost:3000' // TO BE SET AS ENV VARIABLE
    },
    roles: {
        admin: 'Admin',
        modifier: 'Modifier',
        reader: 'Reader'
    }
}