export const statusRegnesSomAvsluttet = (status: string) => {
    switch (status) {
        case "AKTIV":
        case "VURDERES":
            return false;
    }
    return true;
};
