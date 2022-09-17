import { Skeleton, SkeletonProps } from '@mui/material'
import React, { PropsWithChildren } from 'react'

interface ChipSkeletonProps extends Pick<SkeletonProps, 'sx'> {
  isLoading: boolean
}

const ChipSkeleton: React.FC<PropsWithChildren<ChipSkeletonProps>> = ({ isLoading, children, sx }) => {
  if (isLoading) {
    return (
      <Skeleton variant="rectangular" sx={{ borderRadius: 4, ...sx }}>
        {children}
      </Skeleton>
    )
  } else {
    return <>{children}</>
  }
}

export default ChipSkeleton
