import React, {  useEffect,useRef, useState } from "react";
import {
    ArrowRight,
    CloudUpload,
    Loader2,
    Mic,
} from "lucide-react";


const PromptInput = ({
    onSubmit,
    loading = false,
    placeholder = "Describe the website you want to build...",
    large = false,
    autoFocus = false,
    variant = "default",
}) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);
    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    },[autoFocus]);

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = value.trim();

        if (!trimmed || loading) return;

        onSubmit?.(trimmed);
        setValue("");
    };

    // Enter = submit
    // Shift + Enter = new line
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        console.log("Selected file:", file);

        // Later you can upload the file to backend
    };

    // Glass variant
    if (variant === "glass") {
        return (
            <form
                onSubmit={handleSubmit}
                className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-xl ring-1 ring-white/25 focus-within:ring-2 focus-within:ring-white/30 overflow-hidden mt-6 transition"
            >
                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus={autoFocus}
                    disabled={loading}
                    placeholder={placeholder}
                    rows={large ? 5 : 3}
                    className="w-full p-4 pb-2 resize-none placeholder:text-white/60 outline-none bg-transparent text-white text-base"
                />

                {/* Bottom controls */}
                <div className="flex items-center justify-between pb-3 px-3 gap-2">

                    {/* Left controls */}
                    <div className="flex items-center justify-between gap-2">

                        {/* File upload */}
                        <label
                            htmlFor="file"
                            className="border border-white/20 text-white/80 hover:text-white hover:border-white/30 p-1.5 rounded-md cursor-pointer flex items-center justify-center transition"
                        >
                            <input
                                type="file"
                                id="file"
                                hidden
                                onChange={handleFileChange}
                            />

                            <CloudUpload size={18} />
                        </label>

                        {/* Microphone */}
                        <button
                            type="button"
                            className="flex items-center justify-center p-1 text-white/70 hover:text-white cursor-pointer transition"
                        >
                            <Mic size={18} />
                        </button>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={!value.trim() || loading}
                        className="flex items-center justify-center p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                    >
                        {loading ? (
                            <Loader2
                                size={18}
                                className="animate-spin"
                            />
                        ) : (
                            <ArrowRight size={18} />
                        )}
                    </button>
                </div>
            </form>
        );
    }

  
   // Default variant
return (
    <div
        className={`bg-white border border-zinc-200 rounded-xl flex items-end gap-2
        focus-within:ring-1 focus-within:ring-zinc-300 transition
        ${large ? "p-4" : "p-3"}`}
    >
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            rows={large ? 5 : 1}
            className={`flex-1 bg-transparent border-none outline-none resize-none
            text-zinc-900 placeholder:text-zinc-400
            ${large ? "text-base" : "text-sm"}`}
        />

        <button
           onClick={()=>handleSubmit()}
           disabled={!value.trim() || loading}
           className ='inline-flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-40 cursor-pointer rounded-full shrink-0'
           style={{
            width:large ?36:24,
            height:large?36:24,
           }}
        >
            {loading ? (
                <Loader2
                     size={large ? 20 : 15}
                    className="animate-spin"
                />
            ) : (
                <ArrowRight size={large ? 20 : 15} />
            )}
        </button>
    </div>
);
};

export default PromptInput;