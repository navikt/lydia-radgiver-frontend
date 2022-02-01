import request from "supertest"
import {envVars} from "../config";
import Application from "../app";

const mockEnv = () => {
    process.env[envVars.clusterName] = 'local';
    process.env[envVars.nameSpace] = 'pia';
    process.env[envVars.azureAppClientId] = 'azureAppClientId'
    process.env[envVars.azureOpenidConfigTokenEndpoint] = 'azureOpenidConfigTokenEndpoint'
    process.env[envVars.azureAppClientSecret] = 'azureAppClientSecret'
    process.env[envVars.port] = '8080'
    process.env[envVars.lydiaApiUri] = 'http://localhost:8080';
}

const init = () => {
    mockEnv()
    return new Application().expressApp
}

describe("Tester liveness og readiness", () => {
    let expressApp
    beforeAll(() => {
        expressApp = init()
    })

    test("Appen skal respondere på liveness", done => {
        request(expressApp)
            .get("/internal/isAlive")
            .then(response => {
                expect(response.statusCode).toBeLessThan(400);
                done();
            });
    });
    test("Appen skal respondere på readiness", done => {
        request(expressApp)
            .get("/internal/isReady")
            .then(response => {
                expect(response.statusCode).toBeLessThan(400);
                done();
            });
    });
});

describe("Tester proxy mot lydia-api", () => {
    let expressApp
    beforeAll(() => {
        expressApp = init()
    })

    test("Kall som ikke går til /api skal ikke ta i bruk proxy", done => {
        request(expressApp)
            .get("/internal/isAlive")
            .then(response => {
                expect(response.statusCode).toBeLessThan(400);
                done();
            })
    });
    test("Kall til /api/{endepunkt} uten Bearer token skal returnere 401 før de treffer proxy", done => {
        request(expressApp)
            .get("/api/test")
            .then(response => {
                expect(response.statusCode).toBe(401);
                done()
            })
    });
    test("Kall til /api/{endepunkt} skal treffe proxy om de har et Bearer token", done => {
        request(expressApp)
            .get("/api/test")
            .set("Authorization", "Bearer tulletoken")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            })
    });
});