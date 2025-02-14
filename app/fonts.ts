import localFont from 'next/font/local'


export const generalSans = localFont({
  src: [
    {
      path: '../public/fonts/GeneralSans-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeneralSans-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeneralSans-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeneralSans-Semibold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-general-sans',
  display: 'swap',
}) 