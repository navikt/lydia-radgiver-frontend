import { CSSProperties } from "react";

interface BadgeProps {
    color: string;
    backgroundColor: string;
    text: string;
    customStyles?: CSSProperties;
}

export const Badge = ({
    backgroundColor,
    color,
    text,
    customStyles = {},
}: BadgeProps) => {
    return (
        <div
            style={{
                color,
                backgroundColor,
                padding: "0 1rem",
                borderRadius: "4px",
                textAlign: "center",
                whiteSpace: "nowrap",
                ...customStyles,
            }}
        >
            {text}
        </div>
    );
};
