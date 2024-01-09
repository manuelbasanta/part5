import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggable = forwardRef(({ children, showLabel, hideLabel }, refs) => {
  const [isVisible, setIsVisible ] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      {
        isVisible ?
          <div>
            {children}
            <button onClick={toggleVisibility}>{hideLabel}</button>
          </div> :
          <button onClick={toggleVisibility}>{showLabel}</button>

      }
    </>
  )
})

Toggable.displayName = 'Toggable'

Toggable.propTypes = {
  showLabel: PropTypes.string.isRequired,
  hideLabel: PropTypes.string,
  children: PropTypes.node.isRequired
}

Toggable.defaultProps = {
  hideLabel: 'cancel'
}


export default Toggable
