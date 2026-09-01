import { render } from "@testing-library/react";
import { useKaskadeRevalidering } from "./useKaskadeRevalidering";

function TestKomponent({
    foreldreValiderer,
    mutate,
}: {
    foreldreValiderer: boolean;
    mutate: () => void;
}) {
    useKaskadeRevalidering(foreldreValiderer, mutate);
    return null;
}

describe("useKaskadeRevalidering", () => {
    test("kaller ikke mutate ved initial render", () => {
        const mutate = jest.fn();
        render(<TestKomponent foreldreValiderer={false} mutate={mutate} />);
        expect(mutate).not.toHaveBeenCalled();
    });

    test("kaller ikke mutate selv om forelder allerede validerer ved mount", () => {
        const mutate = jest.fn();
        render(<TestKomponent foreldreValiderer={true} mutate={mutate} />);
        expect(mutate).not.toHaveBeenCalled();
    });

    test("kaller ikke mutate når forelder begynner å validere", () => {
        const mutate = jest.fn();
        const { rerender } = render(
            <TestKomponent foreldreValiderer={false} mutate={mutate} />,
        );
        rerender(<TestKomponent foreldreValiderer={true} mutate={mutate} />);
        expect(mutate).not.toHaveBeenCalled();
    });

    test("kaller mutate når forelder er ferdig med å validere", () => {
        const mutate = jest.fn();
        const { rerender } = render(
            <TestKomponent foreldreValiderer={false} mutate={mutate} />,
        );
        rerender(<TestKomponent foreldreValiderer={true} mutate={mutate} />);
        rerender(<TestKomponent foreldreValiderer={false} mutate={mutate} />);
        expect(mutate).toHaveBeenCalledTimes(1);
    });

    test("kaller mutate én gang per true→false-overgang", () => {
        const mutate = jest.fn();
        const { rerender } = render(
            <TestKomponent foreldreValiderer={false} mutate={mutate} />,
        );
        rerender(<TestKomponent foreldreValiderer={true} mutate={mutate} />);
        rerender(<TestKomponent foreldreValiderer={false} mutate={mutate} />);
        rerender(<TestKomponent foreldreValiderer={true} mutate={mutate} />);
        rerender(<TestKomponent foreldreValiderer={false} mutate={mutate} />);
        expect(mutate).toHaveBeenCalledTimes(2);
    });
});
