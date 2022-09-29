import './Notification.scss'

interface INotificationComponent {
  (item: string): JSX.Element
}

export const Notification: INotificationComponent = (item) => {

  function shareOnFacebook() {
    const navUrl = `https://www.facebook.com/sharer/sharer.php?u=https://itra-course-work.herokuapp.com/?kcscmksnkc `
    window.open(navUrl, '_blank')
  }

  function shareOnVK(item: string) {
    const navUrl = `http://vk.com/share.php?url=${window.location.href}&title=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnTelegram(item: string) {
    const navUrl = `https://t.me/share/url?url=${window.location.href
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
    <div className='notification'>
      <div className='notification__message'>Today is {item}</div>
      <div className='notification__buttons'>
        <button className='notification__btn-share'>Share</button>
        <div className='notification__btn-wrapper'>
          <button
            data-tooltip='facebook'
            className='notification__btn notification__btn--facebook'
            onClick={shareOnFacebook}
          />
          <button
            data-tooltip='vk'
            className='notification__btn notification__btn--vk'
            onClick={() => shareOnVK(item)}
          />
          <button
            data-tooltip='sms'
            className='notification__btn notification__btn--sms'
            onClick={() => shareOnSMS(item)}
          />
          <button
            data-tooltip='email'
            className='notification__btn notification__btn--email'
            onClick={() => shareOnEmail(item)}
          />
          <button
            data-tooltip='telegram'
            className='notification__btn notification__btn--telegram'
            onClick={() => shareOnTelegram(item)}
          />
          <button
            data-tooltip='viber'
            className='notification__btn notification__btn--viber'
            onClick={() => shareOnViber(item)}
          />
          <button
            data-tooltip='whatsapp'
            className='notification__btn notification__btn--whatsapp'
            onClick={() => shareOnWhatsApp(item)}
          />
        </div>
      </div>
    </div>
  )
}
