import React from 'react'
import './Sprites.scss'

export const Sprites = ({ item }): JSX.Element => {
  function shareOnVK(item: string) {
    const navUrl = `http://vk.com/share.php?url=${window.location.href}&title=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnTelegram(item: string) {
    const navUrl = `https://t.me/share/url?url=${
      window.location.href
    }&text=Today is ${encodeURIComponent(item)}`
    window.open(navUrl, '_blank')
  }

  function shareOnViber(item: string) {
    const navUrl = `viber://forward?text=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnWhatsApp(item: string) {
    const navUrl = `whatsapp://send?text=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnEmail(item: string) {
    const navUrl = `mailto:?subject=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnSMS(item: string) {
    const navUrl = `sms:?body=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  return (
    <div className='sprites'>
      <button
        data-tooltip='vk'
        className='sprites__btn sprites__btn__vk'
        onClick={() => shareOnVK(item)}
      ></button>
      <button
        data-tooltip='sms'
        className='sprites__btn sprites__btn__sms'
        onClick={() => shareOnSMS(item)}
      />
      <button
        data-tooltip='email'
        className='sprites__btn sprites__btn__email'
        onClick={() => shareOnEmail(item)}
      />
      <button
        data-tooltip='telegram'
        className='sprites__btn sprites__btn__telegram'
        onClick={() => shareOnTelegram(item)}
      />
      <button
        data-tooltip='viber'
        className='sprites__btn sprites__btn__viber'
        onClick={() => shareOnViber(item)}
      />
      <button
        data-tooltip='whatsapp'
        className='sprites__btn sprites__btn__whatsapp'
        onClick={() => shareOnWhatsApp(item)}
      />
    </div>
  )
}
