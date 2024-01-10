import React from 'react'
import { Stack, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles';
const Settings = () => {
    const theme = useTheme()
  return (
      <>
          <Stack direction={"row"} sx={{ width: '100%' }}>
              {/* LeftPannel */}
              <Box sx={{ overFlowY: 'scroll', height: '100vh', width: 320, backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background }}>
                  
              </Box>
              {/* RightPannel */}
      </Stack>
      </>
  )
}

export default Settings
