import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const options: Options = {
    swaggerDefinition: {
        restapi: '3.0.0',
        info: {
            title: 'minimum-social Topic API',
            version: '1.0.0',
            description: 'user-server: https://github.com/young1ll/minimum-social-user',
        },
        server: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ['./src/api/*.routes.ts', './src/api/swagger/*'],
};

export const specs = swaggerJSDoc(options);
