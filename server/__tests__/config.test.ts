import { Config, envVars } from "../config"

const setEnvVar = (name : string, value : string) : void => {
    process.env[name] = value
}

const settOppNødvendigEnvVariabler = () => {
    const nødvedigeMiljøVariabler = [
        envVars.azureAppClientId,
        envVars.azureOpenidConfigTokenEndpoint,
        envVars.azureAppClientSecret,
        envVars.clusterName,
        envVars.nameSpace,
        envVars.lydiaApiUri,
        envVars.azureOpenidConfigIssuer,
        envVars.jwkUri
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
        expect(config.serverConfig.port).toBeDefined()
    })
    test("Det er mulig å spesifisere port for server hvis man ønsker", () => {
        settOppNødvendigEnvVariabler()
        const serverPort = 12345
        setEnvVar(envVars.serverPort, serverPort.toString())
        const config = new Config()
        expect(config.serverConfig.port).toBe(serverPort)
    })

})
