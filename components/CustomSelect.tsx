"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "请选择",
    className = ""
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // 计算下拉框位置
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isClickInsideButton = containerRef.current?.contains(target);
            const isClickInsideDropdown = dropdownRef.current?.contains(target);
            
            if (!isClickInsideButton && !isClickInsideDropdown) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isOpen) {
            if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
                event.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(0);
            }
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < options.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                event.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case "Enter":
                event.preventDefault();
                if (highlightedIndex >= 0) {
                    handleSelect(options[highlightedIndex].value);
                }
                break;
            case "Tab":
                setIsOpen(false);
                break;
        }
    };

    useEffect(() => {
        if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
            const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    }, [highlightedIndex, isOpen]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={`relative h-11 w-full cursor-pointer appearance-none rounded-2xl border px-4 pr-10 text-left text-base outline-none transition-all duration-300 ${isOpen
                    ? "border-ocean/60 bg-white shadow-lg ring-2 ring-ocean/25 scale-[1.01]"
                    : "border-slate/20 bg-gradient-to-br from-white via-white to-white/90 shadow-sm hover:border-ocean/40 hover:shadow-md hover:scale-[1.01]"
                    }`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={selectedOption ? "text-ink font-medium" : "text-slate/60"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span
                    className={`pointer-events-none absolute inset-y-0 right-3 flex items-center transition-all duration-300 ${isOpen ? "rotate-180 text-ocean" : "text-slate/40"
                        }`}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M5 7l5 6 5-6"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>

            {isOpen && typeof window !== 'undefined' && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        zIndex: 99999,
                        animation: 'dropdownFadeIn 0.2s ease-out'
                    }}
                    className="overflow-hidden rounded-2xl border border-slate/10 bg-white shadow-2xl backdrop-blur"
                    role="listbox"
                >
                    <div className="max-h-[280px] overflow-y-auto p-2 custom-scrollbar">
                        {options.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`cursor-pointer rounded-xl px-4 py-3 text-base transition-all duration-150 ${option.value === value
                                    ? "bg-gradient-to-r from-ocean/90 to-ocean text-white font-semibold shadow-md"
                                    : highlightedIndex === index
                                        ? "bg-gradient-to-r from-aurora/60 to-aurora/40 text-ink font-medium translate-x-1"
                                        : "text-slate hover:bg-slate/5"
                                    }`}
                                role="option"
                                aria-selected={option.value === value}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.label}</span>
                                    {option.value === value && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            className="ml-2 flex-shrink-0"
                                        >
                                            <path
                                                d="M4 10l4 4 8-8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
