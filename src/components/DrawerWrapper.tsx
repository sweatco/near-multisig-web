import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { PropsWithChildren } from 'react'

export enum DrawerAction {
  addContract = 0,
  generateKey,
}

interface DrawerWrapperProps {
  drawerWidth: number
  onAction(drawerAction: DrawerAction): void
}

const DrawerWrapper: React.FC<PropsWithChildren<DrawerWrapperProps>> = ({ children, drawerWidth, onAction }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onAction(DrawerAction.addContract)}>
            <ListItemIcon sx={{ minWidth: 40, fontSize: 20 }}>🆕</ListItemIcon>
            <ListItemText sx={{ my: 0 }} primary={'Add MultiSig contract'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onAction(DrawerAction.generateKey)}>
            <ListItemIcon sx={{ minWidth: 40, fontSize: 20 }}>🔑</ListItemIcon>
            <ListItemText primary={'Generate Key'} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      {children}
    </Drawer>
  )
}

export default DrawerWrapper
