import { useState } from 'react'

export const useDialog = <T>(resultHandler: (result: T) => boolean | void) => {
  const [open, setOpen] = useState(false)

  return { open, openDialog, closeDialog }

  function openDialog() {
    setOpen(true)
  }

  function closeDialog(result?: T) {
    let shouldClose = true
    if (result) {
      const returnValue = resultHandler(result)
      if (typeof returnValue === 'boolean') {
        shouldClose = returnValue
      }
    }

    if (shouldClose) {
      setOpen(false)
    }
  }
}
