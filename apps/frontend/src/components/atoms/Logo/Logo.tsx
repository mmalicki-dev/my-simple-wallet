interface LogoProps {
  isFull?: boolean
  className?: string
}

const Logo = ({ isFull = false, className }: LogoProps) => {
  return (
    <img
      src={isFull ? '/logo.svg' : '/logo-icon.svg'}
      alt="My Simple Wallet"
      className={className}
    />
  )
}

export default Logo
