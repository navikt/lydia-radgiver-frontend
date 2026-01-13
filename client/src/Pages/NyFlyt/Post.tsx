import { useState } from "react";
import {
	vurderSakNyFlyt,
	angreVurderingNyFlyt,
	avsluttVurderingNyFlyt,
	opprettSamarbeidNyFlyt,
	opprettKartleggingNyFlyt,
	startKartleggingNyFlyt,
	fullførKartleggingNyFlyt,
	opprettSamarbeidsplanNyFlyt,
	avsluttSamarbeidNyFlyt,
} from "../../api/lydia-api/nyFlyt";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";

interface PostProps {
	orgnummer: string;
	onSuccess: () => void;
}

interface EndpointSectionProps {
	title: string;
	children: React.ReactNode;
	response: object | null;
	error: string | null;
}

function EndpointSection({ title, children, response, error }: EndpointSectionProps) {
	return (
		<div style={{ backgroundColor: "#fff", padding: "10px" }}>
			<h3>{title}</h3>
			{children}
			{error && <div style={{ color: "red" }}>Error: {error}</div>}
			{response && (
				<pre style={{ fontFamily: "monospace", fontSize: "12px", maxHeight: "150px", overflowY: "auto", backgroundColor: "#f0f0f0", padding: "5px" }}>
					{JSON.stringify(response, null, 2)}
				</pre>
			)}
		</div>
	);
}

export function VurderSak({ orgnummer, onSuccess }: PostProps) {
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const result = await vurderSakNyFlyt(orgnummer);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: vurderSakNyFlyt" response={response} error={error}>
			<button onClick={handleSubmit}>Vurder sak</button>
		</EndpointSection>
	);
}

export function AngreVurdering({ orgnummer, onSuccess }: PostProps) {
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const result = await angreVurderingNyFlyt(orgnummer);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: angreVurderingNyFlyt" response={response} error={error}>
			<button onClick={handleSubmit}>Angre vurdering</button>
		</EndpointSection>
	);
}

export function AvsluttVurdering({ orgnummer, onSuccess }: PostProps) {
	const [årsakJson, setÅrsakJson] = useState('{"type": "VIRKSOMHETEN_TAKKET_NEI", "begrunnelser": []}');
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const årsak = JSON.parse(årsakJson);
			const result = await avsluttVurderingNyFlyt(orgnummer, årsak);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: avsluttVurderingNyFlyt" response={response} error={error}>
			<div>
				<span>ValgtÅrsakDto (JSON):</span><br />
				<textarea
					value={årsakJson}
					onChange={(e) => setÅrsakJson(e.target.value)}
					style={{ width: "400px", height: "60px", fontFamily: "monospace" }}
				/>
			</div>
			<button onClick={handleSubmit}>Fullfør vurdering</button>
		</EndpointSection>
	);
}

export function OpprettSamarbeid({ orgnummer, onSuccess }: PostProps) {
	const [samarbeidJson, setSamarbeidJson] = useState('{"id": 0, "saksnummer": "", "navn": "Nytt samarbeid"}');
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const nyttSamarbeid = JSON.parse(samarbeidJson);
			const result = await opprettSamarbeidNyFlyt(orgnummer, nyttSamarbeid);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: opprettSamarbeidNyFlyt" response={response} error={error}>
			<div>
				<span>IaSakProsess (JSON):</span><br />
				<textarea
					value={samarbeidJson}
					onChange={(e) => setSamarbeidJson(e.target.value)}
					style={{ width: "400px", height: "60px", fontFamily: "monospace" }}
				/>
			</div>
			<button onClick={handleSubmit}>Opprett samarbeid</button>
		</EndpointSection>
	);
}

