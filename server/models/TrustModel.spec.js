const TrustModel = require("./TrustModel");
const mockKnex = require("mock-knex");
const tracker = mockKnex.getTracker();
const knex = require("../database/knex");
const chai = require("chai");
const {expect} = chai;

describe("TrustModel", () => {
  let trustModel;

  before(() => {
    mockKnex.mock(knex);
    tracker.install();
    trustModel = new TrustModel();
  });

  after(() => {
    mockKnex.unmock(knex);
    tracker.uninstall();
  });

  it("get trust_relationships", async () => {
    tracker.on("query", (query) => {
      expect(query.sql).match(/select.*trust_relationship.*/);
      query.response([{
        a:1,
      }]);
    });
    const trust_relationships = await trustModel.get();
    expect(trust_relationships).lengthOf(1);
  });


  describe("Request trust", () => {
    it('request a send trust', async () => {
      const zavenWallet = 'Zaven';
      await trustModel.request(
        TrustModel.ENTITY_TRUST_REQUEST_TYPE.send, 
        zavenWallet
      );
    });

    it("request with a wrong type would throw error", async () => {
      try{
        trustModel.request("wrongtype","");
        expect.fail();
      }catch(e){
        expect(true).eq(true);
      }
    });
  });

});

