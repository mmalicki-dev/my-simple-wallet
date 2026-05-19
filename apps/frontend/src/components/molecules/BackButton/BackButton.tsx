import { useNavigate } from 'react-router-dom'
import HoloButton from '@/components/atoms/HoloButton/HoloButton'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <HoloButton onClick={() => navigate(-1)}>← Back</HoloButton>
  )
}

export default BackButton
