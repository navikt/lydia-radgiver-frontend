import request from "supertest"
import app from "../app"

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