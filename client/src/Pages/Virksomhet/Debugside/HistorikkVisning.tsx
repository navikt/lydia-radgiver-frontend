import { useHentHistorikkNyFlyt } from "@features/sak/api/nyFlyt";

const cellStyle = { padding: "4px 8px" };
const cellHeaderStyle = { ...cellStyle, textAlign: "left" as const };

export function HistorikkVisning({ orgnummer }: { orgnummer: string }) {
    const historikk = useHentHistorikkNyFlyt(orgnummer);

    return (
        <div>
            <h2>Historikk (sakshendelser)</h2>
            {historikk.loading && <p>Laster historikk...</p>}
            {historikk.data && historikk.data.length > 0
                ? historikk.data.map((sak) => (
                      <div
                          key={sak.saksnummer}
                          style={{ marginBottom: "16px" }}
                      >
                          <h3>Sak {sak.saksnummer}</h3>
                          <table
                              style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                              }}
                          >
                              <thead>
                                  <tr style={{ backgroundColor: "#e0e0e0" }}>
                                      <th style={cellHeaderStyle}>
                                          Hendelsestype
                                      </th>
                                      <th style={cellHeaderStyle}>Status</th>
                                      <th style={cellHeaderStyle}>Tidspunkt</th>
                                      <th style={cellHeaderStyle}>
                                          Opprettet av
                                      </th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {sak.sakshendelser.map((hendelse, i) => (
                                      <tr
                                          key={i}
                                          style={{
                                              borderBottom: "1px solid #ccc",
                                          }}
                                      >
                                          <td style={cellStyle}>
                                              {hendelse.hendelsestype}
                                          </td>
                                          <td style={cellStyle}>
                                              {hendelse.status}
                                          </td>
                                          <td style={cellStyle}>
                                              {hendelse.tidspunktForSnapshot.toLocaleString()}
                                          </td>
                                          <td style={cellStyle}>
                                              {hendelse.hendelseOpprettetAv}
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  ))
                : historikk.data && <p>Ingen historikk funnet</p>}
        </div>
    );
}
