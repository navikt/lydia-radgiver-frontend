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
            <button onClick={() => { setOpen(true)}}>Åpne modal</button>
            <BekreftValgModal onConfirm={() => {
                setOpen(false)
                console.log('Confirmed')
            }} onCancel={() => {
                setOpen(false)
                console.log('Canceled')
            }} åpen={open} description={"Vennligst bekreft valget ditt"} />
        </>

    );
}
