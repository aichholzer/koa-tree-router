const Koa = require("koa");
const request = require("supertest");
const expect = require("expect");
const Router = require("../router");

describe("Router", () => {
  it("should work", done => {
    const app = new Koa();
    const router = new Router();
    router.get("/", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .get("/")
      .expect(200, done);
  });

  it("support multiple middleware", done => {
    const app = new Koa();
    const router = new Router();
    router.get(
      "/",
      function(ctx, next) {
        ctx.body = 1;
        next();
      },
      function(ctx) {
        ctx.body += 1;
      }
    );

    app.use(router.routes());

    request(app.callback())
      .get("/")
      .expect(200)
      .end(function(err, res) {
        expect(res.body).toEqual(2);
        done(err);
      });
  });

  it("support 405 method not allowed", done => {
    const resBody = { msg: "not allowed" };
    const app = new Koa();
    const router = new Router({
      onMethodNotAllowed(ctx) {
        ctx.body = resBody;
      }
    });
    router.get("/", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .post("/")
      .expect(405)
      .end(function(_, res) {
        expect(res.body).toMatchObject(resBody);
        done();
      });
  });
});