export function OpprettKartlegging({ orgnummer, onSuccess }: PostProps) {
	const [samarbeidId, setSamarbeidId] = useState("");
	const [type, setType] = useState<SpørreundersøkelseType>("BEHOVSVURDERING");
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const result = await opprettKartleggingNyFlyt(orgnummer, samarbeidId, type);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: opprettKartleggingNyFlyt" response={response} error={error}>
			<div>
				<span>samarbeidId: </span>
				<input value={samarbeidId} onChange={(e) => setSamarbeidId(e.target.value)} />
			</div>
			<div>
				<span>type: </span>
				<select value={type} onChange={(e) => setType(e.target.value as SpørreundersøkelseType)}>
					<option value="BEHOVSVURDERING">BEHOVSVURDERING</option>
					<option value="EVALUERING">EVALUERING</option>
				</select>
			</div>
			<button onClick={handleSubmit}>Opprett kartlegging</button>
		</EndpointSection>
	);
}

export function StartKartlegging({ orgnummer, onSuccess }: PostProps) {
	const [samarbeidId, setSamarbeidId] = useState("");
	const [spørreundersøkelseId, setSpørreundersøkelseId] = useState("");
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const result = await startKartleggingNyFlyt(orgnummer, samarbeidId, spørreundersøkelseId);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: startKartleggingNyFlyt" response={response} error={error}>
			<div>
				<span>samarbeidId: </span>
				<input value={samarbeidId} onChange={(e) => setSamarbeidId(e.target.value)} />
			</div>
			<div>
				<span>spørreundersøkelseId: </span>
				<input value={spørreundersøkelseId} onChange={(e) => setSpørreundersøkelseId(e.target.value)} />
			</div>
			<button onClick={handleSubmit}>Start kartlegging</button>
		</EndpointSection>
	);
}

export function FullførKartlegging({ orgnummer, onSuccess }: PostProps) {
	const [samarbeidId, setSamarbeidId] = useState("");
	const [spørreundersøkelseId, setSpørreundersøkelseId] = useState("");
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const result = await fullførKartleggingNyFlyt(orgnummer, samarbeidId, spørreundersøkelseId);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: fullførKartleggingNyFlyt" response={response} error={error}>
			<div>
				<span>samarbeidId: </span>
				<input value={samarbeidId} onChange={(e) => setSamarbeidId(e.target.value)} />
			</div>
			<div>
				<span>spørreundersøkelseId: </span>
				<input value={spørreundersøkelseId} onChange={(e) => setSpørreundersøkelseId(e.target.value)} />
			</div>
			<button onClick={handleSubmit}>Fullfør kartlegging</button>
		</EndpointSection>
	);
}

export function OpprettSamarbeidsplan({ orgnummer, onSuccess }: PostProps) {
	const [samarbeidId, setSamarbeidId] = useState("");
	const [planJson, setPlanJson] = useState('{"tema": []}');
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const nyPlan = JSON.parse(planJson);
			const result = await opprettSamarbeidsplanNyFlyt(orgnummer, samarbeidId, nyPlan);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: opprettSamarbeidsplanNyFlyt" response={response} error={error}>
			<div>
				<span>samarbeidId: </span>
				<input value={samarbeidId} onChange={(e) => setSamarbeidId(e.target.value)} />
			</div>
			<div>
				<span>PlanMal (JSON):</span><br />
				<textarea
					value={planJson}
					onChange={(e) => setPlanJson(e.target.value)}
					style={{ width: "400px", height: "60px", fontFamily: "monospace" }}
				/>
			</div>
			<button onClick={handleSubmit}>Opprett samarbeidsplan</button>
		</EndpointSection>
	);
}

export function AvsluttSamarbeid({ orgnummer, onSuccess }: PostProps) {
	const [samarbeidId, setSamarbeidId] = useState("");
	const [response, setResponse] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		try {
			const result = await avsluttSamarbeidNyFlyt(orgnummer, samarbeidId);
			setResponse(result);
			onSuccess();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	return (
		<EndpointSection title="POST: avsluttSamarbeidNyFlyt" response={response} error={error}>
			<div>
				<span>samarbeidId: </span>
				<input value={samarbeidId} onChange={(e) => setSamarbeidId(e.target.value)} />
			</div>
			<button onClick={handleSubmit}>Avslutt samarbeid</button>
		</EndpointSection>
	);
}
