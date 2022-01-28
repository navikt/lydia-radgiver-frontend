import { NextFunction, Request, Response } from "express";
import request from "supertest"
import app from "../app"
import { lydiaApiProxy } from "../proxy";

jest.mock("../proxy");
(lydiaApiProxy as jest.Mock).mockImplementation((_, res : Response, __) => res.sendStatus(200))

describe("Tester liveness og readiness", () => {
    test("Appen skal respondere på liveness", done => {
        request(app)
            .get("/internal/isAlive")
            .then(response => {
                expect(response.statusCode).toBeLessThan(400);
                done();
            });
    });
    test("Appen skal respondere på readiness", done => {
        request(app)
            .get("/internal/isReady")
            .then(response => {
                expect(response.statusCode).toBeLessThan(400);
                done();
            });
        });
    });
    
describe("Tester proxy mot lydia-api", () => {
    test("Kall som ikke går til /api skal ikke ta i bruk proxy", done => {
        request(app)
            .get("/internal/isAlive")
            .then(response => {
                expect(response.statusCode).toBeLessThan(400);
                expect(lydiaApiProxy).not.toBeCalled()
                done();
            })
    });
    test("Kall til /api/{endepunkt} uten Bearer token skal returnere 401 før de treffer proxy", done => {
        request(app)
            .get("/api/test")
            .then(response => {
                expect(response.statusCode).toBe(401);
                expect(lydiaApiProxy).not.toBeCalled()
                done()
            })
    });
    test("Kall til /api/{endepunkt} skal treffe proxy om de har et Bearer token", done => {
        request(app)
            .get("/api/test")
            .set("Authorization", "Bearer tulletoken")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(lydiaApiProxy).toHaveBeenCalledTimes(1)
                done();
            })
    });
});