import { Config, miljøVariabler } from "../config"

const setEnvVar = (name : string, value : string) : void => {
    process.env[name] = value
}

const settOppNødvendigEnvVariabler = () => {
    const nødvedigeMiljøVariabler = [
        miljøVariabler.azureAppClientId,
        miljøVariabler.azureOpenidConfigTokenEndpoint,
        miljøVariabler.azureAppClientSecret,
        miljøVariabler.clusterName,
        miljøVariabler.nameSpace,
        miljøVariabler.lydiaApiUri,
        miljøVariabler.azureOpenidConfigIssuer,
        miljøVariabler.jwkUri,
        miljøVariabler.csrfHemmelighet,
        miljøVariabler.cookieHemmelighet
    ]
    nødvedigeMiljøVariabler.forEach(name => setEnvVar(name, "verdi"))
}

describe("Tester konfigurasjon", () => {
    test("Initalisering av konfigurasjon uten å sette ENV-variabler kaster feilmelding", () => {
        expect(() => new Config()).toThrow()
    })
    test("Å sette verdier for 'eksterne' variabler resulterer i gyldig konfigurasjon", () => {
        settOppNødvendigEnvVariabler()
        expect(() => new Config()).not.toThrow()
        const config = new Config()
        expect(config.server.port).toBeDefined()
    })
    test("Det er mulig å spesifisere port for server hvis man ønsker", () => {
        settOppNødvendigEnvVariabler()
        const serverPort = 12345
        setEnvVar(miljøVariabler.serverPort, serverPort.toString())
        const config = new Config()
        expect(config.server.port).toBe(serverPort)
    })

})