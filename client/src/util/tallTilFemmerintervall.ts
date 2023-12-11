export const tallTilFemmerintervall = (tall: number) => {
    const tallgruppe = Math.floor(tall / 5) * 5
    return `${tallgruppe} – ${tallgruppe + 4}`
}
