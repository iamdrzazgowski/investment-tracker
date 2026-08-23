import React from 'react';

export default function Showcase() {
    return (
        <div className='relative hidden overflow-hidden bg-[#15151A] lg:flex lg:flex-col lg:justify-between lg:p-10'>
            <div
                className='absolute inset-0 opacity-[0.06]'
                style={{
                    backgroundImage:
                        'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }}
            />

            <div className='relative flex items-center gap-2'>
                <span className='flex size-7 items-center justify-center rounded-md bg-white text-sm font-bold text-[#15151A]'>
                    N
                </span>

                <span className='text-[15px] font-semibold tracking-tight text-white'>
                    Nordwell
                </span>
            </div>

            <div className='relative'>
                <h2 className='mb-3 max-w-[320px] text-[26px] font-bold leading-tight tracking-tight text-white'>
                    Every position, every gain, in one clean view.
                </h2>

                <p className='max-w-[320px] text-[13.5px] leading-relaxed text-white/60'>
                    Track stocks, ETFs and crypto side by side — with the same
                    premium clarity as the rest of Nordwell.
                </p>

                <div className='mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5'>
                    <div className='mb-1 text-xs text-white/50'>
                        Total portfolio value
                    </div>

                    <div className='mb-3 flex items-end justify-between'>
                        <div className='font-mono text-2xl font-bold text-white'>
                            €214,830
                        </div>

                        <span className='text-[13.5px] font-semibold text-[#0C6B4F]'>
                            ▲ +1.86%
                        </span>
                    </div>

                    <svg
                        viewBox='0 0 500 160'
                        className='h-20 w-full'
                        preserveAspectRatio='none'>
                        <defs>
                            <linearGradient
                                id='authGrad'
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'>
                                <stop
                                    offset='0%'
                                    stopColor='#0C6B4F'
                                    stopOpacity='0.5'
                                />
                                <stop
                                    offset='100%'
                                    stopColor='#0C6B4F'
                                    stopOpacity='0'
                                />
                            </linearGradient>
                        </defs>

                        <path
                            d='M0,150 C40,140 60,110 90,120 C130,135 150,90 190,95 C230,100 250,60 290,55 C330,50 350,80 390,65 C430,50 460,20 500,10 L500,160 L0,160 Z'
                            fill='url(#authGrad)'
                        />

                        <path
                            d='M0,150 C40,140 60,110 90,120 C130,135 150,90 190,95 C230,100 250,60 290,55 C330,50 350,80 390,65 C430,50 460,20 500,10'
                            fill='none'
                            stroke='#0C6B4F'
                            strokeWidth='2.5'
                        />
                    </svg>
                </div>
            </div>

            <p className='relative m-0 text-[11.5px] text-white/40'>
                Nordwell — a minimal, premium portfolio tracker.
            </p>
        </div>
    );
}
