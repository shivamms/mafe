import './globals.css';

export const metadata = {
  title: 'MAFE — Medical Assistance For Everyone',
  description: 'Free multilingual medical information in your language. Ask about symptoms, conditions, and when to see a doctor.',
  manifest: '/manifest.json',
  themeColor: '#0d9488',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MAFE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
