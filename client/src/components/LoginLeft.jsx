import React from 'react'

const LoginLeft = () => {
    return (
        <div className=" hidden lg:flex lg:w-2/5 bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat  flex-col justify-between p-12 shrink-0 select-none">
            <div className ='flex items-center gap-3'>
                <img src="/logo.svg" alt="Logo" className="size-9.5" />
                <span className="text-4xl font-bold text-white">Welcome to Builder AI</span>
            </div>
            <div>
                <h2 className="text-3xl text-white font-medium leading-snug mb-3 tracking-tight"> Build your AI-powered applications</h2>
                <p className="text-zinc-300">
                    Describe your idea, and our AI will generate the code for you. Save time and effort with our intelligent code generation platform.
                </p>
                <p> Copyright {new Date().getFullYear()} Builder AI. All rights reserved.</p>
            </div>
        </div>
    )
}

export default LoginLeft