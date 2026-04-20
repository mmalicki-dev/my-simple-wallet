import { useState } from 'react'
import type { Category } from '@/types'
import UserSectionList from '@/components/organisms/UserSectionList/UserSectionList'
import UserSectionItem from '@/components/molecules/UserSectionItem/UserSectionItem'
import CategoryForm from '@/components/organisms/CategoryForm/CategoryForm'
import Modal from '@/components/templates/Modal/Modal'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useGetCategoriesQuery } from '@/services/categoryApi'

const CategorySection = () => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery()
  const [selected, setSelected] = useState<Category | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  if (isLoading) return <Spinner />

  return (
    <>
      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="New Category"
      >
        <CategoryForm onClose={() => setIsAdding(false)} />
      </Modal>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Edit Category"
      >
        {selected && (
          <CategoryForm category={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
      <UserSectionList title="Categories" onAdd={() => setIsAdding(true)}>
        {categories.map((category) => (
          <UserSectionItem
            key={category._id}
            label={category.name}
            subtitle={category.type}
            indicator={category.colour}
            onEdit={category.isDefault ? undefined : () => setSelected(category)}
          />
        ))}
      </UserSectionList>
    </>
  )
}

export default CategorySection
