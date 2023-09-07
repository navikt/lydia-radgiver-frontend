import { Meta } from "@storybook/react";
import { useState } from "react";
import { BekreftValgModal } from "./BekreftValgModal";

export default {
    title: "BekreftValgModal",
    component: BekreftValgModal,
} as Meta<typeof BekreftValgModal>;

export const ModalStory = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <button onClick={() => {
                setOpen(true)
            }}>Åpne modal
            </button>
            <BekreftValgModal
                onConfirm={() => {
                    setOpen(false)
                    console.log('Confirmed')
                }}
                onCancel={() => {
                    setOpen(false)
                    console.log('Canceled')
                }}
                åpen={open}
                title={"Er du sikker på at du vil lukke dialogboksen?"}
                description={"Ved å lukke dialogboksen vil den bli lukket, og må åpnes på nytt for å åpnes."} />
        </>

    );
}
