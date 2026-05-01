import { useState } from 'react'
import type { Category, CreateCategoryRequest } from '@/types'
import type { TransactionType } from 'shared'
import Input from '@/components/atoms/Input/Input'
import SelectOption from '@/components/atoms/SelectOption/SelectOption'
import FormActions from '@/components/molecules/FormActions/FormActions'
import { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '@/services/categoryApi'
import styles from './CategoryForm.module.css'

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const [name, setName] = useState(category?.name ?? '')
  const [type, setType] = useState<TransactionType>(category?.type ?? 'expense')
  const [colour, setColour] = useState(category?.colour ?? '#6366f1')

  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (category) {
      await updateCategory({ id: category._id, body: { name, type, colour } })
    } else {
      const body: CreateCategoryRequest = { name, type, colour }
      await createCategory(body)
    }
    onClose()
  }

  const handleDelete = async () => {
    if (!category) return
    await deleteCategory({ id: category._id })
    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <SelectOption
        value={type}
        options={TYPE_OPTIONS}
        onChange={(e) => setType(e.target.value as TransactionType)}
      />
      <div className={styles.colourField}>
        <label htmlFor="colour" className={styles.colourLabel}>Colour</label>
        <input
          id="colour"
          type="color"
          value={colour}
          onChange={(e) => setColour(e.target.value)}
          className={styles.colourPicker}
        />
      </div>
      <FormActions
        onCancel={onClose}
        onDelete={category ? handleDelete : undefined}
        submitLabel={category ? 'Save' : 'Create'}
      />
    </form>
  )
}

export default CategoryForm
