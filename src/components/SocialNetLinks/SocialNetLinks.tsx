import './SocialNetLinks.scss'

export const SocialNetLinks = ({ message }) => {
  const socialNetLinks = {
    vk: `http://vk.com/share.php?url=${window.location.href}&title=Today is `,
    telegram: `https://t.me/share/url?url=${window.location.href}&text=Today is `,
    viber: `viber://forward?text=Today is `,
    whatsApp: `whatsapp://send?text=Today is `,
    email: `mailto:?subject=Today is `,
    sms: `sms:?body=Today is `,
  }

  const shareWithSocialLink = (link: string, message = ''): void => {
    window.open(link + message, '_blank')
  }

  return (
    <div className='notification__btns'>
      <button
        data-tooltip='vk'
        className='notification__btn notification__btn--vk'
        onClick={() => shareWithSocialLink(socialNetLinks.vk, message)}
      />
      <button
        data-tooltip='sms'
        className='notification__btn notification__btn--sms'
        onClick={() => shareWithSocialLink(socialNetLinks.sms, message)}
      />
      <button
        data-tooltip='email'
        className='notification__btn notification__btn--email'
        onClick={() => shareWithSocialLink(socialNetLinks.email, message)}
      />
      <button
        data-tooltip='telegram'
        className='notification__btn notification__btn--telegram'
        onClick={() =>
          shareWithSocialLink(socialNetLinks.telegram, encodeURIComponent(message) as string)
        }
      />
      <button
        data-tooltip='viber'
        className='notification__btn notification__btn--viber'
        onClick={() => shareWithSocialLink(socialNetLinks.viber, message)}
      />
      <button
        data-tooltip='whatsapp'
        className='notification__btn notification__btn--whatsapp'
        onClick={() => shareWithSocialLink(socialNetLinks.whatsApp, message)}
      />
    </div>
  )
}
