import { Toaster } from 'react-hot-toast';
export const CustomToaster = () => {
  return (
    <Toaster 
      position='top-center' 
      toastOptions={{
        style: {
          background: '#0a0a0a',
          color: '#ffffff',
          border: '1px solid #262626',
          borderRadius: '0px',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '16px 24px',
        },
        success: {
          iconTheme: {
            primary: '#ffffff',
            secondary: '#000000',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#000000',
          },
        },
      }}
    />
  );
};