import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button/Button'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
  )
}

export default BackButton
