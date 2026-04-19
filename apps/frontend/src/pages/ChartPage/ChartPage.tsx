import { Helmet } from 'react-helmet'
import ChartViewer from '@/components/organisms/ChartViewer/ChartViewer'

const ChartPage = () => {
  return (
    <>
      <Helmet>
        <title>Charts</title>
      </Helmet>
      <ChartViewer />
    </>
  )
}

export default ChartPage
