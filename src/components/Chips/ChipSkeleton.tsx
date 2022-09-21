import { Skeleton, SkeletonProps } from '@mui/material'
import React, { PropsWithChildren } from 'react'

interface ChipSkeletonProps extends Pick<SkeletonProps, 'sx' | 'onClick'> {
  isLoading: boolean
}

const ChipSkeleton: React.FC<PropsWithChildren<ChipSkeletonProps>> = ({ isLoading, children, sx, onClick }) => {
  if (isLoading) {
    return (
      <Skeleton onClick={onClick} variant="rectangular" sx={{ borderRadius: 4, ...sx }}>
        {children}
      </Skeleton>
    )
  } else {
    return <>{children}</>
  }
}

export default ChipSkeleton
