const { Verifier } = require('@pact-foundation/pact');
const { before, describe, it } = require('mocha');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const generateAndReplacePactGuid = () => {
    const pactUrl = path.resolve(`./pacts/nutritional-advice-client-nutritional-advice-service.json`);
    let pactFile = fs.readFileSync(pactUrl, 'utf8');
    pactFile = pactFile.replace(/9227d6ea-c391-46b9-8f1b-d180ee111bbe/g, uuidv4());
    const newPactUrl = path.resolve(`./pacts/nutritional-advice-client-nutritional-advice-service-replaced.json`);
    fs.writeFileSync(newPactUrl, pactFile);
    return newPactUrl;
}
const pactFile = generateAndReplacePactGuid();

let port;
let opts;
describe("Pact Verification", () => {
    before(async () => {
        port = 61157;

        opts = {
            provider: "nutritional-advice-service",
            providerBaseUrl: `http://localhost:${port}`,
            logLevel: "info",
            pactUrls: [pactFile]

        };
    });
    it("Valida lo que espera el API del Cliente", () => {
        console.log(opts)
        return new Verifier(opts)
            .verifyProvider()
            .then((output) => {
                console.log("Pact Verification Complete!");
                console.log(output);
            })
            .catch((e) => {
                console.error("Pact verification failed :(", e);
            });
    });

});
