import React from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../../domenetyper/domenetyper";

export interface SamarbeidContextType extends IaSakProsess {
    erFullført: boolean;
}

const STENGTE_STATUSER: IAProsessStatusType[] = [
    IAProsessStatusEnum.enum.FULLFØRT,
    IAProsessStatusEnum.enum.SLETTET,
    IAProsessStatusEnum.enum.AVBRUTT,
];

const SamarbeidContext = React.createContext<SamarbeidContextType | null>(null);

export function SamarbeidProvider({
    children,
    samarbeid,
}: {
    children: React.ReactNode;
    samarbeid?: IaSakProsess;
}) {
    return (
        <SamarbeidContext.Provider
            value={
                samarbeid
                    ? {
                          ...samarbeid,
                          erFullført: STENGTE_STATUSER.includes(
                              samarbeid.status,
                          ),
                      }
                    : null
            }
        >
            {children}
        </SamarbeidContext.Provider>
    );
}

export function useSamarbeidContext(): SamarbeidContextType {
    const context = React.useContext(SamarbeidContext);

    if (!context) {
        throw new Error(
            "useSamarbeidContext må brukes innenfor en SamarbeidContextProvider",
        );
    }

    return context;
}

export function samarbeidErFullført(): boolean {
    const samarbeidContext = useSamarbeidContext();
    return samarbeidContext.erFullført;
}

export function VisHvisSamarbeidErÅpent({
    children,
}: {
    children: React.ReactNode;
}) {
    return samarbeidErFullført() ? null : children;
}

export function VisHvisSamarbeidErLukket({
    children,
}: {
    children: React.ReactNode;
}) {
    return samarbeidErFullført() ? children : null;
}

export default SamarbeidContext;
