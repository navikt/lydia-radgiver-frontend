import styles from "./downForMaitenance.module.scss";

export default function DownForMaintenance() {
    return (
        <>
            <div className={styles.downForMaitenancePage}>
                <h1>Fia er nede for vedlikehold</h1>
                <p>
                    Vi jobber med oppdraderinger! Vi planlegger å få systemet
                    opp igjen i løpet av kvelden.
                </p>
            </div>
        </>
    );
}
