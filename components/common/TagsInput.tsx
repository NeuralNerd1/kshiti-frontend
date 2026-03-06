"use client";

import { useState, useRef, KeyboardEvent } from "react";
import "./TagsInput.css";

type Props = {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
};

export default function TagsInput({
    value,
    onChange,
    placeholder = "Add tag and press Enter",
    maxTags,
}: Props) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (raw: string) => {
        const tag = raw.trim().toLowerCase();
        if (!tag) return;
        if (value.includes(tag)) return;
        if (maxTags && value.length >= maxTags) return;
        onChange([...value, tag]);
        setInput("");
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
        } else if (
            e.key === "Backspace" &&
            input === "" &&
            value.length > 0
        ) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div
            className="tags-input-wrapper"
            onClick={() => inputRef.current?.focus()}
        >
            {value.map((tag) => (
                <span key={tag} className="tags-chip">
                    {tag}
                    <button
                        type="button"
                        className="tags-chip-remove"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(tag);
                        }}
                        aria-label={`Remove ${tag}`}
                    >
                        ×
                    </button>
                </span>
            ))}

            <input
                ref={inputRef}
                className="tags-input"
                value={input}
                placeholder={value.length === 0 ? placeholder : ""}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    if (input.trim()) addTag(input);
                }}
            />
        </div>
    );
}
