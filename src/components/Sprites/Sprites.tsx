import React from 'react'
import './Sprites.scss'

export const Sprites = ({ item }): JSX.Element => {
  const sharingUrls = {
    vk: `http://vk.com/share.php?url=${window.location.href}&title=Today is ${item}`,
    telegram: `https://t.me/share/url?url=${window.location.href}&text=Today is ${encodeURIComponent(item)}`,
    viber: `viber://forward?text=Today is ${item}`,
    whatsapp: `whatsapp://send?text=Today is ${item}`,
    email: `mailto:?subject=Today is ${item}`,
    sms: `sms:?body=Today is ${item}`,
  }
  
  const share = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className='sprites'>
      <button
        data-tooltip='vk'
        className='sprites__btn sprites__btn-vk'
        onClick={() => share(sharingUrls.vk)}
      ></button>
      <button
        data-tooltip='sms'
        className='sprites__btn sprites__btn-sms'
        onClick={() => share(sharingUrls.sms)}
      />
      <button
        data-tooltip='email'
        className='sprites__btn sprites__btn-email'
        onClick={() => share(sharingUrls.email)}
      />
      <button
        data-tooltip='telegram'
        className='sprites__btn sprites__btn-telegram'
        onClick={() => share(sharingUrls.telegram)}
      />
      <button
        data-tooltip='viber'
        className='sprites__btn sprites__btn-viber'
        onClick={() => share(sharingUrls.viber)}
      />
      <button
        data-tooltip='whatsapp'
        className='sprites__btn sprites__btn-whatsapp'
        onClick={() => share(sharingUrls.whatsapp)}
      />
    </div>
  )
}
