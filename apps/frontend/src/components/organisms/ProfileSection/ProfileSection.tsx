import UserInfoBlock from '@/components/organisms/UserInfoBlock/UserInfoBlock'
import UserPreferencesBlock from '@/components/organisms/UserPreferencesBlock/UserPreferencesBlock'
import UserSecurityBlock from '@/components/organisms/UserSecurityBlock/UserSecurityBlock'
import styles from './ProfileSection.module.css'

const ProfileSection = () => {
  return (
    <div className={styles.sections}>
      <UserInfoBlock />
      <UserPreferencesBlock />
      <UserSecurityBlock />
    </div>
  )
}

export default ProfileSection
