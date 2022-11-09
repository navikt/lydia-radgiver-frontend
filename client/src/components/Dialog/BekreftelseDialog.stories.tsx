import {ComponentMeta} from "@storybook/react";
import {BekreftelseDialog} from "./BekreftelseDialog";
import {useState} from "react";

export default {
    title: "BekreftelseDialog",
    component: BekreftelseDialog,
} as ComponentMeta<typeof BekreftelseDialog>;

export const ModalStory = () => {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <button onClick={() => { setOpen(true)}}>Åpne modal</button>
            <BekreftelseDialog onConfirm={() => {
                setOpen(false)
                console.log('Confirmed')
            }} onCancel={() => {
                setOpen(false)
                console.log('Canceled')
            }} åpen={open} description={"Ønsker du å gå tilbake?"} />
        </div>

    );
}
