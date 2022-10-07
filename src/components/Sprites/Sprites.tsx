import React from 'react'
import './Sprites.scss'

export const Sprites = ({ item }): JSX.Element => {
  
  const vkUrl = `http://vk.com/share.php?url=${window.location.href}&title=Today is ${item}`
  const telegramUrl = `https://t.me/share/url?url=${window.location.href}&text=Today is ${encodeURIComponent(item)}`
  const viberUrl = `viber://forward?text=Today is ${item}`
  const whatsappUrl = `whatsapp://send?text=Today is ${item}`
  const emailUrl = `mailto:?subject=Today is ${item}`
  const smsUrl = `sms:?body=Today is ${item}`

  const share = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className='sprites'>
      <button
        data-tooltip='vk'
        className='sprites__btn sprites__btn-vk'
        onClick={() => share(vkUrl)}
      ></button>
      <button
        data-tooltip='sms'
        className='sprites__btn sprites__btn-sms'
        onClick={() => share(smsUrl)}
      />
      <button
        data-tooltip='email'
        className='sprites__btn sprites__btn-email'
        onClick={() => share(emailUrl)}
      />
      <button
        data-tooltip='telegram'
        className='sprites__btn sprites__btn-telegram'
        onClick={() => share(telegramUrl)}
      />
      <button
        data-tooltip='viber'
        className='sprites__btn sprites__btn-viber'
        onClick={() => share(viberUrl)}
      />
      <button
        data-tooltip='whatsapp'
        className='sprites__btn sprites__btn-whatsapp'
        onClick={() => share(whatsappUrl)}
      />
    </div>
  )
}
