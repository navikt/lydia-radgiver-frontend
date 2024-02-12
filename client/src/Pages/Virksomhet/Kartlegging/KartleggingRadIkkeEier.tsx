export interface Props {
    kartleggingStatus: string;
}
export const KartleggingRadIkkeEier = (props: Props) => {
    return <>Kartlegging med status: {props.kartleggingStatus}</>;
};
