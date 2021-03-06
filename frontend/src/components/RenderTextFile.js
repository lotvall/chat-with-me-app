import React, { useState, useEffect } from 'react'


export default ({url}) => {
  const [ text, setText ] = useState("")

  useEffect(() => {
    const fetchText = async () => {
      const response = await fetch(url)
      const text = await response.text()
      setText(text)
    }
    fetchText()
  }, [url]);
  return (
    <div>
      <div>----------</div>
      <p>{text}</p>
      <div>----------</div>
    </div>
  )
}