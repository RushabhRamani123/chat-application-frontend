import React from "react";
import Skeleton from '@mui/material/Skeleton';
const LoadingScreen = () => {
  return <>
    <div style={{ backgroundColor: 'red' ,width:'100px',height:'100px' }}></div>
<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={60} />
<Skeleton variant="rounded" width={210} height={60} />
  </>;
};

export default LoadingScreen;
