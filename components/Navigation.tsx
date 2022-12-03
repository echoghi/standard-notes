const Navigation = () => {
    return (
        <div
            id="navigation"
            className="flex flex-col relative overflow-hidden h-full pb-[50px] md:pb-0 max-h-full pt-safe-top md:h-full md:max-h-full md:min-h-0"
        >
            <div className="flex-grow overflow-y-auto overflow-x-hidden md:overflow-y-hidden md:hover:overflow-y-auto md:hover:[overflow-y:_overlay] pointer-coarse:md:overflow-y-auto">
                <section>
                    <div>
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 fill-current text-info"
                            role="img"
                            aria-hidden="true"
                        >
                            <path d="M4.556 3A1.55 1.55 0 0 0 3 4.556v10.888A1.55 1.55 0 0 0 4.556 17h10.888A1.55 1.55 0 0 0 17 15.444V4.556A1.55 1.55 0 0 0 15.444 3H4.556Zm0 1.556h10.888v10.888H4.556V4.556ZM6.11 6.11v1.556h7.778V6.11H6.11Zm0 3.111v1.556h7.778V9.222H6.11Zm0 3.111v1.556h5.445v-1.556H6.11Z" />
                            <div>Notes</div>
                        </svg>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Navigation;
