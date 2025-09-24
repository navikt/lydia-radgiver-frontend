import { useLocation, useNavigate } from "react-router-dom";
import { useHentBrukerinformasjon } from "../api/lydia-api/bruker";
import React from "react";
import { Alert, Loader } from "@navikt/ds-react";

import styles from './components.module.scss';
export default function SmartStartsideRedirect() {
	const navigate = useNavigate();
	const {
		data: brukerInformasjon,
		loading,
		error,
	} = useHentBrukerinformasjon();
	const location = useLocation();

	React.useEffect(() => {
		if (brukerInformasjon?.rolle) {
			switch (brukerInformasjon.rolle) {
				case "Saksbehandler":
				case "Lesetilgang":
					if (location.search.length > 0) {
						// Vi sender med det originale søket i state, så vi kan putte en alert med lenke til prioriteringssiden i tilfelle folk har lagret søk som bokmerke.
						navigate("/minesaker", {
							replace: true,
							state: {
								redirected: {
									from: location.pathname,
									search: location.search,
								}
							}
						});
					} else {
						navigate("/minesaker", { replace: true });
					}
					break;
				case "Superbruker":
				default:
					if (location.search.length > 0) {
						navigate({
							pathname: "/prioritering",
							search: location.search,
						}, {
							replace: true,
							state: {
								redirected: {
									from: location.pathname,
									search: location.search,
								}
							}
						});
					} else {
						navigate("/prioritering", { replace: true });
					}
					break;
			}
		}
	}, [brukerInformasjon, navigate]);

	if (loading) {
		return <Loader className={styles.lastespinner} />;
	}

	if (error) {
		return (
			<Alert variant="error">{error.message}</Alert>
		);
	}

	return null;
}