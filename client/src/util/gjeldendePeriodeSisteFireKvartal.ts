import { Publiseringsinfo } from "@features/plan/types/publiseringsinfo";

export const getGjeldendePeriodeTekst = (
    publisreingsinfo: Publiseringsinfo | undefined,
) => {
    if (publisreingsinfo) {
        return ` (${publisreingsinfo.fraTil.fra.kvartal}. kvartal ${publisreingsinfo.fraTil.fra.årstall} 
                      – 
                      ${publisreingsinfo.fraTil.til.kvartal}. kvartal ${publisreingsinfo.fraTil.til.årstall})`;
    }
    return "";
};
